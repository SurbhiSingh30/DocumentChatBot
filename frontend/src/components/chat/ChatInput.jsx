import { SendHorizontal } from "lucide-react";

function ChatInput() {
    return (

        <div className="chat-input">

            <input
                placeholder="Ask anything about your documents..."
            />

            <button>

                <SendHorizontal size={18}/>

            </button>

        </div>

    );
}

export default ChatInput;