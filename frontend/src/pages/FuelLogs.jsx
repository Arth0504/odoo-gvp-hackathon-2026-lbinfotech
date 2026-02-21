import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const FuelLogs = () => {
    const [logs, setLogs] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ vehicle: '', liters: '', cost: '', date: new Date().toISOString().split('T')[0] });
    const { user } = useAuth();

    const fetchData = async () => {
        try {
            const [lRes, vRes] = await Promise.all([
                axios.get('/api/fuel'),
                axios.get('/api/vehicles')
            ]);
            setLogs(lRes.data);
            setVehicles(vRes.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/fuel', formData);
            setIsModalOpen(false);
            setFormData({ vehicle: '', liters: '', cost: '', date: new Date().toISOString().split('T')[0] });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || "Error logging fuel");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Fuel Consumption</h1>
                    <p className="text-gray-500 mt-1">Monitor energy spend and efficiency</p>
                </div>
                {(user?.role === 'finance' || user?.role === 'manager') && (
                    <button onClick={() => setIsModalOpen(true)} className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-orange-100 transition">
                        + Record Fuel Entry
                    </button>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left font-medium">
                    <thead className="bg-orange-50/50 border-b">
                        <tr>
                            <th className="p-5 text-sm font-bold text-orange-900 uppercase tracking-wider">Asset</th>
                            <th className="p-5 text-sm font-bold text-orange-900 uppercase tracking-wider">Volume (L)</th>
                            <th className="p-5 text-sm font-bold text-orange-900 uppercase tracking-wider">Total Cost</th>
                            <th className="p-5 text-sm font-bold text-orange-900 uppercase tracking-wider">Date</th>
                            <th className="p-5 text-sm font-bold text-orange-900 uppercase tracking-wider text-right">L/km Est.</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 uppercase text-xs">
                        {logs.map((l) => (
                            <tr key={l._id} className="hover:bg-gray-50/50 transition duration-200">
                                <td className="p-5 font-black text-gray-900">
                                    {l.vehicle?.name}
                                    <span className="block text-[10px] text-gray-400 font-bold">{l.vehicle?.licensePlate}</span>
                                </td>
                                <td className="p-5 text-gray-600">{l.liters} L</td>
                                <td className="p-5 font-black text-emerald-600">₹{l.cost.toLocaleString()}</td>
                                <td className="p-5 text-gray-400 font-bold">{new Date(l.date).toLocaleDateString()}</td>
                                <td className="p-5 text-right">
                                    <span className="px-2 py-1 bg-gray-100 rounded-md text-gray-500">{(l.cost / l.liters).toFixed(2)} /L</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-orange-100">
                        <div className="p-8 border-b bg-orange-50/30">
                            <h2 className="text-2xl font-black text-orange-900 uppercase italic tracking-tighter">New Fuel Entry</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-5">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Select Vehicle Asset</label>
                                <select required className="w-full px-4 py-4 rounded-2xl border-2 border-gray-100 bg-white font-bold text-gray-900 focus:border-orange-500 outline-none transition" value={formData.vehicle} onChange={e => setFormData({ ...formData, vehicle: e.target.value })}>
                                    <option value="">Choose Asset</option>
                                    {vehicles.map(v => <option key={v._id} value={v._id}>{v.name} ({v.licensePlate})</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Liters Pumped</label>
                                    <input required type="number" step="0.01" className="w-full px-4 py-4 rounded-2xl border-2 border-gray-100 font-bold focus:border-orange-500 outline-none transition" placeholder="45.5" value={formData.liters} onChange={e => setFormData({ ...formData, liters: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Amount (₹)</label>
                                    <input required type="number" className="w-full px-4 py-4 rounded-2xl border-2 border-gray-100 font-bold focus:border-orange-500 outline-none transition" placeholder="4500" value={formData.cost} onChange={e => setFormData({ ...formData, cost: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Transaction Date</label>
                                <input required type="date" className="w-full px-4 py-4 rounded-2xl border-2 border-gray-100 font-bold focus:border-orange-500 outline-none transition" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition">Discard</button>
                                <button type="submit" className="flex-1 bg-orange-600 text-white rounded-2xl py-4 text-xs font-black uppercase tracking-widest shadow-xl shadow-orange-200 hover:bg-orange-500 transition">Submit Record</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FuelLogs;
