import { useEffect, useState } from "react";
import api from "../../services/api";

export function ClassPage() {
  const [user, setUser] = useState<any>(null);
  const [classmates, setClassmates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // random 1 orang
  const [selected, setSelected] = useState<any>(null);

  // random kelompok
  const [groupCount, setGroupCount] = useState(3);
  const [groups, setGroups] = useState<any[][]>([]);

  // 🔥 fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, classRes] = await Promise.all([
          api.get("/user"),
          api.get("/classmates"),
        ]);

        setUser(userRes.data);
        setClassmates(classRes.data);
      } catch (err) {
        console.error("Error ambil data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🎯 random 1 orang
  const randomPick = () => {
    if (!classmates.length) return;

    const rand = classmates[Math.floor(Math.random() * classmates.length)];

    setSelected(rand);
  };

  // 🎯 random kelompok
  const generateGroups = () => {
    if (!classmates.length) return;

    // shuffle
    const shuffled = [...classmates].sort(() => Math.random() - 0.5);

    const result: any[][] = Array.from({ length: groupCount }, () => []);

    // bagi rata
    shuffled.forEach((student, index) => {
      result[index % groupCount].push(student);
    });

    setGroups(result);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* USER INFO */}
      <div className="bg-white shadow rounded-xl p-6">
        <h1 className="text-2xl font-bold">{user?.name}</h1>
        <p className="text-gray-500">Kelas: {user?.kelas}</p>
      </div>

      {/* RANDOM 1 ORANG */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="font-bold mb-4">🎯 Random 1 Orang</h2>

        <button
          onClick={randomPick}
          className="bg-indigo-600 text-white px-6 py-2 rounded"
        >
          Pilih Acak
        </button>

        {selected && (
          <div className="mt-4 p-4 bg-green-100 rounded">
            🎉 Terpilih: <b>{selected.name}</b> ({selected.nim_nip})
          </div>
        )}
      </div>

      {/* RANDOM KELOMPOK */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="font-bold mb-4">👥 Random Kelompok</h2>

        <div className="flex gap-2 mb-4">
          <input
            type="number"
            min={1}
            value={groupCount}
            onChange={(e) => setGroupCount(Number(e.target.value))}
            className="border px-3 py-2 rounded w-32"
          />

          <button
            onClick={generateGroups}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Generate
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((group, i) => (
            <div key={i} className="border rounded p-4">
              <h3 className="font-bold mb-2">Kelompok {i + 1}</h3>

              <ul className="space-y-1">
                {group.map((student) => (
                  <li key={student.id}>
                    {student.name} ({student.nim_nip})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* LIST CLASSMATES */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="font-bold mb-4">📋 Daftar Teman Kelas</h2>

        <ul className="space-y-2">
          {classmates.map((item) => (
            <li
              key={item.id}
              className="flex justify-between border p-3 rounded"
            >
              <span>{item.name}</span>
              <span className="text-gray-400 text-sm">{item.nim_nip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
