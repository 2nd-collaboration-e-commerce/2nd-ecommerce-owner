import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder, createPaymentOrder, verifyPayment } from '../utils/api';
import toast from 'react-hot-toast';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({ name: user?.name || '', phone: user?.phone || '', address: '', city: '', state: '', pincode: '' });

  const tax = Math.round(cartTotal * 0.18);
  const shipping = cartTotal > 500 ? 0 : 40;
  const finalTotal = cartTotal + tax + shipping;

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) { resolve(true); return; }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    for (const [key, val] of Object.entries(address)) {
      if (!val.trim()) { toast.error(`Please fill ${key}`); return; }
    }
    setLoading(true);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) { toast.error('Razorpay SDK failed to load'); setLoading(false); return; }

      // Create Razorpay order
      const { data } = await createPaymentOrder(finalTotal);

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: 'INR',
        name: 'Flipkart Clone',
        description: 'Order Payment',
        order_id: data.order.id,
        prefill: { name: user.name, email: user.email, contact: user.phone || '' },
        theme: { color: '#2874f0' },
        handler: async (response) => {
          try {
            // Create order in DB
            const orderData = {
              orderItems: cartItems.map((item) => ({
                product: item._id, name: item.name,
                image: item.images?.[0] || '', price: item.price, quantity: item.quantity,
              })),
              shippingAddress: address,
              paymentInfo: { razorpay_order_id: response.razorpay_order_id, status: 'pending' },
              itemsPrice: cartTotal, taxPrice: tax, shippingPrice: shipping, totalPrice: finalTotal,
            };
            const orderRes = await createOrder(orderData);

            // Verify payment
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderRes.data.order._id,
            });

            clearCart();
            toast.success('Order placed successfully!');
            navigate(`/orders/${orderRes.data.order._id}`);
          } catch (err) {
            toast.error('Payment verification failed');
          }
        },
        modal: { ondismiss: () => { setLoading(false); toast.error('Payment cancelled'); } },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
      setLoading(false);
    }
  };

  if (cartItems.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-main">
          <div className="checkout-card">
            <h2>Delivery Address</h2>
            <div className="addr-form">
              <div className="form-row">
                <input placeholder="Full Name" value={address.name} onChange={(e) => setAddress({...address, name: e.target.value})} className="addr-input" />
                <input placeholder="Phone Number" value={address.phone} onChange={(e) => setAddress({...address, phone: e.target.value})} className="addr-input" />
              </div>
              <input placeholder="Address (House No, Street, Area)" value={address.address} onChange={(e) => setAddress({...address, address: e.target.value})} className="addr-input full" />
              <div className="form-row">
                <input placeholder="City" value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} className="addr-input" />
                <input placeholder="State" value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})} className="addr-input" />
                <input placeholder="Pincode" value={address.pincode} onChange={(e) => setAddress({...address, pincode: e.target.value})} className="addr-input" />
              </div>
            </div>
          </div>

          <div className="checkout-card">
            <h2>Order Summary ({cartItems.length} items)</h2>
            {cartItems.map((item) => (
              <div key={item._id} className="order-item">
                <img src={item.images?.[0] || `https://via.placeholder.com/60x60?text=Item`} alt={item.name} className="order-item-img" onError={(e) => { e.target.src='https://via.placeholder.com/60x60?text=Item'; }} />
                <div className="order-item-info">
                  <p className="order-item-name">{item.name}</p>
                  <p className="order-item-price">₹{item.price.toLocaleString('en-IN')} × {item.quantity} = <strong>₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong></p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="checkout-summary">
          <h3>PRICE DETAILS</h3>
          <div className="summary-row"><span>Price ({cartItems.length} items)</span><span>₹{cartTotal.toLocaleString('en-IN')}</span></div>
          <div className="summary-row"><span>GST (18%)</span><span>₹{tax.toLocaleString('en-IN')}</span></div>
          <div className="summary-row"><span>Delivery</span><span className={shipping===0?'free':''}>{shipping===0?'FREE':`₹${shipping}`}</span></div>
          <div className="summary-row total"><span>Total</span><span>₹{finalTotal.toLocaleString('en-IN')}</span></div>
          <button className="pay-btn" onClick={handlePayment} disabled={loading}>
            {loading ? 'Processing...' : `Pay ₹${finalTotal.toLocaleString('en-IN')} via Razorpay`}
          </button>
          <p className="secure-text">🔒 100% Secure Payments</p>
        </div>
      </div>
    </div>
  );
};
export default Checkout;
