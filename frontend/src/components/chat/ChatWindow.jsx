import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

function ChatWindow({
    messages,
    onSend,
    loading,
    onSourceClick,
}) {
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
                        onSourceClick={onSourceClick}
                    />
                ))}

                {loading && (
                    <MessageBubble
                        user={false}
                        message="Give me a second..."
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