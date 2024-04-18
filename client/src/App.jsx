import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Outlet } from "react-router-dom";
import 'tailwindcss/tailwind.css';
import '../app/globals.css';
import '../app/style.css';
import { NavBar } from "./NavBar";

function App() {
  return (
    <div className='h-full bg-background'>
      <Toaster /> {/* This is the toast container for global toast messages */} 
      < NavBar />
      <Outlet />
    </div>
  )
}

export default App


