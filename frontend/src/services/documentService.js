import axios from "axios";

const API = "http://127.0.0.1:8000";

const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
});

export const uploadDocument = async (file, replace = false) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
        `${API}/documents/upload?replace=${replace}`,
        formData,
        {
            headers: {
                ...getAuthHeaders(),
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

export const getDocuments = async () => {
    const response = await axios.get(
        `${API}/documents`,
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};

export const deleteDocument = async (filename) => {
    const response = await axios.delete(
        `${API}/documents/${filename}`,
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};