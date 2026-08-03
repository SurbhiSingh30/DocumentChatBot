import { Plus } from "lucide-react";

const chats = [
  "Research Paper",
  "Resume Review",
  "TTL Internship",
  "Financial Report",
];

function ChatSidebar() {
  return (
    <aside className="chat-sidebar">

      <button className="primary-btn">
        <Plus size={18}/>
        New Chat
      </button>

      <div className="chat-history">

        {chats.map(chat => (

          <div
            className="chat-history-item"
            key={chat}
          >
            {chat}
          </div>

        ))}

      </div>

    </aside>
  );
}

export default ChatSidebar;