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
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
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
  }, []);

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <h2>🚀 InsightFlow v1.2 Yükleniyor...</h2>
    </div>
  );

  return (
    <div className="App">
      {/* ÜST NAVİGASYON */}
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
            <button className="login-btn">Giriş Yap</button>
          </div>
        </div>
      </nav>

      <div className="dashboard-container">
        {activeTab === 'dashboard' && (
          <>
            {/* CANLI AI ANALİZ KARTI */}
            <section className="ai-insight-card">
              <div className="ai-header">
                <div className="ai-pulse-dot"></div>
                <span className="ai-status">CANLI AI ANALİZİ</span>
              </div>
              <h2 className="ai-text">
                "{data?.ai_live_msg || `Sayın Volkan, satış trendleriniz pozitif ivmede. ${data?.categories?.[0]?.name || 'Ana'} grubundaki artış cironuzu yukarı çekebilir.`}"
              </h2>
              <div className="ai-tags">
                <div className="ai-tag">🚀 Tahmin: ₺{(data?.kpis?.total_revenue * 1.12).toLocaleString('tr-TR', {maximumFractionDigits: 0})}+</div>
                <div className="ai-tag">📉 Risk: Düşük</div>
                <div className="ai-tag">🎯 Öneri: Stok Artırımı</div>
              </div>
            </section>

            {/* BAŞLIK */}
            <header className="main-header">
              <div className="brand">
                <h1>Operasyonel <span>Rapor</span></h1>
                <p>Hoş geldin Volkan, işletmen için en güncel veriler hazır.</p>
              </div>
              <div className="system-status">
                <span className="dot"></span> <span className="status-text">Sistem Aktif</span>
              </div>
            </header>

            {/* KPI GRID */}
            <section className="kpi-grid">
              <KpiCard title="Toplam Gelir" value={`₺${data?.kpis?.total_revenue?.toLocaleString('tr-TR')}`} color="#6366f1" icon="💰" />
              <KpiCard title="Sipariş Sayısı" value={data?.kpis?.total_orders?.toLocaleString('tr-TR')} color="#10b981" icon="📦" />
              <KpiCard title="Aktif Müşteri" value={data?.kpis?.unique_customers?.toLocaleString('tr-TR')} color="#f59e0b" icon="👥" />
              <KpiCard title="Ort. Sepet (AOV)" value={`₺${data?.kpis?.aov?.toLocaleString('tr-TR')}`} color="#8b5cf6" icon="📊" />
            </section>

            {/* GRAFİKLER */}
            <section className="charts-main-row">
              <div className="glass-card main-chart">
                <h3>Aylık Satış Trendi</h3>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data?.trend}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                      <YAxis hide />
                      <Tooltip contentStyle={{borderRadius: '15px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)'}} />
                      <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={4} dot={{ r: 4, fill: '#6366f1', stroke: '#fff' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-card side-chart">
                <h3>Kategori Dağılımı</h3>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data?.categories} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="55%" outerRadius="80%" paddingAngle={8}>
                        {data?.categories?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '12px'}} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            {/* DETAYLI TABLO VE BAR */}
            <section className="charts-detail-row">
              <div className="glass-card">
                <h3>En Çok Satan Ürünler</h3>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.top_products} layout="vertical" margin={{left: 0, right: 30}}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={90} style={{fontSize: '11px', fontWeight: '600'}} />
                      <Bar dataKey="value" fill="#6366f1" radius={[0, 10, 10, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-card table-card">
                <h3>Son İşlemler</h3>
                <div className="table-wrapper">
                  <table className="modern-table">
                    <thead>
                      <tr>
                        <th>Müşteri</th>
                        <th className="hide-mobile">Ürün</th>
                        <th className="text-right">Tutar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.recent?.map((order, i) => (
                        <tr key={i}>
                          <td><strong>{order.customer}</strong></td>
                          <td className="hide-mobile">{order.product}</td>
                          <td className="text-right amount-cell">₺{order.amount.toLocaleString('tr-TR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </>
        )}

        {/* KURUMSAL SAYFASI */}
        {activeTab === 'about' && (
          <section className="info-page">
            <div className="glass-card">
              <h2>InsightFlow v1.2</h2>
              <p>Yapay zeka destekli yeni nesil karar destek mekanizması.</p>
              <div className="info-grid">
                <div className="info-box"><h4>Sistem Durumu</h4><p>Stabil / v1.2</p></div>
                <div className="info-box"><h4>Geliştirici</h4><p>Volkan Ağbal</p></div>
              </div>
            </div>
          </section>
        )}

        {/* İLETİŞİM SAYFASI */}
        {activeTab === 'contact' && (
          <section className="info-page">
            <div className="glass-card">
              <h2>Teknik Destek</h2>
              <p>Sistem yönetimi ve veri entegrasyonu sorularınız için:</p>
              <div className="contact-details">
                <p>📧 <strong>info@insightflowkds.com.tr</strong></p>
                <p>📍 İstanbul / Türkiye</p>
              </div>
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer className="dashboard-footer">
          <div className="footer-content">
             <div className="protection-stamp">
                <span className="shield-icon">🛡️</span>
                <span>System Secured & <strong>Protected by Volkan Ağbal</strong></span>
             </div>
             <p className="v-label">InsightFlow KDS v1.2 © 2025</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

// YARDIMCI BİLEŞEN
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
