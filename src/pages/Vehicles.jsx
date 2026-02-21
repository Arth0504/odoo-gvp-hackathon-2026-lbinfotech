import React, { useEffect, useState } from 'react'
import axios from 'axios'
import StatusPill from '../components/StatusPill'

const Vehicles = () => {

  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/vehicles')
        setVehicles(response.data)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch vehicles")
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [])

  return (
    <div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Vehicle Registry
        </h1>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          + Add Vehicle
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-gray-500">Loading vehicles...</div>
      )}

      {/* Error */}
      {error && (
        <div className="text-red-500">{error}</div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

          <table className="w-full text-left">

            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-600">Name</th>
                <th className="p-4 text-sm font-semibold text-gray-600">License Plate</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Capacity (kg)</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Odometer</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>

            <tbody>
              {vehicles.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-500">
                    No vehicles found
                  </td>
                </tr>
              ) : (
                vehicles.map((vehicle) => (
                  <tr key={vehicle._id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-4">{vehicle.name}</td>
                    <td className="p-4">{vehicle.plate}</td>
                    <td className="p-4">{vehicle.capacity}</td>
                    <td className="p-4">{vehicle.odometer} km</td>
                    <td className="p-4">
                      <StatusPill status={vehicle.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>

        </div>
      )}

    </div>
  )
}

export default Vehicles