import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar';
import NavbarPhone from '../components/NavbarPhone';

export default function () {
  return (
	<>
		<Navbar />
		<NavbarPhone />
		<Outlet />
	</>
  )
}
