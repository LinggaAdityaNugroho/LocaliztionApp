import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Swal from "sweetalert2";

interface CartNonAssetRowProps {
  item: {
    id: number;
    nama_alat: string;
    letak: string;
    jumlah: number;
    qty: number;
  };
  onRemove: () => void;
  onUpdateQty: (newQty: number) => void;
}

export function CartNonAssetRow({
  item,
  onRemove,
  onUpdateQty,
}: CartNonAssetRowProps) {
  return (
    <div className="border-2 border-black px-8 py-8 transition-colors bg-zinc-50 dark:bg-zinc-950/40  hover:translate-x-0 hover:translate-y-0 gap-4  flex flex-col select-none">
      <div className="flex justify-between items-center text-left flex-1">
        <div className="overflow-hidden flex flex-col ">
          <span className="font-sans font-black text-xs text-zinc-900 dark:text-zinc-100 truncate block">
            {item.nama_alat}
          </span>
          <span className="text-xs font-mono font-black text-zinc-400 dark:text-zinc-500  tracking-widest mt-0.5 block">
            Ruangan : {item.letak}
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            Swal.fire({
              title: "Hapus Item?",
              text: `Yakin ingin mengeluarkan ${item.nama_alat} dari berkas peminjaman?`,
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#18181b",
              cancelButtonColor: "#ef4444",
              confirmButtonText: "YA, HAPUS",
              cancelButtonText: "BATAL",
              allowOutsideClick: false,
              allowEscapeKey: false,
              customClass: {
                container: "z-[99999]",
              },
              background: document.documentElement.classList.contains("dark")
                ? "#18181b"
                : "#ffffff",
              color: document.documentElement.classList.contains("dark")
                ? "#f4f4f5"
                : "#09090b",
            }).then((result) => {
              if (result.isConfirmed) {
                onRemove();
              }
            });
          }}
          className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-transparent rounded-lg shrink-0 transition-colors"
        >
          <Trash2 size={14} />
        </Button>
      </div>

      <div className="w-full relative flex items-center  text-left gap-3 justify-end">
        Qty:
        <Input
          type="number"
          min="1"
          max={item.jumlah}
          value={item.qty}
          onChange={(e) =>
            onUpdateQty(Math.max(1, parseInt(e.target.value) || 1))
          }
          className="h-6 w-18 "
        />
      </div>
    </div>
  );
}
