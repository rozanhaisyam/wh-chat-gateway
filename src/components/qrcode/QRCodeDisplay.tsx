
import { Loader2 } from "lucide-react";

interface QRCodeDisplayProps {
  qrCodeUrl: string | null;
  loading: boolean;
  connectionStatus: string | null;
  qrAttemptCount: number;
  maxQrAttempts: number;
}

export function QRCodeDisplay({
  qrCodeUrl,
  loading,
  connectionStatus,
  qrAttemptCount,
  maxQrAttempts,
}: QRCodeDisplayProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center">
        <Loader2 className="h-16 w-16 animate-spin text-whatsapp" />
        <p className="mt-4 text-sm text-muted-foreground">
          {connectionStatus || "Generating QR code..."}
        </p>
      </div>
    );
  }

  return (
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
  );
}
