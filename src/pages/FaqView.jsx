import React, { useState, useEffect } from 'react';
import { faqItems } from '../data/mockData';
import { ChevronDown, Send, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function FaqView({ setActiveTab }) {
  const [faqs, setFaqs] = useState(faqItems);
  const [openId, setOpenId] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/faqs/`)
      .then(res => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setFaqs(data);
          setOpenId(data[0].id);
        }
      })
      .catch(err => {
        console.warn("Using local fallback FAQs:", err);
      });
  }, []);

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <main className="faq-view page-fade">
      {/* Hero Section */}
      <section className="hero-section">
        <img 
          src="/media__1781974764103.jpg" 
          alt="Gothic style cross jewelry" 
          className="hero-bg-image"
        />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <p className="hero-tagline">HELP & INFO</p>
          <h1 className="hero-title">Client Care</h1>
          <p className="hero-desc">
            Transparent policies designed for the discerning Indian jewelry collector. Find details on our logistics, sizing, and quality standards.
          </p>
        </div>
      </section>

      {/* Shipping Box Highlight */}
      <section className="section-padding" style={{ paddingBottom: 0 }}>
        <div className="container">
          <div className="shipping-highlight-box">
            <div className="shipping-highlight-grid">
              <div className="shipping-highlight-info">
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Shipping Available Across India</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6' }}>
                  To ensure the safety, speed, and insurance of our delicate jewelry pieces, HAM STUDIO exclusively operates within Indian domestic borders. We utilize specialized jewelry couriers for secure, tracked delivery to your doorstep.
                </p>
              </div>
              <div className="shipping-stat-col" style={{ textAlign: 'center' }}>
                <p className="shipping-stat-label" style={{ fontFamily: 'var(--font-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Standard Delivery</p>
                <p className="shipping-stat-val" style={{ fontFamily: 'var(--font-accent)', fontWeight: '700', fontSize: '1.1rem', color: 'var(--text-primary)' }}>5 - 7 Business Days</p>
              </div>
              <div className="shipping-stat-col" style={{ textAlign: 'center' }}>
                <p className="shipping-stat-label" style={{ fontFamily: 'var(--font-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Shipping Cost</p>
                <p className="shipping-stat-val gold" style={{ fontFamily: 'var(--font-accent)', fontWeight: '700', fontSize: '1.1rem', color: 'var(--accent-gold)' }}>Complimentary</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accordion FAQ Grid */}
      <section className="section-padding">
        <div className="container">
          <div className="faq-accordion-wrapper" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div key={item.id} className={`faq-item ${isOpen ? 'open' : ''}`} style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
                  <button 
                    className="faq-trigger" 
                    onClick={() => toggleFaq(item.id)}
                    aria-expanded={isOpen}
                  >
                    <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-accent)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>{item.question}</h3>
                    <ChevronDown className="faq-chevron" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'var(--transition-fast)', strokeWidth: '1.5px', color: 'var(--accent-gold)' }} />
                  </button>
                  <div className="faq-content-box">
                    <div className="faq-answer-inner" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.7' }}>
                      <p>{item.answer}</p>
                      {item.bullets && item.bullets.length > 0 && (
                        <ul className="faq-answer-bullets" style={{ marginTop: '1rem', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {item.bullets.map((bullet, idx) => (
                            <li key={idx} style={{ listStyleType: 'square' }}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Box (Still Have Questions) */}
      <section className="cta-box-section" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="cta-box-wrapper">
            <div className="cta-box-content">
              <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Still have questions?</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
                Our jewelry specialists are available to guide you through your purchase, sizing, or custom requirements.
              </p>
              <div className="cta-box-actions">
                <a href="mailto:support@hamstudio.in" className="btn-primary">
                  Contact Support <Send size={14} />
                </a>
                <button onClick={() => setActiveTab('home')} className="btn-outline">
                  Continue Shopping <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
