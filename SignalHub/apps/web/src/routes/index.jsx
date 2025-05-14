import { createBrowserRouter } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import MapPage from '../pages/MapPage'
import ReportPage from '../pages/ReportPage'
import ProfilePage from '../pages/ProfilePage'
import LoginPage from '../pages/LoginPage'
import ProtectedRoute from './ProtectedRoute'
import RegisterPage from '../pages/RegisterPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/map',
    element: <MapPage />,
  },
  {
    path: '/map',
    element: <MapPage />,
  },
  {
    path: '/report',
    element: (
      <ProtectedRoute>
        <ReportPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
])

export default router;
