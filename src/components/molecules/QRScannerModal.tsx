import { Card, CardContent } from "../ui/card";
import { MyButton } from "../atoms/Button";
import { Scanner } from "@yudiel/react-qr-scanner";
import { IconX } from "@tabler/icons-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function QrScannerModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/50">
      <Card>
        <CardContent className="flex flex-col gap-2">
          <div className="flex justify-end">
            <MyButton onClick={onClose} className="w-8 h-8">
              <IconX />
            </MyButton>
          </div>
          <Scanner onScan={(res) => console.log(res)} />
        </CardContent>
      </Card>
    </div>
  );
}
