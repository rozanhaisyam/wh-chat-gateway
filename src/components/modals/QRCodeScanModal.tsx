
import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  makeWASocket, 
  useMultiFileAuthState, 
  DisconnectReason, 
  initAuthCreds, 
  BufferJSON,
  proto,
  AuthenticationState
} from "@whiskeysockets/baileys";
import QRCode from "qrcode";

interface QRCodeScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  deviceId: string | null;
  deviceName: string | null;
}

export default function QRCodeScanModal({
  isOpen,
  onClose,
  deviceId,
  deviceName,
}: QRCodeScanModalProps) {
  const { toast } = useToast();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [qrAttemptCount, setQrAttemptCount] = useState(0);
  const socketRef = useRef<any>(null);
  const maxQrAttempts = 5;

  useEffect(() => {
    if (isOpen && deviceId) {
      connectToWhatsApp();
    }
    
    return () => {
      // Cleanup function to disconnect when modal is closed
      if (socketRef.current) {
        socketRef.current.ws?.close();
        socketRef.current = null;
      }
    };
  }, [isOpen, deviceId]);

  const connectToWhatsApp = async () => {
    setLoading(true);
    setQrCodeUrl(null);
    setConnectionStatus("Initializing...");
    
    try {
      // Initialize proper auth credentials
      const creds = initAuthCreds();
      
      // Create auth state with properly implemented SignalKeyStore
      const authState: AuthenticationState = {
        creds,
        keys: {
          get: async (type, ids) => {
            const result = {};
            for (const id of ids) {
              result[id] = null;
            }
            return result;
          },
          set: async (data) => {
            // In-memory implementation - in a real app, you'd save this
            // console.log("Saving keys data", Object.keys(data));
          }
          // Remove the 'delete' property as it's not part of the SignalKeyStore interface
        }
      };
      
      // Create a new WhatsApp connection
      const sock = makeWASocket({
        auth: authState,
        printQRInTerminal: false,
      });
      
      socketRef.current = sock;
      
      sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
          // New QR code received
          setQrAttemptCount(prev => prev + 1);
          setConnectionStatus(`QR Code generated (${qrAttemptCount + 1}/${maxQrAttempts})`);
          
          try {
            // Convert QR code to data URL
            const qrUrl = await QRCode.toDataURL(qr);
            setQrCodeUrl(qrUrl);
            setLoading(false);
          } catch (err) {
            toast({
              variant: "destructive",
              title: "Error generating QR code",
              description: "There was a problem generating the QR code."
            });
            setLoading(false);
          }
          
          // If reached max attempts, stop
          if (qrAttemptCount >= maxQrAttempts - 1) {
            setConnectionStatus("Max QR attempts reached. Please try again later.");
            sock.ws?.close();
          }
        }
        
        if (connection === "open") {
          setConnectionStatus("Connected successfully!");
          setLoading(false);
          toast({
            title: "Device connected",
            description: `${deviceName} has been connected successfully!`
          });
          
          // In a real app, you would update your database with the connection info
          setTimeout(() => {
            onClose();
          }, 2000);
        }
        
        if (connection === "close") {
          const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;
          
          if (statusCode === DisconnectReason.loggedOut) {
            setConnectionStatus("Logged out from device.");
            toast({
              variant: "destructive",
              title: "Logged out",
              description: "You were logged out from WhatsApp."
            });
          } else if (statusCode !== DisconnectReason.connectionReplaced) {
            setConnectionStatus("Connection closed. Try again.");
          }
          
          setLoading(false);
        }
      });
      
      // Handle credentials updates
      sock.ev.on("creds.update", () => {
        // In a real app, you would save the updated credentials
        console.log("Credentials updated");
      });
      
    } catch (error) {
      console.error("Connection error:", error);
      setConnectionStatus("Error connecting to WhatsApp.");
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Connection error",
        description: "There was a problem connecting to WhatsApp."
      });
    }
  };

  const handleRefreshQR = () => {
    if (qrAttemptCount >= maxQrAttempts) {
      setQrAttemptCount(0);
    }
    
    if (socketRef.current) {
      socketRef.current.ws?.close();
    }
    
    connectToWhatsApp();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Device: {deviceName}</DialogTitle>
          <DialogDescription>
            Scan this QR code with your WhatsApp app to connect this device.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center p-6">
          {loading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-16 w-16 animate-spin text-whatsapp" />
              <p className="mt-4 text-sm text-muted-foreground">
                {connectionStatus || "Generating QR code..."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {qrCodeUrl ? (
                <div className="border-8 border-white p-1 rounded-lg shadow-md">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-48 h-48"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 w-48 bg-gray-100 rounded-lg">
                  <p className="text-sm text-center text-muted-foreground px-4">
                    {connectionStatus || "No QR code available"}
                  </p>
                </div>
              )}
              <p className="mt-4 text-sm text-muted-foreground">
                {connectionStatus || "QR code will refresh in 45 seconds"}
              </p>
              {qrCodeUrl && (
                <div className="w-full max-w-[200px] h-2 bg-gray-200 rounded-full mt-2">
                  <div 
                    className="h-full bg-whatsapp rounded-full animate-pulse-light" 
                    style={{ width: `${(qrAttemptCount / maxQrAttempts) * 100}%` }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleRefreshQR} disabled={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh QR
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
