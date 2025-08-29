import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import Header from './components/Header';
import EventsListPage from './pages/EventsListPage';
import EventDetailPage from './pages/EventDetailPage';
import OrganizerDashboardPage from './pages/OrganizerDashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import { UserRole } from './types';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

const AuthLayout = () => (
  <div className="min-h-screen lg:grid lg:grid-cols-2">
    <div className="hidden lg:block relative bg-primary-dark">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-secondary opacity-80"></div>
        <div className="relative flex flex-col justify-center h-full p-12 text-white">
            <h2 className="text-4xl font-bold tracking-tight">Discover Your Next Experience</h2>
            <p className="mt-4 text-lg text-primary-200">The central hub for all campus happenings. Connect, engage, and be part of the community.</p>
        </div>
    </div>
    <div className="flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50">
        <Outlet />
    </div>
</div>
);

const MainApp: React.FC = () => {
  const { currentUser } = useAppContext();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-neutral-100 font-sans text-neutral-800">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 md:p-8">
        <Routes>
          <Route path="/" element={<EventsListPage />} />
          <Route path="/event/:id" element={<EventDetailPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.ORGANIZER, UserRole.ADMIN]}>
                <OrganizerDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Route>
          <Route path="/*" element={<MainApp />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}

export default App;