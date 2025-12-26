import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, BarChart, Bar, AreaChart, Area 
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
  const [timeRange, setTimeRange] = useState('monthly');

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
      setActiveTab('dashboard'); // Giriş sonrası direkt dashboard'a atar
    } else {
      alert("Hatalı kimlik bilgileri.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isAuth');
  };

  // --- ŞIK AUTH EKRANI ---
  if (!isLoggedIn) {
    return (
      <div className="auth-wrapper">
        <div className="auth-visual-side">
          <div className="visual-content">
            <h1>InsightFlow <span>AI</span></h1>
            <p>E-Ticaret Verilerinizi Stratejik Kararlara Dönüştürün.</p>
          </div>
        </div>
        <div className="auth-form-side">
          <div className="auth-container">
            <div className="auth-brand-mobile">InsightFlow KDS AI</div>
            {!showRegister ? (
              <form className="modern-form" onSubmit={handleLogin}>
                <div className="form-head">
                  <h2>Sisteme Erişin</h2>
                  <p>Operasyonel raporlarınıza ulaşmak için giriş yapın.</p>
                </div>
                <div className="input-field">
                  <label>Yönetici Kimliği</label>
                  <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)} required placeholder="Kullanıcı adı" />
                </div>
                <div className="input-field">
                  <label>Erişim Şifresi</label>
                  <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required placeholder="••••••••" />
                </div>
                <button type="submit" className="prime-btn">Giriş Yap</button>
                <div className="form-foot">
                  <span>Hesabınız yok mu?</span>
                  <button type="button" onClick={()=>setShowRegister(true)}>Kayıt Talebi</button>
                </div>
              </form>
            ) : (
              <form className="modern-form" onSubmit={(e) => {
                e.preventDefault();
                const body = `Ad: ${regData.name} ${regData.surname}%0DTel: ${regData.phone}%0DEmail: ${regData.email}`;
                window.location.href = `mailto:lowkanss@yandex.com?subject=KDS Erişim Başvurusu&body=${body}`;
              }}>
                <div className="form-head">
                  <h2>Yeni Kayıt</h2>
                  <p>Bilgilerinizi bırakın, sizin için hesap oluşturalım.</p>
                </div>
                <div className="grid-inputs">
                   <input type="text" placeholder="Ad" onChange={(e)=>setRegData({...regData, name:e.target.value})} required />
                   <input type="text" placeholder="Soyad" onChange={(e)=>setRegData({...regData, surname:e.target.value})} required />
                </div>
                <input type="tel" placeholder="İletişim Numarası" onChange={(e)=>setRegData({...regData, phone:e.target.value})} required />
                <input type="email" placeholder="E-posta Adresi" onChange={(e)=>setRegData({...regData, email:e.target.value})} required />
                <button type="submit" className="prime-btn">Başvuru Yap</button>
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
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand" onClick={() => setActiveTab('dashboard')}>
            <img src="/logo192.png" alt="Logo" className="nav-logo-img" />
            <span>InsightFlow <span className="v-tag">AI KDS</span></span>
          </div>
          <div className="nav-links">
            <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>Analiz</button>
            <button className={activeTab === 'about' ? 'active' : ''} onClick={() => setActiveTab('about')}>Kurumsal</button>
            <button className={activeTab === 'contact' ? 'active' : ''} onClick={() => setActiveTab('contact')}>Destek</button>
            <button className="logout-btn" onClick={handleLogout}>Çıkış</button>
          </div>
        </div>
      </nav>

      <div className="dashboard-container">
        {activeTab === 'dashboard' && (
          <>
            {/* ŞIKLAŞTIRILMIŞ AI STRATEJİ KARTI */}
            <section className="ai-insight-card-modern">
              <div className="ai-header-row">
                <div className="ai-badge"><span className="pulse"></span> CANLI ANALİZ</div>
                <div className="ai-status-text">AI Strateji Merkezi Aktif</div>
              </div>
              <div className="ai-body">
                <h2 className="ai-text-modern">
                  "Sayın Volkan, verileriniz <strong>%{((data?.kpis?.total_revenue / 100000) * 5).toFixed(1)}</strong> büyüme ivmesinde. {data?.categories?.[0]?.name} grubundaki artışla cironuz ₺{(data?.kpis?.total_revenue * 1.15).toLocaleString('tr-TR')} seviyesini görebilir."
                </h2>
                <div className="ai-meta-tags">
                  <span className="ai-meta">Tahmin: ₺145k+</span>
                  <span className="ai-meta">Güven: %94</span>
                  <span className="ai-meta">Risk: Düşük</span>
                </div>
              </div>
            </section>

            <div className="kpi-grid">
              <KpiCard title="Toplam Gelir" value={`₺${data?.kpis?.total_revenue?.toLocaleString('tr-TR')}`} color="#6366f1" icon="💰" trend="+12%" />
              <KpiCard title="Siparişler" value={data?.kpis?.total_orders} color="#10b981" icon="📦" trend="+5%" />
              <KpiCard title="Kullanıcılar" value={data?.kpis?.unique_customers} color="#f59e0b" icon="👥" trend="+8%" />
              <KpiCard title="Sepet Ort." value={`₺${data?.kpis?.aov}`} color="#8b5cf6" icon="📊" trend="-2%" />
            </div>

            <div className="charts-main-row">
              <div className="glass-card main-chart">
                <div className="card-header-flex"><h3>Performans Trendi</h3></div>
                <div className="chart-wrapper" style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data?.trend}>
                      <defs><linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                      <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.1)'}} />
                      <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fill="url(#colorVal)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="glass-card side-chart">
                <h3>Kategori Payı</h3>
                <div className="chart-wrapper" style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart><Pie data={data?.categories} dataKey="value" innerRadius="60%" outerRadius="80%" paddingAngle={5}>{data?.categories?.map((e,i)=><Cell key={i} fill={COLORS[i%5]}/>)}</Pie><Tooltip/><Legend/></PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="charts-detail-row">
              <div className="glass-card">
                <h3>En Çok Satanlar</h3>
                <div className="chart-wrapper" style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.top_products} layout="vertical">
                      <XAxis type="number" hide/><YAxis dataKey="name" type="category" width={80} style={{fontSize:'11px'}}/><Tooltip cursor={{fill: 'transparent'}}/>
                      <Bar dataKey="value" fill="#6366f1" radius={[0, 5, 5, 0]} barSize={12} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="glass-card table-card">
                <div className="table-header-flex"><h3>Son İşlemler</h3><button className="minimal-btn">Tümünü Gör</button></div>
                <div className="table-wrapper-fix">
                  <table className="modern-table">
                    <thead><tr><th>Müşteri</th><th className="hide-mobile">Ürün</th><th className="text-right">Tutar</th></tr></thead>
                    <tbody>
                      {data?.recent?.map((o, i) => (
                        <tr key={i}>
                          <td><div className="cust-row"><div className="avatar-small" style={{background: COLORS[i%5]}}>{o.customer[0]}</div>{o.customer}</div></td>
                          <td className="hide-mobile">{o.product}</td>
                          <td className="text-right amount-bold">₺{o.amount.toLocaleString('tr-TR')}</td>
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
          <section className="info-page animate-fade">
            <div className="glass-card full-center">
              <h2>InsightFlow v1.3.5</h2>
              <p>Yeni nesil Karar Destek Sistemi. Verinizi zekaya dönüştürüyoruz.</p>
              <div className="badge-row"><span className="v-badge">AI Powered</span><span className="v-badge">Secure</span></div>
            </div>
          </section>
        )}

        {activeTab === 'contact' && (
          <section className="info-page animate-fade">
            <div className="contact-grid-modern">
              <div className="glass-card">
                <h3>Teknik Destek</h3>
                <p>Sorularınız için bizimle iletişime geçin.</p>
                <div className="contact-item">📧 <strong>lowkanss@yandex.com</strong></div>
                <div className="contact-item">📞 <strong>+90 (5XX) XXX XX XX</strong></div>
              </div>
              <div className="glass-card">
                <h3>Sistem Durumu</h3>
                <div className="status-grid">
                  <div className="status-box"><span>Sunucu</span><strong>Aktif</strong></div>
                  <div className="status-box"><span>AI Model</span><strong>v4-Turbo</strong></div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      <footer className="footer-modern">
        <div className="footer-line"></div>
        <p>Secured by <strong>InsightFlow AI</strong> | 2025</p>
        <p className="footer-sub">Protected by <strong>Volkan Ağbal</strong></p>
      </footer>
    </div>
  );
}

const KpiCard = ({ title, value, color, icon, trend }) => (
  <div className="kpi-card-new">
    <div className="kpi-icon-wrap" style={{color}}>{icon}</div>
    <div className="kpi-body">
      <span className="kpi-label">{title}</span>
      <div className="kpi-val-row">
        <h3>{value}</h3>
        <span className={`kpi-trend ${trend.includes('+') ? 'up' : 'down'}`}>{trend}</span>
      </div>
    </div>
  </div>
);

export default App;
