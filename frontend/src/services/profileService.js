import api from "./api";

export const getProfile = async () => {
    const response = await api.get("/profile");
    return response.data;
};

export const updateProfile = async (data) => {
    const response = await api.put(
        "/profile",
        data,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

export const uploadProfileImage = async (file) => {
    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post(
        "/profile/image",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

export const removeProfileImage = async () => {
    const response = await api.delete(
        "/profile/image"
    );

    return response.data;
};