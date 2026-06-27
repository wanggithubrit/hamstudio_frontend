import React, { useState } from 'react';
import { ShoppingBag, User, Gem, Search, X, Menu, Instagram, Mail, Sun, Moon, Heart } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, cartCount, setSearchQuery, theme, toggleTheme, setCartOpen, wishlist }) {
  const [showSearch, setShowSearch] = useState(false);
  const [localQuery, setLocalQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (localQuery.trim()) {
      setSearchQuery(localQuery.trim());
      setActiveTab('shop');
      setShowSearch(false);
      setMenuOpen(false);
    }
  };

  const handleSearchClose = () => {
    setShowSearch(false);
    setLocalQuery('');
  };

  const handleLinkClick = (tab) => {
    setActiveTab(tab);
    setMenuOpen(false);
  };

  return (
    <div className="navbar-wrapper">
      <div className={`container navbar ${showSearch ? 'search-active' : ''} ${menuOpen ? 'menu-active' : ''}`}>
        
        {/* Hamburger Menu Icon (Mobile Only) */}
        {!showSearch && (
          <button 
            className="nav-hamburger-btn" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}

        {/* Desktop Navigation Links (Hidden on Mobile) */}
        {!showSearch && (
          <ul className="nav-links desktop-only">
            <li>
              <a 
                href="#home" 
                className={activeTab === 'home' ? 'active' : ''} 
                onClick={(e) => { e.preventDefault(); handleLinkClick('home'); }}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#shop" 
                className={activeTab === 'shop' ? 'active' : ''} 
                onClick={(e) => { e.preventDefault(); handleLinkClick('shop'); }}
              >
                Shop
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                className={activeTab === 'about' ? 'active' : ''} 
                onClick={(e) => { e.preventDefault(); handleLinkClick('about'); }}
              >
                About
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                className={activeTab === 'contact' ? 'active' : ''} 
                onClick={(e) => { e.preventDefault(); handleLinkClick('contact'); }}
              >
                Contact
              </a>
            </li>
          </ul>
        )}

        {/* Search Input overlay inside Navbar */}
        {showSearch && (
          <form onSubmit={handleSearchSubmit} className="nav-search-form">
            <input 
              type="text" 
              placeholder="SEARCH SILVER PIECES..." 
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              autoFocus
            />
            <button type="submit" className="nav-icon-btn" aria-label="Submit search">
              <Search size={16} />
            </button>
            <button type="button" onClick={handleSearchClose} className="nav-icon-btn" aria-label="Cancel search">
              <X size={16} />
            </button>
          </form>
        )}

        {/* Brand Logo */}
        {!showSearch && (
          <a 
            href="#home" 
            className="nav-logo"
            onClick={(e) => { e.preventDefault(); handleLinkClick('home'); }}
          >
            <span>HAM STUDIO</span>
          </a>
        )}

        {/* Action Icons */}
        {!showSearch && (
          <div className="nav-actions">
            {/* Inline Search Bar (Desktop Only) */}
            <form onSubmit={handleSearchSubmit} className="nav-search-inline desktop-only">
              <span className="search-inline-icon">
                <Search size={14} strokeWidth={2} />
              </span>
              <input 
                type="text" 
                placeholder="Search..." 
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
              />
            </form>

            {/* Icon Search Toggle (Mobile Only) */}
            <button onClick={() => setShowSearch(true)} className="nav-icon-btn mobile-only" aria-label="Search items">
              <Search size={18} strokeWidth={1.5} />
            </button>

            <button 
              onClick={toggleTheme} 
              className="theme-toggle-track desktop-only" 
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <div className="theme-toggle-handle" />
              <Sun size={12} className="theme-toggle-icon sun" />
              <Moon size={12} className="theme-toggle-icon moon" />
            </button>
            

            <button 
              className="nav-icon-btn" 
              aria-label="Shopping cart"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="cart-count-badge">{cartCount}</span>
              )}
            </button>

            <button 
              className={`nav-icon-btn desktop-only ${activeTab === 'profile' ? 'active' : ''}`} 
              aria-label="Account profile"
              onClick={() => handleLinkClick('profile')}
            >
              <User size={18} strokeWidth={1.5} />
            </button>
          </div>
        )}

        {/* Mobile Navigation Drawer Overlay */}
        {menuOpen && (
          <div className="mobile-menu-drawer">
            <ul className="mobile-menu-links">
              <li>
                <span className="mobile-menu-link-num">01</span>
                <a 
                  href="#home" 
                  className={activeTab === 'home' ? 'active' : ''} 
                  onClick={(e) => { e.preventDefault(); handleLinkClick('home'); }}
                >
                  Home
                </a>
              </li>
              <li>
                <span className="mobile-menu-link-num">02</span>
                <a 
                  href="#shop" 
                  className={activeTab === 'shop' ? 'active' : ''} 
                  onClick={(e) => { e.preventDefault(); handleLinkClick('shop'); }}
                >
                  Shop All
                </a>
              </li>
              <li>
                <span className="mobile-menu-link-num">03</span>
                <a 
                  href="#about" 
                  className={activeTab === 'about' ? 'active' : ''} 
                  onClick={(e) => { e.preventDefault(); handleLinkClick('about'); }}
                >
                  Our Story
                </a>
              </li>
              <li>
                <span className="mobile-menu-link-num">04</span>
                <a 
                  href="#contact" 
                  className={activeTab === 'contact' ? 'active' : ''} 
                  onClick={(e) => { e.preventDefault(); handleLinkClick('contact'); }}
                >
                  Get In Touch
                </a>
              </li>
              <li>
                <span className="mobile-menu-link-num">05</span>
                <a 
                  href="#profile" 
                  className={activeTab === 'profile' ? 'active' : ''} 
                  onClick={(e) => { e.preventDefault(); handleLinkClick('profile'); }}
                >
                  My Profile
                </a>
              </li>
              <li>
                <span className="mobile-menu-link-num">06</span>
                <a 
                  href="#wishlist" 
                  className={activeTab === 'wishlist' ? 'active' : ''} 
                  onClick={(e) => { e.preventDefault(); handleLinkClick('wishlist'); }}
                >
                  My Wishlist
                </a>
              </li>
            </ul>
            <div className="mobile-menu-footer">
              <div className="mobile-menu-socials">
                <a href="https://www.instagram.com/hamstu.dio/" target="_blank" rel="noreferrer" aria-label="Instagram">
                  <Instagram size={18} />
                </a>
                <a href="mailto:support@hamstudio.in" aria-label="Email support">
                  <Mail size={18} />
                </a>
                <button 
                  onClick={toggleTheme} 
                  className="theme-toggle-track" 
                  aria-label="Toggle theme"
                >
                  <div className="theme-toggle-handle" />
                  <Sun size={12} className="theme-toggle-icon sun" />
                  <Moon size={12} className="theme-toggle-icon moon" />
                </button>
              </div>
              <p className="mobile-menu-est">EST. 2026 / NAGALAND, INDIA</p>
              <div className="mobile-menu-quick-links">
                <a href="#faq" onClick={(e) => { e.preventDefault(); handleLinkClick('faq'); }}>Client Care</a>
                <span className="dot">•</span>
                <a href="#faq" onClick={(e) => { e.preventDefault(); handleLinkClick('faq'); }}>Shipping</a>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
