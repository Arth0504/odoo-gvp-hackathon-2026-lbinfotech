import React from 'react'

const StatusPill = ({ status }) => {

  const statusStyles = {
    // Vehicle
    Available: "bg-green-100 text-green-700",
    "On Trip": "bg-blue-100 text-blue-700",
    "In Shop": "bg-yellow-100 text-yellow-700",
    Retired: "bg-gray-200 text-gray-700",

    // Trip
    Draft: "bg-gray-100 text-gray-700",
    Dispatched: "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",

    // Driver
    "On Duty": "bg-green-100 text-green-700",
    "Off Duty": "bg-yellow-100 text-yellow-700",
    Suspended: "bg-red-100 text-red-700",

    // Maintenance
    Open: "bg-yellow-100 text-yellow-700",
    Closed: "bg-green-100 text-green-700",
  }

  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}
    >
      {status}
    </span>
  )
}

export default StatusPill