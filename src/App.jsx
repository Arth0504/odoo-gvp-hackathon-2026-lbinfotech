import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Sidebar from "./components/Sidebar"
import Navbar from "./components/Navbar"

import Dashboard from "./pages/Dashboard"
import Vehicles from "./pages/Vehicles"
import Trips from "./pages/Trips"
import Drivers from "./pages/Drivers"
import Maintenance from "./pages/Maintenance"
import Reports from "./pages/Reports"

const App = () => {
  return (
    <BrowserRouter>
      <div className="flex h-screen">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-gray-100">

          {/* Top Navbar */}
          <Navbar />

          {/* Page Content */}
          <div className="p-6 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/trips" element={<Trips />} />
              <Route path="/drivers" element={<Drivers />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </div>

        </div>
      </div>
    </BrowserRouter>
  )
}

export default App