import api from "./api";

export async function getProfile() {
  try {
    const res = await api.get("user", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw new Error("Failed to get profile");
  }
}
