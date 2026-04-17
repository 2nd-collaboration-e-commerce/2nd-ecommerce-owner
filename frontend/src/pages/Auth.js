import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '';
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(redirect ? `/${redirect}` : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <h1>Login</h1>
          <p>Get access to your Orders, Wishlist and Recommendations</p>
        </div>
        <div className="auth-right">
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <p className="auth-terms">
              By continuing, you agree to Flipkart's Terms of Use and Privacy Policy.
            </p>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <Link to={`/register${redirect ? `?redirect=${redirect}` : ''}`} className="auth-switch">
              New to Flipkart? Create an account
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '';
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      await register(form);
      navigate(redirect ? `/${redirect}` : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <h1>Create Account</h1>
          <p>Join millions of Indians who shop on Flipkart</p>
        </div>
        <div className="auth-right">
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" placeholder="Enter your full name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="Enter your email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" placeholder="10-digit mobile number" value={form.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" placeholder="Create password (min. 6 characters)" value={form.password} onChange={handleChange} required />
            </div>
            <p className="auth-terms">
              By continuing, you agree to Flipkart's Terms of Use and Privacy Policy.
            </p>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
            <Link to={`/login${redirect ? `?redirect=${redirect}` : ''}`} className="auth-switch">
              Existing user? Log in
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
