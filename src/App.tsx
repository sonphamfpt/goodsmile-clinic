import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ClinicProvider } from './context/ClinicContext';
import { MainLayout } from './layouts/MainLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Public pages
import { Home } from './pages/public/Home';
import { Services } from './pages/public/Services';
import { PriceList } from './pages/public/PriceList';
import { Doctors } from './pages/public/Doctors';
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

// Route Helper wrappers
const PublicRoute: React.FC<{ component: React.ComponentType }> = ({ component: Component }) => {
  return (
    <MainLayout>
      <Component />
    </MainLayout>
  );
};

const DashboardRoute: React.FC<{ component: React.ComponentType }> = ({ component: Component }) => {
  return (
    <DashboardLayout>
      <Component />
    </DashboardLayout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ClinicProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicRoute component={Home} />} />
            <Route path="/services" element={<PublicRoute component={Services} />} />
            <Route path="/prices" element={<PublicRoute component={PriceList} />} />
            <Route path="/doctors" element={<PublicRoute component={Doctors} />} />
            <Route path="/contact" element={<PublicRoute component={Contact} />} />
            <Route path="/login" element={<PublicRoute component={LoginRegister} />} />

            {/* Waiting Room TV Board */}
            <Route path="/queue-board" element={<QueueTracking />} />

            {/* Patient Portal */}
            <Route path="/patient" element={<DashboardRoute component={PatientDashboard} />} />

            {/* Staff Workspaces */}
            <Route path="/dashboard/receptionist" element={<DashboardRoute component={ReceptionistDashboard} />} />
            <Route path="/dashboard/dentist" element={<DashboardRoute component={DentistDashboard} />} />
            <Route path="/dashboard/cashier" element={<DashboardRoute component={CashierDashboard} />} />
            <Route path="/dashboard/manager" element={<DashboardRoute component={ManagerDashboard} />} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ClinicProvider>
    </AuthProvider>
  );
}
