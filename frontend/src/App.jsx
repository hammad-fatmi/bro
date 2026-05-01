import React from 'react'
import { Button } from './components/ui/button'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Verify from './pages/verify'
import VerifyEmail from './pages/verifyEmail'
import Footer from './components/Footer'
import Profile from "./pages/Profile";
import Products from "./pages/Products"
import Dashboard from "./pages/Dashboard";
// import Services from './pages/Services'

const router = createBrowserRouter([
  {
    path: '/',
    element: <><Navbar /><Home /><Footer /></>
  },
  {
    path: '/signup',
    element: <><Signup /></>
  },
  {
    path: '/login',
    element: <><Login /></>
  },
  {
    path: '/verify',
    element: <><Verify /></>
  },
  {
    path: '/verify/:token',
    element: <><VerifyEmail /></>
  },
  {
    path: '/Profile/:userId',
    element: <><Navbar /><Profile /></>
  },

  {
    path: '/products',
    element: <><Navbar /><Products /></>
  },

  {
    path: "/dashboard",
    element: <><Navbar /><Dashboard /><Footer /></>
  },

  {
    path: '/services',
    element: <><Navbar /><Services /><Footer /></>
  },

])

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App