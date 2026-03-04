import { useState } from "react";
import { Button } from "../ui/button";
import api from "../../services/api";

interface AlatFormProps {
    onSuccess?: () => void;
}

export function AlatForm({ onSuccess }: AlatFormProps) {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        nama_alat: "",
        ruang_lab: "",
        total: 0,
        tersedia: 0,
        kondisi: "Baik"
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi Sederhana
        if (!form.nama_alat || !form.ruang_lab || form.total <= 0) {
            alert("Harap isi Nama Alat, Ruang Lab, dan Total Alat dengan benar.");
            return;
        }

        try {
            setLoading(true);
            const payload = { ...form, tersedia: form.total };

            await api.post("/alat", payload);

            alert("Alat baru berhasil ditambahkan!");
            if (onSuccess) onSuccess();

            // Reset Form
            setForm({
                nama_alat: "",
                ruang_lab: "",
                total: 0,
                tersedia: 0,
                kondisi: "Baik"
            });
        } catch (err: any) {
            alert(err.response?.data?.message || "Gagal menambahkan alat.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                {/* NAMA ALAT */}
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nama Alat</label>
                    <input
                        className="w-full p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-900 text-sm font-semibold dark:text-white outline-none focus:border-indigo-500"
                        placeholder="Contoh: Osiloskop Digital"
                        value={form.nama_alat}
                        onChange={(e) => setForm({ ...form, nama_alat: e.target.value })}
                    />
                </div>

                {/* RUANG LAB */}
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Ruang Laboratorium</label>
                    <input
                        className="w-full p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-900 text-sm font-semibold dark:text-white outline-none focus:border-indigo-500"
                        placeholder="Contoh: Lab Elektronika Dasar"
                        value={form.ruang_lab}
                        onChange={(e) => setForm({ ...form, ruang_lab: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* JUMLAH TOTAL */}
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Total Unit</label>
                        <input
                            type="number"
                            className="w-full p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-900 text-sm font-semibold dark:text-white outline-none focus:border-indigo-500"
                            value={form.total}
                            onChange={(e) => setForm({ ...form, total: parseInt(e.target.value) })}
                        />
                    </div>

                    {/* KONDISI */}
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Kondisi Awal</label>
                        <select
                            className="w-full p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-900 text-sm font-semibold dark:text-white outline-none focus:border-indigo-500 appearance-none"
                            value={form.kondisi}
                            onChange={(e) => setForm({ ...form, kondisi: e.target.value })}
                        >
                            <option value="Baik">Baik</option>
                            <option value="Rusak">Rusak</option>
                            <option value="Perlu Kalibrasi">Perlu Kalibrasi</option>
                        </select>
                    </div>
                </div>
            </div>

            <Button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 py-8 rounded-[2rem] font-black text-sm shadow-xl shadow-indigo-100 active:scale-95 disabled:bg-slate-400 transition-all"
            >
                {loading ? "PROSES MENYIMPAN..." : "TAMBAHKAN KE INVENTARIS"}
            </Button>
        </form>
    );
}