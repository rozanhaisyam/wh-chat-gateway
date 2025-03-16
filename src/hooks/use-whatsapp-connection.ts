
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  makeWASocket, 
  DisconnectReason, 
  initAuthCreds,
  AuthenticationState
} from "@whiskeysockets/baileys";
import QRCode from "qrcode";

interface UseWhatsAppConnectionProps {
  deviceId: string | null;
  deviceName: string | null;
  onSuccessfulConnection?: () => void;
  isActive: boolean;
}

export function useWhatsAppConnection({ 
  deviceId, 
  deviceName, 
  onSuccessfulConnection,
  isActive
}: UseWhatsAppConnectionProps) {
  const { toast } = useToast();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [qrAttemptCount, setQrAttemptCount] = useState(0);
  const socketRef = useRef<any>(null);
  const maxQrAttempts = 5;

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
          if (onSuccessfulConnection) {
            setTimeout(onSuccessfulConnection, 2000);
          }
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

  useEffect(() => {
    if (isActive && deviceId) {
      connectToWhatsApp();
    }
    
    return () => {
      // Cleanup function to disconnect when modal is closed
      if (socketRef.current) {
        socketRef.current.ws?.close();
        socketRef.current = null;
      }
    };
  }, [isActive, deviceId]);

  const handleRefreshQR = () => {
    if (qrAttemptCount >= maxQrAttempts) {
      setQrAttemptCount(0);
    }
    
    if (socketRef.current) {
      socketRef.current.ws?.close();
    }
    
    connectToWhatsApp();
  };

  return {
    qrCodeUrl,
    loading,
    connectionStatus,
    qrAttemptCount,
    maxQrAttempts,
    handleRefreshQR
  };
}
