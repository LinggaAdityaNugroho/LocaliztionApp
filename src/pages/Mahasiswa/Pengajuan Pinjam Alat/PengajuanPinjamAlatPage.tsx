import { useState, useCallback, useMemo, useRef, useEffect } from "react";
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
  CheckCircle2,
  ShoppingCart,
} from "lucide-react";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { PageLayout } from "../../../layouts/PageLayout";
import { InventoryTable } from "../../../components/organism/Table/InventoryTable";
import { LabGroupCard } from "../../../components/molecules/LabGroupCard";
import { CartDrawer } from "../../../components/organism/CartDrawer";
import { CartItemList } from "../../../components/organism/CartItemList";
import { CheckoutFormStep } from "../../../components/organism/CheckoutFormStep";

import api from "../../../services/api";
import { Badge } from "../../../components/ui/badge";
import Swal from "sweetalert2";
import { LoanPagination } from "../../../components/organism/LoanPagination";

const LAB_GROUPS = [
  {
    name: "Gedung Elektronika",
    icon: Activity,
    color: "from-zinc-700 to-zinc-900",
  },
  {
    name: "Gedung Telekomunikasi",
    icon: Network,
    color: "from-zinc-800 to-black",
  },
  {
    name: "Gedung UPT Bahasa",
    icon: Cpu,
    color: "from-zinc-600 to-zinc-800",
  },
  {
    name: "Gedung Magister Terapan",
    icon: Camera,
    color: "from-zinc-500 to-zinc-700",
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

  const [captchaString, setCaptchaString] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const generateCaptcha = useCallback(() => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaString(result);
    setCaptchaInput("");
  }, []);

  useEffect(() => {
    if (isFormStep) generateCaptcha();
  }, [isFormStep, generateCaptcha]);

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
    const isBooking = startTime !== "";
    if (!isFormStep) return setIsFormStep(true);

    if (!targetRoom)
      return Swal.fire(
        "Form Kosong",
        "Silakan tentukan ruangan lab tujuan.",
        "warning",
      );
    if (!tujuan.trim())
      return Swal.fire(
        "Form Kosong",
        "Tujuan penggunaan wajib diisi.",
        "warning",
      );
    if (!imageFile)
      return Swal.fire(
        "Foto Diperlukan",
        "Harap ambil foto kondisi fisik alat.",
        "warning",
      );
    if (captchaInput.toUpperCase() !== captchaString)
      return Swal.fire("Validasi Gagal", "Kode Captcha salah.", "error");

    if (!isBooking && !imageFile) {
      return Swal.fire(
        "Foto Diperlukan",
        "Foto kondisi fisik wajib dilampirkan untuk peminjaman langsung.",
        "warning",
      );
    }

    if (startTime && endTime && new Date(startTime) >= new Date(endTime)) {
      return Swal.fire(
        "Waktu Tidak Valid",
        "Jam selesai harus di atas jam waktu mulai pemesanan.",
        "warning",
      );
    }

    const formData = new FormData();
    formData.append("ruangan_lab", targetRoom);
    formData.append("tujuan", tujuan);
    formData.append("foto_before", imageFile);
    formData.append("waktu_mulai", startTime);
    formData.append("waktu_selesai", endTime);

    const itemsPayload = cart.map((i) => ({
      id: i.id,
      qty: i.is_aset ? i.selected_tags.length : i.qty,
      kode_tag_list: i.is_aset ? i.selected_tags : [],
    }));

    formData.append("items", JSON.stringify(itemsPayload));

    try {
      setLoading(true);
      const response = await api.post("/peminjaman/ajukan", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201 || response.status === 200) {
        Swal.fire(
          "Pengajuan Sukses",
          "Berkas peminjaman dikirim ke koordinator laboratorium.",
          "success",
        );
        setCart([]);
        setIsCartOpen(false);
        window.location.reload();
      }
    } catch (err: any) {
      Swal.fire(
        "Gagal",
        err.response?.data?.message || "Terjadi kendala pada server internal.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(alatList.length / itemsPerPage) || 1;
  const columns = useMemo<ColumnDef<Alat>[]>(
    () => [
      {
        header: "Nama Alat",
        cell: ({ row }) => (
          <div className="py-2">
            <div className="font-sans font-black text-zinc-900 dark:text-zinc-100 text-xs tracking-tight ">
              {row.original.nama_alat}
            </div>
            <div className="text-xs text-zinc-400 dark:text-zinc-500 font-bold tracking-wider mt-0.5 ">
              Ruangan: {row.original.letak}
            </div>
          </div>
        ),
      },
      {
        header: "Stok",
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className="font-mono font-black text-[10px] bg-zinc-50 text-zinc-800 border-zinc-950 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800 rounded-none shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none "
          >
            {row.original.jumlah} Unit
          </Badge>
        ),
      },
      {
        header: "Aksi",
        id: "actions",
        cell: ({ row }) => {
          const isAdded = cart.some((i) => i.id === row.original.id);
          return (
            <Button
              size="sm"
              disabled={row.original.jumlah <= 0}
              variant={isAdded ? "outline" : "brutal"}
              color={isAdded ? "green" : "blue"}
              onClick={() => addToCart(row.original)}
            >
              {isAdded ? (
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Masuk Keranjang</span>
                </div>
              ) : (
                "Pinjam"
              )}
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
    state: {
      globalFilter,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: itemsPerPage,
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <PageLayout
      pageTitle="Katalog Alat Laboratorium"
      pageDescription="Pilih kluster gedung, tentukan kode perangkat telemetri, dan isi formulir pemesanan praktikum."
    >
      <div className="py-6 w-full  space-y-10 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-900 text-left">
        {!selectedGroup ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-full px-1 sm:px-0 ">
            {LAB_GROUPS.map((lab) => (
              <LabGroupCard
                key={lab.name}
                {...lab}
                onClick={() => handleSelectGroup(lab.name)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300 w-full ">
            <div className="flex items-center justify-between">
              <Button variant="brutal" onClick={() => setSelectedGroup(null)}>
                <ArrowLeft className="mr-1.5 w-4 h-4" /> Kembali ke Katalog
                Utama
              </Button>
              {selectedGroup && (
                <Input
                  placeholder="Cari nama alat laboratorium..."
                  className="max-w-xs h-11 bg-white dark:bg-zinc-950 font-medium text-xs border border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-900 rounded-none shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none"
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                />
              )}
            </div>
            <InventoryTable table={table} loading={loading} columnsCount={3} />
            <div className="w-full flex justify-center pt-2">
              <LoanPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        )}

        {cart.length > 0 && (
          <Button
            onClick={() => {
              setIsCartOpen(true);
              setIsFormStep(false);
            }}
            variant={"brutal"}
            className="fixed bottom-8 right-8 h-16 px-4 z-40 group shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none rounded-none"
          >
            <div className="relative bg-white/10 dark:bg-black/10 p-2">
              <ShoppingCart size={16} />
              <span className="absolute -top-1.5 -right-1.5 bg-zinc-900 dark:bg-zinc-50 border border-white dark:border-zinc-900 text-[9px] w-5 h-5 flex items-center justify-center font-mono font-black text-white dark:text-zinc-900 shadow-sm">
                {cart.length}
              </span>
            </div>
          </Button>
        )}

        <CartDrawer
          isOpen={isCartOpen}
          onClose={setIsCartOpen}
          isFormStep={isFormStep}
          cartCount={cart.length}
          onNext={handleCheckout}
          loading={loading}
        >
          {!isFormStep ? (
            <CartItemList
              cart={cart}
              onRemove={(id) => setCart(cart.filter((c) => c.id !== id))}
              onUpdateTags={(id, newTags) =>
                setCart(
                  cart.map((c) =>
                    c.id === id ? { ...c, selected_tags: newTags } : c,
                  ),
                )
              }
              onUpdateQty={(id, newQty) =>
                setCart(
                  cart.map((c) => (c.id === id ? { ...c, qty: newQty } : c)),
                )
              }
            />
          ) : (
            <CheckoutFormStep
              targetRoom={targetRoom}
              setTargetRoom={setTargetRoom}
              tujuan={tujuan}
              setTujuan={setTujuan}
              startTime={startTime}
              setStartTime={setStartTime}
              endTime={endTime}
              setEndTime={setEndTime}
              showCamera={showCamera}
              setShowCamera={setShowCamera}
              imagePreview={imagePreview}
              webcamRef={webcamRef}
              onCapture={capture}
              captchaString={captchaString}
              captchaInput={captchaInput}
              setCaptchaInput={setCaptchaInput}
              onRefreshCaptcha={generateCaptcha}
              rooms={RUANGAN_SPESIFIK}
            />
          )}
        </CartDrawer>
      </div>
    </PageLayout>
  );
}
