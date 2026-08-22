import api from "./api";


// =========================================================
// ASK QUESTION
// =========================================================

export const askQuestion = async (
    question,
    filename,
    chatId = null
) => {
    const response = await api.post(
        "/chat/ask",
        {
            question,
            filename,
            chat_id: chatId,
        }
    );

    return response.data;
};


// =========================================================
// GET ALL CHATS
// =========================================================

export const getChats = async () => {

    const response = await api.get(
        "/chat/chats"
    );

    return response.data;
};


// =========================================================
// CREATE NEW CHAT
// =========================================================

export const createChat = async (filename) => {

    const response = await api.post(
        "/chat/chats",
        {
            filename,
        }
    );

    return response.data;
};


// =========================================================
// GET CHAT + MESSAGES
// =========================================================

export const getChat = async (chatId) => {

    const response = await api.get(
        `/chat/chats/${chatId}`
    );

    return response.data;
};