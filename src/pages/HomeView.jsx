import React from 'react';
import { ArrowRight, Sparkles, Truck, Clock } from 'lucide-react';

export default function HomeView({ setActiveTab, settings }) {
  return (
    <main className="home-view page-fade">
      {/* Hero Section */}
      <section className="hero-section">
        <img 
          src={settings.home_hero_bg} 
          alt="HAM STUDIO designer gothic silver cross necklace" 
          className="hero-bg-image"
        />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <p className="hero-tagline">NEW SEASON DROP</p>
          <h1 className="hero-title">Elegance in <br /><em>Every Detail</em></h1>
          <p className="hero-desc">
            Discover a world where timeless silver meets contemporary gothic soul. Nagaland based, shipping pan India.
          </p>
          <div className="hero-actions">
            <button onClick={() => setActiveTab('shop')} className="btn-primary">
              Shop Collections <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="features-banner reveal">
        <div className="container features-banner-grid stagger-in">
          <div className="feature-banner-item">
            <Sparkles className="feature-banner-icon" />
            <h3>Heirloom Quality</h3>
            <p>Solid 925 sterling silver that lasts generations.</p>
          </div>
          <div className="feature-banner-item">
            <Truck className="feature-banner-icon" />
            <h3>All India Shipping</h3>
            <p>Elegance delivered to your door, safely insured.</p>
          </div>
          <div className="feature-banner-item">
            <Clock className="feature-banner-icon" />
            <h3>Limited Drops</h3>
            <p>Unique designs produced in small batch runs.</p>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="quote-section reveal">
        <div className="container quote-content">
          <div className="quote-decor-diamond"></div>
          <p className="quote-text">
            "HAM STUDIO curates premium designer jewelry that reflects the light within, merging raw strength with delicate silver artistry."
          </p>
          <div className="quote-actions">
            <button onClick={() => setActiveTab('shop')} className="btn-outline">
              View Latest Drops
            </button>
            <button 
              onClick={() => setActiveTab('about')} 
              className="btn-outline"
            >
              Our Story
            </button>
          </div>
        </div>
      </section>

      <section className="section-padding reveal" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="section-header-left-row">
            <div>
              <p className="section-subtitle">CURATED FOR YOU</p>
              <h2>As Seen on You</h2>
            </div>
            <a href="https://www.instagram.com/hamstu.dio/" target="_blank" rel="noreferrer" className="follow-text">
              Follow @hamstu.dio
            </a>
          </div>

          <div className="social-pics-grid stagger-in">
            <div className="social-pic-card">
              <img 
                src={settings.social_img_1} 
                alt="Designer crosses and skulls on white plate" 
              />
            </div>
            <div className="social-pic-card">
              <img 
                src={settings.social_img_2} 
                alt="Silver rings and bracelets on box" 
              />
            </div>
            <div className="social-pic-card">
              <img 
                src={settings.social_img_3} 
                alt="Curated cross necklaces hanging" 
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
