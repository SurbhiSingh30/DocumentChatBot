import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

function ChatWindow({ messages, onSend, loading }) {
    return (
        <section className="chat-window">

            <div className="messages">

                {messages.length === 0 && (
                    <MessageBubble
                        user={false}
                        message="Hello!! Upload a document and ask me anything."
                    />
                )}

                {messages.map((msg, index) => (
                    <MessageBubble
                        key={index}
                        user={msg.user}
                        message={msg.message}
                        sources={msg.sources}
                    />
                ))}

                {loading && (
                    <MessageBubble
                        user={false}
                        message="Thinking..."
                    />
                )}

            </div>

            <ChatInput
                onSend={onSend}
                loading={loading}
            />

        </section>
    );
}

export default ChatWindow;