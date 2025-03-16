
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

// Map routes to their human-readable titles
const routeTitles: Record<string, string> = {
  "/": "Dashboard",
  "/devices": "Devices",
  "/contacts": "Contacts",
  "/messages": "Messages",
  "/campaigns": "Campaigns",
};

export default function PageContainer() {
  const location = useLocation();
  const title = routeTitles[location.pathname] || "Not Found";
  
  return (
    <div className="min-h-screen w-full flex">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header title={title} />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
