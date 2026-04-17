import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(params.get('redirect') ? `/${params.get('redirect')}` : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-banner">
          <h2>Login</h2>
          <p>Get access to your Orders, Wishlist and Recommendations</p>
          <img src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/login_img_c4a81e.svg" alt="login" />
        </div>
        <div className="auth-form-section">
          <form onSubmit={handleSubmit} className="auth-form">
            <h3>Login</h3>
            <input type="email" placeholder="Enter Email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required className="auth-input" />
            <input type="password" placeholder="Enter Password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required className="auth-input" />
            <button type="submit" className="auth-btn" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
            <p className="auth-switch">New to Flipkart? <Link to="/register">Create an account</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;
