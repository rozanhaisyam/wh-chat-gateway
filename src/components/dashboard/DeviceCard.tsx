
import { Device } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, RefreshCw, QrCode, Power } from "lucide-react";

type DeviceStatusColor = {
  [key in Device["status"]]: string;
};

const statusColors: DeviceStatusColor = {
  connected: "bg-green-500",
  disconnected: "bg-gray-500",
  pending: "bg-yellow-500",
  error: "bg-red-500"
};

const statusLabels: DeviceStatusColor = {
  connected: "Connected",
  disconnected: "Disconnected",
  pending: "Waiting for QR Scan",
  error: "Connection Error"
};

interface DeviceCardProps {
  device: Device;
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
  onShowQR: (id: string) => void;
}

export default function DeviceCard({ 
  device, 
  onConnect, 
  onDisconnect, 
  onShowQR 
}: DeviceCardProps) {
  return (
    <Card className="hover-scale">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-accent p-2 rounded-full">
              <Smartphone className="h-5 w-5 text-whatsapp" />
            </div>
            <div>
              <h3 className="font-medium">{device.name}</h3>
              <p className="text-sm text-muted-foreground">
                {device.phoneNumber || "No number associated"}
              </p>
            </div>
          </div>
          <Badge 
            variant="outline"
            className={`${statusColors[device.status]} text-white border-0`}
          >
            {statusLabels[device.status]}
          </Badge>
        </div>
        
        {device.lastActive && (
          <p className="text-xs text-muted-foreground mt-4">
            Last active: {new Date(device.lastActive).toLocaleString()}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-2 pt-2 pb-4">
        {device.status === 'connected' ? (
          <Button 
            variant="destructive" 
            size="sm" 
            className="flex-1"
            onClick={() => onDisconnect(device.id)}
          >
            <Power className="w-4 h-4 mr-2" />
            Disconnect
          </Button>
        ) : (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onShowQR(device.id)}
            >
              <QrCode className="w-4 h-4 mr-2" />
              Scan QR
            </Button>
            
            <Button 
              variant="default" 
              size="sm" 
              className="flex-1"
              onClick={() => onConnect(device.id)}
              disabled={device.status === 'pending'}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Connect
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
