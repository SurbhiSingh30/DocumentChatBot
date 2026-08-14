import { useEffect, useState } from "react";
import { FileText, CheckCircle2 } from "lucide-react";

import { getDocuments } from "../../services/documentService";

function UploadHistory({ refresh }) {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadHistory = async () => {
        try {
            setLoading(true);

            const response = await getDocuments();

            setFiles(response.documents || []);
        } catch (error) {
            console.error(
                "Failed to load upload history:",
                error
            );

            setFiles([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHistory();
    }, [refresh]);

    return (
        <section className="upload-history">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="upload-history-header">

                <div>
                    <h2>Recent Uploads</h2>

                    <p>
                        Documents recently added to your
                        knowledge base.
                    </p>
                </div>

                {files.length > 0 && !loading && (
                    <span className="upload-count">
                        {files.length}{" "}
                        {files.length === 1
                            ? "document"
                            : "documents"}
                    </span>
                )}

            </div>


            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (

                <div className="upload-history-state">
                    <div className="history-loading-icon">
                        <FileText
                            size={22}
                            strokeWidth={1.7}
                        />
                    </div>

                    <p>Loading uploads...</p>
                </div>

            ) : files.length === 0 ? (

                /* =================================================
                   EMPTY
                ================================================= */

                <div className="upload-history-state empty">

                    <div className="history-empty-icon">
                        <FileText
                            size={26}
                            strokeWidth={1.7}
                        />
                    </div>

                    <div>
                        <h3>No uploads yet</h3>

                        <p>
                            Your uploaded documents will
                            appear here.
                        </p>
                    </div>

                </div>

            ) : (

                /* =================================================
                   HISTORY LIST
                ================================================= */

                <div className="history-list">

                    {files.slice(0, 5).map((file) => (

                        <div
                            key={file.filename}
                            className="history-item"
                        >

                            <div className="history-file-icon">
                                <FileText
                                    size={20}
                                    strokeWidth={1.8}
                                />
                            </div>

                            <div className="history-file-info">

                                <span
                                    className="history-file-name"
                                    title={file.filename}
                                >
                                    {file.filename}
                                </span>

                                <span className="history-file-type">
                                    {file.file_type
                                        ?.toUpperCase() ||
                                        "DOCUMENT"}
                                </span>

                            </div>

                            <div
                                className="history-status"
                                title="Uploaded successfully"
                            >
                                <CheckCircle2
                                    size={18}
                                    strokeWidth={1.8}
                                />
                            </div>

                        </div>

                    ))}

                </div>

            )}

        </section>
    );
}

export default UploadHistory;