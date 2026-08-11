import { useEffect, useState } from "react";
import "./chat.css";

import ChatSidebar from "../components/chat/ChatSidebar";
import ChatWindow from "../components/chat/ChatWindow";

import { askQuestion } from "../services/chatService";
import { getDocuments } from "../services/documentService";

function Chat() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const [documents, setDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState("");
    const [loadingDocuments, setLoadingDocuments] = useState(true);

    useEffect(() => {
        const loadDocuments = async () => {
            try {
                const response = await getDocuments();

                const docs = response.documents || [];

                setDocuments(docs);

                if (docs.length > 0) {
                    setSelectedDocument(docs[0].filename);
                }
            } catch (error) {
                console.error("Failed to load documents:", error);
            } finally {
                setLoadingDocuments(false);
            }
        };

        loadDocuments();
    }, []);

    const handleSend = async (question) => {
        if (!selectedDocument) {
            setMessages((prev) => [
                ...prev,
                {
                    user: false,
                    message: "Please select a document before asking a question.",
                },
            ]);

            return;
        }

        setMessages((prev) => [
            ...prev,
            {
                user: true,
                message: question,
            },
        ]);

        setLoading(true);

        try {
            const response = await askQuestion(
                question,
                selectedDocument
            );

            setMessages((prev) => [
                ...prev,
                {
                    user: false,
                    message: response.answer,
                    sources: response.sources || [],
                },
            ]);
        } catch (error) {
            console.error("Chat error:", error);

            setMessages((prev) => [
                ...prev,
                {
                    user: false,
                    message: "Sorry, I couldn't process your question.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-page">

            <ChatSidebar />

            <div className="chat-main">

                <div className="document-selector">

                    <label>Select Document</label>

                    {loadingDocuments ? (
                        <span>Loading documents...</span>
                    ) : documents.length === 0 ? (
                        <span>No documents uploaded yet.</span>
                    ) : (
                        <select
                            value={selectedDocument}
                            onChange={(e) => {
                                setSelectedDocument(e.target.value);
                                setMessages([]);
                            }}
                        >
                            {documents.map((doc) => (
                                <option
                                    key={doc.filename}
                                    value={doc.filename}
                                >
                                    {doc.filename}
                                </option>
                            ))}
                        </select>
                    )}

                </div>

                <ChatWindow
                    messages={messages}
                    onSend={handleSend}
                    loading={loading}
                />

            </div>

        </div>
    );
}

export default Chat;