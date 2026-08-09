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
        `${API}/documents/${encodeURIComponent(filename)}`,
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};

export const downloadDocument = async (filename) => {
    const response = await axios.get(
        `/documents/${encodeURIComponent(filename)}/download`,
        {
            responseType: "blob",
        }
    );

    const url = window.URL.createObjectURL(response.data);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
};

export const viewDocument = async (filename) => {

    const response = await axios.get(
        `${API}/documents/${encodeURIComponent(filename)}/download`,
        {
            headers: getAuthHeaders(),
            responseType: "blob",
        }
    );

    const blob = new Blob(
        [response.data],
        { type: "application/pdf" }
    );

    const url = window.URL.createObjectURL(blob);

    window.open(url, "_blank");
};

export const generateSummary = async (filename, length = "medium") => {
    const response = await axios.post(
        `${API}/documents/${encodeURIComponent(filename)}/summary?length=${length}`,
        {},
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};