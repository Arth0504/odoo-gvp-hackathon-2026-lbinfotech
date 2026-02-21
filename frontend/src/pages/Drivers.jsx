import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StatusPill from '../components/StatusPill';
import { useAuth } from '../context/AuthContext';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPerfModalOpen, setIsPerfModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [perfData, setPerfData] = useState(null);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    licenseNumber: '',
    licenseExpiry: '',
    category: 'Truck'
  });

  const fetchDrivers = async () => {
    try {
      const res = await axios.get('/api/drivers');
      setDrivers(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching drivers:", err);
      setLoading(false);
    }
  };

  const fetchPerformance = async (driver) => {
    try {
      setSelectedDriver(driver);
      setIsPerfModalOpen(true);
      setPerfData(null);
      const res = await axios.get(`/api/drivers/${driver._id}/performance`);
      setPerfData(res.data);
    } catch (err) {
      console.error("Error fetching performance:", err);
    }
  };

  const handleRestrict = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Suspended' ? 'Available' : 'Suspended';
      await axios.put(`/api/drivers/${id}`, { status: newStatus });
      fetchDrivers();
    } catch (err) {
      alert("Action failed. Check permissions.");
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/drivers', formData);
      setIsAddModalOpen(false);
      setFormData({ name: '', licenseNumber: '', licenseExpiry: '', category: 'Truck' });
      fetchDrivers();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding driver. Check permissions.");
    }
  };

  if (loading) return <div className="p-8 text-gray-400 animate-pulse text-center">Initializing Fleet Personnel Data...</div>;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Driver Registry</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-gray-500 text-sm font-medium">Compliance Monitoring Active</p>
          </div>
        </div>

        {(user?.role === 'safety' || user?.role === 'manager') && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition active:scale-95"
          >
            + Add Personnel
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Identity</th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Compliance (LICENSE)</th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Safety Rating</th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Duty Status</th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Operational Controls</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {drivers.map((driver) => (
              <tr key={driver._id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="p-6 border-transparent border-l-4 group-hover:border-indigo-500 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100 uppercase">
                      {driver.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{driver.name}</p>
                      <p className="text-xs text-gray-400 font-medium">{driver.category}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <div className={`font-mono text-sm font-bold ${new Date(driver.licenseExpiry) < new Date() ? 'text-red-600' : 'text-gray-700'}`}>{driver.licenseNumber}</div>
                  <div className={`text-xs mt-0.5 font-bold ${new Date(driver.licenseExpiry) < new Date() ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}>
                    {new Date(driver.licenseExpiry) < new Date() ? 'EXPIRED: ' : 'Expires: '}
                    {new Date(driver.licenseExpiry).toLocaleDateString()}
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${driver.safetyScore >= 90 ? 'bg-emerald-500' : driver.safetyScore >= 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${driver.safetyScore}%` }}></div>
                    </div>
                    <span className={`text-[10px] font-black uppercase ${driver.safetyScore >= 90 ? 'text-emerald-600' : driver.safetyScore >= 70 ? 'text-amber-600' : 'text-red-600'}`}>
                      {driver.safetyScore >= 90 ? 'Elite' : driver.safetyScore >= 70 ? 'Standard' : 'High Risk'}
                    </span>
                  </div>
                </td>
                <td className="p-6 text-center">
                  <StatusPill status={driver.status} />
                </td>
                <td className="p-6">
                  <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => fetchPerformance(driver)}
                      className="px-3 py-1.5 bg-white border border-gray-200 text-[11px] font-bold text-gray-600 rounded-lg hover:border-indigo-600 hover:text-indigo-600 transition"
                    >
                      Compliance Audit
                    </button>
                    {(user?.role === 'safety' || user?.role === 'manager') && (
                      <button
                        onClick={() => handleRestrict(driver._id, driver.status)}
                        className={`px-3 py-1.5 border text-[11px] font-bold rounded-lg transition ${driver.status === 'Suspended'
                          ? 'bg-green-50 border-green-200 text-green-600 hover:bg-green-100'
                          : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                          }`}
                      >
                        {driver.status === 'Suspended' ? 'Activate' : 'Restrict'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Performance Modal */}
      {isPerfModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 bg-indigo-600 text-white relative">
              <button onClick={() => setIsPerfModalOpen(false)} className="absolute top-6 right-6 text-white/60 hover:text-white transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <h2 className="text-2xl font-black">Personnel Performance</h2>
              <p className="text-indigo-100 mt-1 uppercase text-xs font-bold tracking-widest">{selectedDriver?.name} • COMPLIANCE ID: {selectedDriver?.licenseNumber}</p>
            </div>

            <div className="p-8">
              {!perfData ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-20 bg-gray-50 rounded-2xl"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-gray-50 rounded-2xl"></div>
                    <div className="h-20 bg-gray-50 rounded-2xl"></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Completion Efficiency</p>
                      <p className="text-4xl font-black text-gray-900 mt-1">{perfData.completionRate}</p>
                    </div>
                    <div className="w-16 h-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin-slow"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Completed Trips</p>
                      <p className="text-2xl font-black text-green-600 mt-1">{perfData.completedTrips}</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cancellation Rate</p>
                      <p className="text-2xl font-black text-red-600 mt-1">{perfData.cancelledTrips}</p>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-4">
                    <button
                      onClick={() => setIsPerfModalOpen(false)}
                      className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition shadow-xl shadow-gray-200"
                    >
                      Certify Audit
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-black text-gray-900">Personnel Registration</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Full Name</label>
                <input required className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium" placeholder="E.g. Vikram Sharma" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">License Path</label>
                  <input required className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium" placeholder="LIC-9901" value={formData.licenseNumber} onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Certification</label>
                  <select className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold appearance-none" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                    <option>Truck</option>
                    <option>Van</option>
                    <option>Hazardous</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Certification Expiry</label>
                <input required type="date" className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold" value={formData.licenseExpiry} onChange={e => setFormData({ ...formData, licenseExpiry: e.target.value })} />
              </div>
              <div className="flex gap-4 pt-6">
                <button type="submit" className="flex-1 bg-indigo-600 text-white rounded-2xl py-4 font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition active:scale-95">Register Personnel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drivers;