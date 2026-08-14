import { useEffect, useRef, useState } from "react";
import { Minus, Plus, Send, X } from "lucide-react";

import { uploadDocument, getDocuments } from "../../services/documentService";
import { askQuestion } from "../../services/chatService";

import chatbotImage from "../../assets/logo/chatbot-c.jpg";

import "./chatbot.css";

function ChatbotLauncher() {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: "assistant",
            text: "Hi! I'm Stratum AI. Upload a document or ask me something.",
        },
    ]);

    const [selectedDocument, setSelectedDocument] = useState("");
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef(null);

    /* =========================================================
       LOAD EXISTING DOCUMENTS
    ========================================================= */

    useEffect(() => {
        const loadDocuments = async () => {
            try {
                const response = await getDocuments();

                const documents = response.documents || [];

                if (documents.length > 0) {
                    setSelectedDocument(documents[0].filename);
                }
            } catch (error) {
                console.error(
                    "Failed to load chatbot documents:",
                    error
                );
            }
        };

        loadDocuments();
    }, []);

    /* =========================================================
       SEND MESSAGE
    ========================================================= */

    const handleSend = async () => {
        const trimmedMessage = message.trim();

        if (!trimmedMessage || loading) return;

        /* No document yet */

        if (!selectedDocument) {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    type: "user",
                    text: trimmedMessage,
                },
                {
                    id: Date.now() + 1,
                    type: "assistant",
                    text: "Please upload a document first so I can answer questions about it.",
                },
            ]);

            setMessage("");
            return;
        }

        /* Add user message */

        setMessages((prev) => [
            ...prev,
            {
                id: Date.now(),
                type: "user",
                text: trimmedMessage,
            },
        ]);

        setMessage("");
        setLoading(true);

        try {
            const response = await askQuestion(
                trimmedMessage,
                selectedDocument
            );

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    type: "assistant",
                    text:
                        response.answer ||
                        "I couldn't generate an answer.",
                },
            ]);
        } catch (error) {
            console.error("Chatbot question error:", error);

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    type: "assistant",
                    text:
                        error.response?.data?.detail ||
                        "Sorry, I couldn't process your question.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    /* =========================================================
       ENTER TO SEND
    ========================================================= */

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    /* =========================================================
       UPLOAD DOCUMENT
    ========================================================= */

    const handleUploadClick = () => {
        if (!uploading) {
            fileInputRef.current?.click();
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setUploading(true);

        setMessages((prev) => [
            ...prev,
            {
                id: Date.now(),
                type: "system",
                text: `Uploading ${file.name}...`,
            },
        ]);

        try {
            const response = await uploadDocument(file);

            /* Make this document the active chatbot document */

            setSelectedDocument(file.name);

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    type: "system",
                    text:
                        response.message ||
                        `${file.name} is ready. You can ask me questions about it.`,
                },
            ]);
        } catch (error) {
            console.error("Chatbot upload error:", error);

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    type: "system",
                    text:
                        error.response?.data?.detail ||
                        "Upload failed. Please try again.",
                },
            ]);
        } finally {
            setUploading(false);

            /* Allow the same file to be selected again */

            event.target.value = "";
        }
    };

    /* =========================================================
       NEW CHAT
    ========================================================= */

    const handleNewChat = () => {
        setMessages([
            {
                id: Date.now(),
                type: "assistant",
                text: selectedDocument
                    ? `New conversation started. Ask me anything about ${selectedDocument}.`
                    : "New conversation started. Upload a document or ask me something.",
            },
        ]);

        setMessage("");
    };

    /* =========================================================
       RENDER
    ========================================================= */

    return (
        <>
            {/* =================================================
                CHAT WINDOW
            ================================================= */}

            <div
                className={`chatbot-widget ${
                    open ? "chatbot-widget-open" : ""
                }`}
            >
                {/* HEADER */}

                <div className="chatbot-header">

                    <div className="chatbot-brand">

                        <img
                            src={chatbotImage}
                            alt="Stratum AI"
                            className="chatbot-header-image"
                        />

                        <div>
                            <h3>Stratum AI</h3>

                            <span>
                                Document assistant
                            </span>
                        </div>

                    </div>

                    <div className="chatbot-header-actions">

                        <button
                            type="button"
                            onClick={handleNewChat}
                            aria-label="New chat"
                            title="New chat"
                        >
                            <Plus size={17} />
                        </button>

                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            aria-label="Minimize chatbot"
                            title="Minimize"
                        >
                            <Minus size={17} />
                        </button>

                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            aria-label="Close chatbot"
                            title="Close"
                        >
                            <X size={17} />
                        </button>

                    </div>

                </div>


                {/* MESSAGES */}

                <div className="chatbot-messages">

                    {messages.map((item) => (

                        <div
                            key={item.id}
                            className={`chatbot-message chatbot-message-${item.type}`}
                        >
                            {item.text}
                        </div>

                    ))}

                    {loading && (
                        <div className="chatbot-message chatbot-message-assistant chatbot-typing">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    )}

                    {uploading && (
                        <div className="chatbot-message chatbot-message-system">
                            Processing document...
                        </div>
                    )}

                </div>


                {/* INPUT */}

                <div className="chatbot-input-area">

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.docx,.txt"
                        onChange={handleFileUpload}
                        hidden
                    />

                    {/* UPLOAD */}

                    <button
                        type="button"
                        className="chatbot-upload"
                        onClick={handleUploadClick}
                        disabled={uploading}
                        aria-label="Upload document"
                        title="Upload document"
                    >
                        <Plus size={19} />
                    </button>


                    {/* MESSAGE */}

                    <input
                        type="text"
                        value={message}
                        onChange={(event) =>
                            setMessage(event.target.value)
                        }
                        onKeyDown={handleKeyDown}
                        placeholder={
                            selectedDocument
                                ? "Ask about your document..."
                                : "Upload a document first..."
                        }
                        disabled={loading || uploading}
                    />


                    {/* SEND */}

                    <button
                        type="button"
                        className="chatbot-send"
                        onClick={handleSend}
                        disabled={
                            !message.trim() ||
                            loading ||
                            uploading
                        }
                        aria-label="Send message"
                    >
                        <Send size={18} />
                    </button>

                </div>

            </div>


            {/* =================================================
                FLOATING LAUNCHER
            ================================================= */}

            <button
                type="button"
                className={`chatbot-launcher ${
                    open ? "chatbot-launcher-hidden" : ""
                }`}
                onClick={() => setOpen(true)}
                aria-label="Open Stratum AI"
            >
                <img
                    src={chatbotImage}
                    alt="Open Stratum AI"
                />

                <span className="chatbot-launcher-pulse" />
            </button>
        </>
    );
}

export default ChatbotLauncher;