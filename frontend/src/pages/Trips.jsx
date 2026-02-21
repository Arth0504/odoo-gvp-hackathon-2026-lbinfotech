import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StatusPill from '../components/StatusPill';

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    vehicle: '',
    driver: '',
    cargoWeight: '',
    origin: '',
    destination: ''
  });

  const fetchData = async () => {
    try {
      const [tRes, vRes, dRes] = await Promise.all([
        axios.get('/api/trips'),
        axios.get('/api/vehicles'),
        axios.get('/api/drivers')
      ]);
      console.log("Vehicles fetched:", vRes.data.length);
      console.log("Drivers fetched:", dRes.data.length);
      setTrips(tRes.data);
      setVehicles(vRes.data.filter(v => v.status === 'Available'));
      setDrivers(dRes.data.filter(d => d.status === 'Available'));
      setLoading(false);
    } catch (err) {
      console.error("Fetch error", err);
      setError("Network Error: Could not reach the fleet services.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/trips', formData);
      setIsModalOpen(false);
      setFormData({ vehicle: '', driver: '', cargoWeight: '', origin: '', destination: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Validation Error");
    }
  };

  const updateStatus = async (id, action) => {
    let data = {};

    if (action === 'complete') {
      const odo = window.prompt("Enter End Odometer Reading:");
      if (odo === null) return; // User cancelled
      data.endOdometer = Number(odo);
    }

    try {
      await axios.put(`/api/trips/${id}/${action}`, data);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error processing action");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trip Dispatcher</h1>
          <p className="text-gray-500 mt-1">Plan and execute logistics workflows</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-100 transition"
        >
          + Plan New Trip
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-5 text-sm font-semibold text-gray-600">Vehicle / Driver</th>
              <th className="p-5 text-sm font-semibold text-gray-600">Route</th>
              <th className="p-5 text-sm font-semibold text-gray-600">Cargo</th>
              <th className="p-5 text-sm font-semibold text-gray-600">Status</th>
              <th className="p-5 text-sm font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {trips.map((t) => (
              <tr key={t._id} className="hover:bg-gray-50/50 transition">
                <td className="p-5">
                  <div className="font-medium text-gray-900">{t.vehicle?.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{t.driver?.name}</div>
                </td>
                <td className="p-5 text-sm text-gray-600">
                  {t.origin} <span className="mx-2 text-gray-300">→</span> {t.destination}
                </td>
                <td className="p-5 text-sm font-semibold text-gray-600">{t.cargoWeight} kg</td>
                <td className="p-5"><StatusPill status={t.status} /></td>
                <td className="p-5 text-right space-x-2">
                  {t.status === 'Draft' && (
                    <button onClick={() => updateStatus(t._id, 'dispatch')} className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg border border-indigo-100">Dispatch</button>
                  )}
                  {t.status === 'Dispatched' && (
                    <button onClick={() => updateStatus(t._id, 'complete')} className="text-xs font-bold bg-green-50 text-green-600 px-3 py-1.5 rounded-lg border border-green-100">Complete</button>
                  )}
                  {(t.status === 'Draft' || t.status === 'Dispatched') && (
                    <button onClick={() => updateStatus(t._id, 'cancel')} className="text-xs font-bold text-gray-400 hover:text-red-500 transition">Cancel</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b bg-indigo-50/30">
              <h2 className="text-2xl font-bold text-indigo-900">Plan Logistic Workflow</h2>
            </div>
            <form onSubmit={handleCreate} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Available Vehicle</label>
                    <select required name="vehicle" className="w-full px-4 py-3 rounded-xl border bg-white" value={formData.vehicle} onChange={e => setFormData({ ...formData, vehicle: e.target.value })}>
                      <option value="">Select Asset</option>
                      {vehicles.map(v => <option key={v._id} value={v._id}>{v.name} ({v.maxCapacity}kg)</option>)}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Available Driver</label>
                    <select required name="driver" className="w-full px-4 py-3 rounded-xl border bg-white" value={formData.driver} onChange={e => setFormData({ ...formData, driver: e.target.value })}>
                      <option value="">Select Driver</option>
                      {drivers.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cargo Weight (kg)</label>
                  <input required type="number" className="w-full px-4 py-3 rounded-xl border" placeholder="5000" value={formData.cargoWeight} onChange={e => setFormData({ ...formData, cargoWeight: e.target.value })} />
                </div>
                <div className="col-span-2 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Origin</label>
                    <input required className="w-full px-4 py-3 rounded-xl border" placeholder="Surat" value={formData.origin} onChange={e => setFormData({ ...formData, origin: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                    <input required className="w-full px-4 py-3 rounded-xl border" placeholder="Mumbai" value={formData.destination} onChange={e => setFormData({ ...formData, destination: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-gray-600 font-semibold">Discard</button>
                <button type="submit" className="flex-1 bg-indigo-600 text-white rounded-xl py-3 font-bold shadow-lg shadow-indigo-200">Save Draft</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trips;