import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Layout } from "@/components/Layout";
import Overview from "./pages/Overview";
import ScanHistory from "./pages/ScanHistory";
import Rewards from "./pages/Rewards";
import MPesa from "./pages/MPesa";
import Audit from "./pages/Audit";
import Blocked from "./pages/Blocked";
import Notifications from "./pages/Notifications";
import Media from "./pages/Media";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/scan-history" element={<ScanHistory />} />
                <Route path="/rewards" element={<Rewards />} />
                <Route path="/mpesa" element={<MPesa />} />
                <Route path="/audit" element={<Audit />} />
                <Route path="/blocked" element={<Blocked />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/media" element={<Media />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
