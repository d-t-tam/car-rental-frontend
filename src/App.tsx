import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { BrowseCarsPage } from "@/pages/BrowseCarsPage";
import { CarDetailPage } from "@/pages/CarDetailPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { AuthProvider } from "@/contexts/AuthContext";

export function App() {
  return (
    <TooltipProvider>
      <Toaster position="top-center" richColors />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/cars" element={<BrowseCarsPage />} />
              <Route path="/cars/:id" element={<CarDetailPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  );
}

export default App;
