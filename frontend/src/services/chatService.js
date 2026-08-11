import api from "./api";

export const askQuestion = async (question, filename) => {
    const response = await api.post(
        "/chat/ask",
        {
            question,
            filename,
        }
    );

    return response.data;
};