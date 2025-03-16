
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";

import PageContainer from "@/components/layout/PageContainer";
import Index from "./pages/Index";
import Devices from "./pages/Devices";
import Contacts from "./pages/Contacts";
import Messages from "./pages/Messages";
import Campaigns from "./pages/Campaigns";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <Routes>
            <Route element={<PageContainer />}>
              <Route path="/" element={<Index />} />
              <Route path="/devices" element={<Devices />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
