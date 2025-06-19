// import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './Components/DashboardLayout';
import Login from './Components/Login';
import DashboardHome from './Components/DashboardPages/DashboardHome';
import DashboardPosts from './Components/DashboardPages/DashboardPosts';
import DashboardChat from './Components/DashboardPages/DashboardChat';
function App() {
  

  return (
    
     <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="posts" element={<DashboardPosts />} />
          <Route path="chat" element={<DashboardChat />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
