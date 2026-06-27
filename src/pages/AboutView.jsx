import React from 'react';
import { Sparkles, Heart, Shield, ArrowRight } from 'lucide-react';

export default function AboutView({ setActiveTab, settings }) {
  return (
    <main className="about-view page-fade">
      {/* Hero Section */}
      <section className="hero-section reveal">
        <div 
          className="hero-bg-image" 
          style={{ 
            backgroundImage: `url('${settings.about_hero_bg}')`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            height: '60vh' 
          }} 
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-tagline">CURATED EXCELLENCE</p>
          <h1 className="hero-title">Our Journey</h1>
          <p className="hero-desc">
            Sourcing and delivering gothic-infused sterling silver statement pieces from our Nagaland-based e-commerce platform.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding reveal">
        <div className="container about-story-grid">
          <div>
            <p className="section-subtitle" style={{ color: 'var(--accent-gold)', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.8rem', marginBottom: '1rem' }}>HAM STUDIO EST. 2026</p>
            <h2 style={{ marginBottom: '1.5rem' }}>Gothic Spirit. <br />Silver Craft.</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.8' }}>
              Born in Nagaland, HAM STUDIO represents a bold synthesis of dark romanticism, subcultural emblems, and premium silver wear. We believe jewelry is more than an accessory—it is an externalization of raw strength and personal identity.
            </p>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.8' }}>
              Every single pendant, chain, and ring in our catalog is carefully selected, audited, and curated for quality. We prioritize high-grade 925 sterling silver and premium gemstones to ensure that each piece stands the test of time as a modern statement.
            </p>
            <button onClick={() => setActiveTab('shop')} className="btn-primary">
              Explore Collection <ArrowRight size={16} />
            </button>
          </div>
          <div className="about-story-img-wrapper">
            <img 
              src={settings.about_story_img} 
              alt="Curated gothic pendants" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="values-section reveal" style={{ backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2>Our Core Principles</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>How we maintain excellence in every release</p>
          </div>

          <div className="about-values-grid">
            <div className="value-card" style={{ padding: '2rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark)', textAlign: 'center' }}>
              <Sparkles className="value-icon" style={{ stroke: 'var(--accent-gold)', width: '28px', height: '28px', margin: '0 auto 1.5rem' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', fontFamily: 'var(--font-accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Premium Standard</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                We curate items made strictly in solid 925 sterling silver, polished to a mirror luster. No cheap bases, no peeling platings.
              </p>
            </div>
            
            <div className="value-card" style={{ padding: '2rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark)', textAlign: 'center' }}>
              <Heart className="value-icon" style={{ stroke: 'var(--accent-gold)', width: '28px', height: '28px', margin: '0 auto 1.5rem' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', fontFamily: 'var(--font-accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Curated Selections</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Every release is selected and offered in limited runs, preserving the authenticity and uniqueness of each design in our store.
              </p>
            </div>

            <div className="value-card" style={{ padding: '2rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark)', textAlign: 'center' }}>
              <Shield className="value-icon" style={{ stroke: 'var(--accent-gold)', width: '28px', height: '28px', margin: '0 auto 1.5rem' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', fontFamily: 'var(--font-accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pan-India Security</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Fully tracked and insured transit across India. Your precious statement jewelry is safely packaged and delivered to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
