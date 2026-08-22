import { useEffect, useState } from "react";
import {
    Plus,
    Pin,
    Clock3,
} from "lucide-react";

import {
    getChats,
    getChat,
} from "../../services/chatService";


function ChatSidebar({
    onNewChat,
    onSelectChat,
    refreshTrigger,
}) {

    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);


    // =========================================================
    // LOAD CHAT HISTORY
    // =========================================================

    const loadChats = async () => {

        try {

            const response = await getChats();

            console.log("CHAT HISTORY:", response);

            const chatList =
                Array.isArray(response)
                    ? response
                    : response?.chats || [];

            setChats(chatList);

        } catch (error) {

            console.error(
                "Failed to load chat history:",
                error
            );

            setChats([]);

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadChats();

    }, [refreshTrigger]);


    // =========================================================
    // NEW CHAT
    // =========================================================

    const handleNewChat = () => {

        if (onNewChat) {
            onNewChat();
        }

    };


    // =========================================================
    // SELECT CHAT
    // =========================================================

    const handleSelectChat = async (chat) => {

        try {

            const response =
                await getChat(chat.chat_id);

            if (onSelectChat) {

                onSelectChat(response);

            }

        } catch (error) {

            console.error(
                "Failed to load chat:",
                error
            );

        }

    };


    return (

        <aside className="chat-sidebar">


            {/* =================================================
                NEW CHAT
            ================================================= */}

            <button
                className="primary-btn chat-new-button"
                onClick={handleNewChat}
            >

                <Plus size={18} />

                <span>
                    New Chat
                </span>

            </button>


            {/* =================================================
                PINNED
            ================================================= */}

            <div className="chat-section">

                <div className="chat-section-title">

                    <Pin size={14} />

                    <span>
                        Pinned
                    </span>

                </div>


                <div className="chat-history">

                    <div className="chat-empty">

                        No pinned chats yet.

                    </div>

                </div>

            </div>


            {/* =================================================
                RECENT
            ================================================= */}

            <div className="chat-section">

                <div className="chat-section-title">

                    <Clock3 size={14} />

                    <span>
                        Recent
                    </span>

                </div>


                <div className="chat-history">

                    {loading ? (

                        <div className="chat-empty">

                            Loading chats...

                        </div>

                    ) : chats.length === 0 ? (

                        <div className="chat-empty">

                            No recent chats.

                        </div>

                    ) : (

                        chats.map((chat) => (

                            <button
                                className="chat-history-item"
                                key={chat.chat_id}
                                onClick={() =>
                                    handleSelectChat(chat)
                                }
                            >

                                {chat.title || "New Chat"}

                            </button>

                        ))

                    )}

                </div>

            </div>

        </aside>

    );

}


export default ChatSidebar;