import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Plus, Minus, Trash2 } from "lucide-react";

interface CartAssetRowProps {
  item: any;
  onRemove: () => void;
  onUpdateTags: (tags: string[]) => void;
}

export function CartAssetRow({
  item,
  onRemove,
  onUpdateTags,
}: CartAssetRowProps) {
  return (
    <div className="p-5 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-4xl space-y-4">
      <div className="flex justify-between items-center">
        <span className="font-black text-xs text-zinc-800 dark:text-zinc-200">
          {item.nama_alat}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-8 w-8 text-zinc-400 hover:text-red-500 rounded-lg"
        >
          <Trash2 size={14} />
        </Button>
      </div>

      <div className="space-y-2">
        {item.selected_tags.map((tag: string, idx: number) => (
          <div key={idx} className="flex gap-2 items-center">
            <Select
              value={tag}
              onValueChange={(v) => {
                const newTags = [...item.selected_tags];
                newTags[idx] = v;
                onUpdateTags(newTags);
              }}
            >
              <SelectTrigger className="rounded-xl h-10 text-[10px] font-black uppercase border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <SelectValue placeholder="Pilih Kode Unit Perangkat" />
              </SelectTrigger>
              <SelectContent className="font-mono text-xs font-bold">
                {item.kode_tag_list?.map((t: string) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {item.selected_tags.length > 1 && (
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  onUpdateTags(
                    item.selected_tags.filter((_: any, i: number) => i !== idx),
                  )
                }
                className="h-10 w-10 border-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 shrink-0"
              >
                <Minus size={14} />
              </Button>
            )}
          </div>
        ))}

        <Button
          variant="outline"
          size="sm"
          className="w-full rounded-xl border-dashed border-2 text-[10px] font-black uppercase tracking-wider text-zinc-500"
          onClick={() => onUpdateTags([...item.selected_tags, ""])}
        >
          <Plus size={12} className="mr-1" /> Tambah Unit Berseri
        </Button>
      </div>
    </div>
  );
}
