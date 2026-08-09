import { useEffect, useState } from "react";
import { FileText, MoreVertical } from "lucide-react";
import { getDocuments } from "../../services/documentService";

function RecentDocuments() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDocuments = async () => {
            try {
                const response = await getDocuments();

                setDocuments(response.documents || []);
            } catch (error) {
                console.error(
                    "Failed to load recent documents:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        loadDocuments();
    }, []);

    return (
        <section className="recent-documents">

            <h2>Recent Documents</h2>

            {loading ? (

                <p>Loading documents...</p>

            ) : documents.length === 0 ? (

                <p>No documents uploaded yet.</p>

            ) : (

                <div className="document-list">

                    {documents.slice(0, 5).map((doc) => (

                        <div
                            className="document-item"
                            key={doc.document_id || doc.filename}
                        >

                            <div className="document-icon">
                                <FileText size={20} />
                            </div>

                            <div className="document-info">

                                <h4>{doc.filename}</h4>

                                <p>
                                    {doc.file_type?.toUpperCase()} •{" "}
                                    {(doc.file_size / 1024).toFixed(1)} KB
                                </p>

                            </div>

                            <MoreVertical size={18} />

                        </div>

                    ))}

                </div>

            )}

        </section>
    );
}

export default RecentDocuments;