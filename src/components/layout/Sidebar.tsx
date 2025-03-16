
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Smartphone, 
  Users, 
  MessageSquare, 
  Megaphone, 
  LogOut,
  Menu,
  Settings
} from "lucide-react";
import { 
  Sidebar as SidebarComponent, 
  SidebarContent, 
  SidebarFooter,
  SidebarHeader, 
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Sidebar() {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  return (
    <SidebarComponent defaultCollapsed={isMobile} className="border-r">
      <SidebarHeader className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          {!isCollapsed && (
            <span className="font-bold text-lg text-sidebar-foreground">WA Gateway</span>
          )}
        </div>
        <SidebarTrigger onClick={() => setIsCollapsed(!isCollapsed)} className="text-sidebar-foreground">
          <Menu size={20} />
        </SidebarTrigger>
      </SidebarHeader>
      
      <SidebarContent className="p-2">
        <nav className="space-y-1">
          <NavLink to="/" end className={({isActive}) => 
            `sidebar-link ${isActive ? 'active' : ''}`
          }>
            <LayoutDashboard size={20} />
            {!isCollapsed && <span>Dashboard</span>}
          </NavLink>
          
          <NavLink to="/devices" className={({isActive}) => 
            `sidebar-link ${isActive ? 'active' : ''}`
          }>
            <Smartphone size={20} />
            {!isCollapsed && <span>Devices</span>}
          </NavLink>
          
          <NavLink to="/contacts" className={({isActive}) => 
            `sidebar-link ${isActive ? 'active' : ''}`
          }>
            <Users size={20} />
            {!isCollapsed && <span>Contacts</span>}
          </NavLink>
          
          <NavLink to="/messages" className={({isActive}) => 
            `sidebar-link ${isActive ? 'active' : ''}`
          }>
            <MessageSquare size={20} />
            {!isCollapsed && <span>Messages</span>}
          </NavLink>
          
          <NavLink to="/campaigns" className={({isActive}) => 
            `sidebar-link ${isActive ? 'active' : ''}`
          }>
            <Megaphone size={20} />
            {!isCollapsed && <span>Campaigns</span>}
          </NavLink>
        </nav>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="flex flex-col gap-2">
          {!isCollapsed && (
            <Button variant="ghost" className="justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground">
              <Settings size={20} className="mr-2" />
              Settings
            </Button>
          )}
          
          <Button variant="ghost" className="justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground">
            <LogOut size={20} className={isCollapsed ? "" : "mr-2"} />
            {!isCollapsed && "Logout"}
          </Button>
        </div>
      </SidebarFooter>
    </SidebarComponent>
  );
}
