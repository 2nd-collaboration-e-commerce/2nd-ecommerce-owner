import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../utils/api';
import { FiUser, FiMail, FiPhone, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Profile.css';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateProfile(form);
      setUser(res.data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="avatar-circle">{user?.name?.[0]?.toUpperCase()}</div>
          <h3>{user?.name}</h3>
          <p>{user?.email}</p>
          <span className={`role-badge ${user?.role}`}>{user?.role}</span>
        </div>
        <div className="profile-main">
          <div className="profile-card">
            <h2><FiUser /> Personal Information</h2>
            <form onSubmit={handleSubmit}>
              <div className="profile-field">
                <label><FiUser size={14}/> Full Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="profile-input" required />
              </div>
              <div className="profile-field">
                <label><FiMail size={14}/> Email Address</label>
                <input type="email" value={user?.email} disabled className="profile-input disabled" />
              </div>
              <div className="profile-field">
                <label><FiPhone size={14}/> Phone Number</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="profile-input" />
              </div>
              <button type="submit" className="save-btn" disabled={loading}>
                <FiSave size={16}/> {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
