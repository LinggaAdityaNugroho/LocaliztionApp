import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

export const CartDrawer = ({
  isOpen,
  onClose,
  children,
  onNext,
  step,
}: any) => (
  <Drawer open={isOpen} onOpenChange={onClose} direction="right">
    <DrawerContent className="h-full ml-auto w-full max-w-md rounded-none">
      <DrawerHeader className="border-b">
        <DrawerTitle className="italic uppercase font-black text-2xl">
          {step === "form" ? "Detail Peminjaman" : "Keranjang Alat"}
        </DrawerTitle>
      </DrawerHeader>

      <ScrollArea className="flex-1 p-6">{children}</ScrollArea>

      <DrawerFooter className="border-t bg-slate-50">
        <Button
          size="lg"
          className="w-full rounded-full font-bold uppercase tracking-widest"
          onClick={onNext}
        >
          {step === "cart" ? "Lanjut ke Form" : "Kirim Pengajuan"}
        </Button>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
);
