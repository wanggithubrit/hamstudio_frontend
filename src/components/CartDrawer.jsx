import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Lock, Truck } from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateQty, 
  onRemoveItem, 
  onCheckout 
}) {
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className={`cart-drawer-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div 
        className={`cart-drawer-panel ${isOpen ? 'active' : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShoppingBag size={20} className="header-bag-icon" />
            <h3 className="cart-drawer-title">Your Cart</h3>
            <span className="cart-drawer-badge">{itemCount}</span>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="cart-drawer-close-btn"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body (Scrollable) */}
        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <div className="cart-drawer-empty">
              <ShoppingBag size={48} className="empty-cart-icon" />
              <h4>Your cart is empty</h4>
              <p>Add some solid 925 sterling silver jewelry to get started.</p>
              <button 
                type="button" 
                onClick={onClose} 
                className="btn-outline"
                style={{ marginTop: '1.5rem', width: 'auto', padding: '0.75rem 2rem' }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="cart-drawer-items-list">
              {cart.map((item) => (
                <div key={item.id} className="cart-drawer-item">
                  <div className="cart-drawer-item-img-container">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-drawer-item-info">
                    <h4>{item.name}</h4>
                    <p className="item-meta">{item.meta}</p>
                    <span className="item-price">₹{(item.price).toLocaleString('en-IN')}</span>

                    <div className="item-qty-row">
                      <div className="item-qty-selector">
                        <button 
                          type="button" 
                          onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={10} />
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          type="button" 
                          onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={10} />
                        </button>
                      </div>

                      <button 
                        type="button" 
                        onClick={() => onRemoveItem(item.id)}
                        className="item-remove-btn"
                        aria-label="Remove item"
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                  <div className="cart-drawer-item-total">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer (Sticky at bottom) */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            {/* Free shipping banner */}
            <div className="cart-drawer-shipping-banner">
              <Truck size={14} style={{ color: 'var(--accent-gold)' }} />
              <span>Complimentary Domestic Shipping Across India</span>
            </div>

            {/* Pricing Summary */}
            <div className="cart-drawer-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span className="subtotal-val">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-row shipping">
                <span>Shipping</span>
                <span className="free-shipping-tag">Free</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>Estimated Total</span>
                <span className="total-val">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="cart-drawer-actions">
              <button 
                type="button" 
                onClick={onCheckout}
                className="btn-primary cart-checkout-btn"
              >
                <span>Proceed To Checkout</span>
                <ArrowRight size={16} />
              </button>
              <button 
                type="button" 
                onClick={onClose} 
                className="cart-continue-btn"
              >
                Continue Shopping
              </button>
            </div>

            {/* Safe transaction note */}
            <div className="cart-drawer-trust-note">
              <Lock size={11} />
              <span>Secure Checkout SSL Encrypted Connection</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
