import { useState } from "react";
import { SendHorizontal } from "lucide-react";

function ChatInput({ onSend, loading }) {

    const [question, setQuestion] = useState("");

    const handleSubmit = async (event) => {

        event.preventDefault();

        const trimmedQuestion = question.trim();

        if (!trimmedQuestion || loading) {
            return;
        }

        await onSend(trimmedQuestion);

        setQuestion("");
    };

    return (
        <form
            className="chat-input"
            onSubmit={handleSubmit}
        >

            <input
                type="text"
                placeholder="Ask anything about your documents..."
                value={question}
                onChange={(event) =>
                    setQuestion(event.target.value)
                }
                disabled={loading}
            />

            <button
                type="submit"
                disabled={loading || !question.trim()}
            >
                <SendHorizontal size={18} />
            </button>

        </form>
    );
}

export default ChatInput;