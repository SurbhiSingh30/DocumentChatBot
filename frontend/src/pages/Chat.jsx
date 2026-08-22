import { useEffect, useState } from "react";
import "./chat.css";

import { FileText } from "lucide-react";

import api from "../services/api";
import { askQuestion } from "../services/chatService";
import { getDocuments } from "../services/documentService";

import ChatSidebar from "../components/chat/ChatSidebar";
import ChatWindow from "../components/chat/ChatWindow";


function Chat() {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const [documents, setDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState("");

    const [documentUrl, setDocumentUrl] = useState("");
    const [loadingDocument, setLoadingDocument] = useState(false);

    const [activeChatId, setActiveChatId] = useState(null);
    const [loadingChat, setLoadingChat] = useState(false);

    const [recentChats, setRecentChats] = useState([]);
    const [chatRefreshTrigger, setChatRefreshTrigger] = useState(0);

    const [selectedPage, setSelectedPage] = useState(null);
    const [activeSources, setActiveSources] = useState([]);


    /*
    =========================================================
    LOAD DOCUMENTS
    =========================================================
    */

    useEffect(() => {

        const loadDocuments = async () => {

            try {

                const response = await getDocuments();

                console.log(
                    "CHAT DOCUMENT RESPONSE:",
                    response
                );

                /*
                 * Support the existing backend response:
                 *
                 * {
                 *     "documents": [...]
                 * }
                 *
                 * and also a direct array response.
                 */

                const docs = Array.isArray(response)
                    ? response
                    : response?.documents || [];

                console.log(
                    "CHAT DOCUMENTS:",
                    docs
                );

                setDocuments(docs);

                /*
                 * Automatically select the first document
                 * when documents exist.
                 */

                if (docs.length > 0) {

                    setSelectedDocument(
                        docs[0].filename
                    );

                } else {

                    setSelectedDocument("");

                }

            } catch (error) {

                console.error(
                    "Failed to load documents:",
                    error
                );

                setDocuments([]);
                setSelectedDocument("");

            }

        };

        loadDocuments();

    }, []);


    /*
    =========================================================
    LOAD SELECTED DOCUMENT
    =========================================================
    */

    useEffect(() => {

        if (!selectedDocument) {

            setDocumentUrl("");

            return;

        }


        const loadDocument = async () => {

            setLoadingDocument(true);

            try {

                const response = await api.get(
                    `/documents/${encodeURIComponent(
                        selectedDocument
                    )}/download`,
                    {
                        responseType: "blob",

                        /*
                         * IMPORTANT:
                         * The PDF endpoint requires authentication.
                         */

                        headers: {
                            Authorization:
                                `Bearer ${localStorage.getItem(
                                    "access_token"
                                )}`,
                        },
                    }
                );


                const blob = new Blob(
                    [response.data],
                    {
                        type: "application/pdf",
                    }
                );


                const url =
                    window.URL.createObjectURL(blob);

                setDocumentUrl(url);
                setSelectedPage(null);

            } catch (error) {

                console.error(
                    "Failed to load document:",
                    error
                );

                setDocumentUrl("");

            } finally {

                setLoadingDocument(false);

            }

        };


        loadDocument();


        return () => {

            setDocumentUrl((currentUrl) => {

                if (currentUrl) {

                    window.URL.revokeObjectURL(
                        currentUrl
                    );

                }

                return "";

            });

        };

    }, [selectedDocument]);


    /*
    =========================================================
    SEND MESSAGE
    =========================================================
    */

    const handleSend = async (question) => {

        if (
            !question?.trim() ||
            loading
        ) {
            return;
        }


        if (!selectedDocument) {

            setMessages((prev) => [

                ...prev,

                {
                    user: false,
                    message:
                        "Please select a document before asking a question.",
                    sources: [],
                },

            ]);

            return;

        }


        /*
         * Add user's message immediately.
         */

        setMessages((prev) => [

            ...prev,

            {
                user: true,
                message: question,
            },

        ]);


        setLoading(true);


        try {

            /*
             * Pass the currently active chat ID.
             *
             * null = backend creates a new chat.
             * existing ID = continue that chat.
             */

            const response = await askQuestion(
                question,
                selectedDocument,
                activeChatId
            );

            setActiveChatId(response.chat_id);

            // Refresh Recent Chats
            setChatRefreshTrigger((prev) => prev + 1);

            /*
             * Once the backend creates the first chat,
             * remember its ID for subsequent questions.
             */

            if (response?.chat_id) {

                setActiveChatId(
                    response.chat_id
                );

            }


            /*
             * Add AI response.
             */

            const sources = response?.sources || [];

            setActiveSources(sources);

            setMessages((prev) => [
                ...prev,
                {
                    user: false,
                    message:
                        response?.answer ||
                        "I couldn't generate an answer.",
                    sources: sources,
                },
            ]);
        } catch (error) {

            console.error(
                "Chat error:",
                error
            );


            const errorMessage =
                error.response?.data?.detail ||
                "Something went wrong while processing your question.";


            setMessages((prev) => [

                ...prev,

                {
                    user: false,
                    message: errorMessage,
                    sources: [],
                },

            ]);

        } finally {

            setLoading(false);

        }

    };


    /*
    =========================================================
    SOURCE CLICK
    =========================================================
    */

    const handleSourceClick = (source) => {

        if (
            !source ||
            source.filename !== selectedDocument ||
            source.location_type !== "page" ||
            source.location == null
        ) {
            return;
        }

        const page = Number(source.location);

        if (!Number.isInteger(page) || page < 1) {
            return;
        }

        setSelectedPage(page);

    };


    /*
    =========================================================
    NEW CHAT
    =========================================================
    */

    const handleNewChat = () => {

        /*
         * Clear the current chat context.
         *
         * We intentionally do NOT create a database chat here.
         * The backend creates it when the user sends the
         * first question.
         */

        setActiveChatId(null);

        setMessages([]);

    };


    /*
    =========================================================
    SELECT EXISTING CHAT
    =========================================================
    */

    const handleSelectChat = async (response) => {

        if (!response?.chat) {

            console.error(
                "Invalid chat response:",
                response
            );

            return;

        }


        try {

            setLoadingChat(true);


            const chat =
                response.chat;

            const chatMessages =
                response.messages || [];


            /*
             * Remember which chat is currently open.
             */

            setActiveChatId(
                chat.chat_id
            );


            /*
             * Switch the document on the right
             * to the document belonging to this chat.
             */

            if (chat.document_name) {

                setSelectedDocument(
                    chat.document_name
                );

            }


            /*
             * Convert backend messages into the
             * format already expected by ChatWindow.
             */

            const formattedMessages =
                chatMessages.map(
                    (message) => ({

                        user:
                            message.sender === "user",

                        message:
                            message.content,

                        /*
                         * Historical messages currently
                         * don't return their source metadata.
                         * Keep this empty instead of inventing it.
                         */

                        sources: [],

                        created_at:
                            message.created_at,

                    })
                );


            setMessages(
                formattedMessages
            );

        } catch (error) {

            console.error(
                "Failed to open chat:",
                error
            );

        } finally {

            setLoadingChat(false);

        }

    };


    /*
    =========================================================
    RENDER
    =========================================================
    */

    return (

        <div className="chat-page">


            {/* =================================================
                LEFT — CHAT SIDEBAR
            ================================================= */}

            <aside className="chat-sidebar-panel">

                <ChatSidebar
                    onNewChat={handleNewChat}
                    onSelectChat={handleSelectChat}
                    refreshTrigger={chatRefreshTrigger}
                />

            </aside>


            {/* =================================================
                CENTER — CHAT
            ================================================= */}

            <main className="chat-main-panel">

                <ChatWindow
                    messages={messages}
                    onSend={handleSend}
                    loading={
                        loading ||
                        loadingChat
                    }
                    onSourceClick={handleSourceClick}
                />

            </main>


            {/* =================================================
                RIGHT — LIVE DOCUMENT
            ================================================= */}

            <aside className="document-panel">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="document-panel-header">

                    <div className="document-panel-title">

                        <FileText size={18} />

                        <div>

                            <h3>
                                Document
                            </h3>

                            <p>
                                Live document & citations
                            </p>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    DOCUMENT SELECTOR
                ================================================= */}

                <div className="document-panel-selector">

                    {documents.length === 0 ? (

                        <div className="document-empty-small">

                            No documents uploaded yet.

                        </div>

                    ) : (

                        <select
                            id="chat-document-select"
                            value={selectedDocument}
                            onChange={(event) =>
                                setSelectedDocument(
                                    event.target.value
                                )
                            }
                        >

                            {documents.map((doc) => (

                                <option
                                    key={
                                        doc.document_id ||
                                        doc.filename
                                    }
                                    value={doc.filename}
                                >
                                    {doc.filename}
                                </option>

                            ))}

                        </select>

                    )}

                </div>


                {/* =================================================
                    PDF VIEWER
                ================================================= */}

                <div className="document-viewer">

                    {loadingDocument ? (

                        <div className="document-loading">

                            Loading document...

                        </div>

                    ) : documentUrl ? (

                        <iframe
                            key={`${documentUrl}-${selectedPage || 0}`}
                            src={
                                selectedPage
                                    ? `${documentUrl}#page=${selectedPage}`
                                    : documentUrl
                            }
                            className="pdf-viewer"
                        />

                    ) : (

                        <div className="document-empty">

                            <div className="document-empty-icon">

                                <FileText size={24} />

                            </div>

                            <h3>
                                No document selected
                            </h3>

                            <p>
                                Select a document to view it here.
                            </p>

                        </div>

                    )}

                </div>


                {/* =================================================
                    CITATIONS
                ================================================= */}

                <div className="citation-panel">
                    <div className="citation-header">
                        <h4>Citations</h4>
                    </div>

                    {activeSources.length === 0 ? (
                        <div className="citation-empty">
                            Citations from AI responses
                            will appear here.
                        </div>
                    ) : (
                        <div className="citation-list">
                            {activeSources.map((source, index) => (
                                <button
                                    type="button"
                                    className={`citation-item ${
                                        Number(source.location) === selectedPage
                                            ? "active"
                                            : ""
                                    }`}
                                    key={`${source.filename}-${source.location}-${index}`}
                                    onClick={() => handleSourceClick(source)}
                                >
                                    <span className="citation-icon">
                                        📄
                                    </span>

                                    <span className="citation-text">
                                        <span className="citation-filename">
                                            {source.filename}
                                        </span>

                                        {source.location_type === "page" &&
                                            source.location != null && (
                                                <span className="citation-page">
                                                    Page {source.location}
                                                </span>
                                            )}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>


            </aside>

        </div>

    );

}
export default Chat;