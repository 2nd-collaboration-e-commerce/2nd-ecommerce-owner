import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FiSearch, FiShoppingCart, FiUser, FiLogOut, FiPackage, FiChevronDown } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?keyword=${search}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-text">Flipkart</span>
          <span className="logo-sub">
            <em>Explore</em>
            <img
              src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/plus_aef861.png"
              alt="plus"
              className="logo-plus"
            />
            <em>Plus</em>
          </span>
        </Link>

        {/* Search */}
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for products, brands and more"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="search-btn">
            <FiSearch size={20} />
          </button>
        </form>

        {/* Nav items */}
        <div className="nav-items">
          {user ? (
            <div className="user-menu" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
              <button className="nav-btn">
                <FiUser size={18} />
                <span>{user.name.split(' ')[0]}</span>
                <FiChevronDown size={14} />
              </button>
              {showDropdown && (
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">
                    <FiUser size={14} /> My Profile
                  </Link>
                  <Link to="/orders" className="dropdown-item">
                    <FiPackage size={14} /> My Orders
                  </Link>
                  <button onClick={logout} className="dropdown-item logout-btn">
                    <FiLogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nav-btn login-btn">
              Login
            </Link>
          )}

          <Link to="/cart" className="nav-btn cart-btn">
            <FiShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            <span>Cart</span>
          </Link>
        </div>
      </div>

      {/* Category bar */}
      <div className="category-bar">
        {['Electronics', 'Fashion', 'Home & Furniture', 'Appliances', 'Beauty', 'Toys', 'Sports', 'Books'].map(
          (cat) => (
            <Link key={cat} to={`/products?category=${cat}`} className="category-link">
              {cat}
            </Link>
          )
        )}
      </div>
    </nav>
  );
};

export default Navbar;
