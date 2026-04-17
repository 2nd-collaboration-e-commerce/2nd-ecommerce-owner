import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../utils/api';
import ProductCard from '../components/ProductCard/ProductCard';
import './Products.css';

const CATEGORIES = ['Electronics','Fashion','Home & Furniture','Appliances','Beauty','Toys','Sports','Books','Grocery'];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  useEffect(() => {
    setLoading(true);
    getProducts({ keyword, category, sort, page, minPrice, maxPrice, limit: 12 })
      .then((res) => { setProducts(res.data.products); setTotal(res.data.total); setPages(res.data.pages); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [keyword, category, sort, page, minPrice, maxPrice]);

  const updateParam = (key, value) => {
    const params = Object.fromEntries(searchParams.entries());
    if (value) params[key] = value; else delete params[key];
    params.page = '1';
    setSearchParams(params);
  };

  return (
    <div className="products-page">
      <aside className="filters">
        <h3>Filters</h3>
        <div className="filter-group">
          <h4>CATEGORY</h4>
          {CATEGORIES.map((cat) => (
            <label key={cat} className="filter-option">
              <input type="radio" name="category" checked={category === cat} onChange={() => updateParam('category', cat)} />
              {cat}
            </label>
          ))}
          {category && <button className="clear-filter" onClick={() => updateParam('category', '')}>Clear</button>}
        </div>
        <div className="filter-group">
          <h4>PRICE RANGE</h4>
          <input className="price-input" type="number" placeholder="Min Price" value={minPrice} onChange={(e) => updateParam('minPrice', e.target.value)} />
          <input className="price-input" type="number" placeholder="Max Price" value={maxPrice} onChange={(e) => updateParam('maxPrice', e.target.value)} />
        </div>
        <div className="filter-group">
          <h4>SORT BY</h4>
          {[['newest','Newest First'],['price_asc','Price: Low to High'],['price_desc','Price: High to Low'],['rating','Top Rated']].map(([val,label]) => (
            <label key={val} className="filter-option">
              <input type="radio" name="sort" checked={sort === val} onChange={() => updateParam('sort', val)} />
              {label}
            </label>
          ))}
        </div>
      </aside>

      <main className="products-main">
        <div className="products-header">
          <h2>{keyword ? `Results for "${keyword}"` : category || 'All Products'} <span>({total} items)</span></h2>
        </div>
        {loading ? (
          <div className="products-grid-page">
            {[...Array(12)].map((_, i) => <div key={i} className="skeleton-card"><div className="skeleton-img"></div><div className="skeleton-line"></div><div className="skeleton-line short"></div></div>)}
          </div>
        ) : products.length === 0 ? (
          <div className="no-results">
            <h3>No products found</h3>
            <p>Try different keywords or filters</p>
          </div>
        ) : (
          <>
            <div className="products-grid-page">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
            {pages > 1 && (
              <div className="pagination">
                {[...Array(pages)].map((_, i) => (
                  <button key={i} className={`page-btn ${page === i+1 ? 'active' : ''}`} onClick={() => updateParam('page', String(i+1))}>{i+1}</button>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Products;
