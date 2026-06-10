import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Landing from "./pages/Landing.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import AppHome from "./pages/AppHome.tsx";
import VotingInfo from "./pages/VotingInfo.tsx";
import BillDetail from "./pages/BillDetail.tsx";
import StateBillDetail from "./pages/StateBillDetail.tsx";
import RepProfile from "./pages/RepProfile.tsx";
import ElectionDetail from "./pages/ElectionDetail.tsx";
import Glossary from "./pages/Glossary.tsx";
import Auth from "./pages/Auth.tsx";
import NotFound from "./pages/NotFound.tsx";
import MidtermsGuide from "./pages/MidtermsGuide.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/app" element={<AppHome />} />
            <Route path="/voting" element={<VotingInfo />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/bill/:id" element={<BillDetail />} />
            <Route path="/state-bill/:id" element={<StateBillDetail />} />
            <Route path="/rep/:id" element={<RepProfile />} />
            <Route path="/election/:slug" element={<ElectionDetail />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/guides/2026-midterms-voting-guide" element={<MidtermsGuide />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
