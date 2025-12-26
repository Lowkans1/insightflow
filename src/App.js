import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar, AreaChart, Area 
} from 'recharts';
import './App.css';

const API_BASE_URL = 'https://insgihtflowkdsbackend.onrender.com/api';
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isAuth') === 'true');
  const [showRegister, setShowRegister] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [timeRange, setTimeRange] = useState('monthly'); // Veri filtreleme simülasyonu

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [regData, setRegData] = useState({ name: '', surname: '', phone: '', email: '' });

  useEffect(() => {
    if (isLoggedIn) {
      const fetchEverything = async () => {
        setLoading(true);
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
  }, [isLoggedIn, timeRange]);

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

  if (!isLoggedIn) {
    return (
      <div className="auth-wrapper">
        <div className="auth-visual-side">
          <div className="visual-content">
            <h1>InsightFlow <span>AI</span></h1>
            <p>E-Ticaret Operasyonlarını Yapay Zeka ile Optimize Edin.</p>
          </div>
        </div>
        <div className="auth-form-side">
          <div className="auth-container">
            {!showRegister ? (
              <form className="modern-form" onSubmit={handleLogin}>
                <div className="form-head">
                  <h2>Yönetici Paneli</h2>
                  <p>Güvenli oturum açmak için bilgilerinizi girin.</p>
                </div>
                <div className="input-group-modern">
                  <label>Kullanıcı Adı</label>
                  <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)} required placeholder="admin" />
                </div>
                <div className="input-group-modern">
                  <label>Şifre</label>
                  <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required placeholder="••••••••" />
                </div>
                <button type="submit" className="prime-btn">Sisteme Giriş Yap</button>
                <div className="form-foot">
                  <span>Hesabınız yok mu?</span>
                  <button type="button" onClick={()=>setShowRegister(true)}>Kayıt Talebi</button>
                </div>
              </form>
            ) : (
              <form className="modern-form" onSubmit={(e) => {
                e.preventDefault();
                window.location.href = `mailto:lowkanss@yandex.com?subject=Erişim Talebi&body=Ad:${regData.name} Tel:${regData.phone}`;
              }}>
                <div className="form-head">
                  <h2>Erişim Başvurusu</h2>
                  <p>Bilgilerinizi bırakın, Volkan Bey size dönüş yapsın.</p>
                </div>
                <div className="grid-inputs">
                   <input type="text" placeholder="Ad" onChange={(e)=>setRegData({...regData, name:e.target.value})} required />
                   <input type="text" placeholder="Soyad" onChange={(e)=>setRegData({...regData, surname:e.target.value})} required />
                </div>
                <input type="tel" placeholder="Telefon" onChange={(e)=>setRegData({...regData, phone:e.target.value})} required />
                <input type="email" placeholder="E-posta" onChange={(e)=>setRegData({...regData, email:e.target.value})} required />
                <button type="submit" className="prime-btn">Başvuruyu Gönder</button>
                <button type="button" className="text-btn" onClick={()=>setShowRegister(false)}>Geri Dön</button>
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
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand" onClick={() => setActiveTab('dashboard')}>
            <img src="/logo192.png" alt="Logo" className="nav-logo-img" />
            <span>InsightFlow <span className="v-tag">v1.3</span></span>
          </div>
          <div className="nav-links">
            <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>Analiz Paneli</button>
            <button className={activeTab === 'about' ? 'active' : ''} onClick={() => setActiveTab('about')}>Sistem Hakkında</button>
            <button className={activeTab === 'contact' ? 'active' : ''} onClick={() => setActiveTab('contact')}>Destek</button>
            <button className="logout-btn" onClick={handleLogout}>Çıkış Yap</button>
          </div>
        </div>
      </nav>

      <div className="dashboard-container">
        {activeTab === 'dashboard' && (
          <>
            {/* AI STRATEJİ KARTI */}
            <section className="ai-insight-card">
              <div className="ai-header">
                <div className="ai-pulse-dot"></div>
                <span className="ai-status">AI STRATEJİ MERKEZİ</span>
              </div>
              <h2 className="ai-text">
                "Sayın Volkan, veriler <strong>%{((data?.kpis?.total_revenue / 100000) * 5).toFixed(1)}</strong> oranında büyüme trendi gösteriyor. 
                Özellikle {data?.categories?.[0]?.name} kategorisindeki ivme gelecek ay cironuzu ₺{(data?.kpis?.total_revenue * 1.15).toLocaleString('tr-TR')} seviyesine taşıyabilir."
              </h2>
              <div className="ai-tags">
                <div className="ai-tag">🚀 Büyüme Skoru: 94/100</div>
                <div className="ai-tag">📉 Risk Faktörü: %1.2 (Düşük)</div>
                <div className="ai-tag">🎯 Öneri: Reklam Bütçesini %10 Artır</div>
              </div>
            </section>

            {/* FİLTRELEME ÇUBUĞU */}
            <div className="filter-bar">
              <div className="time-filters">
                <button className={timeRange === 'weekly' ? 'active' : ''} onClick={()=>setTimeRange('weekly')}>Haftalık</button>
                <button className={timeRange === 'monthly' ? 'active' : ''} onClick={()=>setTimeRange('monthly')}>Aylık</button>
                <button className={timeRange === 'yearly' ? 'active' : ''} onClick={()=>setTimeRange('yearly')}>Yıllık</button>
              </div>
              <div className="live-clock">{new Date().toLocaleDateString('tr-TR')} - Sistem Güncel</div>
            </div>

            {/* KPI KARTLARI */}
            <section className="kpi-grid">
              <KpiCard title="Toplam Ciro" value={`₺${data?.kpis?.total_revenue?.toLocaleString('tr-TR')}`} color="#6366f1" icon="💰" trend="+12%" />
              <KpiCard title="Sipariş Adedi" value={data?.kpis?.total_orders} color="#10b981" icon="📦" trend="+5%" />
              <KpiCard title="Sadık Müşteri" value={data?.kpis?.unique_customers} color="#f59e0b" icon="👥" trend="+8%" />
              <KpiCard title="Sepet Ortalaması" value={`₺${data?.kpis?.aov}`} color="#8b5cf6" icon="📊" trend="-2%" />
            </section>

            {/* ANA GRAFİKLER */}
            <div className="charts-main-row">
              <div className="glass-card main-chart">
                <div className="card-header">
                  <h3>Gelir Performans Trendi</h3>
                  <span className="info-tag">Tahminlemeli</span>
                </div>
                <div className="chart-wrapper" style={{ height: '320px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data?.trend}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                      <YAxis hide />
                      <Tooltip contentStyle={{borderRadius: '15px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'}} />
                      <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-card side-chart">
                <h3>Kategori Ciro Payı</h3>
                <div className="chart-wrapper" style={{ height: '320px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data?.categories} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="60%" outerRadius="85%" paddingAngle={5}>
                        {data?.categories?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* DETAYLI ANALİZ VE TABLO */}
            <div className="charts-detail-row">
              <div className="glass-card">
                <h3>Ürün Bazlı Satış Performansı</h3>
                <div className="chart-wrapper" style={{ height: '350px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.top_products} layout="vertical" margin={{left: 0, right: 30}}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} style={{fontSize: '11px', fontWeight: '600'}} />
                      <Tooltip cursor={{fill: 'transparent'}} />
                      <Bar dataKey="value" fill="#6366f1" radius={[0, 10, 10, 0]} barSize={18} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-card table-card">
                <div className="card-header">
                  <h3>Gerçek Zamanlı Son İşlemler</h3>
                  <button className="view-all-btn">Tümünü Gör</button>
                </div>
                <div className="table-wrapper">
                  <table className="modern-table">
                    <thead>
                      <tr><th>Müşteri</th><th className="hide-mobile">Ürün Grubu</th><th className="text-right">Tutar</th></tr>
                    </thead>
                    <tbody>
                      {data?.recent?.map((order, i) => (
                        <tr key={i}>
                          <td>
                            <div className="cust-info">
                              <div className="avatar" style={{background: COLORS[i % 5]}}>{order.customer.charAt(0)}</div>
                              <strong>{order.customer}</strong>
                            </div>
                          </td>
                          <td className="hide-mobile">{order.product}</td>
                          <td className="text-right amount-cell">₺{order.amount.toLocaleString('tr-TR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'about' && (
          <section className="info-page">
            <div className="glass-card">
              <h2>InsightFlow v1.3 Karar Destek Sistemi</h2>
              <p>Bu sistem, e-ticaret verilerini analiz ederek işletme sahiplerine stratejik içgörüler sunar.</p>
              <div className="info-grid-modern">
                <div className="info-item"><h4>Yapay Zeka</h4><p>Trend analizi ve gelecek projeksiyonu.</p></div>
                <div className="info-item"><h4>Veri Güvenliği</h4><p>Uçtan uca şifreli veri işleme.</p></div>
                <div className="info-item"><h4>Performans</h4><p>Anlık veri senkronizasyonu.</p></div>
              </div>
            </div>
          </section>
        )}
      </div>

      <footer className="dashboard-footer">
        <div className="protection-stamp">
          <span className="shield-icon">🛡️</span>
          <span>Secured by <strong>InsightFlow AI</strong> | Protected by Volkan Ağbal</span>
        </div>
      </footer>
    </div>
  );
}

const KpiCard = ({ title, value, color, icon, trend }) => (
  <div className="kpi-card">
    <div className="card-icon" style={{ backgroundColor: `${color}15`, color: color }}>{icon}</div>
    <div className="card-content">
      <span className="card-label">{title}</span>
      <div className="val-row">
        <h2 className="card-value">{value}</h2>
        <span className={`trend-tag ${trend.startsWith('+') ? 'up' : 'down'}`}>{trend}</span>
      </div>
    </div>
  </div>
);

export default App;
