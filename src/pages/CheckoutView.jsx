import React, { useState, useEffect } from 'react';
import { Mail, Truck, Lock, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

export default function CheckoutView({ 
  cart, 
  onUpdateQty, 
  onRemoveItem, 
  onCheckoutSuccess,
  setActiveTab,
  profile,
  clientEmail
}) {
  const [formData, setFormData] = useState(() => {
    const savedProfile = localStorage.getItem('hamstudio_client_profile');
    const savedEmail = localStorage.getItem('hamstudio_client_email') || '';
    const initialProfile = savedProfile ? JSON.parse(savedProfile) : {};
    return {
      email: clientEmail || savedEmail,
      firstName: profile.firstName || initialProfile.firstName || '',
      lastName: profile.lastName || initialProfile.lastName || '',
      address: profile.address || initialProfile.address || '',
      landmark: '',
      city: profile.city || initialProfile.city || '',
      state: profile.state || initialProfile.state || '',
      pincode: profile.pincode || initialProfile.pincode || '',
      phone: profile.phone || initialProfile.phone || '',
      sameBilling: true
    };
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      email: clientEmail || prev.email,
      firstName: profile.firstName || prev.firstName,
      lastName: profile.lastName || prev.lastName,
      address: profile.address || prev.address,
      city: profile.city || prev.city,
      state: profile.state || prev.state,
      pincode: profile.pincode || prev.pincode,
      phone: profile.phone || prev.phone
    }));
  }, [profile, clientEmail]);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic local validation
    if (cart.length === 0) {
      alert('Your cart is empty. Please add items before checking out.');
      return;
    }
    
    if (formData.phone.length < 10) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }

    if (formData.pincode.length !== 6 || isNaN(formData.pincode)) {
      alert('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    // Trigger success callback
    onCheckoutSuccess(formData);
  };

  return (
    <main className="checkout-view container section-padding page-fade" style={{ paddingTop: '3rem' }}>
      {/* Step Indicator */}
      <div className="checkout-progress">
        <a href="#shop" className="checkout-step" onClick={(e) => { e.preventDefault(); setActiveTab('home'); }}>
          <span className="checkout-step-num">1</span>
          <span>Shop</span>
        </a>
        <div className="checkout-step-sep"></div>
        <div className="checkout-step active">
          <span className="checkout-step-num">2</span>
          <span>Checkout</span>
        </div>
        <div className="checkout-step-sep"></div>
        <div className="checkout-step">
          <span className="checkout-step-num">3</span>
          <span>Payment</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="checkout-grid">
        {/* Left Column: Forms */}
        <div className="checkout-form-container">
          {/* Step 1: Contact Information */}
          <div className="checkout-section-block">
            <h3 className="checkout-block-title">
              <Mail className="checkout-block-title-icon" />
              <span>1. Contact Information</span>
            </h3>
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address *</label>
              <input 
                type="email" 
                id="email"
                name="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>

          {/* Step 2: Shipping Details */}
          <div className="checkout-section-block">
            <h3 className="checkout-block-title">
              <Truck className="checkout-block-title-icon" />
              <span>2. Shipping Details</span>
            </h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">First Name *</label>
                <input 
                  type="text" 
                  id="firstName"
                  name="firstName"
                  required
                  placeholder="Arjun"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName" className="form-label">Last Name *</label>
                <input 
                  type="text" 
                  id="lastName"
                  name="lastName"
                  required
                  placeholder="Sharma"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="address" className="form-label">Full Address *</label>
              <input 
                type="text" 
                id="address"
                name="address"
                required
                placeholder="House No, Apartment, Street Name"
                value={formData.address}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="landmark" className="form-label">Landmark (Optional)</label>
              <input 
                type="text" 
                id="landmark"
                name="landmark"
                placeholder="Near Phoenix Mall"
                value={formData.landmark}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city" className="form-label">City *</label>
                <input 
                  type="text" 
                  id="city"
                  name="city"
                  required
                  placeholder="Mumbai"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="state" className="form-label">State / UT *</label>
                <input 
                  type="text" 
                  id="state"
                  name="state"
                  required
                  placeholder="Maharashtra"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="pincode" className="form-label">PIN Code *</label>
                <input 
                  type="text" 
                  id="pincode"
                  name="pincode"
                  required
                  maxLength={6}
                  placeholder="400001"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="country" className="form-label">Country *</label>
                <input 
                  type="text" 
                  id="country"
                  name="country"
                  disabled
                  value="India"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">Phone Number *</label>
              <input 
                type="tel" 
                id="phone"
                name="phone"
                required
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-checkbox-label">
                <input 
                  type="checkbox"
                  name="sameBilling"
                  checked={formData.sameBilling}
                  onChange={handleInputChange}
                  className="form-checkbox"
                />
                <span>Billing address same as shipping address</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Summary Sticky Card */}
        <div className="order-summary-card">
          <h3 className="summary-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Your Order</span>
            <span>({cart.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
          </h3>

          {cart.length === 0 ? (
            <div className="empty-cart-state" style={{ textAlign: 'center', padding: '2rem 0' }}>
              <ShoppingBag style={{ width: '48px', height: '48px', stroke: 'var(--text-muted)', marginBottom: '1rem' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>Your cart is empty</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Browse our catalog to add products.</p>
              <button 
                type="button" 
                onClick={() => setActiveTab('home')}
                className="btn-outline"
                style={{ width: '100%' }}
              >
                Browse Collection
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              <div className="summary-items-list">
                {cart.map((item) => (
                  <div key={item.id} className="summary-item-row">
                    <div className="summary-item-img-container">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="summary-item-info">
                      <h4>{item.name}</h4>
                      <p>{item.meta}</p>
                      
                      <div className="item-qty-selector" style={{ marginTop: '0.5rem' }}>
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
                        
                        <button 
                          type="button" 
                          onClick={() => onRemoveItem(item.id)}
                          className="item-remove-btn"
                          style={{ marginLeft: 'auto', display: 'inline-flex', background: 'none', border: 'none', padding: 0 }}
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="summary-item-price-col">
                      <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* India Only Delivery Note */}
              <div style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', padding: '1.25rem', display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
                <Truck style={{ stroke: 'var(--accent-gold)', width: '20px', height: '20px', flexShrink: 0, marginTop: '0.15rem' }} />
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  <strong>SHIPPING: INDIA ONLY.</strong> Your order will ship from our Nagaland studio and arrive within 5-7 business days. Domestic shipping is complimentary.
                </p>
              </div>

              {/* Calculation Rows */}
              <div className="summary-pricing-rows">
                <div className="summary-pricing-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="summary-pricing-row">
                  <span>Shipping (Domestic)</span>
                  <span style={{ color: 'var(--accent-gold)' }}>COMPLIMENTARY</span>
                </div>
                <div className="summary-pricing-row">
                  <span>Estimated Taxes (GST)</span>
                  <span>Calculated next step</span>
                </div>
                
                <div className="summary-pricing-row total">
                  <span>Total</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Submit button */}
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '2rem', marginBottom: '1rem' }}>
                Complete Checkout <ArrowRight size={16} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <Lock size={12} style={{ stroke: 'var(--accent-gold)' }} />
                <span>Secure Policy Encrypted Transaction</span>
              </div>
            </>
          )}
        </div>
      </form>
    </main>
  );
}
