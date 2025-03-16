
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Smartphone, Users, MessageSquare, Megaphone, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatCard from "@/components/dashboard/StatCard";
import DeviceCard from "@/components/dashboard/DeviceCard";
import QRCodeScanModal from "@/components/modals/QRCodeScanModal";
import { mockDevices, mockDashboardStats } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<{id: string, name: string} | null>(null);

  // In a real app, these would be API calls to connect/disconnect devices
  const handleConnect = (id: string) => {
    toast({
      title: "Connecting device",
      description: "Attempting to connect to the WhatsApp servers..."
    });
  };

  const handleDisconnect = (id: string) => {
    toast({
      title: "Disconnecting device",
      description: "Device has been disconnected from WhatsApp servers."
    });
  };

  const handleShowQR = (id: string) => {
    const device = mockDevices.find(d => d.id === id);
    if (device) {
      setSelectedDevice({ id, name: device.name });
      setQrModalOpen(true);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
          <p className="text-muted-foreground">
            Here's an overview of your WhatsApp gateway
          </p>
        </div>
        <Button onClick={() => navigate('/devices')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Device
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Active Devices" 
          value={mockDashboardStats.activeDevices} 
          icon={<Smartphone />}
          description={`${mockDashboardStats.activeDevices} of ${mockDashboardStats.totalDevices} connected`} 
        />
        <StatCard 
          title="Contacts" 
          value={mockDashboardStats.totalContacts} 
          icon={<Users />}
        />
        <StatCard 
          title="Messages Today" 
          value={mockDashboardStats.messagesSent + mockDashboardStats.messagesReceived} 
          icon={<MessageSquare />}
          variant="primary"
          description={`Sent: ${mockDashboardStats.messagesSent} · Received: ${mockDashboardStats.messagesReceived}`} 
        />
        <StatCard 
          title="Active Campaigns" 
          value={mockDashboardStats.activeCampaigns} 
          icon={<Megaphone />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Connected Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
              {mockDevices.slice(0, 2).map((device) => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  onConnect={handleConnect}
                  onDisconnect={handleDisconnect}
                  onShowQR={handleShowQR}
                />
              ))}
              {mockDevices.length > 2 && (
                <Button 
                  variant="outline" 
                  className="mt-2" 
                  onClick={() => navigate('/devices')}
                >
                  View all devices
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="message">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="message">Send Message</TabsTrigger>
                <TabsTrigger value="campaign">Campaign</TabsTrigger>
                <TabsTrigger value="contact">Add Contact</TabsTrigger>
              </TabsList>
              <TabsContent value="message" className="py-4">
                <Button className="w-full mb-2" onClick={() => navigate('/messages')}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  New Single Message
                </Button>
                <Button className="w-full" variant="outline" onClick={() => navigate('/messages')}>
                  <Users className="mr-2 h-4 w-4" />
                  New Bulk Message
                </Button>
              </TabsContent>
              <TabsContent value="campaign" className="py-4">
                <Button className="w-full" onClick={() => navigate('/campaigns')}>
                  <Megaphone className="mr-2 h-4 w-4" />
                  Create New Campaign
                </Button>
              </TabsContent>
              <TabsContent value="contact" className="py-4">
                <Button className="w-full" onClick={() => navigate('/contacts')}>
                  <Users className="mr-2 h-4 w-4" />
                  Add New Contact
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <QRCodeScanModal
        isOpen={qrModalOpen}
        onClose={() => {
          setQrModalOpen(false);
          setSelectedDevice(null);
        }}
        deviceId={selectedDevice?.id || null}
        deviceName={selectedDevice?.name || null}
      />
    </div>
  );
};

export default Index;
