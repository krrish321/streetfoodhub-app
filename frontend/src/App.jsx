import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import ShopDashbord from './Pages/ShopDashbord'
import VendorPage from './Pages/VendorPage'
import VendorItems from "./Pages/VendorItems";
import SupplierDashboard from './Pages/SupplierDashboard'



function App() {
  return (
    <Routes>

      <Route path='/' element={<Home/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/shop' element={<ShopDashbord/>} />
      <Route path="/vendor/:id" element={<VendorPage />} />
      <Route path="/vendor/:vendorId" element={<VendorItems />} />
      <Route path="/supplier" element={<SupplierDashboard/>} />


    </Routes>
  )
}

export default App
