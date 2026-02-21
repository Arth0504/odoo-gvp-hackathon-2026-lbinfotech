import React from 'react'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="h-16 bg-white shadow-sm flex items-center justify-between px-6">

      <h2 className="text-lg font-semibold text-gray-800">
        Fleet Management System
      </h2>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="text-right leading-tight">
            <p className="text-sm font-semibold text-gray-800 capitalize">
              {user?.email.split('@')[0]}
            </p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              {user?.role}
            </p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center font-bold shadow-md shadow-blue-100">
            {user?.email[0].toUpperCase()}
          </div>
        </div>

        <button
          onClick={logout}
          className="bg-gray-50 text-gray-600 hover:text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-red-50 border border-transparent hover:border-red-100"
        >
          Logout
        </button>
      </div>

    </div>
  )
}

export default Navbar