import React from 'react';

export default function Footer({ setActiveTab, setSelectedPolicyKey }) {
  const handlePolicyClick = (key) => {
    if (setSelectedPolicyKey) {
      setSelectedPolicyKey(key);
    }
    setActiveTab('policy');
  };

  return (
    <footer className="footer-wrapper signature-layout-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <h2 className="footer-brand-title">HAM STUDIO</h2>
          </div>

          {/* Menu Column */}
          <div className="footer-links-col">
            <h4>Menu</h4>
            <ul className="footer-links">
              <li><a href="#home" onClick={(e) => { e.preventDefault(); setActiveTab('home'); }}>Home</a></li>
              <li><a href="#shop" onClick={(e) => { e.preventDefault(); setActiveTab('shop'); }}>Shop</a></li>
              <li><a href="#about" onClick={(e) => { e.preventDefault(); setActiveTab('about'); }}>About</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); setActiveTab('contact'); }}>Contact</a></li>
            </ul>
          </div>

          {/* Policies Column */}
          <div className="footer-links-col">
            <h4>Policies</h4>
            <ul className="footer-links">
              <li><a href="#faq" onClick={(e) => { e.preventDefault(); setActiveTab('faq'); }}>FAQ</a></li>
              <li><a href="#terms" onClick={(e) => { e.preventDefault(); handlePolicyClick('policy_terms'); }}>Terms & Conditions</a></li>
              <li><a href="#privacy" onClick={(e) => { e.preventDefault(); handlePolicyClick('policy_privacy'); }}>Privacy Policy</a></li>
              <li><a href="#shipping" onClick={(e) => { e.preventDefault(); handlePolicyClick('policy_shipping'); }}>Shipping Policy</a></li>
              <li><a href="#refund" onClick={(e) => { e.preventDefault(); handlePolicyClick('policy_refund'); }}>Refund Policy</a></li>
              <li><a href="#cookie" onClick={(e) => { e.preventDefault(); handlePolicyClick('policy_cookie'); }}>Cookie Policy</a></li>
            </ul>
          </div>

          {/* Social Column */}
          <div className="footer-links-col">
            <h4>Social</h4>
            <ul className="footer-links">
              <li>
                <a href="https://www.instagram.com/hamstu.dio/" target="_blank" rel="noreferrer" className="footer-social-link">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© 2026 HAM STUDIO. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
}
