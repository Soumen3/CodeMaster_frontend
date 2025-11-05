import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Home from '../pages/Home'
// import ProblemList from '../pages/ProblemList'
// import ProblemDetail from '../pages/ProblemDetail'
import Login from '../pages/Login'
import AuthSuccess from '../pages/AuthSuccess'
import Profile from '../pages/Profile'
// import NotFound from '../pages/NotFound'
import Tags from '../pages/Tags'

const AppRouter = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            {/* <Route path="/problems" element={<ProblemList />} /> */}
            {/* <Route path="/problems/:id" element={<ProblemDetail />} /> */}
            <Route path="/tags" element={<Tags />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/success" element={<AuthSuccess />} />
            <Route path="/profile" element={<Profile />} />
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default AppRouter
