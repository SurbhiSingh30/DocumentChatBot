function MessageBubble({
    user,
    message,
    sources = [],
    onSourceClick,
}) {
    return (
        <div className={`message ${user ? "user" : "ai"}`}>
            <div className="bubble">

                <div className="message-content">
                    {message}
                </div>

                {!user && sources.length > 0 && (
                    <div className="message-sources">

                        <div className="message-sources-title">
                            Sources
                        </div>

                        <div className="message-source-list">

                            {sources.map((source, index) => (

                                <button
                                    type="button"
                                    className="message-source"
                                    key={`${source.filename || "source"}-${source.location || index}`}
                                    onClick={() =>
                                        onSourceClick?.(source)
                                    }
                                >

                                    <span className="message-source-icon">
                                        📄
                                    </span>

                                    <span className="message-source-text">

                                        <span className="message-source-filename">
                                            {source.filename || "Document"}
                                        </span>

                                        {source.location_type === "page" &&
                                            source.location != null && (
                                                <span className="message-source-location">
                                                    Page {source.location}
                                                </span>
                                            )}

                                    </span>

                                </button>

                            ))}

                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default MessageBubble;
