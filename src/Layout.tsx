import React from 'react'
import { Outlet } from 'react-router'
import Header from './components/global/Heading'
import OfflineAlert from './components/global/OfflineAlert'

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <OfflineAlert />
    </>
  )
}

export default Layout
