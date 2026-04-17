import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders, cancelOrder } from '../utils/api';
import { FiPackage, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Orders.css';

const statusColors = { Processing: '#ff9f00', Shipped: '#2874f0', Delivered: '#388e3c', Cancelled: '#f44336' };

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders().then((res) => setOrders(res.data.orders)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this order?')) return;
    try {
      await cancelOrder(id);
      setOrders((prev) => prev.map((o) => o._id === id ? {...o, orderStatus: 'Cancelled'} : o));
      toast.success('Order cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel');
    }
  };

  if (loading) return <div className="orders-loading"><div className="spinner"></div></div>;

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h2><FiPackage /> My Orders</h2>
        {orders.length === 0 ? (
          <div className="no-orders">
            <FiPackage size={64} color="#e0e0e0" />
            <h3>No orders yet</h3>
            <Link to="/products" className="shop-link">Start Shopping</Link>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <div>
                  <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                  <span className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</span>
                </div>
                <div className="order-right">
                  <span className="order-status" style={{color: statusColors[order.orderStatus]}}>{order.orderStatus}</span>
                  <span className="order-total">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="order-items-list">
                {order.orderItems.map((item, i) => (
                  <div key={i} className="order-item-row">
                    <img src={item.image || 'https://via.placeholder.com/60x60?text=Item'} alt={item.name} className="order-item-thumb" onError={(e) => { e.target.src='https://via.placeholder.com/60x60?text=Item'; }} />
                    <div>
                      <p className="oi-name">{item.name}</p>
                      <p className="oi-details">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-card-footer">
                <Link to={`/orders/${order._id}`} className="view-order-btn">View Details</Link>
                {order.orderStatus === 'Processing' && (
                  <button className="cancel-order-btn" onClick={() => handleCancel(order._id)}><FiX size={14}/> Cancel</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default Orders;
