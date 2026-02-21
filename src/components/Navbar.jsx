import React from 'react'

const Navbar = () => {
  return (
    <div className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
      
      <h2 className="text-lg font-semibold">
        Fleet Management System
      </h2>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          Manager
        </span>

        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
          A
        </div>
      </div>

    </div>
  )
}

export default Navbar