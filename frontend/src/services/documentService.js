import axios from "axios";

const API = "http://127.0.0.1:8000";

export const uploadDocument = async (file, replace = false) => {
  const token = localStorage.getItem("access_token");

  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    `${API}/documents/upload?replace=${replace}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};