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
            {/* AI STRATEJİ KARTI */}
            <section className="ai-insight-card">
              <div className="ai-content">
                <div className="ai-header">
                  <span className="ai-sparkle">✨</span>
                  <h3>AI Strateji Merkezi</h3>
                  <span className="ai-status">Veri Analiz Edildi</span>
                </div>
                <p className="ai-text">
                  "Sayın Volkan, e-ticaret trendleriniz <strong>pozitif ivmede</strong>. {data?.categories[0]?.name} grubundaki artış, gelecek ay cironuzu %12 oranında yukarı çekebilir."
                </p>
                <div className="ai-tags">
                  <div className="ai-tag">🚀 Tahmin: ₺145k+</div>
                  <div className="ai-tag">📉 Risk: Düşük</div>
                  <div className="ai-tag">🎯 Öneri: Stok Artırımı</div>
                </div>
              </div>
            </section>

            {/* BAŞLIK */}
            <header className="main-header">
              <div className="brand">
                <h1>Operasyonel <span>Rapor</span></h1>
                <p>İşletmenizin 24 saatlik verileri işlendi.</p>
              </div>
              <div className="system-status">
                <span className="dot"></span> <span className="status-text">Sistem Aktif</span>
              </div>
            </header>

            {/* KPI GRID */}
            <section className="kpi-grid">
              <KpiCard title="Toplam Gelir" value={`₺${data?.kpis?.total_revenue?.toLocaleString('tr-TR')}`} color="#6366f1" icon="💰" />
              <KpiCard title="Sipariş Sayısı" value={data?.kpis?.total_orders} color="#10b981" icon="📦" />
              <KpiCard title="Aktif Müşteri" value={data?.kpis?.unique_customers} color="#f59e0b" icon="👥" />
              <KpiCard title="Sepet Ort. (AOV)" value={`₺${data?.kpis?.aov}`} color="#8b5cf6" icon="📊" />
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
                      <Tooltip contentStyle={{borderRadius: '15px', border: 'none'}} />
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
                      <Pie data={data?.categories} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="50%" outerRadius="80%" paddingAngle={8}>
                        {data?.categories?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            {/* DETAYLI ANALİZ */}
            <section className="charts-detail-row">
              <div className="glass-card">
                <h3>En Çok Satan 5 Ürün</h3>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.top_products} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} style={{fontSize: '11px'}} />
                      <Bar dataKey="value" fill="#6366f1" radius={[0, 10, 10, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-card table-card">
                <h3>Son 10 Sipariş</h3>
                <div className="table-wrapper">
                  <table className="modern-table">
                    <thead>
                      <tr><th>Müşteri</th><th className="hide-mobile">Ürün</th><th className="text-right">Tutar</th></tr>
                    </thead>
                    <tbody>
                      {data?.recent?.map((order, i) => (
                        <tr key={i}>
                          <td className="customer-cell">{order.customer}</td>
                          <td className="product-cell hide-mobile">{order.product}</td>
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

        {activeTab === 'about' && (
          <section className="info-page">
            <div className="glass-card">
              <h2>InsightFlow v1.2 Hakkında</h2>
              <p>Volkan Ağbal tarafından geliştirilen KDS v1.2, yapay zeka entegrasyonu ile e-ticaret analizlerini bir üst seviyeye taşıyor.</p>
              <div className="info-grid">
                <div className="info-box"><h4>Sürüm</h4><p>v1.2 (Stabil)</p></div>
                <div className="info-box"><h4>Geliştirici</h4><p>Volkan Ağbal</p></div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'contact' && (
          <section className="info-page">
            <div className="glass-card">
              <h2>İletişim Kanalı</h2>
              <p>Bizimle her türlü soru ve teknik destek için iletişime geçebilirsiniz.</p>
              <div className="contact-details">
                <p>📧 info@insightflowkds.com.tr</p>
                <p>🌐 insightflowkds.com.tr</p>
              </div>
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer className="dashboard-footer">
          <div className="footer-content">
             <p className="v-label">InsightFlow Karar Destek Sistemi v1.2</p>
             <div className="protection-stamp">
                <span className="shield-icon">🛡️</span>
                <span>System Secured & <strong>Protected by Volkan Ağbal</strong></span>
             </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

const KpiCard = ({ title, value, color, icon }) => (
  <div className="kpi-card" style={{ borderTop: `4px solid ${color}` }}>
    <div className="card-icon" style={{ backgroundColor: `${color}15`, color: color }}>{icon}</div>
    <div className="card-content">
      <span className="card-label">{title}</span>
      <h2 className="card-value">{value}</h2>
    </div>
  </div>
);

export default App;
