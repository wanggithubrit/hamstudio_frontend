import React from 'react';
import { Heart, ShoppingBag, Eye, ArrowRight } from 'lucide-react';

export default function WishlistView({ 
  wishlist = [], 
  onAddToCart, 
  toggleWishlist, 
  setActiveTab, 
  onSelectProduct,
  hideHeader = false
}) {
  const handleProductClick = (product) => {
    onSelectProduct(product);
    setActiveTab('detail');
  };

  return (
    <main className={`wishlist-view ${!hideHeader ? 'container section-padding' : ''} page-fade`} style={{ minHeight: !hideHeader ? '80vh' : 'auto', paddingTop: !hideHeader ? '3rem' : '0' }}>
      {!hideHeader && (
        <div className="catalog-header" style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <p className="section-subtitle" style={{ letterSpacing: '0.2em' }}>YOUR FAVOURITES</p>
          <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: '400' }}>My Wishlist</h1>
          <p style={{ maxWidth: '600px', margin: '1rem auto 0', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Keep track of the sterling silver pieces you command. Add them directly to your bag or view details.
          </p>
        </div>
      )}

      {wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: hideHeader ? '3rem 0' : '5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }} className="page-fade">
          <div style={{ position: 'relative', display: 'inline-flex', padding: '1.5rem', borderRadius: '50%', backgroundColor: 'var(--accent-transparent)' }}>
            <Heart size={48} strokeWidth={1} style={{ color: 'var(--accent-gold)' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Your Wishlist is Empty</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '300px', margin: '0 auto' }}>
              Explore our collections to save your favorite silver pieces.
            </p>
          </div>
          <button onClick={() => setActiveTab('shop')} className="btn-primary" style={{ marginTop: '0.5rem' }}>
            Explore Shop <ArrowRight size={14} />
          </button>
        </div>
      ) : (
        <div 
          key={wishlist.length}
          className="catalog-products-grid stagger-in"
        >
          {wishlist.map((product, index) => {
            const isWishlisted = wishlist.some(item => item.id === product.id);
            return (
              <div 
                key={product.id} 
                className="product-card"
                onClick={() => handleProductClick(product)}
                style={{ cursor: 'pointer', animationDelay: `${index * 50}ms` }}
              >
                <div className="product-image-container" style={{ position: 'relative' }}>
                  {product.tag && (
                    <span className="product-tag-padded">{product.tag}</span>
                  )}
                  <img src={product.image} alt={product.name} className="product-image" />
                  
                  {/* Remove Wishlist Button */}
                  <button 
                    type="button"
                    className={`product-wishlist-btn-floating ${isWishlisted ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                    aria-label="Remove from wishlist"
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
                      onClick={(e) => { e.stopPropagation(); handleProductClick(product); }}
                      title="View Details"
                      style={{ padding: '0.75rem' }}
                    >
                      <Eye size={14} />
                    </button>
                    <button 
                      className="product-btn-add"
                      onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                      title="Quick Add"
                      style={{ padding: '0.75rem' }}
                    >
                      <ShoppingBag size={14} />
                    </button>
                  </div>
                </div>
                <div className="product-info">
                  <div>
                    <h3 className="product-title">{product.name}</h3>
                    <p className="product-subtext">{product.category}</p>
                  </div>
                  <span className="product-price">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
