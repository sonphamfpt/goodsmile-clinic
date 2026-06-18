import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ClinicProvider } from './context/ClinicContext';
import { MainLayout } from './layouts/MainLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Public pages
import { Home } from './pages/public/Home';
import { Services } from './pages/public/Services';
import { Doctors } from './pages/public/Doctors';
import { DoctorDetail } from './pages/public/DoctorDetail';
import { BookingPage } from './pages/public/BookingPage';
import { AboutUs } from './pages/public/AboutUs';
import { Contact } from './pages/public/Contact';
import { LoginRegister } from './pages/public/LoginRegister';

// Patient page
import { PatientDashboard } from './pages/patient/PatientDashboard';

// Staff pages
import { ReceptionistDashboard } from './pages/staff/ReceptionistDashboard';
import { DentistDashboard } from './pages/staff/DentistDashboard';
import { CashierDashboard } from './pages/staff/CashierDashboard';
import { ManagerDashboard } from './pages/staff/ManagerDashboard';

// Waiting Room board
import { QueueTracking } from './pages/queue-tracking/QueueTracking';

// ── Route Wrappers ──

const PublicRoute: React.FC<{ component: React.ComponentType }> = ({ component: Component }) => (
  <MainLayout>
    <Component />
  </MainLayout>
);

const DashboardRoute: React.FC<{ component: React.ComponentType }> = ({ component: Component }) => (
  <DashboardLayout>
    <Component />
  </DashboardLayout>
);

// Protected route — redirect to /login if not authenticated
const ProtectedRoute: React.FC<{ component: React.ComponentType }> = ({ component: Component }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <DashboardLayout>
      <Component />
    </DashboardLayout>
  );
};

// Redirect logged-in users away from login page
const GuestOnlyRoute: React.FC<{ component: React.ComponentType }> = ({ component: Component }) => {
  const { isAuthenticated, role } = useAuth();

  if (isAuthenticated) {
    const dest = role === 'patient' ? '/patient' : `/dashboard/${role}`;
    return <Navigate to={dest} replace />;
  }

  return <Component />;
};

export default function App() {
  return (
    <AuthProvider>
      <ClinicProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicRoute component={Home} />} />
            <Route path="/about" element={<PublicRoute component={AboutUs} />} />
            <Route path="/services" element={<PublicRoute component={Services} />} />
            <Route path="/doctors" element={<PublicRoute component={Doctors} />} />
            <Route path="/doctors/:id" element={<PublicRoute component={DoctorDetail} />} />
            <Route path="/contact" element={<PublicRoute component={Contact} />} />
            <Route path="/book" element={<PublicRoute component={BookingPage} />} />

            {/* Auth — redirect away if already logged in */}
            <Route path="/login" element={<GuestOnlyRoute component={LoginRegister} />} />

            {/* Waiting Room TV Board — public display screen */}
            <Route path="/queue-board" element={<QueueTracking />} />

            {/* Protected: Patient Portal */}
            <Route path="/patient" element={<ProtectedRoute component={PatientDashboard} />} />

            {/* Protected: Staff Workspaces */}
            <Route path="/dashboard/receptionist" element={<ProtectedRoute component={ReceptionistDashboard} />} />
            <Route path="/dashboard/dentist"       element={<ProtectedRoute component={DentistDashboard} />} />
            <Route path="/dashboard/cashier"       element={<ProtectedRoute component={CashierDashboard} />} />
            <Route path="/dashboard/manager"       element={<ProtectedRoute component={ManagerDashboard} />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ClinicProvider>
    </AuthProvider>
  );
}
