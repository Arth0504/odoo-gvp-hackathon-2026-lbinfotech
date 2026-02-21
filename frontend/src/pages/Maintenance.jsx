import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StatusPill from '../components/StatusPill';
import { useAuth } from '../context/AuthContext';

const Maintenance = () => {
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    vehicle: '',
    serviceType: 'Routine Inspection',
    cost: '',
    notes: ''
  });

  const fetchData = async () => {
    try {
      const [logsRes, vehiclesRes] = await Promise.all([
        axios.get('/api/maintenance'),
        axios.get('/api/vehicles')
      ]);
      setLogs(logsRes.data);
      // Only suggest Available vehicles for service
      setVehicles(vehiclesRes.data.filter(v => v.status === 'Available'));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/maintenance', formData);
      setIsModalOpen(false);
      setFormData({ vehicle: '', serviceType: 'Routine Inspection', cost: '', notes: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error logging service.");
    }
  };

  const handleComplete = async (id) => {
    try {
      await axios.put(`/api/maintenance/${id}/complete`);
      fetchData();
    } catch (err) {
      alert("Failed to complete maintenance.");
    }
  };

  if (loading) return <div className="p-8 text-gray-400 animate-pulse text-center">Diagnostics in Progress...</div>;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] shadow-sm border border-gray-50 overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase">Fleet Health Registry</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
            <p className="text-gray-500 text-xs font-black uppercase tracking-widest">Live Diagnostic Stream</p>
          </div>
        </div>

        {user?.role === 'manager' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-gray-200 hover:bg-gray-800 transition active:scale-95 uppercase tracking-widest text-xs italic"
          >
            + Log Asset Service
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Asset Identification</th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Service Protocol</th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Financial Impact</th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Current Phase</th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Operational Overrides</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {logs.map((log) => (
              <tr key={log._id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white font-black text-sm">
                      {log.vehicle?.registrationNumber?.slice(-2) || "!!"}
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-sm uppercase italic">{log.vehicle?.registrationNumber}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{log.vehicle?.name}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6 font-bold text-gray-700 text-sm">{log.serviceType}</td>
                <td className="p-6 font-black text-indigo-600 text-sm italic">₹ {log.cost.toLocaleString()}</td>
                <td className="p-6 text-center">
                  <StatusPill status={log.status || (log.vehicle?.status === 'InShop' ? 'Open' : 'Closed')} />
                </td>
                <td className="p-6 text-right">
                  {log.status !== 'Closed' && (
                    <button
                      onClick={() => handleComplete(log._id)}
                      className="px-4 py-2 bg-green-50 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-100 transition shadow-sm border border-green-100 active:scale-95"
                    >
                      Verify & Close
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 bg-gray-900 text-white relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-white/40 hover:text-white transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter">Initiate Service Protocol</h2>
              <p className="text-gray-400 mt-1 uppercase text-[10px] font-black tracking-widest">Asset will be flagged "InShop" upon submission</p>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Target Asset (Available Only)</label>
                <select
                  required
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-gray-900/5 focus:border-gray-900 transition-all outline-none font-bold appearance-none uppercase text-xs"
                  value={formData.vehicle}
                  onChange={e => setFormData({ ...formData, vehicle: e.target.value })}
                >
                  <option value="">Select Asset</option>
                  {vehicles.map(v => (
                    <option key={v._id} value={v._id}>{v.registrationNumber} - {v.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Service Type</label>
                  <input required className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white transition-all outline-none font-bold text-xs" value={formData.serviceType} onChange={e => setFormData({ ...formData, serviceType: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Estimated Cost (₹)</label>
                  <input required type="number" className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white transition-all outline-none font-black text-xs italic" value={formData.cost} onChange={e => setFormData({ ...formData, cost: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Maintenance Notes</label>
                <textarea className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white transition-all outline-none font-medium text-xs min-h-[100px]" placeholder="Specific technical details..." value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })}></textarea>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-gray-900 text-white rounded-[1.5rem] py-5 font-black shadow-2xl shadow-gray-200 hover:bg-gray-800 transition active:scale-95 uppercase tracking-widest text-xs italic">Confirm & Flag Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;