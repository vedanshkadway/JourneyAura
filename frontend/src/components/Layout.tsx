// import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar';

const Layout = () => {
  return (
    <>
    {/* <CssBaseline/> */}
    <Navbar/>
    <Outlet/>
    {/* <BackgroundBeams/> */}
    {/* <Home/> */}
  </>
  )
}

export default Layout
