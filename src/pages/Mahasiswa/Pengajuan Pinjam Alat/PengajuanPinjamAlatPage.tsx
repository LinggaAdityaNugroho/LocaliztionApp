import { useState, useCallback, useMemo, useRef } from "react";
import { cn } from "./../../../lib/utils";
import Webcam from "react-webcam";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Activity,
  Network,
  Cpu,
  Camera,
  ArrowLeft,
  Camera as CameraIcon,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  ShoppingCart,
} from "lucide-react";

import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { InventoryTable } from "../../../components/organism/Table/InventoryTable";
import { LabGroupCard } from "../../../components/molecules/LabGroupCard";
import { CartDrawer } from "../../../components/organism/CartDrawer";
import api from "../../../services/api";

const LAB_GROUPS = [
  {
    name: "Gedung Elektronika",
    icon: Activity,
    color: "from-blue-600 to-indigo-800",
  },
  {
    name: "Gedung Telekomunikasi",
    icon: Network,
    color: "from-orange-500 to-red-700",
  },
  {
    name: "Gedung UPT Bahasa",
    icon: Cpu,
    color: "from-purple-600 to-fuchsia-800",
  },
  {
    name: "Gedung Magister Terapan",
    icon: Camera,
    color: "from-pink-600 to-rose-800",
  },
];

const RUANGAN_SPESIFIK = [
  "Lab Barat 1",
  "Lab Barat 2",
  "Lab Timur 1",
  "Lab Broadcast",
  "Lab Jaringan",
];

interface Alat {
  id: number;
  nama_alat: string;
  letak: string;
  jumlah: number;
  kode_tag_list?: string[];
  is_aset?: boolean;
}
interface CartItem extends Alat {
  selected_tags: string[];
  qty: number;
}

