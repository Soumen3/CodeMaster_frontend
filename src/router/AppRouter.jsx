import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Home from '../pages/Home'
import ProblemList from '../pages/ProblemList'
import ProblemDetail from '../pages/ProblemDetail'
import Login from '../pages/Login'
import AuthSuccess from '../pages/AuthSuccess'
import Profile from '../pages/Profile'
// import NotFound from '../pages/NotFound'
import Tags from '../pages/Tags'

const Layout = () => {
  const location = useLocation()
  const hiddenNavbarRoutes = ['/problems/']
  
  // Check if current path matches problem detail route
  const shouldHideNavbar = hiddenNavbarRoutes.some(route => 
    location.pathname.startsWith(route) && location.pathname !== '/problems'
  )
  
  // Also hide footer on problem detail pages for better UX
  const shouldHideFooter = shouldHideNavbar

  return (
    <div className="min-h-screen flex flex-col">
      {!shouldHideNavbar && <Navbar />}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/problems" element={<ProblemList />} />
          <Route path="/problems/:id" element={<ProblemDetail />} />
          <Route path="/tags" element={<Tags />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="/profile" element={<Profile />} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </div>
      {!shouldHideFooter && <Footer />}
    </div>
  )
}

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}

export default AppRouter
