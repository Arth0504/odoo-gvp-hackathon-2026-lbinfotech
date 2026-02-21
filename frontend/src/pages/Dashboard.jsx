import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">Syncing Fleet Intelligence...</p>
      </div>
    );
  }

  // Define role-based KPI configurations
  const getRoleKPIs = () => {
    switch (user?.role) {
      case 'manager':
        return [
          { title: "Active Fleet", value: stats?.activeFleet, sub: "Vehicles currently on trip", color: "blue" },
          { title: "In the Shop", value: stats?.inShop, sub: "Maintenance alerts", color: "red" },
          { title: "Utilization", value: stats?.utilizationRate, sub: "Fleet efficiency", color: "indigo" },
          { title: "Fleet Size", value: stats?.totalVehicles, sub: "Total registered assets", color: "slate" },
        ];
      case 'dispatcher':
        return [
          { title: "Pending Cargo", value: stats?.pendingCargo, sub: "Draft trips awaiting dispatch", color: "amber" },
          { title: "Available Assets", value: stats?.available, sub: "Vehicles ready for assignment", color: "green" },
          { title: "Available Drivers", value: stats?.availableDrivers, sub: "Drivers ready for duty", color: "teal" },
          { title: "Active Fleet", value: stats?.activeFleet, sub: "Currently executing trips", color: "blue" },
        ];
      case 'safety':
        return [
          { title: "Active Drivers", value: stats?.activeDrivers, sub: "Currently on the road", color: "blue" },
          { title: "Compliance Score", value: stats?.complianceScore, sub: "Fleet-wide rating", color: "emerald" },
          { title: "Safety Alerts", value: stats?.safetyAlerts, sub: "Suspended personnel", color: "orange" },
          { title: "Off Duty", value: stats?.totalDrivers - stats?.activeDrivers, sub: "Personnel resting", color: "slate" },
        ];
      case 'finance':
        return [
          { title: "Utilization", value: stats?.utilizationRate, sub: "Asset efficiency rate", color: "indigo" },
          { title: "Total Revenue", value: stats?.totalRevenue, sub: "From completed trips", color: "blue" },
          { title: "Fuel Spend", value: stats?.totalFuelCost, sub: "Lifetime fuel cost", color: "orange" },
          { title: "Net Profit", value: stats?.netProfit, sub: "Revenue minus overhead", color: "green" },
        ];
      default:
        return [];
    }
  };

  const kpis = getRoleKPIs();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-50">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight italic uppercase">Command Center</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100 italic">
              Access Level: {user?.role}
            </div>
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Real-time Stream Online</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Global Utilization</p>
            <p className="text-2xl font-black text-indigo-600 italic">{stats?.utilizationRate}</p>
          </div>
          <button onClick={() => window.location.reload()} className="bg-gray-900 text-white px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition active:scale-95 shadow-xl shadow-gray-200">
            Sync Analytics
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-50 hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${kpi.color}-500/5 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform`}></div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-gray-600 transition-colors">{kpi.title}</p>
            <div className="flex items-end justify-between mt-4 relative z-10">
              <span className={`text-4xl font-black tracking-tighter text-gray-900`}>{kpi.value ?? 0}</span>
              <div className={`p-2 bg-${kpi.color}-50 rounded-xl`}>
                <div className={`w-2 h-2 rounded-full bg-${kpi.color}-500 shadow-[0_0_10px_rgba(0,0,0,0.1)] group-hover:animate-ping`}></div>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 mt-2 font-medium tracking-wide">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Activity area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-50 flex flex-col justify-center items-center overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute top-8 left-8">
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Operational Trajectory</span>
          </div>

          <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-6 transform rotate-3 shadow-inner">
            <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="text-xl font-black text-gray-900 italic uppercase tracking-tight">Active Performance Log</h3>
          <p className="text-sm text-gray-400 mt-3 text-center max-w-sm leading-relaxed font-medium">
            The intelligence engine is aggregating data points from the latest {stats?.activeFleet} active vehicles and {stats?.activeDrivers} personnel on duty.
          </p>
        </div>

        <div className="bg-gray-900 p-10 rounded-[2.5rem] shadow-2xl text-white flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] group-hover:bg-indigo-500/30 transition-all duration-700"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-black italic tracking-tighter uppercase leading-none">Role Toolkit</h3>
            <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mt-3">Priority Protocols for {user?.role}</p>
          </div>

          <div className="space-y-4 mt-12 relative z-10">
            {(user?.role === 'manager' || user?.role === 'dispatcher') && (
              <button className="w-full py-4 px-6 bg-white/5 hover:bg-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all text-left border border-white/5 flex justify-between items-center group/btn active:scale-95">
                Plan Logistic Flow
                <span className="opacity-0 group-hover/btn:opacity-100 translate-x-[-10px] group-hover/btn:translate-x-0 transition-all">→</span>
              </button>
            )}
            {user?.role === 'manager' && (
              <button className="w-full py-4 px-6 bg-white/5 hover:bg-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all text-left border border-white/5 flex justify-between items-center group/btn active:scale-95">
                Asset Lifecycle View
                <span className="opacity-0 group-hover/btn:opacity-100 translate-x-[-10px] group-hover/btn:translate-x-0 transition-all">→</span>
              </button>
            )}
            {user?.role === 'safety' && (
              <button className="w-full py-4 px-6 bg-white/5 hover:bg-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all text-left border border-white/5 flex justify-between items-center group/btn active:scale-95">
                Compliance Audit
                <span className="opacity-0 group-hover/btn:opacity-100 translate-x-[-10px] group-hover/btn:translate-x-0 transition-all">→</span>
              </button>
            )}
            <div className="pt-4">
              <button className="w-full py-5 px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-900/40 active:scale-95 scale-100 italic">
                Generate Role Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;