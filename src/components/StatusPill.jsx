import React from 'react'

const StatusPill = ({ status }) => {
  const statusStyles = {
    Available: "bg-green-100 text-green-700",
    "On Trip": "bg-blue-100 text-blue-700",
    "In Shop": "bg-yellow-100 text-yellow-700",
    Retired: "bg-gray-200 text-gray-700",
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