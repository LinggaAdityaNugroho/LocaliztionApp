import { QrScannerModal } from "../../components/molecules/QRScannerModal";
import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import api from "../../services/api";

interface UserData {
  name: string;
  email: string;
  student_class: {
    class: string;
  };
}

export function ClassPage() {
  const [qr, setQr] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [scanResult, setScanResult] = useState<any>(null);
  const [classmates, setClassmates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processLoading, setProcessLoading] = useState(false);

  // State untuk Randomizer
  const [numGroups, setNumGroups] = useState<number>(2);
  const [groups, setGroups] = useState<any[][]>([]);

  useEffect(() => {
    const initApp = async () => {
      try {
        setLoading(true);
        const [userRes, sessionRes] = await Promise.all([
          api.get("user"),
          api.get("scan-room/check-session"),
        ]);

        setUserData(userRes.data);
        if (sessionRes.data.active) {
          setScanResult(sessionRes.data.data);
          setClassmates(sessionRes.data.classmates || []);
        }
      } catch (error) {
        console.error("Gagal sinkronisasi sesi.");
      } finally {
        setLoading(false);
      }
    };
    initApp();
  }, []);

  const handleScan = async (scannedId: string) => {
    setProcessLoading(true);
    try {
      await api.post("scan-room/scan", {
        roomclass_id: parseInt(scannedId),
        keperluan: "Praktikum Jaringan",
      });
      const sessionRes = await api.get("scan-room/check-session");
      setScanResult(sessionRes.data.data);
      setClassmates(sessionRes.data.classmates);
      setQr(false);
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal scan");
    } finally {
      setProcessLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!scanResult?.id) return;
    setProcessLoading(true);
    try {
      await api.post(`scan-room/checkout/${scanResult.id}`);
      setScanResult(null);
      setClassmates([]);
      setGroups([]);
    } catch (error) {
      alert("Gagal keluar");
    } finally {
      setProcessLoading(false);
    }
  };

  const generateGroups = () => {
    if (classmates.length === 0) return;
    const shuffled = [...classmates].sort(() => Math.random() - 0.5);
    const result: any[][] = Array.from(
      { length: Math.max(1, numGroups) },
      () => [],
    );

    shuffled.forEach((student, index) => {
      result[index % result.length].push(student);
    });
    setGroups(result);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className=" min-h-screen p-4 md:p-8 transition-colors duration-300">
      <QrScannerModal
        open={qr}
        onClose={() => setQr(false)}
        onScan={handleScan}
      />

      <div className="max-w-6xl mx-auto">
        {!scanResult ? (
          /* HERO SECTION - BEFORE SCAN */
          <div className="max-w-md mx-auto bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 text-center mt-10 transform transition-all hover:scale-[1.01]">
            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">📡</span>
            </div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
              Presensi Digital
            </h1>
            <p className="text-indigo-600 dark:text-indigo-400 font-bold tracking-widest text-sm mb-8">
              KELAS {userData?.student_class.class}
            </p>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl mb-8 border border-slate-100 dark:border-slate-700">
              <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black mb-1">
                Identitas Mahasiswa
              </p>
              <p className="font-bold text-slate-700 dark:text-slate-200">
                {userData?.name}
              </p>
            </div>

            <Button
              onClick={() => setQr(true)}
              className="w-full py-8 text-lg rounded-2xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-xl shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
              disabled={processLoading}
            >
              {processLoading ? "Memproses..." : "Scan Barcode Masuk"}
            </Button>
          </div>
        ) : (
          /* DASHBOARD SECTION - AFTER SCAN */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* PANEL KIRI: DAFTAR HADIR */}
            <div className="lg:col-span-4">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 sticky top-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                    Daftar Hadir
                  </h3>
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                      AKTIF
                    </span>
                  </div>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {classmates.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center p-3 rounded-2xl border transition-all ${
                        item.email === userData?.email
                          ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800"
                          : "bg-slate-50 dark:bg-slate-800/40 border-transparent"
                      }`}
                    >
                      <div className="w-10 h-10 bg-white dark:bg-slate-700 shadow-sm rounded-xl flex items-center justify-center text-sm font-black text-indigo-600 dark:text-indigo-400 mr-4 shrink-0">
                        {item.name.charAt(0)}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                          {item.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="destructive"
                  className="w-full mt-8 rounded-2xl py-7 font-black text-sm tracking-widest uppercase bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700 transition-all shadow-lg shadow-rose-100 dark:shadow-none"
                  onClick={handleCheckout}
                  disabled={processLoading}
                >
                  SCAN KELUAR
                </Button>
              </div>
            </div>

            {/* PANEL KANAN: RANDOMIZER */}
            <div className="lg:col-span-8">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 h-full">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-2xl text-xl">
                    🎲
                  </div>
                  <h3 className="font-black text-xl text-slate-800 dark:text-slate-100 tracking-tight">
                    Group Randomizer
                  </h3>
                </div>

                <div className="flex flex-col sm:flex-row items-end gap-4 mb-10 bg-slate-50 dark:bg-slate-800/40 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
                  <div className="w-full sm:w-32">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 mb-2 block uppercase tracking-widest">
                      Jumlah
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={numGroups}
                      onChange={(e) =>
                        setNumGroups(parseInt(e.target.value) || 1)
                      }
                      className="w-full p-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-black text-indigo-600 dark:text-indigo-400 text-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <Button
                    onClick={generateGroups}
                    className="w-full sm:flex-1 h-[60px] bg-slate-800 hover:bg-slate-950 dark:bg-indigo-600 dark:hover:bg-indigo-700 rounded-2xl font-bold text-white shadow-xl transition-all active:scale-[0.98]"
                  >
                    ACAK KELOMPOK SEKARANG
                  </Button>
                </div>

                {/* HASIL KELOMPOK */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {groups.length > 0 ? (
                    groups.map((group, gIdx) => (
                      <div
                        key={gIdx}
                        className="group p-6 bg-white dark:bg-slate-800/30 border-2 border-slate-50 dark:border-slate-800 rounded-[2rem] shadow-sm hover:border-indigo-200 dark:hover:border-indigo-900 transition-all duration-300"
                      >
                        <div className="flex items-center mb-5 pb-4 border-b border-dashed border-slate-100 dark:border-slate-700">
                          <span className="w-8 h-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-lg shadow-indigo-200 dark:shadow-none mr-3">
                            {gIdx + 1}
                          </span>
                          <h4 className="font-black text-slate-800 dark:text-slate-200 text-sm tracking-tight">
                            KELOMPOK {gIdx + 1}
                          </h4>
                        </div>
                        <ul className="space-y-3">
                          {group.map((s, sIdx) => (
                            <li
                              key={sIdx}
                              className="text-[13px] text-slate-600 dark:text-slate-400 flex items-center font-semibold group-hover:translate-x-1 transition-transform"
                            >
                              <span className="w-1.5 h-1.5 bg-indigo-400 dark:bg-indigo-600 rounded-full mr-3 shrink-0"></span>
                              <span className="truncate">{s.name}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <div className="md:col-span-2 py-24 text-center border-4 border-dashed border-slate-50 dark:border-slate-800/50 rounded-[2.5rem]">
                      <p className="text-slate-300 dark:text-slate-700 font-black text-lg uppercase tracking-tighter italic">
                        Belum Ada Kelompok Terbentuk
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
