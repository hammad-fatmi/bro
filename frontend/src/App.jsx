import React from 'react'
import { Button } from './components/ui/button'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Verify from './pages/verify'
import VerifyEmail from './pages/verifyEmail'
import Footer from './components/Footer'
import Profile from "./pages/Profile"

import Upload from "./pages/Upload"
import News from "./components/news/News"
import NewsCard from "./components/news/NewsCard"
import Trending from "./components/news/Trending"
import TechMoves from "./components/news/TechMoves"
import Article from "./pages/Article";
import ArticleView from "./components/news/ArticleView";

// Layout wrapper
const AppLayout = () => {
  return (
    <>
      <Navbar />

      <main className="pt-16 min-h-screen bg-black">
        <Outlet />
      </main>

      <Footer />
    </>
  )
}


// Router
const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/news', element: <News /> },
      { path: '/trending', element: <Trending /> },
      { path: '/tech-moves', element: <TechMoves /> },
      { path: '/upload', element: <Upload /> },
      { path: '/Profile/:userId', element: <Profile /> },
      { path: "/article/:id", element: <Article /> },
      { path: "/article-view", element: <ArticleView /> }
     

    ]
  },

  { path: '/signup', element: <Signup /> },
  { path: '/login', element: <Login /> },
  { path: '/verify', element: <Verify /> },
  { path: '/verify/:token', element: <VerifyEmail /> },
])


const App = () => {
  return <RouterProvider router={router} />
}

export default App