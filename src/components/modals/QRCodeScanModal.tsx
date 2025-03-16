
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { QRCodeDisplay } from "@/components/qrcode/QRCodeDisplay";
import { useWhatsAppConnection } from "@/hooks/use-whatsapp-connection";

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
  const {
    qrCodeUrl,
    loading,
    connectionStatus,
    qrAttemptCount,
    maxQrAttempts,
    handleRefreshQR
  } = useWhatsAppConnection({
    deviceId,
    deviceName,
    onSuccessfulConnection: onClose,
    isActive: isOpen
  });

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
          <QRCodeDisplay
            qrCodeUrl={qrCodeUrl}
            loading={loading}
            connectionStatus={connectionStatus}
            qrAttemptCount={qrAttemptCount}
            maxQrAttempts={maxQrAttempts}
          />
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
