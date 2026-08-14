import {
    Plus,
    Pin,
    Clock3,
} from "lucide-react";

const pinnedChats = [
    "Research Paper",
    "TTL Internship",
];

const recentChats = [
    "Resume Review",
    "Financial Report",
];

function ChatSidebar() {

    return (
        <aside className="chat-sidebar">

            {/* NEW CHAT */}

            <button className="primary-btn chat-new-button">
                <Plus size={18} />
                <span>New Chat</span>
            </button>


            {/* PINNED CHATS */}

            <div className="chat-section">

                <div className="chat-section-title">
                    <Pin size={14} />
                    <span>Pinned</span>
                </div>

                <div className="chat-history">

                    {pinnedChats.map((chat) => (

                        <button
                            className="chat-history-item"
                            key={chat}
                        >
                            {chat}
                        </button>

                    ))}

                </div>

            </div>


            {/* RECENT CHATS */}

            <div className="chat-section">

                <div className="chat-section-title">
                    <Clock3 size={14} />
                    <span>Recent</span>
                </div>

                <div className="chat-history">

                    {recentChats.map((chat) => (

                        <button
                            className="chat-history-item"
                            key={chat}
                        >
                            {chat}
                        </button>

                    ))}

                </div>

            </div>

        </aside>
    );
}

export default ChatSidebar;