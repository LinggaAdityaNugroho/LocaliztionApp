export async function getProfile() {
  const res = await fetch("http://localhost:3000/user/profile", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Failed get profile");

  const data = await res.json();
  return data;
}
