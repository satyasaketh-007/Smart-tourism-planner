import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Login from "./pages/Login.tsx";
import Plan from "./pages/Plan.tsx";
import Packages from "./pages/Packages.tsx";
import TripMap from "./pages/TripMap.tsx";
import Payment from "./pages/Payment.tsx";
import Receipt from "./pages/Receipt.tsx";
import NotFound from "./pages/NotFound.tsx";
import ThemeToggle from "./components/ThemeToggle.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ThemeToggle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/trip-map" element={<TripMap />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/receipt" element={<Receipt />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
