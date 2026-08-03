import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

function ChatWindow() {

    return (

        <section className="chat-window">

            <div className="messages">

                <MessageBubble
                    user={false}
                    message="Hello 👋 Upload a document and ask me anything."
                />

                <MessageBubble
                    user={true}
                    message="Summarize this report."
                />

            </div>

            <ChatInput/>

        </section>

    );
}

export default ChatWindow;