import "./chat.css";

import ChatSidebar from "../components/chat/ChatSidebar";
import ChatWindow from "../components/chat/ChatWindow";

function Chat() {
  return (
    <div className="chat-page">

      <ChatSidebar />

      <ChatWindow />

    </div>
  );
}

export default Chat;