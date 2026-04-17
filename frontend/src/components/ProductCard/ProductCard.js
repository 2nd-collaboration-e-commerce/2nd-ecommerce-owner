import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : product.discount || 0;

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-link">
        <div className="product-image-wrap">
          <img
            src={product.images?.[0] || `https://via.placeholder.com/300x300?text=${encodeURIComponent(product.name)}`}
            alt={product.name}
            className="product-image"
            onError={(e) => { e.target.src = `https://via.placeholder.com/300x300?text=No+Image`; }}
          />
          {discount > 0 && <span className="discount-badge">{discount}% off</span>}
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <div className="product-rating">
            <span className="rating-badge">{product.ratings?.toFixed(1) || '4.0'} <FiStar size={10} /></span>
            <span className="rating-count">({product.numReviews || 0})</span>
          </div>
          <div className="product-price">
            <span className="price-current">Rs.{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="price-original">Rs.{product.originalPrice.toLocaleString('en-IN')}</span>
                <span className="price-discount">{discount}% off</span>
              </>
            )}
          </div>
          {product.seller && <p className="product-seller">by {product.seller}</p>}
        </div>
      </Link>
      <button className="add-cart-btn" onClick={(e) => { e.preventDefault(); addToCart(product); }} disabled={product.stock === 0}>
        <FiShoppingCart size={16} />
        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default ProductCard;
