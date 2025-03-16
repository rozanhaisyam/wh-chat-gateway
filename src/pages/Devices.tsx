
import { useState } from "react";
import { 
  Plus, 
  Filter, 
  Search, 
  MoreVertical,
  Smartphone 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DeviceCard from "@/components/dashboard/DeviceCard";
import QRCodeScanModal from "@/components/modals/QRCodeScanModal";
import { mockDevices } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

const Devices = () => {
  const { toast } = useToast();
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [addDeviceOpen, setAddDeviceOpen] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [selectedDevice, setSelectedDevice] = useState<{id: string, name: string} | null>(null);

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

  const handleAddDevice = () => {
    if (!newDeviceName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Device name cannot be empty"
      });
      return;
    }

    toast({
      title: "Device added",
      description: `Device "${newDeviceName}" has been added successfully`
    });
    
    setAddDeviceOpen(false);
    setNewDeviceName("");
    
    // In a real app, this would create a device and then open the QR modal
    const newId = (Math.max(...mockDevices.map(d => parseInt(d.id))) + 1).toString();
    setSelectedDevice({ id: newId, name: newDeviceName });
    setQrModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Devices</h2>
          <p className="text-muted-foreground">
            Manage your WhatsApp connections
          </p>
        </div>
        <Button onClick={() => setAddDeviceOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Device
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search devices..."
                className="pl-8"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="connected">Connected</SelectItem>
                  <SelectItem value="disconnected">Disconnected</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockDevices.map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
                onShowQR={handleShowQR}
              />
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <p className="text-sm text-muted-foreground">
              Showing {mockDevices.length} devices
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={addDeviceOpen} onOpenChange={setAddDeviceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Device</DialogTitle>
            <DialogDescription>
              Enter a name for your new WhatsApp device
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Input
                id="name"
                placeholder="Device name (e.g., Sales Phone)"
                value={newDeviceName}
                onChange={(e) => setNewDeviceName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDeviceOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDevice}>
              Add Device
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

export default Devices;
