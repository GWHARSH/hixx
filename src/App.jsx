import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import UploadsPage from './pages/UploadsPage';
import PackagesPage from './pages/PackagesPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import UploadDetails from './pages/UploadDetails';
import PackageDetails from './pages/PackageDetails';
import { NotificationProvider } from './context/NotificationContext';
import DevToolsBlocker from './components/DevToolsBlocker';
import AnnouncementPopup from './components/AnnouncementPopup';
import ScrollToTop from './components/ScrollToTop';
import SeoHead from './components/SeoHead';
import { useTracking } from './hooks/useTracking';
import { useAntiBot } from './hooks/useAntiBot';
import { useGlobalScrollReveal } from './hooks/useScrollReveal';
import './index.css';

function AppInner() {
  useTracking();
  useAntiBot();
  useGlobalScrollReveal();
  return (
    <>
      <SeoHead />
      <ScrollToTop />
      <Navbar />
      {/* Floating background particles */}
      <div className="bg-particles">
        <div className="bg-particles__dot bg-particles__dot--1" />
        <div className="bg-particles__dot bg-particles__dot--2" />
        <div className="bg-particles__dot bg-particles__dot--3" />
        <div className="bg-particles__dot bg-particles__dot--4" />
        <div className="bg-particles__dot bg-particles__dot--5" />
        <div className="bg-particles__dot bg-particles__dot--6" />
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/uploads" element={<UploadsPage />} />
        <Route path="/uploads/:slug" element={<UploadDetails />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/packages/:slug" element={<PackageDetails />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <Footer />
      <AnnouncementPopup />
    </>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <SettingsProvider>
        <AuthProvider>
          <DevToolsBlocker />
          <BrowserRouter>
            <AppInner />
          </BrowserRouter>
        </AuthProvider>
      </SettingsProvider>
    </NotificationProvider>
  );
}
