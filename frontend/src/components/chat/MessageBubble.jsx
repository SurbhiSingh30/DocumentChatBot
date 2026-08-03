function MessageBubble({
    user,
    message
}) {
    return (
        <div className={`message ${user ? "user" : "ai"}`}>

            <div className="bubble">

                {message}

            </div>

        </div>
    );
}

export default MessageBubble;