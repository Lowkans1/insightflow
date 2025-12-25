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
      <h2>📊 InsightFlow Hazırlanıyor...</h2>
      <p>Veritabanı bağlantısı kuruluyor...</p>
    </div>
  );

  return (
    <div className="App">
      <div className="dashboard-container">
        
        {/* Modern Başlık ve SOL ÜST LOGO */}
        <header className="main-header">
          <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* LOGO BURAYA EKLENDİ - Dosya adın logo192.png (veya .jpg) ise kontrol et kanki */}
            <img 
              src="/logo192.png" 
              alt="InsightFlow Logo" 
              style={{ width: '50px', height: '50px', borderRadius: '12px', objectFit: 'cover' }} 
            />
            <div>
              <h1>InsightFlow <span>KDS</span></h1>
              <p>E-Ticaret Karar Destek Sistemi</p>
            </div>
          </div>
          <div className="system-status">
            <span className="dot"></span> <span className="status-text">Sistem Çevrimiçi</span>
          </div>
        </header>

        {/* 1. SATIR: KPI Kartları */}
        <section className="kpi-grid">
          <KpiCard title="Toplam Gelir" value={`₺${data?.kpis?.total_revenue?.toLocaleString('tr-TR')}`} color="#6366f1" icon="💰" />
          <KpiCard title="Sipariş Sayısı" value={data?.kpis?.total_orders?.toLocaleString('tr-TR')} color="#10b981" icon="📦" />
          <KpiCard title="Aktif Müşteri" value={data?.kpis?.unique_customers?.toLocaleString('tr-TR')} color="#f59e0b" icon="👥" />
          <KpiCard title="Ort. Sepet (AOV)" value={`₺${data?.kpis?.aov?.toLocaleString('tr-TR', { minimumFractionDigits: 0 })}`} color="#8b5cf6" icon="📊" />
        </section>

        {/* 2. SATIR: Ana Grafikler */}
        <section className="charts-main-row">
          <div className="glass-card main-chart">
            <h3>Aylık Satış Trendi</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.trend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <YAxis hide />
                  <Tooltip 
                    formatter={(value) => [`₺${value.toLocaleString('tr-TR')}`, 'Gelir']}
                    contentStyle={{borderRadius: '15px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)'}} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#6366f1" 
                    strokeWidth={4} 
                    dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} 
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card side-chart">
            <h3>Kategori Dağılımı</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={data?.categories} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" cy="50%" 
                    innerRadius="50%" 
                    outerRadius="80%" 
                    paddingAngle={8}
                  >
                    {data?.categories?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Sipariş Sayısı']} />
                  <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{fontSize: '12px'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* 3. SATIR: Detaylı Analiz */}
        <section className="charts-detail-row">
          <div className="glass-card">
            <h3>En Çok Satan 5 Ürün</h3>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.top_products} layout="vertical" margin={{left: 0, right: 20}}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} style={{fontSize: '11px', fontWeight: '500'}} width={80} />
                  <Tooltip cursor={{fill: 'transparent'}} formatter={(value) => [value, 'Satış Adedi']} />
                  <Bar dataKey="value" fill="#6366f1" radius={[0, 10, 10, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card table-card">
            <h3>Son 10 Sipariş</h3>
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

        {/* PROTECTED BY İMZASI GERİ GELDİ */}
        <footer className="dashboard-footer">
          <div className="footer-content">
             <p className="footer-text">v1.0 | {data?.kpis?.total_orders} İşlem İncelendi</p>
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
