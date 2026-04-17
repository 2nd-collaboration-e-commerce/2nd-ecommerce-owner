import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, addReview } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiStar, FiShoppingCart, FiZap } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [review, setReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    getProduct(id).then((res) => { setProduct(res.data.product); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/cart');
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to review'); navigate('/login'); return; }
    try {
      await addReview(id, review);
      toast.success('Review added!');
      getProduct(id).then((res) => setProduct(res.data.product));
      setReview({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error adding review');
    }
  };

  if (loading) return <div className="detail-loading"><div className="spinner"></div></div>;
  if (!product) return <div className="detail-loading"><h3>Product not found</h3></div>;

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  const imgs = product.images?.length ? product.images : [`https://via.placeholder.com/500x500?text=${encodeURIComponent(product.name)}`];

  return (
    <div className="detail-page">
      <div className="detail-container">
        {/* Images */}
        <div className="detail-images">
          <div className="thumbnails">
            {imgs.map((img, i) => (
              <img key={i} src={img} alt={product.name} className={`thumb ${selectedImg===i?'active':''}`} onClick={() => setSelectedImg(i)} onError={(e) => { e.target.src='https://via.placeholder.com/60x60?text=Img'; }} />
            ))}
          </div>
          <div className="main-img-wrap">
            <img src={imgs[selectedImg]} alt={product.name} className="main-img" onError={(e) => { e.target.src='https://via.placeholder.com/500x500?text=No+Image'; }} />
          </div>
          <div className="detail-actions">
            <button className="action-btn cart-action" onClick={() => addToCart(product)} disabled={product.stock===0}><FiShoppingCart size={20}/> ADD TO CART</button>
            <button className="action-btn buy-action" onClick={handleBuyNow} disabled={product.stock===0}><FiZap size={20}/> BUY NOW</button>
          </div>
        </div>

        {/* Info */}
        <div className="detail-info">
          <p className="detail-brand">{product.brand}</p>
          <h1 className="detail-name">{product.name}</h1>
          <div className="detail-rating">
            <span className="rating-chip">{product.ratings?.toFixed(1)} <FiStar size={12}/></span>
            <span className="rating-text">{product.numReviews} Ratings</span>
            <span className="fk-assured">✓ Flipkart Assured</span>
          </div>
          <div className="detail-price">
            <span className="d-price">₹{product.price.toLocaleString('en-IN')}</span>
            {discount > 0 && <><span className="d-original">₹{product.originalPrice.toLocaleString('en-IN')}</span><span className="d-off">{discount}% off</span></>}
          </div>
          {product.stock === 0 && <p className="out-of-stock">Out of Stock</p>}
          {product.stock > 0 && product.stock <= 5 && <p className="low-stock">Only {product.stock} left!</p>}

          {product.highlights?.length > 0 && (
            <div className="detail-section">
              <h3>Highlights</h3>
              <ul className="highlights-list">{product.highlights.map((h, i) => <li key={i}>{h}</li>)}</ul>
            </div>
          )}

          <div className="detail-section">
            <h3>Description</h3>
            <p className="detail-description">{product.description}</p>
          </div>

          {product.specifications?.length > 0 && (
            <div className="detail-section">
              <h3>Specifications</h3>
              <table className="spec-table">
                <tbody>{product.specifications.map((s, i) => (<tr key={i}><td>{s.key}</td><td>{s.value}</td></tr>))}</tbody>
              </table>
            </div>
          )}

          {/* Reviews */}
          <div className="detail-section">
            <h3>Ratings & Reviews</h3>
            {product.reviews?.length > 0 ? (
              product.reviews.map((r, i) => (
                <div key={i} className="review-item">
                  <div className="review-header">
                    <span className="review-rating-chip">{r.rating} <FiStar size={10}/></span>
                    <span className="reviewer-name">{r.name}</span>
                  </div>
                  <p className="review-comment">{r.comment}</p>
                </div>
              ))
            ) : <p className="no-reviews">No reviews yet. Be the first to review!</p>}

            <form className="review-form" onSubmit={handleReview}>
              <h4>Write a Review</h4>
              <div className="rating-select">
                {[1,2,3,4,5].map((s) => (
                  <button key={s} type="button" className={`star-btn ${review.rating >= s ? 'filled' : ''}`} onClick={() => setReview({...review, rating: s})}>★</button>
                ))}
              </div>
              <textarea placeholder="Share your experience..." value={review.comment} onChange={(e) => setReview({...review, comment: e.target.value})} required rows={3} className="review-textarea" />
              <button type="submit" className="submit-review-btn">Submit Review</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductDetail;
