import React from 'react'
import { Link, useLocation } from "react-router-dom"

import { useAuth } from "../context/AuthContext"

const Sidebar = () => {
  const location = useLocation()
  const { user } = useAuth()

  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Vehicles", path: "/vehicles", roles: ["manager"] },
    { name: "Trips", path: "/trips", roles: ["dispatcher"] },
    { name: "Drivers", path: "/drivers", roles: ["safety"] },
    { name: "Fuel Logs", path: "/fuel", roles: ["finance", "manager"] },
    { name: "Maintenance", path: "/maintenance", roles: ["manager"] },
    { name: "Reports", path: "/reports", roles: ["finance"] },
  ]

  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-6 text-2xl font-bold border-b">
        FleetFlow
      </div>

      <div className="flex flex-col p-4 gap-2">
        {menuItems
          .filter((item) => !item.roles || item.roles.includes(user?.role))
          .map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`p-3 rounded-lg transition ${location.pathname === item.path
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