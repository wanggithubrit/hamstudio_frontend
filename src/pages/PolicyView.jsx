import React from 'react';
import { ArrowLeft, Shield, FileText, Truck, RefreshCw, Cookie } from 'lucide-react';

export default function PolicyView({ policyKey, setSelectedPolicyKey, setActiveTab, settings }) {
  // Get document text from global settings populated from database
  const rawText = settings[policyKey] || '';

  const getPolicyInfo = () => {
    switch (policyKey) {
      case 'policy_terms':
        return {
          title: 'Terms & Conditions',
          tagline: 'TERMS OF SERVICE',
          icon: <FileText size={24} className="policy-icon" />
        };
      case 'policy_privacy':
        return {
          title: 'Privacy Policy',
          tagline: 'DATA PROTECTION',
          icon: <Shield size={24} className="policy-icon" />
        };
      case 'policy_shipping':
        return {
          title: 'Shipping Policy',
          tagline: 'LOGISTICS & DELIVERY',
          icon: <Truck size={24} className="policy-icon" />
        };
      case 'policy_refund':
        return {
          title: 'Refund Policy',
          tagline: 'RETURNS & EXCHANGES',
          icon: <RefreshCw size={24} className="policy-icon" />
        };
      case 'policy_cookie':
        return {
          title: 'Cookie Policy',
          tagline: 'TRACKING & STORAGE',
          icon: <Cookie size={24} className="policy-icon" />
        };
      default:
        return {
          title: 'Store Policy',
          tagline: 'LEGAL INFO',
          icon: <FileText size={24} className="policy-icon" />
        };
    }
  };

  const info = getPolicyInfo();

  // Helper to parse double newlines into paragraphs, and format section headers
  const renderContent = () => {
    if (!rawText) {
      return <p className="policy-empty-text">This document is currently empty.</p>;
    }

    const blocks = rawText.split('\n\n');
    const elements = [];

    blocks.forEach((block, blockIdx) => {
      const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length === 0) return;

      const firstLine = lines[0];
      // Check if it starts with a number followed by a dot and space (e.g. "1. ")
      const isHeader = /^\d+\.\s+/.test(firstLine);

      if (isHeader) {
        elements.push(
          <h3 key={`h-${blockIdx}`} className="policy-section-title">
            {firstLine}
          </h3>
        );
        
        // Remaining lines are paragraphs
        const paragraphLines = lines.slice(1);
        if (paragraphLines.length > 0) {
          elements.push(
            <p key={`p-${blockIdx}`} className="policy-paragraph">
              {paragraphLines.map((line, lIdx) => (
                <React.Fragment key={lIdx}>
                  {line}
                  {lIdx < paragraphLines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          );
        }
      } else {
        // Render the entire block as paragraphs
        elements.push(
          <p key={`p-${blockIdx}`} className="policy-paragraph">
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {line}
                {lIdx < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      }
    });

    return elements;
  };

  return (
    <main className="policy-view page-fade" style={{ paddingTop: '2.5rem' }}>
      <div className="container">
        {/* Back Button */}
        <button 
          onClick={() => setActiveTab('home')} 
          className="policy-back-btn"
        >
          <ArrowLeft size={14} /> Back to Catalog
        </button>

        {/* Split Layout */}
        <div className="policy-layout">
          {/* Left Column: Sidebar Navigation */}
          <aside className="policy-sidebar">
            <h3 className="policy-sidebar-title">Client Care</h3>
            <ul className="policy-sidebar-menu">
              <li>
                <button 
                  onClick={() => setSelectedPolicyKey('policy_terms')}
                  className={`policy-sidebar-link ${policyKey === 'policy_terms' ? 'active' : ''}`}
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setSelectedPolicyKey('policy_privacy')}
                  className={`policy-sidebar-link ${policyKey === 'policy_privacy' ? 'active' : ''}`}
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setSelectedPolicyKey('policy_shipping')}
                  className={`policy-sidebar-link ${policyKey === 'policy_shipping' ? 'active' : ''}`}
                >
                  Shipping Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setSelectedPolicyKey('policy_refund')}
                  className={`policy-sidebar-link ${policyKey === 'policy_refund' ? 'active' : ''}`}
                >
                  Refund Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setSelectedPolicyKey('policy_cookie')}
                  className={`policy-sidebar-link ${policyKey === 'policy_cookie' ? 'active' : ''}`}
                >
                  Cookie Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('faq')}
                  className="policy-sidebar-link"
                >
                  FAQs
                </button>
              </li>
            </ul>
          </aside>

          {/* Right Column: Active Policy Content Card */}
          <div className="policy-main-content">
            <div className="policy-header-meta">
              <span className="policy-icon-span">{info.icon}</span>
              <span className="policy-tagline-span">
                {info.tagline}
              </span>
            </div>
            <h1 className="policy-main-title">
              {info.title}
            </h1>
            
            <div className="policy-document-body">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
