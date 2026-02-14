import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import ErrorBoundary from "@/components/common/ErrorBoundary";

// Pages
import LandingPage from "./pages/LandingPage";
import GedungPublicList from "./pages/GedungPublicList";
import GedungDetailPage from "./pages/GedungDetailPage";
import LoginPage from "./pages/auth/LoginPage";
import LoginAdminPage from "./pages/auth/LoginAdminPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import NotFound from "./pages/NotFound";
import KonfirmasiPembayaranPage from "./pages/peminjam/KonfirmasiPembayaranPage";

// Layouts
import { PeminjamLayout } from "./components/layout/PeminjamLayout";
import { AdminLayout } from "./components/layout/AdminLayout";

// Peminjam Pages
import PeminjamDashboard from "./pages/peminjam/PeminjamDashboard";
import PeminjamGedungList from "./pages/peminjam/PeminjamGedungList";
import PeminjamPengajuan from "./pages/peminjam/PeminjamPengajuan";
import BookingPage from "./pages/peminjam/BookingPage";
import ProfilPage from "./pages/peminjam/ProfilPage";
import NotifikasiPage from "./pages/peminjam/NotifikasiPage";
import PembayaranPage from "./pages/peminjam/PembayaranPage";
import PaymentGateway from "./pages/payment/PaymentGateway";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminGedungPage from "./pages/admin/AdminGedungPage";
import AdminPeminjamanPage from "./pages/admin/AdminPeminjamanPage";
import AdminPeminjamPage from "./pages/admin/AdminPeminjamPage";
import AdminPetugasPage from "./pages/admin/AdminPetugasPage";
import AdminLaporanPage from "./pages/admin/AdminLaporanPage";
import AdminPembayaranPage from "./pages/admin/AdminPembayaranPage";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DataProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/gedung" element={<GedungPublicList />} />
                <Route path="/gedung/:id" element={<GedungDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/login-admin" element={<LoginAdminPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/pembayaran/konfirmasi/:id" element={<KonfirmasiPembayaranPage />} />
                <Route path="/payment-gateway" element={<PaymentGateway />} />

                {/* Peminjam Routes */}
                <Route path="/peminjam" element={<PeminjamLayout />}>
                  <Route index element={<PeminjamDashboard />} />
                  <Route path="gedung" element={<PeminjamGedungList />} />
                  <Route path="gedung/:id/booking" element={<BookingPage />} />
                  <Route path="pengajuan" element={<PeminjamPengajuan />} />
                  <Route path="pembayaran/:id" element={<PembayaranPage />} />
                  <Route path="profil" element={<ProfilPage />} />
                  <Route path="notifikasi" element={<NotifikasiPage />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="gedung" element={<AdminGedungPage />} />
                  <Route path="peminjaman" element={<AdminPeminjamanPage />} />
                  <Route path="peminjam" element={<AdminPeminjamPage />} />
                  <Route path="petugas" element={<AdminPetugasPage />} />
                  <Route path="laporan" element={<AdminLaporanPage />} />
                  <Route path="pembayaran" element={<AdminPembayaranPage />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </DataProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
