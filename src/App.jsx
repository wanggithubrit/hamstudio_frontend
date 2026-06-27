import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './pages/HomeView';
import ShopAllView from './pages/ShopAllView';
import ProductDetailView from './pages/ProductDetailView';
import CheckoutView from './pages/CheckoutView';
import AboutView from './pages/AboutView';
import ContactView from './pages/ContactView';
import FaqView from './pages/FaqView';
import PolicyView from './pages/PolicyView';
import ProfileView from './pages/ProfileView';
import { products } from './data/mockData';
import { Sparkles, Check } from 'lucide-react';
import AdminDashboard from './components/AdminDashboard';
import CartDrawer from './components/CartDrawer';

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    const validTabs = ['home', 'shop', 'detail', 'checkout', 'about', 'contact', 'faq', 'policy', 'profile'];
    if (validTabs.includes(hash)) return hash;
    return localStorage.getItem('hamstudio_active_tab') || 'home';
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('hamstudio_theme') || 'dark';
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [clientEmail, setClientEmail] = useState(() => {
    return localStorage.getItem('hamstudio_client_email') || '';
  });
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('hamstudio_client_profile');
      return saved ? JSON.parse(saved) : {
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
      };
    } catch (e) {
      return {
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
      };
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hamstudio_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const [selectedPolicyKey, setSelectedPolicyKey] = useState('policy_terms');
  const [showPreloader, setShowPreloader] = useState(() => {
    return !sessionStorage.getItem('hamstudio_preloaded');
  });
  const [preloaderFadeOut, setPreloaderFadeOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [productsList, setProductsList] = useState(products);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [settings, setSettings] = useState({
    home_hero_bg: "/media__1781974764102.jpg",
    about_hero_bg: "/media__1781974764103.jpg",
    about_story_img: "/media__1781974764108.jpg",
    social_img_1: "/media__1781974764103.jpg",
    social_img_2: "/media__1781974705838.jpg",
    social_img_3: "/media__1781974705839.jpg"
  });

  // Handle Preloader timer
  useEffect(() => {
    if (showPreloader) {
      const fadeTimer = setTimeout(() => {
        setPreloaderFadeOut(true);
      }, 1800);
      
      const unmountTimer = setTimeout(() => {
        setShowPreloader(false);
        sessionStorage.setItem('hamstudio_preloaded', 'true');
      }, 2300);
      
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(unmountTimer);
      };
    }
  }, [showPreloader]);

  // Fetch products and settings on mount
  useEffect(() => {
    fetch('/api/products/')
      .then((res) => {
        if (!res.ok) throw new Error('API server returned error');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProductsList(data);
          // Sync selected product if it's the default
          setSelectedProduct(data[0]);
        }
      })
      .catch((err) => {
        console.warn('Using fallback local products database:', err.message);
      });

    fetch('/api/settings/')
      .then((res) => {
        if (!res.ok) throw new Error('API settings server returned error');
        return res.json();
      })
      .then((data) => {
        if (data && typeof data === 'object') {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      })
      .catch((err) => {
        console.warn('Using fallback local UI settings:', err.message);
      });
  }, []);
  
  // Pre-populate cart with 2 default items from the new database 
  // so the Checkout page looks populated and functional immediately
  const [cart, setCart] = useState([
    {
      id: 'obsidian-cross-Silver-18',
      name: 'Obsidian Cross Pendant',
      price: 3850,
      quantity: 1,
      image: products[0].image,
      meta: 'Silver / 18"'
    },
    {
      id: 'sapphire-crucifix-Silver-20',
      name: 'Sapphire Heart Crucifix',
      price: 3200,
      quantity: 1,
      image: products[2].image,
      meta: 'Silver / 20"'
    }
  ]);
  
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hamstudio_wishlist') || '[]');
    } catch (e) {
      return [];
    }
  });

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      let updated;
      if (exists) {
        updated = prev.filter((item) => item.id !== product.id);
        addToast(`Removed ${product.name} from Wishlist`);
      } else {
        updated = [...prev, product];
        addToast(`Added ${product.name} to Wishlist!`);
      }
      localStorage.setItem('hamstudio_wishlist', JSON.stringify(updated));
      return updated;
    });
  };
  
  const [toasts, setToasts] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Scroll to top and initialize scroll reveals on page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Scroll reveal observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.05 });

    // Small timeout to allow the tab component to fully mount in the DOM
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.reveal');
      elements.forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [activeTab]);

  // Sync activeTab with URL hash and localStorage
  useEffect(() => {
    localStorage.setItem('hamstudio_active_tab', activeTab);
    if (window.location.hash !== `#${activeTab}`) {
      window.location.hash = activeTab;
    }
  }, [activeTab]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validTabs = ['home', 'shop', 'detail', 'checkout', 'about', 'contact', 'faq', 'policy', 'profile'];
      if (validTabs.includes(hash)) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const addToast = (message) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, message }]);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const handleAddToCart = (product) => {
    const defaultCartId = `${product.id}-Silver-18`;
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === defaultCartId);
      if (existing) {
        return prevCart.map((item) => 
          item.id === defaultCartId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, {
        id: defaultCartId,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        meta: 'Silver / 18"'
      }];
    });
    addToast(`Added ${product.name} to cart`);
    setCartOpen(true);
  };

  const handleAddToCartWithOptions = (config) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === config.cartId);
      if (existing) {
        return prevCart.map((item) => 
          item.id === config.cartId ? { ...item, quantity: item.quantity + config.quantity } : item
        );
      }
      return [...prevCart, {
        id: config.cartId,
        name: config.name,
        price: config.price,
        quantity: config.quantity,
        image: config.image,
        meta: `${config.selectedMetal} / ${config.selectedLength}`
      }];
    });
    addToast(`Added ${config.quantity}x ${config.name} (${config.selectedMetal} / ${config.selectedLength}) to cart`);
    setCartOpen(true);
  };

  const handleUpdateQty = (itemId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCart((prevCart) => 
      prevCart.map((item) => 
        item.id === itemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    const item = cart.find((i) => i.id === itemId);
    setCart((prevCart) => prevCart.filter((i) => i.id !== itemId));
    if (item) {
      addToast(`Removed ${item.name} from cart`);
    }
  };

  const handleCheckoutSuccess = (shippingData) => {
    const clientEmailVal = shippingData.email || '';
    setClientEmail(clientEmailVal);
    localStorage.setItem('hamstudio_client_email', clientEmailVal);

    const clientProfileVal = {
      firstName: shippingData.firstName || '',
      lastName: shippingData.lastName || '',
      phone: shippingData.phone || '',
      address: shippingData.address || '',
      city: shippingData.city || '',
      state: shippingData.state || '',
      pincode: shippingData.pincode || ''
    };
    setProfile(clientProfileVal);
    localStorage.setItem('hamstudio_client_profile', JSON.stringify(clientProfileVal));

    fetch('/api/orders/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: cart,
        shipping: shippingData,
        date: new Date().toISOString()
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error('API order submission failed');
        return res.json();
      })
      .then((data) => {
        setOrderNumber(data.orderId);
        setCart([]); // Clear cart
        setShowSuccessModal(true);
      })
      .catch((err) => {
        console.warn('API checkout failed, falling back to local simulation:', err.message);
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        setOrderNumber(`HAM-${randomNum}`);
        setCart([]);
        setShowSuccessModal(true);
      });
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setActiveTab('home');
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (window.location.pathname === '/admin' || window.location.pathname === '/admin/') {
    return <AdminDashboard />;
  }

  return (
    <>
      {showPreloader && (
        <div className={`preloader-overlay ${preloaderFadeOut ? 'fade-out' : ''}`}>
          <div className="preloader-content">
            <div className="preloader-logo">⚡</div>
            <h1 className="preloader-brand">HAM STUDIO</h1>
            <div className="preloader-line">
              <div className="preloader-progress"></div>
            </div>
            <p className="preloader-sub">FINE JEWELRY CATALOG</p>
          </div>
        </div>
      )}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        cartCount={cartCount} 
        setSearchQuery={setSearchQuery}
        theme={theme}
        toggleTheme={toggleTheme}
        setCartOpen={setCartOpen}
      />

      {/* Render Active View */}
      {activeTab === 'home' && (
        <HomeView 
          setActiveTab={setActiveTab} 
          settings={settings}
        />
      )}
      {activeTab === 'shop' && (
        <ShopAllView 
          onAddToCart={handleAddToCart}
          onSelectProduct={setSelectedProduct}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          productsList={productsList}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
        />
      )}
      {activeTab === 'detail' && (
        <ProductDetailView 
          product={selectedProduct}
          onAddToCartWithOptions={handleAddToCartWithOptions}
          onSelectProduct={setSelectedProduct}
          setActiveTab={setActiveTab}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
          onAddToCart={handleAddToCart}
        />
      )}
      {activeTab === 'checkout' && (
        <CheckoutView 
          cart={cart}
          onUpdateQty={handleUpdateQty}
          onRemoveItem={handleRemoveItem}
          onCheckoutSuccess={handleCheckoutSuccess}
          setActiveTab={setActiveTab}
          profile={profile}
          clientEmail={clientEmail}
        />
      )}
      {activeTab === 'about' && (
        <AboutView 
          setActiveTab={setActiveTab} 
          settings={settings}
        />
      )}
      {activeTab === 'contact' && (
        <ContactView 
          setActiveTab={setActiveTab} 
        />
      )}
      {activeTab === 'faq' && (
        <FaqView 
          setActiveTab={setActiveTab} 
        />
      )}
      {activeTab === 'policy' && (
        <PolicyView 
          policyKey={selectedPolicyKey}
          setSelectedPolicyKey={setSelectedPolicyKey}
          setActiveTab={setActiveTab}
          settings={settings}
        />
      )}
      {activeTab === 'profile' && (
        <ProfileView 
          setActiveTab={setActiveTab} 
          profile={profile}
          setProfile={setProfile}
          loggedInEmail={clientEmail}
          setLoggedInEmail={setClientEmail}
        />
      )}

      <CartDrawer 
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setCartOpen(false);
          setActiveTab('checkout');
        }}
      />

      <Footer 
        setActiveTab={setActiveTab} 
        setSelectedPolicyKey={setSelectedPolicyKey} 
      />

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast">
            <Check className="toast-icon" />
            <span className="toast-text">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Checkout Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <Sparkles className="modal-success-icon" />
            <h3>Order Placed Successfully!</h3>
            <p>
              Your selected items are being prepared for dispatch. We have sent a detailed confirmation email with tracking information to your address.
            </p>
            <div className="modal-order-number">
              Order Reference: #{orderNumber}
            </div>
            <button 
              onClick={handleCloseSuccessModal} 
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </>
  );
}
