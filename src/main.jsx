import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Dashboard from './Layout/Dashboard/Dashboard.jsx';
import Overview from './Components/Overview/Overview.jsx';
import User from './Components/Pages/User/User.jsx';
import Agent from './Components/Pages/Agent/Agent.jsx';
import Admin from './Components/Pages/Admin/Admin.jsx';
import Registation from './Components/Pages/Registation/Registation.jsx';
import Login from './Components/Pages/Login/Login.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard></Dashboard>,
    children: [
      {
        path: '/',
        element: <Overview></Overview>
      },
      {
        path: '/user',
        element: <User></User>
      },
      {
        path: '/agent',
        element: <Agent></Agent>
      },
      {
        path: '/admin',
        element: <Admin></Admin>
      },
      {
        path: '/registation',
        element: <Registation></Registation>
      },
      {
        path: '/login',
        element: <Login></Login>
      },
      {
        path: '/user-management',
        element: <UserManagement></UserManagement>
      },
      {
        path: '/transactions',
        element: <Transactions></Transactions>
      },
    ]
  },
]);

import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'
import UserManagement from './Components/UserManageMent/UserManagement.jsx';
import Transactions from './Components/Pages/User/Transactions .jsx';

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)
