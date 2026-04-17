import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../utils/api';
import ProductCard from '../components/ProductCard/ProductCard';
import './Home.css';

const CATEGORIES = [
  { name: 'Electronics', img: 'https://rukminim2.flixcart.com/flap/128/128/image/69c6589653afdb9a.png' },
  { name: 'Fashion', img: 'https://rukminim2.flixcart.com/flap/128/128/image/0d75b34f7d8fbcb3.png' },
  { name: 'Home & Furniture', img: 'https://rukminim2.flixcart.com/flap/128/128/image/ab7e2b022a4587dd.jpg' },
  { name: 'Appliances', img: 'https://rukminim2.flixcart.com/flap/128/128/image/0139228b2f7eb413.jpg' },
  { name: 'Beauty', img: 'https://rukminim2.flixcart.com/flap/128/128/image/dff3f7adcf3a90c6.png' },
  { name: 'Toys', img: 'https://rukminim2.flixcart.com/flap/128/128/image/71050627a56b4693.png' },
  { name: 'Sports', img: 'https://rukminim2.flixcart.com/flap/128/128/image/dde1b5c7b24c8a4f.png' },
  { name: 'Books', img: 'https://rukminim2.flixcart.com/flap/128/128/image/fa1f81c939f88f4e.png' },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ limit: 20 })
      .then((res) => setProducts(res.data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <h1>India ka Fashion Capital</h1>
          <p>Millions of Products, Best Prices, Fast Delivery</p>
          <Link to="/products" className="hero-btn">Shop Now</Link>
        </div>
      </div>

      {/* Categories */}
      <div className="section">
        <div className="section-card">
          <h2 className="section-title">Shop by Category</h2>
          <div className="category-grid">
            {CATEGORIES.map((cat) => (
              <Link key={cat.name} to={`/products?category=${cat.name}`} className="cat-item">
                <img src={cat.img} alt={cat.name} onError={(e) => { e.target.style.display='none'; }} />
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="section">
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">Top Deals</h2>
            <Link to="/products" className="view-all-btn">VIEW ALL →</Link>
          </div>
          {loading ? (
            <div className="products-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-img"></div>
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="products-grid">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
          {!loading && products.length === 0 && (
            <div className="empty-state">
              <p>No products yet. Add products via Admin panel.</p>
              <Link to="/products" className="hero-btn" style={{marginTop:12,display:'inline-block'}}>Browse All</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
