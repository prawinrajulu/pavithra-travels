import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Layout } from "./components/layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import { AdminRoute } from "./components/AdminRoute";

// Pages
import { Home } from "./pages/home";
import { TempleDestinations } from "./pages/temple-destinations";
import { TempleDetail } from "./pages/temple-detail";
import { FamilyTrips } from "./pages/family-trips";
import { AllDestinations } from "./pages/all-destinations";
import { DestinationDetail } from "./pages/destination-detail";
import BookingSuccess from "./pages/BookingSuccess";
import { ServiceCategory } from "./pages/ServiceCategory";
import { BookingUnified } from "./pages/BookingUnified";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { NotFound } from "./pages/NotFound";
import { Dashboard } from "./pages/Dashboard";
import { CinematicCheckStatus } from "./pages/CinematicCheckStatus";
import { ForgotPassword } from "./pages/ForgotPassword";
import { WhatsAppAutomation } from "./pages/WhatsAppAutomation";
import AdminMedia from "./pages/AdminMedia";
import { AdminLayout } from "./components/AdminLayout";
import AdminOverview from "./pages/AdminOverview";
import AdminBookings from "./pages/AdminBookings";
import AdminSpecialTrips from "./pages/AdminSpecialTrips";
import CustomizedTrip from "./pages/CustomizedTrip";
import { TermsAndConditions } from "./pages/TermsAndConditions";
import { useEffect } from "react";
import { apiClient } from "./services/apiClient";

export default function App() {
  useEffect(() => {
    // Warm up the backend early to handle Render cold starts
    apiClient.healthCheck().catch(() => {
      // Ignore errors, we just want to wake up the server
    });
  }, []);

  return (
    <AuthProvider>
      <Routes>
        {/* Full screen cinematic routes without Layout */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        
        {/* Main app routes with Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/temples" element={<TempleDestinations />} />
          <Route path="/temples/:templeId" element={<TempleDetail />} />
          <Route path="/family-trips" element={<FamilyTrips />} />
          <Route path="/destinations" element={<AllDestinations />} />
          <Route path="/destinations/:slug" element={<DestinationDetail />} />
          <Route path="/customized-trip" element={<CustomizedTrip />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="/services/:type" element={<ServiceCategory />} />
          <Route path="/booking" element={<ProtectedRoute><BookingUnified /></ProtectedRoute>} />
          <Route path="/booking/:id" element={<ProtectedRoute><BookingUnified /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/check-status" element={<CinematicCheckStatus />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        </Route>
        
        {/* Unified Admin Panel - Moved outside of main Layout to avoid header/footer overlap */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminOverview />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="whatsapp" element={<WhatsAppAutomation />} />
          <Route path="media" element={<AdminMedia />} />
          <Route path="special-trips" element={<AdminSpecialTrips />} />
        </Route>

        {/* Capture All */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}
