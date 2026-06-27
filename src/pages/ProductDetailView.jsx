import React, { useState, useEffect } from 'react';
import { recommendedProducts } from '../data/mockData';
import { ChevronDown, ShoppingBag, Heart, Share2, Sparkles, Truck, RotateCcw, Plus, Minus } from 'lucide-react';

export default function ProductDetailView({ 
  product, 
  onAddToCartWithOptions, 
  onSelectProduct,
  setActiveTab,
  wishlist = [],
  toggleWishlist = () => {}
}) {
  const isWishlisted = wishlist.some((item) => item.id === product.id);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedMetal, setSelectedMetal] = useState('925 Sterling Silver');
  const [selectedLength, setSelectedLength] = useState('18"');
  const [quantity, setQuantity] = useState(1);
  const [openAccId, setOpenAccId] = useState('artisan');

  // Reset page selections when product changes
  useEffect(() => {
    setActiveImgIndex(0);
    setSelectedMetal('925 Sterling Silver');
    setSelectedLength('18"');
    setQuantity(1);
    setOpenAccId('artisan');
  }, [product]);

  if (!product) return null;

  const imagesList = [];
  if (product.image) {
    imagesList.push(product.image);
  }
  if (Array.isArray(product.images)) {
    product.images.forEach(img => {
      if (img && !imagesList.includes(img)) {
        imagesList.push(img);
      }
    });
  }
  if (imagesList.length === 0 && product.image_url) {
    imagesList.push(product.image_url);
  }

  const handleAddToCart = () => {
    onAddToCartWithOptions({
      ...product,
      // Create a unique cart ID based on configurations
      cartId: `${product.id}-${selectedMetal}-${selectedLength.replace('"', '')}`,
      selectedMetal,
      selectedLength,
      quantity
    });
  };

  const handleRecommendationClick = (rec) => {
    // Map standard recommended structure to active product structure
    // Since recommendations are mock data, we can resolve or mock their full page
    const fullProduct = {
      id: rec.id,
      name: rec.name,
      price: rec.price,
      image: rec.image,
      images: [
        rec.image,
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80'
      ],
      tag: 'Limited',
      category: 'Necklaces',
      gemstone: 'Onyx',
      material: 'Sterling Silver',
      meta: rec.meta,
      description: `A masterclass in gothic luxury. The ${rec.name} features refined solid 925 sterling silver outlines designed to highlight details under the moon.`
    };
    onSelectProduct(fullProduct);
  };

  return (
    <main className="product-detail-view container section-padding page-fade" style={{ padding: '1rem' }}>
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <a href="#home" onClick={(e) => { e.preventDefault(); setActiveTab('home'); }}>Home</a>
        <span className="breadcrumbs-separator">/</span>
        <a href="#shop" onClick={(e) => { e.preventDefault(); setActiveTab('shop'); }}>{product.category}</a>
        <span className="breadcrumbs-separator">/</span>
        <span className="breadcrumbs-current">{product.name}</span>
      </div>

      {/* Main Detail Split */}
      <div className="detail-layout">
        {/* Left Column: Gallery */}
        <div className="detail-gallery">
          {/* Thumbnails list */}
          <div className="gallery-thumbnails-col">
            {imagesList.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImgIndex(idx)}
                className={`gallery-thumb-btn ${activeImgIndex === idx ? 'active' : ''}`}
                aria-label={`View thumbnail ${idx + 1}`}
              >
                <img src={img} alt="" />
              </button>
            ))}
          </div>
          
          {/* Main Showcase Image */}
          <div className="gallery-main-container">
            <img 
              src={imagesList[activeImgIndex] || product.image} 
              alt={product.name} 
              className="gallery-main-img" 
            />
          </div>
        </div>

        {/* Right Column: Information Panel */}
        <div className="detail-info-sidebar">
          <span className="detail-tag">{product.tag || 'LIMITED DROP'}</span>
          <h1 className="detail-title">{product.name}</h1>
          
          <div className="detail-price-row">
            <span className="detail-price">₹{product.price.toLocaleString('en-IN')}.00</span>
            {product.originalPrice && (
              <span className="detail-original-price">₹{product.originalPrice.toLocaleString('en-IN')}.00</span>
            )}
          </div>

          {/* Length Selector */}
          <div className="detail-option-group">
            <div className="detail-option-label">
              <span>Chain Length</span>
              <span className="detail-option-selection-txt">{selectedLength}</span>
            </div>
            <div className="option-btns-flex">
              {['16"', '18"', '20"', '22"'].map(len => (
                <button 
                  key={len}
                  type="button"
                  onClick={() => setSelectedLength(len)}
                  className={`option-select-btn ${selectedLength === len ? 'active' : ''}`}
                >
                  {len}
                </button>
              ))}
            </div>
          </div>

          {/* Actions Row */}
          <div className="detail-actions-row">
            <div className="detail-qty-selector">
              <button 
                type="button" 
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="detail-qty-btn"
                aria-label="Decrease quantity"
              >
                <Minus size={12} />
              </button>
              <span className="detail-qty-val">{quantity}</span>
              <button 
                type="button" 
                onClick={() => setQuantity(prev => prev + 1)}
                className="detail-qty-btn"
                aria-label="Increase quantity"
              >
                <Plus size={12} />
              </button>
            </div>

            <button 
              type="button" 
              onClick={handleAddToCart}
              className="btn-primary"
            >
              <ShoppingBag size={14} /> Add to Cart
            </button>
          </div>

          {/* Secondary Actions */}
          <div className="detail-secondary-actions">
            <button 
              type="button" 
              onClick={() => toggleWishlist(product)}
              className={`btn-outline ${isWishlisted ? 'wishlisted' : ''}`}
              style={isWishlisted ? { borderColor: 'var(--accent-gold)' } : {}}
            >
              <Heart size={14} fill={isWishlisted ? "#e11d48" : "none"} color={isWishlisted ? "#e11d48" : "currentColor"} /> {isWishlisted ? 'In Wishlist' : 'Wishlist'}
            </button>
            <button 
              type="button" 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Product link copied to clipboard!');
              }}
              className="btn-outline"
            >
              <Share2 size={14} /> Share
            </button>
          </div>

          {/* Accordion Specs */}
          <div className="detail-accordions">
            {/* Spec 1: Styling & Details */}
            <div className={`detail-acc-item ${openAccId === 'artisan' ? 'open' : ''}`}>
              <button 
                type="button" 
                onClick={() => setOpenAccId(openAccId === 'artisan' ? '' : 'artisan')}
                className="detail-acc-trigger"
              >
                <h4>Styling & Details</h4>
                <ChevronDown className="detail-acc-chevron" />
              </button>
              <div className="detail-acc-content">
                <div className="detail-acc-inner">
                  <p>{product.description}</p>
                </div>
              </div>
            </div>

            {/* Spec 2: Materials & Care */}
            <div className={`detail-acc-item ${openAccId === 'materials' ? 'open' : ''}`}>
              <button 
                type="button" 
                onClick={() => setOpenAccId(openAccId === 'materials' ? '' : 'materials')}
                className="detail-acc-trigger"
              >
                <h4>Materials & Care</h4>
                <div className="detail-acc-content-wrapper"></div>
                <ChevronDown className="detail-acc-chevron" />
              </button>
              <div className="detail-acc-content">
                <div className="detail-acc-inner">
                  <p>Our pieces are curated in solid 925 sterling silver or heavy 18K Gold Vermeil plate.</p>
                  <p style={{ marginTop: '0.5rem' }}>Avoid chlorine and sulfur pools. Clean gently with a soft cotton jewelry cloth after every wear to preserve shine.</p>
                </div>
              </div>
            </div>

            {/* Spec 3: Shipping & Returns */}
            <div className={`detail-acc-item ${openAccId === 'shipping' ? 'open' : ''}`}>
              <button 
                type="button" 
                onClick={() => setOpenAccId(openAccId === 'shipping' ? '' : 'shipping')}
                className="detail-acc-trigger"
              >
                <h4>Shipping & Returns</h4>
                <ChevronDown className="detail-acc-chevron" />
              </button>
              <div className="detail-acc-content">
                <div className="detail-acc-inner">
                  <p>Complimentary insured standard delivery across all states in India. Order dispatches within 2 business days.</p>
                  <p style={{ marginTop: '0.5rem' }}>7-day returns for unworn items in original packaging. Refunds are processed immediately upon receipt.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Assurances Row */}
          <div className="detail-assurances">
            <div className="assurance-item">
              <Sparkles className="assurance-icon" />
              <span>Heirloom Quality</span>
            </div>
            <div className="assurance-item">
              <Truck className="assurance-icon" />
              <span>Insured Shipping</span>
            </div>
            <div className="assurance-item">
              <RotateCcw className="assurance-icon" />
              <span>Easy Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <section className="section-padding" style={{ borderTop: '1px solid var(--border-color)', paddingBottom: '2rem' }}>
        <div className="section-header-left-row" style={{ marginBottom: '3.5rem' }}>
          <div>
            <p className="section-subtitle">CURATED FOR YOU</p>
            <h2>You May Also Like</h2>
          </div>
        </div>

        <div className="products-grid stagger-in">
          {recommendedProducts.map((rec) => (
            <div 
              key={rec.id} 
              className="product-card"
              onClick={() => handleRecommendationClick(rec)}
              style={{ cursor: 'pointer' }}
            >
              <div className="product-image-container" style={{ height: '280px' }}>
                <img src={rec.image} alt={rec.name} className="product-image" />
              </div>
              <div className="product-info">
                <div>
                  <h3 className="product-title" style={{ fontSize: '1.05rem' }}>{rec.name}</h3>
                  <p className="product-subtext">{rec.meta}</p>
                </div>
                <span className="product-price" style={{ fontSize: '0.9rem' }}>
                  ₹{rec.price.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Want to see more */}
      <section className="cta-box-section" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="cta-box-wrapper" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>
          <div className="cta-box-content">
            <h2 style={{ color: 'var(--text-primary)' }}>Want to see more?</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Discover our full Autumn/Winter collection of curated architectural jewelry.
            </p>
            <div className="cta-box-actions">
              <button onClick={() => setActiveTab('shop')} className="btn-primary">
                Explore Full Shop
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
