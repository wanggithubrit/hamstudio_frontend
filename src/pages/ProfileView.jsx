import React, { useState, useEffect } from 'react';
import { User, LogOut, Package, MapPin, Phone, Mail, Calendar, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import WishlistView from './WishlistView';

export default function ProfileView({ 
  setActiveTab, 
  profile, 
  setProfile, 
  loggedInEmail, 
  setLoggedInEmail,
  wishlist = [],
  onAddToCart,
  toggleWishlist,
  onSelectProduct
}) {
  const [emailInput, setEmailInput] = useState('');
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [subTab, setSubTab] = useState('account'); // 'account', 'orders', 'addresses'

  // Fetch order history if already logged in on mount
  useEffect(() => {
    if (loggedInEmail) {
      fetchOrderHistory(loggedInEmail);
    }
  }, [loggedInEmail]);

  const fetchOrderHistory = async (email) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/orders/history/?email=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error('Failed to fetch history');
      const data = await res.json();
      setOrders(data);
      
      // If we find orders and our profile fields are empty, pre-fill them from the most recent order shipping details!
      if (Array.isArray(data) && data.length > 0) {
        const lastOrder = data[0];
        const ship = lastOrder.shipping || {};
        setProfile(prev => {
          const updated = {
            firstName: prev.firstName || ship.firstName || '',
            lastName: prev.lastName || ship.lastName || '',
            phone: prev.phone || ship.phone || '',
            address: prev.address || ship.address || '',
            city: prev.city || ship.city || '',
            state: prev.state || ship.state || '',
            pincode: prev.pincode || ship.pincode || ''
          };
          localStorage.setItem('hamstudio_client_profile', JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      setErrorMsg('Could not connect to database history.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setLoggedInEmail(emailInput.trim());
    localStorage.setItem('hamstudio_client_email', emailInput.trim());
    fetchOrderHistory(emailInput.trim());
  };

  const handleLogout = () => {
    setLoggedInEmail('');
    setOrders([]);
    localStorage.removeItem('hamstudio_client_email');
    setEmailInput('');
  };

  const handleSavePersonal = (e) => {
    e.preventDefault();
    setSavingProfile(true);
    const formData = new FormData(e.target);
    const updated = {
      ...profile,
      firstName: formData.get('firstName') || '',
      lastName: formData.get('lastName') || '',
      phone: formData.get('phone') || ''
    };
    setProfile(updated);
    localStorage.setItem('hamstudio_client_profile', JSON.stringify(updated));
    setTimeout(() => {
      setSavingProfile(false);
      alert('Personal details updated successfully.');
    }, 400);
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    setSavingProfile(true);
    const formData = new FormData(e.target);
    const updated = {
      ...profile,
      address: formData.get('address') || '',
      city: formData.get('city') || '',
      state: formData.get('state') || '',
      pincode: formData.get('pincode') || ''
    };
    setProfile(updated);
    localStorage.setItem('hamstudio_client_profile', JSON.stringify(updated));
    setTimeout(() => {
      setSavingProfile(false);
      alert('Shipping address updated successfully.');
    }, 400);
  };

  const toggleOrder = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return '#10b981'; // green
      case 'shipped':
        return '#3b82f6'; // blue
      default:
        return '#f59e0b'; // orange
    }
  };

  return (
    <main className="profile-view-page page-fade text-white" style={{ minHeight: '80vh' }}>
      {/* Hero Section */}
      <section style={{ paddingTop: '2.5rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--accent-gold)' }}><User size={24} /></span>
            <span style={{ fontFamily: 'var(--font-accent)', fontSize: '0.75rem', letterSpacing: '0.15em', color: 'var(--accent-gold)', textTransform: 'uppercase', fontWeight: 600 }}>
              Client Portal
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>
            {loggedInEmail ? 'My Account' : 'Access Your Profile'}
          </h1>
        </div>
      </section>

      {/* Main Grid View */}
      <section style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          {!loggedInEmail ? (
            /* LOGIN SCREEN */
            <div className="profile-login-card">
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Lock size={32} style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Passwordless Login</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                  Enter your email address used during purchase. We will retrieve your shipping profile and order history instantly.
                </p>
              </div>

              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', fontFamily: 'var(--font-accent)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Email Address *</label>
                  <input 
                    type="email" 
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="e.g. client@example.com" 
                    required 
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Verify & Access Account
                </button>
              </form>
            </div>
          ) : (
            /* LOGGED IN ACCOUNT DASHBOARD */
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Profile Sub-tabs Nav */}
              <div className="profile-subtabs-nav">
                <button 
                  onClick={() => setSubTab('account')}
                  className={`profile-subtab-btn ${subTab === 'account' ? 'active' : ''}`}
                >
                  My Account
                </button>
                <button 
                  onClick={() => setSubTab('orders')}
                  className={`profile-subtab-btn ${subTab === 'orders' ? 'active' : ''}`}
                >
                  My Orders
                </button>
                <button 
                  onClick={() => setSubTab('addresses')}
                  className={`profile-subtab-btn ${subTab === 'addresses' ? 'active' : ''}`}
                >
                  My Addresses
                </button>
                <button 
                  onClick={() => setSubTab('wishlist')}
                  className={`profile-subtab-btn ${subTab === 'wishlist' ? 'active' : ''}`}
                >
                  My Wishlist
                </button>
              </div>

              {/* Tab Contents */}
              <div className="profile-tab-content">
                
                {/* 1. MY ACCOUNT TAB */}
                {subTab === 'account' && (
                  <div style={{ maxWidth: '680px' }} className="page-fade">
                    
                    {/* Tab Page Header */}
                    <div style={{ marginBottom: '2.5rem' }}>
                      <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: 'bold' }}>Account</h2>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>View and edit your personal info below.</p>
                      <div style={{ borderBottom: '1px solid var(--border-color)', marginTop: '1.5rem' }} />
                    </div>

                    <div className="profile-details-card-inner" style={{ background: 'none', border: 'none', padding: 0, backdropFilter: 'none', boxShadow: 'none' }}>
                      <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Personal info</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Update your personal information.</p>

                      <form onSubmit={handleSavePersonal} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>First name</label>
                            <input type="text" name="firstName" defaultValue={profile.firstName} placeholder="First name" />
                          </div>
                          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Last name</label>
                            <input type="text" name="lastName" defaultValue={profile.lastName} placeholder="Last name" />
                          </div>
                        </div>

                        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Phone</label>
                          <input type="text" name="phone" defaultValue={profile.phone} placeholder="Phone number" />
                        </div>

                        {/* Form Action Buttons: Aligned to the Right */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
                          <button type="reset" className="btn-outline btn-sm">Discard</button>
                          <button type="submit" className="btn-primary btn-sm" disabled={savingProfile}>
                            {savingProfile ? 'Updating...' : 'Update Info'}
                          </button>
                        </div>
                      </form>

                      {/* Login Info Block */}
                      <div style={{ marginTop: '3.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
                        <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Login info</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>View your login email authentication.</p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Login email:</span>
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{loggedInEmail}</span>
                          <button 
                            onClick={handleLogout} 
                            style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: '#ef4444', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.85rem', padding: '0.25rem 0 0 0', marginTop: '0.5rem', fontWeight: 500 }}
                          >
                            Log Out
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* 2. MY ORDERS TAB */}
                {subTab === 'orders' && (
                  <div className="profile-orders-list page-fade" style={{ maxWidth: '900px' }}>
                    
                    {/* Tab Page Header */}
                    <div style={{ marginBottom: '2.5rem' }}>
                      <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: 'bold' }}>Orders</h2>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Monitor shipment progress and inspect purchase histories.</p>
                      <div style={{ borderBottom: '1px solid var(--border-color)', marginTop: '1.5rem' }} />
                    </div>

                    {loading ? (
                      <p style={{ color: 'var(--text-muted)' }}>Retrieving purchase logs...</p>
                    ) : errorMsg ? (
                      <p style={{ color: '#ef4444' }}>{errorMsg}</p>
                    ) : orders.length === 0 ? (
                      <div className="profile-order-empty-state" style={{ background: 'rgba(12, 12, 14, 0.45)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '4rem 2rem', textAlign: 'center', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)' }}>
                        <Package size={28} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>No orders found matching this email address.</p>
                        <button onClick={() => setActiveTab('shop')} className="btn-primary" style={{ display: 'inline-flex' }}>Explore Shop Inventory</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {orders.map((o) => {
                          const isExpanded = expandedOrderId === o.orderId;
                          const orderItems = o.items || [];
                          const totalAmt = orderItems.reduce((acc, item) => acc + (parseFloat(item.price) * parseInt(item.quantity || 1)), 0);

                          return (
                            <div key={o.orderId} className="profile-order-item">
                              
                              {/* Order Header Summary Row */}
                              <div 
                                onClick={() => toggleOrder(o.orderId)}
                                className="profile-order-header"
                              >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Reference #{o.orderId}</span>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Calendar size={12} /> {o.date?.split(' ')[0]}
                                  </span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                  <span 
                                    className="status-badge"
                                    style={{ 
                                      backgroundColor: `${getStatusColor(o.status)}15`,
                                      borderColor: `${getStatusColor(o.status)}40`,
                                      color: getStatusColor(o.status)
                                    }}
                                  >
                                    {o.status}
                                  </span>
                                  <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>₹{totalAmt.toLocaleString('en-IN')}</span>
                                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </div>
                              </div>

                              {/* Expanded Order Detail Block */}
                              {isExpanded && (
                                <div className="profile-order-expanded">
                                  <h4 style={{ fontSize: '0.75rem', fontFamily: 'var(--font-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '1rem', marginTop: 0 }}>Items Ordered</h4>
                                  
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                                    {orderItems.map((item, idx) => (
                                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                          {item.image && (
                                            <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                                          )}
                                          <div>
                                            <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>{item.name}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>{item.meta || 'Standard'}</p>
                                          </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                          <p style={{ fontSize: '0.85rem', margin: 0 }}>{item.quantity} x ₹{item.price}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                    <div>
                                      <h4 style={{ fontSize: '0.7rem', fontFamily: 'var(--font-accent)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', margin: '0 0 6px 0' }}>Shipping Address</h4>
                                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0 }}>
                                        {o.shipping?.firstName} {o.shipping?.lastName}<br />
                                        {o.shipping?.address}<br />
                                        {o.shipping?.city}, {o.shipping?.state} - {o.shipping?.pincode}<br />
                                        Phone: {o.shipping?.phone}
                                      </p>
                                    </div>
                                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Payment Mode</span>
                                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Online Payment (UPI/Card)</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. MY ADDRESSES TAB */}
                {subTab === 'addresses' && (
                  <div style={{ maxWidth: '640px' }} className="page-fade">
                    
                    {/* Tab Page Header */}
                    <div style={{ marginBottom: '2.5rem' }}>
                      <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: 'bold' }}>Addresses</h2>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Manage your shipping addresses and delivery details.</p>
                      <div style={{ borderBottom: '1px solid var(--border-color)', marginTop: '1.5rem' }} />
                    </div>

                    <div className="profile-details-card-inner" style={{ background: 'none', border: 'none', padding: 0, backdropFilter: 'none', boxShadow: 'none' }}>
                      <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Shipping Address</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Update your default delivery location.</p>

                      <form onSubmit={handleSaveAddress} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Street address</label>
                          <textarea name="address" rows="3" defaultValue={profile.address} placeholder="Street address, apartment, suite, unit, etc." style={{ resize: 'vertical' }} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '1.5rem' }}>
                          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>City</label>
                            <input type="text" name="city" defaultValue={profile.city} placeholder="City" />
                          </div>
                          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>State</label>
                            <input type="text" name="state" defaultValue={profile.state} placeholder="State" />
                          </div>
                          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Pincode</label>
                            <input type="text" name="pincode" defaultValue={profile.pincode} placeholder="Pincode" />
                          </div>
                        </div>

                        {/* Form Action Buttons: Aligned to the Right */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
                          <button type="reset" className="btn-outline btn-sm">Discard</button>
                          <button type="submit" className="btn-primary btn-sm" disabled={savingProfile}>
                            {savingProfile ? 'Updating...' : 'Update Address'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* 4. MY WISHLIST SUBTAB */}
                {subTab === 'wishlist' && (
                  <div className="page-fade" style={{ maxWidth: '900px' }}>
                    <div style={{ marginBottom: '2.5rem' }}>
                      <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: 'bold' }}>My Wishlist</h2>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Inspect and manage your saved sterling silver jewelry pieces.</p>
                      <div style={{ borderBottom: '1px solid var(--border-color)', marginTop: '1.5rem' }} />
                    </div>

                    <WishlistView 
                      wishlist={wishlist}
                      onAddToCart={onAddToCart}
                      toggleWishlist={toggleWishlist}
                      setActiveTab={setActiveTab}
                      onSelectProduct={onSelectProduct}
                    />
                  </div>
                )}

              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