export default function PengajuanPinjamAlatPage() {
  const webcamRef = useRef<Webcam>(null);
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [alatList, setAlatList] = useState<Alat[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFormStep, setIsFormStep] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const [targetRoom, setTargetRoom] = useState("");
  const [tujuan, setTujuan] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSelectGroup = async (name: string) => {
    setSelectedGroup(name);
    try {
      setLoading(true);
      const res = await api.get(`/alat?role=mahasiswa&lab=${name}`);
      setAlatList(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImagePreview(imageSrc);
      fetch(imageSrc)
        .then((res) => res.blob())
        .then((blob) => {
          setImageFile(new File([blob], "alat.jpg", { type: "image/jpeg" }));
          setShowCamera(false);
        });
    }
  }, []);

  const addToCart = (alat: Alat) => {
    if (cart.find((i) => i.id === alat.id)) return;
    setCart([...cart, { ...alat, qty: 1, selected_tags: [""] }]);
  };

  const handleCheckout = async () => {
    if (!isFormStep) return setIsFormStep(true);

    if (!targetRoom) return alert("Pilih ruangan lab!");
    if (!tujuan.trim()) return alert("Isi tujuan penggunaan!");

    if (!imageFile || !(imageFile instanceof File)) {
      return alert("Ambil foto kondisi alat terlebih dahulu!");
    }

    const formData = new FormData();
    formData.append("ruangan_lab", targetRoom);
    formData.append("tujuan", tujuan);
    formData.append("foto_before", imageFile);

    const itemsPayload = cart.map((i) => ({
      id: i.id,
      qty: i.is_aset ? i.selected_tags.length : i.qty,
      kode_tag_list: i.is_aset ? i.selected_tags : [],
    }));

    formData.append("items", JSON.stringify(itemsPayload));

    try {
      setLoading(true);

      const response = await api.post("/peminjaman/ajukan", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201 || response.status === 200) {
        alert("✅ Pengajuan Berhasil!");
        setCart([]);
        setIsCartOpen(false);
        window.location.reload();
      }
    } catch (err: any) {
      console.error("Error Detail:", err.response?.data);
      const serverMessage = err.response?.data?.message;
      const validationErrors = err.response?.data?.errors;

      if (validationErrors) {
        const errorMsg = Object.values(validationErrors).flat().join(", ");
        alert(`❌ Validasi Gagal: ${errorMsg}`);
      } else {
        alert(`❌ Gagal: ${serverMessage || "Terjadi kesalahan server"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo<ColumnDef<Alat>[]>(
    () => [
      {
        header: "NAMA ALAT",
        cell: ({ row }) => (
          <div className="py-2">
            <div className="font-black text-slate-900 uppercase italic text-xs">
              {row.original.nama_alat}
            </div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {row.original.letak}
            </div>
          </div>
        ),
      },
      {
        header: "STOK",
        cell: ({ row }) => (
          <Badge
            variant="secondary"
            className="font-black text-[10px] bg-emerald-50 text-emerald-700 border-emerald-100"
          >
            {row.original.jumlah} UNIT
          </Badge>
        ),
      },
      {
        header: "AKSI",
        id: "actions",
        cell: ({ row }) => {
          const isAdded = cart.some((i) => i.id === row.original.id);
          return (
            <Button
              size="sm"
              disabled={row.original.jumlah <= 0 || isAdded}
              onClick={() => addToCart(row.original)}
              className={cn(
                "rounded-xl font-bold text-[10px] h-9 px-5",
                isAdded
                  ? "bg-emerald-500 hover:bg-emerald-600"
                  : "bg-indigo-600",
              )}
            >
              {isAdded ? <CheckCircle2 className="w-4 h-4 mr-1" /> : "PINJAM"}
            </Button>
          );
        },
      },
    ],
    [cart],
  );

  const table = useReactTable({
    data: alatList,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="container max-w-7xl py-10 space-y-10 min-h-screen">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b pb-8">
        {/* <div>
          <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none mb-3">
            SISTEM PEMINJAMAN
          </Badge>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
            E-INVENTORY <span className="text-indigo-600">POLINES</span>
          </h1>
        </div> */}
        {selectedGroup && (
          <Input
            placeholder="Cari alat..."
            className="max-w-xs rounded-2xl h-12 bg-white shadow-inner border-2 focus-visible:ring-indigo-500"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        )}
      </header>

      {/* MAIN CONTENT */}
      {!selectedGroup ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {LAB_GROUPS.map((lab) => (
            <LabGroupCard
              key={lab.name}
              {...lab}
              onClick={() => handleSelectGroup(lab.name)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Button
            variant="ghost"
            onClick={() => setSelectedGroup(null)}
            className="font-black text-indigo-600 uppercase tracking-widest text-xs hover:bg-indigo-50"
          >
            <ArrowLeft className="mr-2 w-4 h-4" /> Kembali ke Katalog
          </Button>
          <div className="overflow-hidden p-2">
            <InventoryTable table={table} loading={loading} columnsCount={2} />
          </div>
        </div>
      )}

      {/* FLOATING CART BUTTON */}
      {cart.length > 0 && (
        <Button
          onClick={() => {
            setIsCartOpen(true);
            setIsFormStep(false);
          }}
          className="fixed bottom-10 right-10 h-20 px-10 rounded-[2.5rem] shadow-2xl bg-slate-900 hover:scale-105 transition-all z-50 group border-b-4 border-indigo-600"
        >
          <div className="relative mr-4 bg-white/10 p-3 rounded-2xl">
            <ShoppingCart className="text-indigo-400" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] w-6 h-6 rounded-full flex items-center justify-center border-2 border-slate-900 font-black italic">
              {cart.length}
            </span>
          </div>
          <span className="font-black uppercase tracking-[0.2em] text-sm italic">
            Review & Pinjam
          </span>
        </Button>
      )}

      {/* DRAWER KERANJANG */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={setIsCartOpen}
        isFormStep={isFormStep}
        cartCount={cart.length}
        onNext={handleCheckout}
        loading={loading}
      >
        {!isFormStep ? (
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="p-5 bg-slate-50 rounded-4xl border-2 border-slate-100 space-y-4"
              >
                <div className="flex justify-between">
                  <span className="font-black uppercase italic text-xs text-slate-700">
                    {item.nama_alat}
                  </span>
                  <button
                    onClick={() =>
                      setCart(cart.filter((c) => c.id !== item.id))
                    }
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
                {item.is_aset ? (
                  <div className="space-y-2">
                    {item.selected_tags.map((tag, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Select
                          value={tag}
                          onValueChange={(v) => {
                            const newTags = [...item.selected_tags];
                            newTags[idx] = v;
                            setCart(
                              cart.map((c) =>
                                c.id === item.id
                                  ? { ...c, selected_tags: newTags }
                                  : c,
                              ),
                            );
                          }}
                        >
                          <SelectTrigger className="rounded-xl h-10 text-[10px] font-bold">
                            <SelectValue placeholder="Pilih Kode Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            {item.kode_tag_list?.map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {item.selected_tags.length > 1 && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-red-500"
                            onClick={() => {
                              const newTags = item.selected_tags.filter(
                                (_, i) => i !== idx,
                              );
                              setCart(
                                cart.map((c) =>
                                  c.id === item.id
                                    ? { ...c, selected_tags: newTags }
                                    : c,
                                ),
                              );
                            }}
                          >
                            <Minus size={14} />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full rounded-xl border-dashed border-2 text-[10px] font-black"
                      onClick={() =>
                        setCart(
                          cart.map((c) =>
                            c.id === item.id
                              ? {
                                  ...c,
                                  selected_tags: [...c.selected_tags, ""],
                                }
                              : c,
                          ),
                        )
                      }
                    >
                      <Plus className="w-3 h-3 mr-1" /> TAMBAH UNIT
                    </Button>
                  </div>
                ) : (
                  <Input
                    type="number"
                    min="1"
                    max={item.jumlah}
                    value={item.qty}
                    onChange={(e) =>
                      setCart(
                        cart.map((c) =>
                          c.id === item.id
                            ? { ...c, qty: parseInt(e.target.value) }
                            : c,
                        ),
                      )
                    }
                    className="h-10 rounded-xl font-bold"
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                Lokasi Penggunaan
              </label>
              <Select onValueChange={setTargetRoom}>
                <SelectTrigger className="h-14 rounded-2xl border-2">
                  <SelectValue placeholder="Pilih Ruangan Lab" />
                </SelectTrigger>
                <SelectContent>
                  {RUANGAN_SPESIFIK.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                Tujuan Penggunaan
              </label>
              <Textarea
                placeholder="Contoh: Praktikum Antena - Kelompok 4"
                rows={3}
                className="rounded-2xl border-2"
                value={tujuan}
                onChange={(e) => setTujuan(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                Foto Kondisi Alat
              </label>
              {!showCamera ? (
                <div
                  onClick={() => setShowCamera(true)}
                  className="h-44 bg-slate-50 border-2 border-dashed rounded-4xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 overflow-hidden"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <CameraIcon className="text-indigo-500 mb-2" />
                      <span className="text-[10px] font-bold uppercase text-slate-400">
                        Ambil Foto
                      </span>
                    </>
                  )}
                </div>
              ) : (
                <div className="relative h-64 rounded-4xl overflow-hidden shadow-xl">
                  <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 inset-x-0 flex justify-center gap-3">
                    <Button
                      size="sm"
                      variant="destructive"
                      className="rounded-full"
                      onClick={() => setShowCamera(false)}
                    >
                      Batal
                    </Button>
                    <Button
                      size="sm"
                      className="rounded-full bg-white text-black hover:bg-slate-200"
                      onClick={capture}
                    >
                      Jepret
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CartDrawer>
    </div>
  );
}
