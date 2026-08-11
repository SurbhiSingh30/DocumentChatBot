function MessageBubble({
    user,
    message,
    sources = []
}) {
    return (
        <div className={`message ${user ? "user" : "ai"}`}>

            <div className="bubble">

                <div className="message-content">
                    {message}
                </div>

                {!user && sources.length > 0 && (
                    <div className="message-sources">

                        <div className="sources-title">
                            Sources
                        </div>

                        {sources.map((source, index) => {

                            const isPage =
                                source.location_type === "page";

                            return (
                                <div
                                    className="source-item"
                                    key={index}
                                >
                                    <span>
                                        📄 {source.filename}
                                    </span>

                                    <span>
                                        {isPage
                                            ? `Page ${source.location}`
                                            : `Chunk ${source.chunk_number}`
                                        }
                                    </span>
                                </div>
                            );
                        })}

                    </div>
                )}

            </div>

        </div>
    );
}

export default MessageBubble;