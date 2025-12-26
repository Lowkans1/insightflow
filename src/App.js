import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar 
} from 'recharts';
import './App.css';

const API_BASE_URL = 'https://insgihtflowkdsbackend.onrender.com/api';
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  // Tarayıcı kapatılsa bile girişi hatırlar
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isAuth') === 'true');
  const [showRegister, setShowRegister] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [regData, setRegData] = useState({ name: '', surname: '', phone: '', email: '' });

  useEffect(() => {
    if (isLoggedIn) {
      const fetchEverything = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/dashboard/all`);
          setData(res.data);
          setLoading(false);
        } catch (err) {
          console.error("Veri çekme hatası:", err);
          setLoading(false);
        }
      };
      fetchEverything();
    }
  }, [isLoggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'insight2025') {
      setIsLoggedIn(true);
      localStorage.setItem('isAuth', 'true');
    } else {
      alert("Hatalı kimlik bilgileri.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isAuth');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const mailBody = `Yeni Kayıt Talebi%0D%0AAd Soyad: ${regData.name} ${regData.surname}%0D%0ATelefon: ${regData.phone}%0D%0AEmail: ${regData.email}`;
    window.location.href = `mailto:lowkanss@yandex.com?subject=Erişim Talebi&body=${mailBody}`;
    setShowRegister(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="auth-wrapper">
        <div className="auth-visual-side">
          <div className="visual-content">
            <h1>InsightFlow <span>AI</span></h1>
            <p>Verinizi stratejiye dönüştüren akıllı karar destek sistemi.</p>
          </div>
        </div>
        <div className="auth-form-side">
          <div className="auth-container">
            {!showRegister ? (
              <form className="modern-form" onSubmit={handleLogin}>
                <div className="form-head">
                  <h2>Tekrar Hoş Geldin</h2>
                  <p>Lütfen yönetici panelinize giriş yapın.</p>
                </div>
                <div className="input-group-modern">
                  <label>Kullanıcı Adı</label>
                  <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)} required placeholder="admin" />
                </div>
                <div className="input-group-modern">
                  <label>Şifre</label>
                  <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required placeholder="••••••••" />
                </div>
                <button type="submit" className="prime-btn">Oturum Aç</button>
                <div className="form-foot">
                  <span>Hesabınız yok mu?</span>
                  <button type="button" onClick={()=>setShowRegister(true)}>Kayıt Talebi Oluştur</button>
                </div>
              </form>
            ) : (
              <form className="modern-form" onSubmit={handleRegister}>
                <div className="form-head">
                  <h2>Kayıt Talebi</h2>
                  <p>Sistemi kullanmak için bilgilerinizi Volkan'a iletin.</p>
                </div>
                <div className="grid-inputs">
                   <input type="text" placeholder="Ad" onChange={(e)=>setRegData({...regData, name:e.target.value})} required />
                   <input type="text" placeholder="Soyad" onChange={(e)=>setRegData({...regData, surname:e.target.value})} required />
                </div>
                <input type="tel" placeholder="Telefon" onChange={(e)=>setRegData({...regData, phone:e.target.value})} required />
                <input type="email" placeholder="E-posta" onChange={(e)=>setRegData({...regData, email:e.target.value})} required />
                <button type="submit" className="prime-btn">Başvuruyu Gönder</button>
                <button type="button" className="text-btn" onClick={()=>setShowRegister(false)}>Giriş Ekranına Dön</button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="App">
       {/* Dashboard Navbar ve İçerik Buraya Gelecek */}
       <nav className="navbar">
         <div className="nav-container">
           <div className="nav-brand" onClick={() => setActiveTab('dashboard')}>
             <img src="/logo192.png" alt="Logo" className="nav-logo-img" />
             <span>InsightFlow <span className="v-tag">v1.2</span></span>
           </div>
           <div className="nav-links">
             <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>Panel</button>
             <button className={activeTab === 'about' ? 'active' : ''} onClick={() => setActiveTab('about')}>Kurumsal</button>
             <button className={activeTab === 'contact' ? 'active' : ''} onClick={() => setActiveTab('contact')}>İletişim</button>
             <button className="logout-btn" onClick={handleLogout}>Çıkış</button>
           </div>
         </div>
       </nav>

       <div className="dashboard-container">
          {activeTab === 'dashboard' && (
            <>
              {/* AI Insight Card ve Grafikleriniz */}
              <section className="ai-insight-card">
                 <div className="ai-header">
                   <div className="ai-pulse-dot"></div>
                   <span className="ai-status">CANLI AI ANALİZİ</span>
                 </div>
                 <h2 className="ai-text">"{data?.ai_live_msg || `Sayın Volkan, satış trendleriniz pozitif ivmede.`}"</h2>
                 <div className="ai-tags">
                   <div className="ai-tag">🚀 Tahmin: ₺{(data?.kpis?.total_revenue * 1.12).toLocaleString('tr-TR')}+</div>
                 </div>
              </section>

              {/* ... Önceki grafik ve tablo bölümlerini buraya ekleyin ... */}
            </>
          )}
       </div>
    </div>
  );
}

const KpiCard = ({ title, value, color, icon }) => (
  <div className="kpi-card">
    <div className="card-icon" style={{ backgroundColor: `${color}15`, color: color }}>{icon}</div>
    <div className="card-content">
      <span className="card-label">{title}</span>
      <h2 className="card-value">{value}</h2>
    </div>
  </div>
);

export default App;
