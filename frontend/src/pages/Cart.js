import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const tax = Math.round(cartTotal * 0.18);
  const shipping = cartTotal > 500 ? 0 : 40;
  const finalTotal = cartTotal + tax + shipping;

  const handleCheckout = () => {
    if (!user) { navigate('/login?redirect=checkout'); return; }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png" alt="Empty cart" className="empty-img" />
        <h2>Your cart is empty!</h2>
        <p>Add items to it now.</p>
        <Link to="/products" className="shop-btn">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-items-section">
          <h2>My Cart ({cartItems.length})</h2>
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <Link to={`/products/${item._id}`}>
                <img src={item.images?.[0] || `https://via.placeholder.com/100x100?text=${encodeURIComponent(item.name)}`} alt={item.name} className="cart-item-img" onError={(e) => { e.target.src='https://via.placeholder.com/100x100?text=Item'; }} />
              </Link>
              <div className="cart-item-info">
                <Link to={`/products/${item._id}`} className="cart-item-name">{item.name}</Link>
                <p className="cart-item-seller">Seller: {item.seller || 'Flipkart Seller'}</p>
                <div className="cart-item-price">
                  <span className="c-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  {item.originalPrice > item.price && <span className="c-original">₹{(item.originalPrice * item.quantity).toLocaleString('en-IN')}</span>}
                </div>
              </div>
              <div className="cart-item-controls">
                <div className="qty-control">
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)}><FiMinus size={14}/></button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)}><FiPlus size={14}/></button>
                </div>
                <button className="remove-btn" onClick={() => removeFromCart(item._id)}><FiTrash2 size={16}/> Remove</button>
              </div>
            </div>
          ))}
          <div className="place-order-bar">
            <button className="place-order-btn" onClick={handleCheckout}>PLACE ORDER</button>
          </div>
        </div>

        <div className="cart-summary">
          <h3>PRICE DETAILS</h3>
          <div className="summary-row"><span>Price ({cartItems.length} items)</span><span>₹{cartTotal.toLocaleString('en-IN')}</span></div>
          <div className="summary-row"><span>GST (18%)</span><span>₹{tax.toLocaleString('en-IN')}</span></div>
          <div className="summary-row"><span>Delivery Charges</span><span className={shipping === 0 ? 'free' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
          <div className="summary-row total"><span>Total Amount</span><span>₹{finalTotal.toLocaleString('en-IN')}</span></div>
          <p className="savings-text">You will save ₹{Math.round(cartTotal * 0.1).toLocaleString('en-IN')} on this order</p>
        </div>
      </div>
    </div>
  );
};
export default Cart;
