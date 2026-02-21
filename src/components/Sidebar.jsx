import React from 'react'
import { Link, useLocation } from "react-router-dom"

const Sidebar = () => {
  const location = useLocation()

  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Vehicles", path: "/vehicles" },
    { name: "Trips", path: "/trips" },
    { name: "Drivers", path: "/drivers" },
    { name: "Maintenance", path: "/maintenance" },
    { name: "Reports", path: "/reports" },
  ]

  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-6 text-2xl font-bold border-b">
        FleetFlow
      </div>

      <div className="flex flex-col p-4 gap-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`p-3 rounded-lg transition ${
              location.pathname === item.path
                ? "bg-blue-100 text-blue-600 font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Sidebar