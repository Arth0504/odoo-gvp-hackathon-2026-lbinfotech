import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import { AuthProvider } from "./context/AuthContext"
import Sidebar from "./components/Sidebar"
import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"

import Dashboard from "./pages/Dashboard"
import Vehicles from "./pages/Vehicles"
import Trips from "./pages/Trips"
import Drivers from "./pages/Drivers"
import Maintenance from "./pages/Maintenance"
import Reports from "./pages/Reports"
import FuelLogs from "./pages/FuelLogs"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"

const MainLayout = ({ children }) => (
  <div className="flex h-screen">
    <Sidebar />
    <div className="flex-1 flex flex-col bg-gray-100">
      <Navbar />
      <div className="p-6 overflow-y-auto">
        {children}
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout><Dashboard /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/vehicles" element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <MainLayout><Vehicles /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/trips" element={
            <ProtectedRoute allowedRoles={["dispatcher"]}>
              <MainLayout><Trips /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/drivers" element={
            <ProtectedRoute allowedRoles={["safety"]}>
              <MainLayout><Drivers /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/maintenance" element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <MainLayout><Maintenance /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute allowedRoles={["finance"]}>
              <MainLayout><Reports /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/fuel" element={
            <ProtectedRoute allowedRoles={["finance", "manager"]}>
              <MainLayout><FuelLogs /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App