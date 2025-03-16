
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && deviceId) {
      // In a real app, this would fetch the QR code from the backend
      setLoading(true);
      setTimeout(() => {
        setQrCode(
          "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=whatsapp-web-connect-example"
        );
        setLoading(false);
      }, 1500);
    } else {
      setQrCode(null);
    }
  }, [isOpen, deviceId]);

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
                Generating QR code...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="border-8 border-white p-1 rounded-lg shadow-md">
                <img
                  src={qrCode || ""}
                  alt="QR Code"
                  className="w-48 h-48"
                />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                QR code will refresh in 45 seconds
              </p>
              <div className="w-full max-w-[200px] h-2 bg-gray-200 rounded-full mt-2">
                <div className="h-full bg-whatsapp rounded-full animate-pulse-light" style={{ width: '100%' }}></div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => {
            setLoading(true);
            setTimeout(() => {
              setQrCode(
                "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=whatsapp-web-connect-example"
              );
              setLoading(false);
            }, 1500);
          }}>
            Refresh QR
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
