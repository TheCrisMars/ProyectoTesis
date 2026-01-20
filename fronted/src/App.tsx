import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ScrollToTop } from './components/ScrollToTop';

import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ProfilePage } from './pages/dashboard/ProfilePage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
