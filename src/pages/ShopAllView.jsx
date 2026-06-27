import React, { useState, useMemo } from 'react';
import { products } from '../data/mockData';
import { X, Grid, List, SlidersHorizontal, ShoppingBag, Eye, Heart, Star } from 'lucide-react';

export default function ShopAllView({ 
  onAddToCart, 
  onSelectProduct, 
  setActiveTab, 
  searchQuery, 
  setSearchQuery, 
  productsList = products,
  wishlist = [],
  toggleWishlist = () => {}
}) {
  // Filters State
  const [selectedCats, setSelectedCats] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  
  // Controls State
  const [sortBy, setSortBy] = useState('DEFAULT');
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Filter Categories list
  const categoriesList = ['Necklaces', 'Bracelets', 'Rings', 'Earrings'];
  const priceRanges = [
    { label: 'Under ₹2,000', id: 'under-2000' },
    { label: '₹2,000 - ₹3,500', id: '2000-3500' },
    { label: '₹3,500 - ₹5,000', id: '3500-5000' },
    { label: 'Over ₹5,000', id: 'over-5000' }
  ];

  // Helper toggle functions
  const toggleFilter = (list, setList, val) => {
    setList(prev => 
      prev.includes(val) ? prev.filter(item => item !== val) : [...prev, val]
    );
  };

  const handleClearAll = () => {
    setSelectedCats([]);
    setSelectedPrices([]);
    setSearchQuery('');
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...productsList];

    // Filter by Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Filter by Category
    if (selectedCats.length > 0) {
      result = result.filter(p => selectedCats.includes(p.category));
    }



    // Filter by Price Range
    if (selectedPrices.length > 0) {
      result = result.filter(p => {
        return selectedPrices.some(rangeId => {
          if (rangeId === 'under-2000') return p.price < 2000;
          if (rangeId === '2000-3500') return p.price >= 2000 && p.price <= 3500;
          if (rangeId === '3500-5000') return p.price >= 3500 && p.price <= 5000;
          if (rangeId === 'over-5000') return p.price > 5000;
          return false;
        });
      });
    }

    // Sort Products
    if (sortBy === 'LOW_TO_HIGH') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'HIGH_TO_LOW') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [selectedCats, selectedPrices, sortBy, searchQuery, productsList]);

  // Aggregate active tags for rendering
  const activeTags = useMemo(() => {
    const tags = [];
    if (searchQuery) {
      tags.push({ type: 'search', value: searchQuery, label: `Search: "${searchQuery}"` });
    }
    selectedCats.forEach(c => tags.push({ type: 'cat', value: c, label: c }));
    selectedPrices.forEach(p => {
      const range = priceRanges.find(r => r.id === p);
      if (range) tags.push({ type: 'price', value: p, label: range.label });
    });
    return tags;
  }, [selectedCats, selectedPrices, searchQuery]);

  const removeTag = (tag) => {
    if (tag.type === 'search') setSearchQuery('');
    if (tag.type === 'cat') setSelectedCats(prev => prev.filter(i => i !== tag.value));
    if (tag.type === 'price') setSelectedPrices(prev => prev.filter(i => i !== tag.value));
  };

  const handleProductClick = (product) => {
    onSelectProduct(product);
    setActiveTab('detail');
  };

  const totalCount = productsList.length;
  const filteredCount = filteredProducts.length;

  return (
    <main className="shop-all-view container section-padding page-fade" style={{ padding: '1rem', }}>
      {/* Catalog Title Header */}
      <div className="catalog-header">
        <h1>The Collection</h1>
        <p>
          Discover meticulous craftsmanship through our curated selection of fine jewelry, designed for those who command the light.
        </p>
      </div>

      {/* Control Bar (Grid vs List, Toggle Filter, Sort dropdown) */}
      <div className="catalog-control-bar">
        <div className="control-bar-left">
          <button 
            type="button" 
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline"
            style={{ padding: '0.6rem 1.2rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <SlidersHorizontal size={14} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          
          <div className="grid-layout-btns">
            <button 
              onClick={() => setViewMode('grid')}
              className={`grid-layout-btn ${viewMode === 'grid' ? 'active' : ''}`}
              aria-label="Grid View"
            >
              <Grid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`grid-layout-btn ${viewMode === 'list' ? 'active' : ''}`}
              aria-label="List View"
            >
              <List size={18} />
            </button>
          </div>
        </div>

        <div className="control-bar-right">
          <div className="sort-select-wrapper">
            <span>Sort By</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="DEFAULT">Featured</option>
              <option value="LOW_TO_HIGH">Price: Low to High</option>
              <option value="HIGH_TO_LOW">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Tags Row */}
      {activeTags.length > 0 && (
        <div className="active-tags-row">
          {activeTags.map((tag, index) => (
            <button 
              key={index}
              onClick={() => removeTag(tag)}
              className={`active-tag-badge ${tag.type === 'search' ? 'search-badge' : ''}`}
            >
              {tag.label} <X size={12} />
            </button>
          ))}
          <button onClick={handleClearAll} className="clear-all-filters-btn">
            Clear All
          </button>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className={`catalog-layout ${showFilters ? 'filters-visible' : 'filters-hidden'}`}>
        {/* Sidebar Filters */}
        {showFilters && (
          <>
            <div className="filters-backdrop-overlay" onClick={() => setShowFilters(false)} />
            <aside className="filters-sidebar">
              <div className="mobile-filter-header">
                <h3>Filters</h3>
                <button 
                  type="button" 
                  onClick={() => setShowFilters(false)} 
                  className="mobile-filter-close-btn"
                  aria-label="Close filters"
                >
                  <X size={18} />
                </button>
              </div>
            {/* Categories */}
            <div className="filter-group-block">
              <h4 className="filter-group-title">Categories</h4>
              <ul className="filter-items-list">
                {categoriesList.map(cat => (
                  <li key={cat}>
                    <label className="filter-item-label">
                      <input 
                        type="checkbox"
                        checked={selectedCats.includes(cat)}
                        onChange={() => toggleFilter(selectedCats, setSelectedCats, cat)}
                        className="filter-checkbox"
                      />
                      <span>{cat}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>


            {/* Price Ranges */}
            <div className="filter-group-block">
              <h4 className="filter-group-title">Price Range</h4>
              <ul className="filter-items-list">
                {priceRanges.map(range => (
                  <li key={range.id}>
                    <label className="filter-item-label">
                      <input 
                        type="checkbox"
                        checked={selectedPrices.includes(range.id)}
                        onChange={() => toggleFilter(selectedPrices, setSelectedPrices, range.id)}
                        className="filter-checkbox"
                      />
                      <span>{range.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

          </aside>
        </>
      )}

        {/* Product Grid / List Container */}
        <div className="catalog-products-container" style={{ width: '100%' }}>
          {filteredCount === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
              <h3 style={{ marginBottom: '1rem' }}>No products match your filters</h3>
              <button onClick={handleClearAll} className="btn-primary">Clear Filters</button>
            </div>
          ) : (
            <>
              <div 
                key={`${viewMode}-${sortBy}-${selectedCats.join(',')}-${selectedPrices.join(',')}`}
                className={`${viewMode === 'grid' ? 'catalog-products-grid' : 'catalog-products-list-mode'} stagger-in`}
              >
                {filteredProducts.map((product, index) => {
                  const isWishlisted = wishlist.some(item => item.id === product.id);
                  const productSeed = product.name.charCodeAt(0) + product.name.charCodeAt(product.name.length - 1);
                  const rating = 4 + (productSeed % 2 === 0 ? 1 : 0);
                  const itemsSold = (productSeed * 7 + 120) % 350 + 80;

                  if (viewMode === 'list') {
                    return (
                      <div key={product.id} className="product-list-card" style={{ animationDelay: `${index * 50}ms` }}>
                        <div className="product-list-img-wrapper" onClick={() => handleProductClick(product)}>
                          {product.tag && (
                            <span 
                              className="product-tag-padded" 
                              style={{ 
                                position: 'absolute', 
                                top: '20px', 
                                left: '20px', 
                                borderRadius: '4px',
                                zIndex: 2 
                              }}
                            >
                              {product.tag}
                            </span>
                          )}
                          <img src={product.image} alt={product.name} className="product-list-image" />
                          
                          {/* Wishlist Button */}
                          <button 
                            type="button"
                            className={`product-wishlist-btn-floating ${isWishlisted ? 'active' : ''}`}
                            onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                          >
                            <Heart size={15} fill={isWishlisted ? "var(--accent-gold)" : "none"} stroke={isWishlisted ? "var(--accent-gold)" : "currentColor"} />
                          </button>
                        </div>

                        <div className="product-list-content">
                          <div className="product-list-header">
                            <h3 className="product-list-title" onClick={() => handleProductClick(product)}>
                              {product.name}
                            </h3>
                          </div>

                          <p className="product-list-desc" onClick={() => handleProductClick(product)}>
                            {product.description || "Crafted from fine 925 sterling silver, this design features architectural accents and modern gothic details."}
                          </p>

                          <div className="product-list-footer">
                            <span className="product-list-price" onClick={() => handleProductClick(product)}>
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                            
                            <div className="product-list-stats">
                              <span className="product-list-sold">{itemsSold} items sold</span>
                              
                              <button 
                                type="button"
                                className="product-list-add-btn btn-primary btn-sm"
                                onClick={() => onAddToCart(product)}
                              >
                                <ShoppingBag size={12} />
                                <span>Add</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Default Grid Card
                  return (
                    <div key={product.id} className="product-card" style={{ animationDelay: `${index * 50}ms` }}>
                      <div className="product-image-container">
                        {product.tag && (
                          <span 
                            className="product-tag-padded" 
                            style={{ 
                              position: 'absolute', 
                              top: '20px', 
                              left: '20px', 
                              borderRadius: '4px',
                              zIndex: 2,
                              padding:'1rem'
                            }}
                          >
                            {product.tag}
                          </span>
                        )}
                        <img src={product.image} alt={product.name} className="product-image" />

                        {/* Wishlist Button */}
                        <button 
                          type="button"
                          className={`product-wishlist-btn-floating ${isWishlisted ? 'active' : ''}`}
                          onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        >
                          <Heart size={15} fill={isWishlisted ? "var(--accent-gold)" : "none"} stroke={isWishlisted ? "var(--accent-gold)" : "currentColor"} />
                        </button>

                        {/* Floating Quick Add Button (Mobile Only) */}
                        <button
                          type="button"
                          className="product-quick-add-btn-floating mobile-only-btn"
                          onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                          aria-label="Quick add to cart"
                        >
                          <ShoppingBag size={14} />
                        </button>
                        
                        {/* Dual Action Overlay */}
                        <div className="product-add-overlay" style={{ gap: '0.75rem' }}>
                          <button 
                            className="product-btn-add"
                            onClick={() => handleProductClick(product)}
                            title="View Details"
                            style={{ padding: '0.75rem' }}
                          >
                            <Eye size={14} />
                          </button>
                          <button 
                            className="product-btn-add"
                            onClick={() => onAddToCart(product)}
                            title="Quick Add"
                            style={{ padding: '0.75rem' }}
                          >
                            <ShoppingBag size={14} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="product-info" onClick={() => handleProductClick(product)} style={{ cursor: 'pointer' }}>
                        <div>
                          <h3 className="product-title">{product.name}</h3>
                          <p className="product-subtext">{product.meta}</p>
                        </div>
                        <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progress/Pagination */}
              <div className="catalog-pagination">
                <span className="pagination-progress-text">
                  Showing {filteredCount} of {totalCount} Pieces
                </span>
                <div className="pagination-progress-bar">
                  <div 
                    className="pagination-progress-fill" 
                    style={{ width: `${(filteredCount / totalCount) * 100}%` }}
                  ></div>
                </div>
                {filteredCount < totalCount && (
                  <button 
                    type="button" 
                    onClick={() => alert("Loading more items...")} 
                    className="btn-outline"
                    style={{ marginTop: '0.5rem' }}
                  >
                    Load More
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
