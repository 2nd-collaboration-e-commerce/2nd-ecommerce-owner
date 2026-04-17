import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../utils/api';
import { FiCheckCircle, FiTruck, FiPackage, FiAlertCircle } from 'react-icons/fi';
import './OrderDetail.css';

const statusSteps = ['Processing', 'Shipped', 'Delivered'];
const statusIcons = { Processing: FiPackage, Shipped: FiTruck, Delivered: FiCheckCircle, Cancelled: FiAlertCircle };

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder(id).then((res) => setOrder(res.data.order)).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="od-loading"><div className="spinner"></div></div>;
  if (!order) return <div className="od-loading"><h3>Order not found</h3></div>;

  const stepIdx = statusSteps.indexOf(order.orderStatus);
  const StatusIcon = statusIcons[order.orderStatus] || FiPackage;

  return (
    <div className="od-page">
      <div className="od-container">
        <div className="od-header">
          <div>
            <h2>Order #{order._id.slice(-8).toUpperCase()}</h2>
            <p>{new Date(order.createdAt).toLocaleString('en-IN')}</p>
          </div>
          <span className={`od-status-badge ${order.orderStatus.toLowerCase()}`}>
            <StatusIcon size={16}/> {order.orderStatus}
          </span>
        </div>

        {/* Progress */}
        {order.orderStatus !== 'Cancelled' && (
          <div className="od-progress">
            {statusSteps.map((step, i) => (
              <div key={step} className={`progress-step ${i <= stepIdx ? 'done' : ''}`}>
                <div className="step-circle">{i <= stepIdx ? '✓' : i + 1}</div>
                <span>{step}</span>
                {i < statusSteps.length - 1 && <div className={`step-line ${i < stepIdx ? 'done' : ''}`}></div>}
              </div>
            ))}
          </div>
        )}

        <div className="od-body">
          <div className="od-main">
            {/* Items */}
            <div className="od-card">
              <h3>Items Ordered</h3>
              {order.orderItems.map((item, i) => (
                <div key={i} className="od-item">
                  <img src={item.image || 'https://via.placeholder.com/80x80?text=Item'} alt={item.name} onError={(e) => { e.target.src='https://via.placeholder.com/80x80?text=Item'; }} />
                  <div className="od-item-info">
                    <p className="od-item-name">{item.name}</p>
                    <p className="od-item-price">₹{item.price.toLocaleString('en-IN')} × {item.quantity}</p>
                  </div>
                  <span className="od-item-total">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            {/* Shipping */}
            <div className="od-card">
              <h3>Delivery Address</h3>
              <p className="addr-name">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              <p>📞 {order.shippingAddress.phone}</p>
            </div>
          </div>

          <div className="od-sidebar">
            <div className="od-card">
              <h3>Price Details</h3>
              <div className="od-price-row"><span>Items Price</span><span>₹{order.itemsPrice.toLocaleString('en-IN')}</span></div>
              <div className="od-price-row"><span>GST</span><span>₹{order.taxPrice.toLocaleString('en-IN')}</span></div>
              <div className="od-price-row"><span>Shipping</span><span>{order.shippingPrice === 0 ? <span className="free">FREE</span> : `₹${order.shippingPrice}`}</span></div>
              <div className="od-price-row total"><span>Total</span><span>₹{order.totalPrice.toLocaleString('en-IN')}</span></div>
            </div>
            <div className="od-card">
              <h3>Payment</h3>
              <p className={`pay-status ${order.paymentInfo?.status}`}>{order.paymentInfo?.status === 'paid' ? '✓ Payment Successful' : '⏳ Payment Pending'}</p>
              {order.paymentInfo?.razorpay_payment_id && <p className="pay-id">ID: {order.paymentInfo.razorpay_payment_id}</p>}
            </div>
            <Link to="/orders" className="back-orders-btn">← Back to Orders</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OrderDetail;
