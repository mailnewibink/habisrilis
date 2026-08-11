import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { LanguageWrapper } from './components/layout/LanguageWrapper';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { LandingPage } from './pages/public/LandingPage';
import { ArtistProfile } from './pages/public/ArtistProfile';
import { ClaimArtist } from './pages/public/ClaimArtist';
import { ReleasePage } from './pages/public/ReleasePage';
import { AppShell } from './components/layout/AppShell';
import { MyReleases } from './pages/app/MyReleases';
import { CreateRelease } from './pages/app/CreateRelease';
import { EditRelease } from './pages/app/EditRelease';
import { Account } from './pages/app/Account';
import { ArtistSetup } from './pages/app/ArtistSetup';
import { ClaimArtistDiscovery } from './pages/app/ClaimArtistDiscovery';
import { AdminClaims } from './pages/app/AdminClaims';
import { AdminFeatured } from './pages/app/AdminFeatured';
import { SuperAdmin } from './pages/app/SuperAdmin';
import { Onboarding } from './pages/app/Onboarding';
import { ManagerDashboard } from './pages/app/ManagerDashboard';
import { UpgradePage } from './pages/app/UpgradePage';
import { FanDashboard } from './pages/app/FanDashboard';
import { NotFound } from './pages/public/NotFound';
import { AuthCallback } from './pages/public/AuthCallback';
import { ExamplesShowcase } from './pages/public/ExamplesShowcase';
import { AboutPage } from './pages/public/AboutPage';
import { PricingPage } from './pages/public/PricingPage';
import { isSupabaseConfigured } from './lib/supabase';

export default function App() {
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-lg w-full text-center">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Configuration Required</h2>
          <p className="text-gray-600 mb-6">
            The application is missing its Supabase configuration. Please ensure <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">VITE_SUPABASE_URL</code> and <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">VITE_SUPABASE_ANON_KEY</code> are provided in your environment variables.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <LanguageProvider>
      <LanguageWrapper>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/examples" element={<ExamplesShowcase />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          <Route path="/onboarding" element={
            <ProtectedRoute requireArtist={false}>
              <Onboarding />
            </ProtectedRoute>
          } />

          <Route path="/app/manager" element={
            <ProtectedRoute requireArtist={false}>
              <ManagerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/app/upgrade" element={
            <ProtectedRoute requireArtist={false}>
              <UpgradePage />
            </ProtectedRoute>
          } />

          <Route path="/app/fan" element={
            <ProtectedRoute requireArtist={false}>
              <FanDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/app/setup" element={
            <ProtectedRoute requireArtist={false}>
              <ArtistSetup />
            </ProtectedRoute>
          } />
          
          <Route path="/app/claim-artist" element={
            <ProtectedRoute requireArtist={false}>
              <ClaimArtistDiscovery />
            </ProtectedRoute>
          } />
          
          <Route path="/app/admin/claims" element={
            <ProtectedRoute requireArtist={false}>
              <AdminClaims />
            </ProtectedRoute>
          } />
          <Route path="/app/admin/featured" element={
            <ProtectedRoute requireArtist={false}>
              <AdminFeatured />
            </ProtectedRoute>
          } />
          <Route path="/app/admin/super" element={
            <ProtectedRoute requireArtist={false}>
              <SuperAdmin />
            </ProtectedRoute>
          } />
          
          <Route path="/app" element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }>
            <Route index element={<MyReleases />} />
            <Route path="new" element={<CreateRelease />} />
            <Route path="edit/:releaseSlug" element={<EditRelease />} />
            <Route path="account" element={<Account />} />
          </Route>

          <Route path="/:username" element={<ArtistProfile />} />
          <Route path="/:username/:releaseSlug" element={<ReleasePage />} />
          <Route path="/claim/:username" element={<ClaimArtist />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
        </LanguageWrapper>
      </LanguageProvider>
    </AuthProvider>
  );
}
