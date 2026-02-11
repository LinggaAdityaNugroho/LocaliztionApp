import { useEffect, useState } from "react";
import { SelectAlat } from "../atoms/SelectAlat";

export function PeminjamanForm() {
  const [alat, setAlat] = useState<any[]>([]);
  const [form, setForm] = useState({
    alat_id: null as number | null,
    nama_mahasiswa: "",
    nim: "",
    laboratorium: "",
    tujuan_penggunaan: "",
    waktu_pinjam: "",
    waktu_kembali: "",
  });

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/alat")
      .then((r) => r.json())
      .then(setAlat);
  }, []);

  const submit = async () => {
    await fetch("http://127.0.0.1:8000/api/peminjaman", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    alert("Peminjaman berhasil diajukan");
  };

  return (
    <div className="space-y-3">
      <SelectAlat
        value={form.alat_id}
        onChange={(v) => setForm({ ...form, alat_id: v })}
        options={alat.map((a) => ({
          id: a.id,
          label: `${a.nama_alat} (${a.tersedia})`,
        }))}
      />

      {["nama_mahasiswa", "nim", "laboratorium", "tujuan_penggunaan"].map(
        (f) => (
          <input
            key={f}
            placeholder={f.replace("_", " ")}
            className="border px-3 py-2 w-full"
            onChange={(e) => setForm({ ...form, [f]: e.target.value })}
          />
        )
      )}

      <input
        type="datetime-local"
        onChange={(e) =>
          setForm({
            ...form,
            waktu_pinjam: e.target.value.replace("T", " ") + ":00",
          })
        }
      />

      <input
        type="datetime-local"
        onChange={(e) =>
          setForm({
            ...form,
            waktu_kembali: e.target.value.replace("T", " ") + ":00",
          })
        }
      />

      <button
        onClick={submit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Ajukan Peminjaman
      </button>
    </div>
  );
}
