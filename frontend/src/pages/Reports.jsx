import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get('/api/analytics/fleet');
        setData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Report fetch error", err);
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <div className="p-12 text-center text-gray-400 animate-pulse font-black uppercase tracking-widest">Compiling Financial Ledger...</div>;

  const stats = [
    { label: "Gross Revenue", value: `₹${(data?.totalRevenue || 0).toLocaleString()}`, color: "emerald", desc: "Sum of all completed trips" },
    { label: "Fuel Spend", value: `₹${(data?.totalFuelCost || 0).toLocaleString()}`, color: "orange", desc: "Total fuel transaction costs" },
    { label: "Maintenance", value: `₹${(data?.totalMaintenanceCost || 0).toLocaleString()}`, color: "red", desc: "Aggregate service invoice costs" },
    { label: "Net Operating Income", value: `₹${(data?.netProfit || 0).toLocaleString()}`, color: "indigo", desc: "Revenue - (Fuel + Maintenance)" },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Header Area */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase">Fiscal Intelligence</h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mt-2">Fleet-Wide Economics & Performance Audit</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition shadow-sm">
            Export Raw CSV
          </button>
          <button className="px-6 py-3 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition shadow-xl shadow-gray-200 italic">
            Generate PDF Audit
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-50 group hover:shadow-xl hover:shadow-gray-100 transition-all duration-500 overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${s.color}-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700`}></div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{s.label}</p>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight italic">{s.value}</h3>
            <p className="text-[8px] text-gray-300 mt-2 font-bold uppercase tracking-wider">{s.desc}</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Live Audit Stream</span>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Analytics Placeholder Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-sm border border-gray-50">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-black italic uppercase tracking-tighter">Performance Trajectory</h2>
            <div className="flex gap-2">
              {['6M', '1Y', 'ALL'].map(t => (
                <button key={t} className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-[10px] font-black hover:bg-gray-900 hover:text-white transition">{t}</button>
              ))}
            </div>
          </div>

          <div className="h-64 flex items-end gap-4 px-4 overflow-hidden">
            {data?.monthlyData?.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3">
                <div className="w-full flex flex-col gap-1 justify-end h-full">
                  <div className="w-full bg-indigo-500 rounded-lg group relative cursor-pointer" style={{ height: `${(m.revenue / data.totalRevenue) * 100}%` }}>
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition tracking-widest italic">₹{Math.round(m.revenue)}</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-lg" style={{ height: `${(m.expenses / data.totalRevenue) * 100}%` }}></div>
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{m.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-gray-50 flex gap-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-500 rounded-sm"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gross Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-200 rounded-sm"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Operating Costs</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <h2 className="text-xl font-black text-white italic uppercase tracking-tighter mb-8">Asset Efficiency</h2>

          <div className="space-y-8 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Fleet Return on Investment</p>
                <p className="text-3xl font-black text-white italic">{data?.roi}%</p>
                <p className="text-[8px] text-indigo-300/50 mt-1 uppercase font-bold tracking-wider">Formula: (Revenue - Expenses) / Asset Value</p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 flex items-center justify-center">
                <span className="text-[10px] font-black text-indigo-400 italic">ROI</span>
              </div>
            </div>

            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 text-center">Fuel Consumption Intensity</p>
              <div className="flex justify-between items-end h-12 gap-1 px-4">
                {[3, 5, 2, 8, 4, 6, 3, 7].map((h, i) => (
                  <div key={i} className="flex-1 bg-white/20 rounded-full" style={{ height: `${h * 10}%` }}></div>
                ))}
              </div>
            </div>

            <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition shadow-xl shadow-indigo-500/20 italic">
              Optimize Fuel Strategy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;