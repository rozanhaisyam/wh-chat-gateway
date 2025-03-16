
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import QRCode from "qrcode";

// Mock QR code data - in production this would come from the server
const MOCK_QR_DATA = "https://example.com/whatsapp";

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
  const maxQrAttempts = 5;

  const connectToWhatsApp = async () => {
    setLoading(true);
    setQrCodeUrl(null);
    setConnectionStatus("Initializing connection...");
    
    // Simulate connection process
    setTimeout(async () => {
      try {
        setQrAttemptCount(prev => prev + 1);
        setConnectionStatus(`QR Code generated (${qrAttemptCount + 1}/${maxQrAttempts})`);
        
        // Generate real QR code from mock data
        const qrUrl = await QRCode.toDataURL(MOCK_QR_DATA);
        setQrCodeUrl(qrUrl);
        setLoading(false);
        
        // Simulate successful connection after 10 seconds if it's the last attempt
        if (qrAttemptCount >= maxQrAttempts - 1) {
          setTimeout(() => {
            setConnectionStatus("Connected successfully!");
            toast({
              title: "Device connected",
              description: `${deviceName} has been connected successfully!`
            });
            
            if (onSuccessfulConnection) {
              setTimeout(onSuccessfulConnection, 2000);
            }
          }, 10000);
        }
      } catch (err) {
        console.error("Error generating QR code:", err);
        toast({
          variant: "destructive",
          title: "Error generating QR code",
          description: "There was a problem generating the QR code."
        });
        setLoading(false);
      }
    }, 1500);
  };

  useEffect(() => {
    if (isActive && deviceId) {
      connectToWhatsApp();
    }
    
    return () => {
      // Cleanup function
    };
  }, [isActive, deviceId]);

  const handleRefreshQR = () => {
    if (qrAttemptCount >= maxQrAttempts) {
      setQrAttemptCount(0);
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
