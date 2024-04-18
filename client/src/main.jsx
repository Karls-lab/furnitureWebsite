import React from 'react'
import ReactDOM from 'react-dom/client'
import {createHashRouter, RouterProvider} from "react-router-dom";
import App from './App.jsx'
import Home from "./Home.jsx"
import Login from "./Login.jsx"
import About from "./About.jsx"
import Profile from "./Profile.jsx"
import Contact from "./Contact.jsx"
import Store from './Store.jsx';
import Cart from './Cart.jsx';
import Orders from './Orders.jsx';
import ErrorPage from "./error-page.jsx"
import Dashboard from './dashboard.jsx';
import FurnitureEditor from './forms/FurnitureEditor.jsx';
import NewFurnitureForm from './forms/NewFurniture.jsx';

const router = createHashRouter([
  {
    path: "",
    element:  <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/store",
        element: <Store />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/orders",
        element: <Orders />,
      },
      {
        path: "/dashboard/FurnitureEditor/:furnitureId",
        element: <FurnitureEditor />,
      },
      {
        path: "/dashboard/NewFurniture",
        element: <NewFurnitureForm />,
      },
      {
        path: "*",
        element: <ErrorPage />
      }
   ]
  }
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)

