import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StatusPill from '../components/StatusPill';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', licensePlate: '', maxCapacity: '', odometer: 0 });

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('/api/vehicles');
      setVehicles(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch vehicles");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/vehicles', formData);
      setIsModalOpen(false);
      setFormData({ name: '', licensePlate: '', maxCapacity: '', odometer: 0 });
      fetchVehicles();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating vehicle");
    }
  };

  const toggleRetired = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Retired' ? 'Available' : 'Retired';
    try {
      await axios.put(`http://localhost:5000/api/vehicles/${id}`, { status: newStatus });
      fetchVehicles();
    } catch (err) {
      alert("Error updating status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vehicle Registry</h1>
          <p className="text-gray-500 mt-1">Manage physical assets and lifecycle</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-100 transition"
        >
          + Add New Vehicle
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-5 text-sm font-semibold text-gray-600">Vehicle Details</th>
              <th className="p-5 text-sm font-semibold text-gray-600">Plate ID</th>
              <th className="p-5 text-sm font-semibold text-gray-600">Max Load (kg)</th>
              <th className="p-5 text-sm font-semibold text-gray-600">Mileage</th>
              <th className="p-5 text-sm font-semibold text-gray-600">Status</th>
              <th className="p-5 text-sm font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {vehicles.map((v) => (
              <tr key={v._id} className="hover:bg-gray-50/50 transition">
                <td className="p-5 font-medium text-gray-900">{v.name}</td>
                <td className="p-5 text-gray-600 font-mono text-xs">{v.licensePlate}</td>
                <td className="p-5 text-gray-600">{v.maxCapacity} kg</td>
                <td className="p-5 text-gray-600">{v.odometer.toLocaleString()} km</td>
                <td className="p-5"><StatusPill status={v.status} /></td>
                <td className="p-5 text-right space-x-3">
                  <button
                    onClick={() => toggleRetired(v._id, v.status)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${v.status === 'Retired' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                      }`}
                  >
                    {v.status === 'Retired' ? 'Back to Service' : 'Retire'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b">
              <h2 className="text-2xl font-bold text-gray-800">New Vehicle Asset</h2>
            </div>
            <form onSubmit={handleCreate} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model Name</label>
                  <input required className="w-full px-4 py-3 rounded-xl border" placeholder="e.g. Tata Ultra 1518" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">License Plate</label>
                  <input required className="w-full px-4 py-3 rounded-xl border" placeholder="GJ-01-XX-0000" value={formData.licensePlate} onChange={e => setFormData({ ...formData, licensePlate: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Load (kg)</label>
                  <input required type="number" className="w-full px-4 py-3 rounded-xl border" placeholder="15000" value={formData.maxCapacity} onChange={e => setFormData({ ...formData, maxCapacity: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-gray-600 font-semibold">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white rounded-xl py-3 font-bold shadow-lg shadow-blue-100">Add Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicles;