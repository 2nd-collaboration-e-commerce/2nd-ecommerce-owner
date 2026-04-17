import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-banner">
          <h2>Looks like you're new here!</h2>
          <p>Sign up with your email to get started</p>
          <img src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/login_img_c4a81e.svg" alt="register" />
        </div>
        <div className="auth-form-section">
          <form onSubmit={handleSubmit} className="auth-form">
            <h3>Create Account</h3>
            <input type="text" placeholder="Your Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required className="auth-input" />
            <input type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required className="auth-input" />
            <input type="tel" placeholder="Mobile Number" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="auth-input" />
            <input type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required className="auth-input" />
            <button type="submit" className="auth-btn" disabled={loading}>{loading ? 'Creating Account...' : 'Create Account'}</button>
            <p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Register;
