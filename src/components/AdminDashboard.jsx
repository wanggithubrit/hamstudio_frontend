import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  Mail, 
  Users, 
  Settings, 
  LogOut, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Eye, 
  ChevronRight,
  FolderOpen,
  CheckCircle,
  FileImage,
  Clock,
  HelpCircle,
  FileText,
  Instagram,
  Upload
} from 'lucide-react';
import { API_BASE_URL } from '../config';

const fetch = (url, options) => {
  const finalUrl = typeof url === 'string' && url.startsWith('/') 
    ? `${API_BASE_URL}${url}` 
    : url;
  return window.fetch(finalUrl, options);
};

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Dashboard statistics & lists
  const [stats, setStats] = useState({
    total_sales: 0,
    total_orders: 0,
    total_products: 0,
    total_messages: 0,
    sales_history: []
  });
  
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [settings, setSettings] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [socialItems, setSocialItems] = useState([]);
  
  // UI states
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState(null); // 'product_add', 'product_edit', 'collection_add', 'collection_edit', 'setting_edit', 'faq_add', 'faq_edit', 'policy_edit'
  const [selectedItem, setSelectedItem] = useState(null);
  const [fileInput, setFileInput] = useState(null);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  
  // Synchronize dynamic gallery states
  useEffect(() => {
    if (selectedItem && (modalType === 'product_edit' || modalType === 'product_add')) {
      setExistingImages(selectedItem.images || []);
    } else {
      setExistingImages([]);
    }
    setAdditionalFiles([]);
  }, [selectedItem, modalType]);

  const handleRemoveExistingImage = (idxToRemove) => {
    setExistingImages(prev => prev.filter((_, idx) => idx !== idxToRemove));
  };
  
  // Check if already logged in on mount
  useEffect(() => {
    const sessionLogged = sessionStorage.getItem('adminLogged');
    if (sessionLogged === 'true') {
      setIsLoggedIn(true);
      fetchDashboardData();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        setIsLoggedIn(true);
        sessionStorage.setItem('adminLogged', 'true');
        fetchDashboardData();
      } else {
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setLoginError('Error connecting to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout/', { method: 'POST' });
    } catch (e) {}
    setIsLoggedIn(false);
    sessionStorage.removeItem('adminLogged');
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const statsRes = await fetch('/api/admin/stats/');
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch products
      const prodRes = await fetch('/api/admin/products/');
      const prodData = await prodRes.json();
      setProducts(prodData);

      // Fetch collections
      const collRes = await fetch('/api/admin/collections/');
      const collData = await collRes.json();
      setCollections(collData);

      // Fetch orders
      const ordRes = await fetch('/api/admin/orders/');
      const ordData = await ordRes.json();
      setOrders(ordData);

      // Fetch messages
      const msgRes = await fetch('/api/admin/messages/');
      const msgData = await msgRes.json();
      setMessages(msgData);

      // Fetch settings
      const setRes = await fetch('/api/admin/settings/');
      const setData = await setRes.json();
      setSettings(setData);

      // Fetch FAQs
      const faqRes = await fetch('/api/admin/faqs/');
      const faqData = await faqRes.json();
      setFaqs(faqData);

      // Fetch social feed items
      const socialRes = await fetch('/api/admin/social-feed/');
      const socialData = await socialRes.json();
      setSocialItems(socialData);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------------
  // CRUD Actions
  // --------------------------------------------------------
  
  // Product CRUD
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    if (fileInput) {
      formData.append('image', fileInput);
    }
    
    // Append any newly selected additional gallery images
    additionalFiles.forEach(file => {
      formData.append('images_files', file);
    });
    
    // Append remaining existing gallery images list
    if (modalType === 'product_edit') {
      formData.append('existing_images', JSON.stringify(existingImages));
    }

    const url = modalType === 'product_add' 
      ? '/api/admin/products/' 
      : `/api/admin/products/${selectedItem.id}/`;

    try {
      const res = await url.includes('products/') 
        ? fetch(url, { method: 'POST', body: formData }) 
        : fetch(url, { method: 'POST', body: formData });
      
      const response = await res;
      const data = await response.json();
      if (data.success) {
        setModalType(null);
        setSelectedItem(null);
        setFileInput(null);
        fetchDashboardData();
      } else {
        alert(data.error || 'Failed to save product');
      }
    } catch (err) {
      alert('Error saving product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${id}/`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchDashboardData();
      } else {
        alert(data.error || 'Failed to delete product');
      }
    } catch (err) {
      alert('Error deleting product');
    } finally {
      setLoading(false);
    }
  };

  // Collection CRUD
  const handleSaveCollection = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    if (fileInput) {
      formData.append('image', fileInput);
    }

    const url = modalType === 'collection_add'
      ? '/api/admin/collections/'
      : `/api/admin/collections/${selectedItem.id}/`;

    try {
      const res = await fetch(url, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setModalType(null);
        setSelectedItem(null);
        setFileInput(null);
        fetchDashboardData();
      } else {
        alert(data.error || 'Failed to save collection');
      }
    } catch (err) {
      alert('Error saving collection');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCollection = async (id) => {
    if (!window.confirm("Are you sure you want to delete this collection?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/collections/${id}/`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchDashboardData();
      } else {
        alert(data.error || 'Failed to delete collection');
      }
    } catch (err) {
      alert('Error deleting collection');
    } finally {
      setLoading(false);
    }
  };

  // Order Status update
  const handleUpdateOrderStatus = async (id, status) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        fetchDashboardData();
      } else {
        alert(data.error || 'Failed to update order');
      }
    } catch (err) {
      alert('Error updating order');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Delete this order record permanently?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}/`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchDashboardData();
      }
    } catch (err) {
      alert('Error deleting order');
    } finally {
      setLoading(false);
    }
  };

  // Message Delete
  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Delete this contact message inquiry?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/messages/${id}/`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchDashboardData();
      }
    } catch (err) {
      alert('Error deleting message');
    } finally {
      setLoading(false);
    }
  };


  // FAQ CRUD
  const handleSaveFaq = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const question = formData.get('question');
    const answer = formData.get('answer');
    const bulletsText = formData.get('bullets_text') || '';
    const bullets = bulletsText.split('\n').map(b => b.trim()).filter(b => b.length > 0);

    const url = modalType === 'faq_add'
      ? '/api/admin/faqs/'
      : `/api/admin/faqs/${selectedItem.id}/`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answer, bullets })
      });
      const data = await res.json();
      if (data.success) {
        setModalType(null);
        setSelectedItem(null);
        fetchDashboardData();
      } else {
        alert(data.error || 'Failed to save FAQ');
      }
    } catch (err) {
      alert('Error saving FAQ');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFaq = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/faqs/${id}/`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchDashboardData();
      } else {
        alert(data.error || 'Failed to delete FAQ');
      }
    } catch (err) {
      alert('Error deleting FAQ');
    } finally {
      setLoading(false);
    }
  };

  // Policy CRUD
  const handleSavePolicy = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    try {
      const res = await fetch('/api/admin/settings/', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setModalType(null);
        setSelectedItem(null);
        fetchDashboardData();
      } else {
        alert(data.error || 'Failed to save policy');
      }
    } catch (err) {
      alert('Error saving policy');
    } finally {
      setLoading(false);
    }
  };


  // Social Feed CRUD
  const handleSaveSocial = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    if (fileInput) {
      formData.append('image', fileInput);
    }
    try {
      const res = await fetch('/api/admin/social-feed/', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setModalType(null);
        setSelectedItem(null);
        setFileInput(null);
        fetchDashboardData();
      } else {
        alert(data.error || 'Failed to save social item');
      }
    } catch (err) {
      alert('Error saving social item');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSocial = async (id) => {
    if (!window.confirm("Are you sure you want to delete this social feed image?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/social-feed/${id}/`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchDashboardData();
      } else {
        alert(data.error || 'Failed to delete social item');
      }
    } catch (err) {
      alert('Error deleting social item');
    } finally {
      setLoading(false);
    }
  };


  // Settings Save
  const handleSaveSetting = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    if (fileInput) {
      formData.append('image', fileInput);
    }

    try {
      const res = await fetch('/api/admin/settings/', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setModalType(null);
        setSelectedItem(null);
        setFileInput(null);
        fetchDashboardData();
      } else {
        alert(data.error || 'Failed to save setting');
      }
    } catch (err) {
      alert('Error saving site setting');
    } finally {
      setLoading(false);
    }
  };

  // SVG Line Chart Drawer
  const renderSalesChart = () => {
    if (!stats.sales_history || stats.sales_history.length === 0) return null;
    
    const height = 180;
    const width = 500;
    const padding = 30;
    
    const maxVal = Math.max(...stats.sales_history.map(d => d.sales), 5000);
    
    // Convert coordinate points
    const points = stats.sales_history.map((d, index) => {
      const x = padding + (index * (width - padding * 2)) / (stats.sales_history.length - 1);
      const y = height - padding - (d.sales * (height - padding * 2)) / maxVal;
      return { x, y, sales: d.sales, date: d.date };
    });
    
    const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');
    
    // SVG curved path calculator
    let pathD = '';
    if (points.length > 0) {
      pathD = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        const cpX1 = points[i-1].x + (points[i].x - points[i-1].x) / 2;
        const cpY1 = points[i-1].y;
        const cpX2 = points[i-1].x + (points[i].x - points[i-1].x) / 2;
        const cpY2 = points[i].y;
        pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${points[i].x} ${points[i].y}`;
      }
    }

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="sales-svg-chart">
        <defs>
          <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25"/>
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.00"/>
          </linearGradient>
          <linearGradient id="chart-line-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#818cf8"/>
            <stop offset="100%" stopColor="#4f46e5"/>
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#1e293b" strokeWidth="1" />
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#1e293b" strokeWidth="1" strokeDasharray="3" />
        <line x1={padding} y1={(height)/2} x2={width - padding} y2={(height)/2} stroke="#1e293b" strokeWidth="1" strokeDasharray="3" />
        
        {/* Shaded Area */}
        {points.length > 0 && (
          <path 
            d={`${pathD} L ${points[points.length-1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`} 
            fill="url(#chart-area-grad)" 
          />
        )}
        
        {/* Smooth Glow Line */}
        <path d={pathD} fill="none" stroke="url(#chart-line-grad)" strokeWidth="3" strokeLinecap="round" />
        
        {/* Points and Labels */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="#6366f1" stroke="#020617" strokeWidth="2" />
            <text x={p.x} y={height - 8} fontSize="9" fill="#94a3b8" textAnchor="middle">{p.date}</text>
            {p.sales > 0 && (
              <text x={p.x} y={p.y - 8} fontSize="9" fontWeight="600" fill="#ffffff" textAnchor="middle">₹{p.sales}</text>
            )}
          </g>
        ))}
      </svg>
    );
  };

  // Filter lists based on search term
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(o => 
    o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.shipping.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.shipping.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.shipping.email.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const filteredMessages = messages.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --------------------------------------------------------
  // Views
  // --------------------------------------------------------
  
  if (!isLoggedIn) {
    return (
      <div className="admin-login-layout">
        <style>{`
          .admin-login-layout {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent 45%), #030712;
            color: #f3f4f6;
            font-family: 'Outfit', sans-serif;
            padding: 20px;
          }
          .login-card {
            background: rgba(17, 24, 39, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 24px;
            padding: 40px;
            width: 100%;
            max-width: 440px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
          }
          .login-title {
            text-align: center;
            margin-bottom: 30px;
          }
          .login-title h2 {
            font-size: 1.8rem;
            font-weight: 700;
            margin: 5px 0 0 0;
            letter-spacing: -0.025em;
            background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .login-title span {
            font-size: 2.2rem;
          }
          .login-error {
            background: rgba(239, 68, 68, 0.15);
            border: 1px solid rgba(239, 68, 68, 0.25);
            color: #fca5a5;
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 0.85rem;
            margin-bottom: 20px;
          }
          .form-group {
            margin-bottom: 20px;
          }
          .form-group label {
            display: block;
            margin-bottom: 8px;
            font-size: 0.85rem;
            font-weight: 500;
            color: #9ca3af;
          }
          .form-group input {
            width: 100%;
            box-sizing: border-box;
            background: rgba(3, 7, 18, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 10px;
            padding: 12px 16px;
            color: #ffffff;
            font-size: 0.95rem;
            transition: all 0.2s ease;
          }
          .form-group input:focus {
            border-color: #6366f1;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
            outline: none;
          }
          .login-btn {
            width: 100%;
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            color: #ffffff;
            border: none;
            padding: 14px;
            border-radius: 10px;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
          }
          .login-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
          }
        `}</style>
        
        <div className="login-card">
          <div className="login-title">
            <span>⚡</span>
            <h2>HAM STUDIO ADMIN</h2>
            <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '6px' }}>Store Operations Control Center</p>
          </div>
          
          {loginError && <div className="login-error">{loginError}</div>}
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                placeholder="Enter admin username"
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="Enter password"
              />
            </div>
            
            <button type="submit" disabled={loading} className="login-btn">
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-portal">
      <style>{`
        .admin-portal {
          background-color: #030712;
          color: #f3f4f6;
          min-height: 100vh;
          font-family: 'Outfit', sans-serif;
          display: flex;
        }
        
        /* Sidebar Navigation */
        .admin-sidebar {
          width: 260px;
          background-color: #090d16;
          border-right: 1px solid #111827;
          display: flex;
          flex-direction: column;
          padding: 25px 15px;
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
        }
        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.25rem;
          font-weight: 700;
          color: #ffffff;
          padding: 0 10px 25px 10px;
          border-bottom: 1px solid #1f2937;
          margin-bottom: 25px;
        }
        .sidebar-menu {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex-grow: 1;
        }
        .menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          color: #9ca3af;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          background: transparent;
          border: none;
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: all 0.2s ease;
        }
        .menu-item:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.03);
        }
        .menu-item.active {
          color: #ffffff;
          background: #6366f1;
        }
        .logout-btn {
          margin-top: auto;
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #fca5a5;
        }
        
        /* Main Panel Layout */
        .admin-main {
          margin-left: 260px;
          flex-grow: 1;
          padding: 40px;
          box-sizing: border-box;
          max-width: calc(100vw - 260px);
        }
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 35px;
        }
        .admin-header h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
        }
        .header-meta {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .refresh-btn {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #f3f4f6;
          padding: 8px 16px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 500;
          font-size: 0.85rem;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }
        .refresh-btn:hover {
          background: rgba(255, 255, 255, 0.08);
        }
        
        /* Dashboard KPI Cards */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 35px;
        }
        .stat-card {
          background: rgba(17, 24, 39, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 18px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: #6366f1;
        }
        .stat-card:nth-child(2)::before { background: #3b82f6; }
        .stat-card:nth-child(3)::before { background: #8b5cf6; }
        .stat-card:nth-child(4)::before { background: #f59e0b; }
        .stat-card:nth-child(5)::before { background: #10b981; }
        
        .stat-label {
          color: #9ca3af;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .stat-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: #ffffff;
        }
        .stat-footer {
          margin-top: 10px;
          font-size: 0.8rem;
          color: #6b7280;
        }
        
        /* Chart container */
        .chart-container {
          background: rgba(17, 24, 39, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 35px;
        }
        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .chart-header h3 {
          margin: 0;
          font-size: 1.1rem;
          color: #ffffff;
        }
        .sales-svg-chart {
          width: 100%;
          height: auto;
          overflow: visible;
        }
        
        /* Tables and CRUD elements */
        .control-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          gap: 15px;
          flex-wrap: wrap;
        }
        .search-wrapper {
          position: relative;
          width: 100%;
          max-width: 320px;
        }
        .search-wrapper input {
          width: 100%;
          background: rgba(17, 24, 39, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 10px 16px 10px 40px;
          color: #ffffff;
          box-sizing: border-box;
          font-size: 0.9rem;
        }
        .search-wrapper .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }
        .add-btn {
          background: #6366f1;
          color: #ffffff;
          border: none;
          padding: 10px 18px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }
        .add-btn:hover {
          background: #4f46e5;
          transform: translateY(-1px);
        }
        
        /* Grid & Table lists */
        .admin-card-table {
          background: rgba(17, 24, 39, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 20px;
          overflow: hidden;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .data-table th {
          background: rgba(17, 24, 39, 0.8);
          color: #ffffff;
          padding: 14px 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .data-table td {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          font-size: 0.9rem;
          color: #cbd5e1;
        }
        .data-table tbody tr:hover {
          background: rgba(255, 255, 255, 0.01);
        }
        
        /* Action buttons */
        .row-actions {
          display: flex;
          gap: 10px;
        }
        .action-icon-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: #9ca3af;
          padding: 6px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .action-icon-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }
        .action-icon-btn.delete:hover {
          color: #f87171;
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.2);
        }
        
        /* Status badge */
        .status-badge {
          padding: 4px 10px;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 600;
          display: inline-block;
        }
        .status-badge.processing { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
        .status-badge.shipped { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
        .status-badge.delivered { background: rgba(16, 185, 129, 0.15); color: #34d399; }
        
        /* Order details box */
        .order-expanded-row {
          background: rgba(2, 6, 23, 0.4);
        }
        .order-details-pane {
          padding: 24px;
          border-left: 3px solid #6366f1;
        }
        .order-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        @media (max-width: 768px) {
          .order-details-grid { grid-template-columns: 1fr; }
        }
        .details-col h4 {
          margin: 0 0 12px 0;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #94a3b8;
        }
        .details-col p {
          margin: 6px 0;
          font-size: 0.9rem;
        }
        
        /* Modals and Forms */
        .modal-overlay {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        .modal-card {
          background: #0f172a;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
        }
        .modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-header h3 {
          margin: 0;
          font-size: 1.15rem;
          color: #ffffff;
        }
        .modal-close {
          background: transparent;
          border: none;
          color: #9ca3af;
          cursor: pointer;
        }
        .modal-close:hover { color: #ffffff; }
        .modal-body {
          padding: 24px;
        }
        .form-row-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        @media (max-width: 600px) {
          .form-row-split { grid-template-columns: 1fr; }
        }
        .modal-footer {
          padding: 16px 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
        .btn-cancel {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #f3f4f6;
          padding: 10px 18px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
        }
        .btn-save {
          background: #6366f1;
          color: #ffffff;
          border: none;
          padding: 10px 18px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-save:hover { background: #4f46e5; }
        
        /* Catalog internal tabs */
        .catalog-tabs {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 10px;
        }
        .catalog-tab-btn {
          background: transparent;
          border: none;
          color: #9ca3af;
          font-weight: 600;
          font-size: 0.9rem;
          padding: 6px 12px;
          cursor: pointer;
          position: relative;
        }
        .catalog-tab-btn.active {
          color: #ffffff;
        }
        .catalog-tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -11px;
          left: 0;
          right: 0;
          height: 2px;
          background: #6366f1;
        }
      `}</style>
      
      {/* Sidebar Navigation */}
      <div className="admin-sidebar">
        <div className="sidebar-logo">
          <span>⚡</span>
          <span>HAM CONTROL</span>
        </div>
        
        <div className="sidebar-menu">
          <button 
            className={`menu-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => { setActiveTab('overview'); setSearchTerm(''); }}
          >
            <TrendingUp size={18} />
            <span>Dashboard</span>
          </button>
          
          <button 
            className={`menu-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => { setActiveTab('orders'); setSearchTerm(''); }}
          >
            <ShoppingBag size={18} />
            <span>Orders</span>
          </button>
          
          <button 
            className={`menu-item ${activeTab === 'catalog' ? 'active' : ''}`}
            onClick={() => { setActiveTab('catalog'); setSearchTerm(''); }}
          >
            <Package size={18} />
            <span>Catalog</span>
          </button>
          
          <button 
            className={`menu-item ${activeTab === 'inbox' ? 'active' : ''}`}
            onClick={() => { setActiveTab('inbox'); setSearchTerm(''); }}
          >
            <Mail size={18} />
            <span>Inbox</span>
          </button>
          
          <button 
            className={`menu-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => { setActiveTab('settings'); setSearchTerm(''); }}
          >
            <Settings size={18} />
            <span>Site Settings</span>
          </button>

          <button 
            className={`menu-item ${activeTab === 'faqs' ? 'active' : ''}`}
            onClick={() => { setActiveTab('faqs'); setSearchTerm(''); }}
          >
            <HelpCircle size={18} />
            <span>FAQs Manager</span>
          </button>

          <button 
            className={`menu-item ${activeTab === 'policies' ? 'active' : ''}`}
            onClick={() => { setActiveTab('policies'); setSearchTerm(''); }}
          >
            <FileText size={18} />
            <span>Policies Manager</span>
          </button>
          
          <button 
            className={`menu-item ${activeTab === 'social' ? 'active' : ''}`}
            onClick={() => { setActiveTab('social'); setSearchTerm(''); }}
          >
            <Instagram size={18} />
            <span>Social Feed</span>
          </button>
          
          <button onClick={handleLogout} className="menu-item logout-btn">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
      
      {/* Main Panel */}
      <div className="admin-main">
        <div className="admin-header">
          <div>
            <h1>
              {activeTab === 'overview' && 'Operations Overview'}
              {activeTab === 'orders' && 'Customer Purchase Orders'}
              {activeTab === 'catalog' && 'E-Commerce Catalog Inventory'}
              {activeTab === 'inbox' && 'Contact Inquiries Inbox'}
              {activeTab === 'settings' && 'Global Site settings'}
              {activeTab === 'faqs' && 'FAQ Directory Manager'}
              {activeTab === 'policies' && 'Store Policies Editor'}
              {activeTab === 'social' && 'Social Instagram Feed Manager'}
            </h1>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
              Real-time synchronization active
            </p>
          </div>
          <div className="header-meta">
            <button onClick={fetchDashboardData} className="refresh-btn">
              <Clock size={14} />
              <span>Sync Data</span>
            </button>
          </div>
        </div>
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Total Revenue</span>
                <span className="stat-value">₹{(stats.total_sales || 0).toLocaleString('en-IN')}</span>
                <span className="stat-footer">Gross billing from orders</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Total Orders</span>
                <span className="stat-value">{stats.total_orders}</span>
                <span className="stat-footer">Completed checkouts</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Catalog Products</span>
                <span className="stat-value">{stats.total_products}</span>
                <span className="stat-footer">Active items in store</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Customer Queries</span>
                <span className="stat-value">{stats.total_messages}</span>
                <span className="stat-footer">Inboxes pending reply</span>
              </div>
            </div>
            
            <div className="chart-container">
              <div className="chart-header">
                <h3>Revenue Chart (Past 7 Days)</h3>
                <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Daily sales totals</span>
              </div>
              {renderSalesChart()}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '30px' }}>
              <div className="admin-card-table" style={{ padding: '20px' }}>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '1rem', color: '#ffffff' }}>Latest Orders</h4>
                {orders.length === 0 ? (
                  <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>No orders placed yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {orders.slice(0, 4).map(o => (
                      <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '8px' }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{o.orderId}</p>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: '#9ca3af' }}>{o.shipping.firstName} {o.shipping.lastName}</p>
                        </div>
                        <span className={`status-badge ${o.status.toLowerCase()}`}>{o.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="admin-card-table" style={{ padding: '20px' }}>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '1rem', color: '#ffffff' }}>Recent Customer Queries</h4>
                {messages.length === 0 ? (
                  <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Inbox empty.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {messages.slice(0, 3).map(m => (
                      <div key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem' }}>{m.subject}</p>
                          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{m.timestamp.split(' ')[0]}</span>
                        </div>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {m.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* TAB 2: ORDERS */}
        {activeTab === 'orders' && (
          <div>
            <div className="control-bar">
              <div className="search-wrapper">
                <Search size={16} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search orders..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="admin-card-table">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(o => (
                    <React.Fragment key={o.id}>
                      <tr>
                        <td style={{ fontWeight: 600 }}>{o.orderId}</td>
                        <td>
                          <div>{o.shipping.firstName} {o.shipping.lastName}</div>
                          <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{o.shipping.email}</div>
                        </td>
                        <td>{o.date}</td>
                        <td>
                          <select 
                            value={o.status}
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                            className="status-select"
                            style={{
                              background: '#090d16',
                              border: '1px solid rgba(255,255,255,0.1)',
                              color: '#ffffff',
                              padding: '6px 10px',
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              fontWeight: 600
                            }}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                        <td>
                          <div className="row-actions">
                            <button 
                              className="action-icon-btn"
                              title="Toggle Details"
                              onClick={() => setSelectedItem(selectedItem === o.id ? null : o.id)}
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              className="action-icon-btn delete"
                              title="Delete Order"
                              onClick={() => handleDeleteOrder(o.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Expanded Order details */}
                      {selectedItem === o.id && (
                        <tr className="order-expanded-row">
                          <td colSpan="5">
                            <div className="order-details-pane">
                              <div className="order-details-grid">
                                <div className="details-col">
                                  <h4>Shipping Details</h4>
                                  <p><strong>Name:</strong> {o.shipping.firstName} {o.shipping.lastName}</p>
                                  <p><strong>Address:</strong> {o.shipping.addressLine1}, {o.shipping.addressLine2 || ''}</p>
                                  <p><strong>City/Postal:</strong> {o.shipping.city} - {o.shipping.postalCode}</p>
                                  <p><strong>Phone:</strong> {o.shipping.phone}</p>
                                </div>
                                <div className="details-col">
                                  <h4>Purchased Items</h4>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {o.items && o.items.map((item, idx) => (
                                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
                                        <div>
                                          <span style={{ fontWeight: 600 }}>{item.name}</span>
                                          <span style={{ fontSize: '0.75rem', color: '#9ca3af', marginLeft: '10px' }}>({item.meta || 'Standard'})</span>
                                        </div>
                                        <span>{item.quantity}x ₹{parseInt(item.price).toLocaleString('en-IN')}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                  
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>
                        No orders matching search filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* TAB 3: CATALOG (PRODUCTS & COLLECTIONS) */}
        {activeTab === 'catalog' && (
          <div>
            <div className="catalog-tabs">
              <button 
                className={`catalog-tab-btn ${selectedItem?.type !== 'collection' ? 'active' : ''}`}
                onClick={() => setSelectedItem(null)}
              >
                Products ({products.length})
              </button>
              <button 
                className={`catalog-tab-btn ${selectedItem?.type === 'collection' ? 'active' : ''}`}
                onClick={() => setSelectedItem({ type: 'collection' })}
              >
                Collections ({collections.length})
              </button>
            </div>
            
            {/* Products Sub-section */}
            {selectedItem?.type !== 'collection' ? (
              <div>
                <div className="control-bar">
                  <div className="search-wrapper">
                    <Search size={16} className="search-icon" />
                    <input 
                      type="text" 
                      placeholder="Search products..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button className="add-btn" onClick={() => { setSelectedItem(null); setModalType('product_add'); }}>
                    <Plus size={16} />
                    <span>Add Product</span>
                  </button>
                </div>
                
                <div className="admin-card-table">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Original Price</th>
                        <th>Tag</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map(p => (
                        <tr key={p.id}>
                          <td>
                            {p.image ? (
                              <img src={p.image} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }} />
                            ) : (
                              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>💎</div>
                            )}
                          </td>
                          <td style={{ fontWeight: 600 }}>{p.name}</td>
                          <td>{p.category}</td>
                          <td>₹{p.price.toLocaleString('en-IN')}</td>
                          <td>{p.originalPrice ? `₹${p.originalPrice.toLocaleString('en-IN')}` : '-'}</td>
                          <td>
                            {p.tag ? <span style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>{p.tag}</span> : '-'}
                          </td>
                          <td>
                            <div className="row-actions">
                              <button 
                                className="action-icon-btn" 
                                title="Edit Product"
                                onClick={() => { setSelectedItem(p); setModalType('product_edit'); }}
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                className="action-icon-btn delete" 
                                title="Delete Product"
                                onClick={() => handleDeleteProduct(p.id)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* Collections Sub-section */
              <div>
                <div className="control-bar">
                  <div></div>
                  <button className="add-btn" onClick={() => setModalType('collection_add')}>
                    <Plus size={16} />
                    <span>Add Collection</span>
                  </button>
                </div>
                
                <div className="admin-card-table">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Collection Name</th>
                        <th>Tag</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {collections.map(c => (
                        <tr key={c.id}>
                          <td>
                            {c.image ? (
                              <img src={c.image} alt={c.name} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }} />
                            ) : (
                              <div style={{ width: '60px', height: '40px', borderRadius: '8px', background: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📁</div>
                            )}
                          </td>
                          <td style={{ fontWeight: 600 }}>{c.name}</td>
                          <td>{c.tag || '-'}</td>
                          <td>
                            <div className="row-actions">
                              <button 
                                className="action-icon-btn"
                                onClick={() => { setSelectedItem(c); setModalType('collection_edit'); }}
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                className="action-icon-btn delete"
                                onClick={() => handleDeleteCollection(c.id)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* TAB 4: INBOX */}
        {activeTab === 'inbox' && (
          <div>
            <div className="control-bar">
              <div className="search-wrapper">
                <Search size={16} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search inquiries..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="admin-card-table">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Sender Name</th>
                    <th>Email Address</th>
                    <th>Subject</th>
                    <th>Message Details</th>
                    <th>Date Received</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMessages.map(m => (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 600 }}>{m.name}</td>
                      <td>{m.email}</td>
                      <td>{m.subject}</td>
                      <td style={{ maxWidth: '300px', fontSize: '0.85rem' }}>{m.message}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{m.timestamp}</td>
                      <td>
                        <button 
                          className="action-icon-btn delete"
                          onClick={() => handleDeleteMessage(m.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredMessages.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>
                        Inquiries inbox is currently empty.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        

        
        {/* TAB 6: SETTINGS */}
        {activeTab === 'settings' && (
          <div>
            <div className="admin-card-table">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Setting Asset Key</th>
                    <th>Value / Image Preview</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {settings.map(s => (
                    <tr key={s.key}>
                      <td style={{ fontWeight: 600, fontFamily: 'monospace' }}>{s.key}</td>
                      <td style={{ maxWidth: '280px', wordBreak: 'break-all' }}>
                        {s.image ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <img src={s.image} alt={s.key} style={{ width: '120px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }} />
                            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{s.image.substring(0, 40)}...</span>
                          </div>
                        ) : (
                          <span>{s.value || 'None'}</span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.85rem', color: '#9ca3af' }}>{s.description}</td>
                      <td>
                        <button 
                          className="action-icon-btn"
                          onClick={() => { setSelectedItem(s); setModalType('setting_edit'); }}
                        >
                          <Edit size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: FAQS */}
        {activeTab === 'faqs' && (
          <div>
            <div className="control-bar">
              <div className="search-wrapper">
                <Search size={16} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search FAQs..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                className="add-btn"
                onClick={() => { setSelectedItem(null); setModalType('faq_add'); }}
              >
                <Plus size={16} />
                <span>Add FAQ</span>
              </button>
            </div>
            
            <div className="admin-card-table">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '25%' }}>Question</th>
                    <th style={{ width: '50%' }}>Answer</th>
                    <th style={{ width: '15%' }}>Bullets Count</th>
                    <th style={{ width: '10%' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {faqs.filter(f => 
                    f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    f.answer.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map(f => (
                    <tr key={f.id}>
                      <td style={{ fontWeight: 600 }}>{f.question}</td>
                      <td style={{ fontSize: '0.85rem', color: '#e5e7eb', whiteSpace: 'pre-wrap' }}>{f.answer}</td>
                      <td>{f.bullets ? f.bullets.length : 0} items</td>
                      <td>
                        <div className="row-actions">
                          <button 
                            className="action-icon-btn"
                            onClick={() => { setSelectedItem(f); setModalType('faq_edit'); }}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="action-icon-btn delete"
                            onClick={() => handleDeleteFaq(f.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {faqs.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>
                        No FAQs registered in the database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 8: POLICIES */}
        {activeTab === 'policies' && (
          <div>
            <div className="admin-card-table">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Policy Document</th>
                    <th>Setting Key</th>
                    <th>Description</th>
                    <th>Content Preview</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {settings.filter(s => s.key.startsWith('policy_')).map(s => {
                    const policyNames = {
                      'policy_terms': 'Terms & Conditions',
                      'policy_privacy': 'Privacy Policy',
                      'policy_shipping': 'Shipping Policy',
                      'policy_refund': 'Refund Policy',
                      'policy_cookie': 'Cookie Policy'
                    };
                    return (
                      <tr key={s.key}>
                        <td style={{ fontWeight: 600 }}>{policyNames[s.key] || s.key}</td>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#9ca3af' }}>{s.key}</td>
                        <td style={{ fontSize: '0.85rem', color: '#9ca3af' }}>{s.description}</td>
                        <td style={{ maxWidth: '300px', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#cbd5e1' }}>
                          {s.value || 'Not configured'}
                        </td>
                        <td>
                          <button 
                            className="action-icon-btn"
                            onClick={() => { setSelectedItem(s); setModalType('policy_edit'); }}
                          >
                            <Edit size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {settings.filter(s => s.key.startsWith('policy_')).length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>
                        No policy documents found. Please sync or verify migrations.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 9: SOCIAL FEED ("AS SEEN ON YOU") */}
        {activeTab === 'social' && (
          <div>
            <div className="control-bar">
              <div className="search-wrapper">
                <Search size={16} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search Alt Text..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                className="add-btn"
                onClick={() => { setSelectedItem(null); setFileInput(null); setModalType('social_add'); }}
              >
                <Plus size={16} />
                <span>Add Social Image</span>
              </button>
            </div>

            <div className="admin-card-table" style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', padding: '1.5rem' }}>
                {socialItems.filter(item => 
                  item.altText.toLowerCase().includes(searchTerm.toLowerCase())
                ).map(item => (
                  <div key={item.id} style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ width: '100%', height: '200px', backgroundColor: '#0f0f10', position: 'relative' }}>
                      <img 
                        src={item.image} 
                        alt={item.altText} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                      <button 
                        onClick={() => handleDeleteSocial(item.id)}
                        style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(239, 68, 68, 0.9)', color: '#ffffff', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
                        title="Delete Image"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div style={{ padding: '1rem', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <p style={{ fontSize: '0.85rem', color: '#9ca3af', lineHeight: '1.4', margin: 0 }}>
                        {item.altText}
                      </p>
                      <span style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '0.75rem', fontFamily: 'monospace' }}>
                        ID: {item.id}
                      </span>
                    </div>
                  </div>
                ))}
                {socialItems.filter(item => 
                  item.altText.toLowerCase().includes(searchTerm.toLowerCase())
                ).length === 0 && (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 0', color: '#9ca3af' }}>
                    No matching social feed images found.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* --------------------------------------------------
          MODALS
      -------------------------------------------------- */}
      
      {/* Product Add / Edit Modal */}
      {(modalType === 'product_add' || modalType === 'product_edit') && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{modalType === 'product_add' ? 'Add New Product Record' : `Edit Product: ${selectedItem?.name}`}</h3>
              <button className="modal-close" onClick={() => { setModalType(null); setSelectedItem(null); setFileInput(null); }}><X size={18} /></button>
            </div>
            
            <form onSubmit={handleSaveProduct}>
              <div className="modal-body">
                {modalType === 'product_edit' && (
                  <input type="hidden" name="id" value={selectedItem?.id} />
                )}
                
                <div className="form-group">
                  <label>Product Name *</label>
                  <input type="text" name="name" defaultValue={selectedItem?.name || ''} required />
                </div>
                
                <div className="form-row-split">
                  <div className="form-group">
                    <label>Price (₹) *</label>
                    <input type="number" name="price" defaultValue={selectedItem?.price || ''} required />
                  </div>
                  <div className="form-group">
                    <label>Original Price (₹) (Discount fallback)</label>
                    <input type="number" name="originalPrice" defaultValue={selectedItem?.originalPrice || ''} />
                  </div>
                </div>
                
                <div className="form-row-split">
                  <div className="form-group">
                    <label>Category *</label>
                    <select name="category" defaultValue={selectedItem?.category || 'pendant'} style={{ width: '100%', background: '#030712', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px', color: '#ffffff' }}>
                      <option value="pendant">Pendants</option>
                      <option value="ring">Rings</option>
                      <option value="bracelet">Bracelets</option>
                      <option value="choker">Chokers</option>
                      <option value="keyring">Keyrings</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Catalog Tag</label>
                    <input type="text" name="tag" placeholder="e.g. New Drop, Sale, Best Seller" defaultValue={selectedItem?.tag || ''} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Metal / Material</label>
                  <input type="text" name="material" placeholder="e.g. Sterling Silver" defaultValue={selectedItem?.material || ''} />
                </div>

                <div className="form-group">
                  <label>Display Image file</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <input 
                      type="file" 
                      onChange={(e) => setFileInput(e.target.files[0])}
                      style={{ border: 'none', background: 'transparent', padding: 0 }}
                    />
                    {selectedItem?.image && !fileInput && (
                      <img src={selectedItem.image} alt="preview" style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '8px' }} />
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Additional Gallery Images (Upload multiple)</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input 
                      type="file" 
                      multiple 
                      onChange={(e) => setAdditionalFiles(Array.from(e.target.files))}
                      style={{ border: 'none', background: 'transparent', padding: 0 }}
                    />
                    
                    {/* Display existing secondary gallery images */}
                    {existingImages.length > 0 && (
                      <div className="gallery-preview-container">
                        {existingImages.map((img, idx) => (
                          <div key={idx} className="gallery-preview-item">
                            <img src={img} alt={`gallery-${idx}`} />
                            <button 
                              type="button" 
                              onClick={() => handleRemoveExistingImage(idx)}
                              className="gallery-preview-remove-btn"
                              title="Remove image"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Short Metadata Label</label>
                  <input type="text" name="meta" placeholder="e.g. Silver / 18 inches" defaultValue={selectedItem?.meta || ''} />
                </div>

                <div className="form-group">
                  <label>Description Details</label>
                  <textarea name="description" rows="3" defaultValue={selectedItem?.description || ''} style={{ width: '100%', boxSizing: 'border-box', background: '#030712', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px', color: '#ffffff' }} />
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => { setModalType(null); setSelectedItem(null); setFileInput(null); }}>Cancel</button>
                <button type="submit" disabled={loading} className="btn-save">{loading ? 'Saving...' : 'Save Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Collection Add / Edit Modal */}
      {(modalType === 'collection_add' || modalType === 'collection_edit') && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3>{modalType === 'collection_add' ? 'Create Collection Group' : 'Edit Collection Group'}</h3>
              <button className="modal-close" onClick={() => { setModalType(null); setSelectedItem(null); setFileInput(null); }}><X size={18} /></button>
            </div>
            
            <form onSubmit={handleSaveCollection}>
              <div className="modal-body">
                {modalType === 'collection_edit' && (
                  <input type="hidden" name="id" value={selectedItem?.id} />
                )}
                
                <div className="form-group">
                  <label>Collection Name *</label>
                  <input type="text" name="name" defaultValue={selectedItem?.name || ''} required />
                </div>
                
                <div className="form-group">
                  <label>Subtitle / Tagline</label>
                  <input type="text" name="tag" placeholder="e.g. Premium Silver Crucifixes" defaultValue={selectedItem?.tag || ''} />
                </div>

                <div className="form-group">
                  <label>Banner Image file</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <input 
                      type="file" 
                      onChange={(e) => setFileInput(e.target.files[0])}
                      style={{ border: 'none', background: 'transparent', padding: 0 }}
                    />
                    {selectedItem?.image && !fileInput && (
                      <img src={selectedItem.image} alt="preview" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '8px' }} />
                    )}
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => { setModalType(null); setSelectedItem(null); setFileInput(null); }}>Cancel</button>
                <button type="submit" disabled={loading} className="btn-save">{loading ? 'Saving...' : 'Save Collection'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Setting Edit Modal */}
      {modalType === 'setting_edit' && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3>Edit Asset setting: {selectedItem?.key}</h3>
              <button className="modal-close" onClick={() => { setModalType(null); setSelectedItem(null); setFileInput(null); }}><X size={18} /></button>
            </div>
            
            <form onSubmit={handleSaveSetting}>
              <div className="modal-body">
                <input type="hidden" name="key" value={selectedItem?.key} />
                
                <div className="form-group">
                  <label>Setting Key</label>
                  <input type="text" value={selectedItem?.key} disabled style={{ background: '#111827', color: '#9ca3af' }} />
                </div>
                
                <div className="form-group">
                  <label>Description</label>
                  <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '4px 0 12px 0' }}>{selectedItem?.description}</p>
                </div>

                <div className="form-group">
                  <label>Text Value (Image Path / URL / Key Value)</label>
                  <textarea 
                    name="value" 
                    rows="3" 
                    defaultValue={selectedItem?.value || ''} 
                    style={{ width: '100%', boxSizing: 'border-box', background: '#030712', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px', color: '#ffffff' }} 
                  />
                </div>

                {(selectedItem?.key.toLowerCase().includes('bg') || selectedItem?.key.toLowerCase().includes('img')) && (
                  <div className="form-group" style={{ marginTop: '15px' }}>
                    <label>Upload Image File (will override text value)</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
                      <input 
                        type="file" 
                        onChange={(e) => setFileInput(e.target.files[0])}
                        style={{ border: 'none', background: 'transparent', padding: 0 }}
                      />
                      {selectedItem?.image && !fileInput ? (
                        <img src={selectedItem.image} alt="preview" style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                      ) : selectedItem?.value && !fileInput && (
                        <img src={selectedItem.value} alt="preview" style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => { setModalType(null); setSelectedItem(null); setFileInput(null); }}>Cancel</button>
                <button type="submit" disabled={loading} className="btn-save">{loading ? 'Saving...' : 'Save Setting'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ Add / Edit Modal */}
      {(modalType === 'faq_add' || modalType === 'faq_edit') && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <h3>{modalType === 'faq_add' ? 'Add New FAQ Record' : 'Edit FAQ Item'}</h3>
              <button className="modal-close" onClick={() => { setModalType(null); setSelectedItem(null); }}><X size={18} /></button>
            </div>
            
            <form onSubmit={handleSaveFaq}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Question / Query text *</label>
                  <input type="text" name="question" defaultValue={selectedItem?.question || ''} required style={{ width: '100%' }} />
                </div>
                
                <div className="form-group">
                  <label>Answer details *</label>
                  <textarea name="answer" rows="5" defaultValue={selectedItem?.answer || ''} required style={{ width: '100%', boxSizing: 'border-box', background: '#030712', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px', color: '#ffffff' }} />
                </div>

                <div className="form-group">
                  <label>Bullet Points (Optional - One bullet per line)</label>
                  <textarea 
                    name="bullets_text" 
                    rows="4" 
                    placeholder="e.g. Fully insured domestic transit.&#10;Signature required on delivery." 
                    defaultValue={selectedItem?.bullets ? selectedItem.bullets.join('\n') : ''} 
                    style={{ width: '100%', boxSizing: 'border-box', background: '#030712', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px', color: '#ffffff' }} 
                  />
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => { setModalType(null); setSelectedItem(null); }}>Cancel</button>
                <button type="submit" disabled={loading} className="btn-save">{loading ? 'Saving...' : 'Save FAQ'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Policy Edit Modal */}
      {modalType === 'policy_edit' && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '720px', width: '90%' }}>
            <div className="modal-header">
              <h3>Edit Policy Document: {selectedItem?.key === 'policy_terms' ? 'Terms & Conditions' : selectedItem?.key === 'policy_privacy' ? 'Privacy Policy' : selectedItem?.key === 'policy_shipping' ? 'Shipping Policy' : selectedItem?.key === 'policy_refund' ? 'Refund Policy' : 'Cookie Policy'}</h3>
              <button className="modal-close" onClick={() => { setModalType(null); setSelectedItem(null); }}><X size={18} /></button>
            </div>
            
            <form onSubmit={handleSavePolicy}>
              <div className="modal-body">
                <input type="hidden" name="key" value={selectedItem?.key} />
                
                <div className="form-group">
                  <label>Policy Content Text (Supports paragraphs separated by double newlines)</label>
                  <textarea 
                    name="value" 
                    rows="16" 
                    defaultValue={selectedItem?.value || ''} 
                    required 
                    style={{ width: '100%', boxSizing: 'border-box', background: '#030712', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '15px', color: '#ffffff', fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: '1.5' }} 
                  />
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => { setModalType(null); setSelectedItem(null); }}>Cancel</button>
                <button type="submit" disabled={loading} className="btn-save">{loading ? 'Saving...' : 'Save Policy Document'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Social Feed Add Modal */}
      {modalType === 'social_add' && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>Add Social Feed Image</h3>
              <button className="modal-close" onClick={() => { setModalType(null); setFileInput(null); }}><X size={18} /></button>
            </div>
            
            <form onSubmit={handleSaveSocial}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Alt Text / Image Description *</label>
                  <input 
                    type="text" 
                    name="altText" 
                    required 
                    placeholder="e.g. Sterling silver rings and chains stacked"
                    style={{ width: '100%' }}
                  />
                </div>

                <div className="form-group" style={{ marginTop: '15px' }}>
                  <label>Upload Image File</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setFileInput(e.target.files[0])}
                      style={{ border: 'none', background: 'transparent', padding: 0 }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '15px' }}>
                  <label>Or Fallback Image URL</label>
                  <input 
                    type="text" 
                    name="image_url" 
                    placeholder="e.g. /media/social_image.jpg"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => { setModalType(null); setFileInput(null); }}>Cancel</button>
                <button type="submit" disabled={loading} className="btn-save">{loading ? 'Saving...' : 'Add Image'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
