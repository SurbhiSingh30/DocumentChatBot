import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { getDocuments } from "../../services/documentService";

function UploadHistory({ refresh }) {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadHistory = async () => {
        try {
            const response = await getDocuments();

            setFiles(response.documents || []);

        } catch (error) {
            console.error("Failed to load upload history:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHistory();
    }, [refresh]);

    return (
        <section className="upload-history">

            <h2>Recent Uploads</h2>

            {loading ? (

                <p>Loading uploads...</p>

            ) : files.length === 0 ? (

                <p>No documents uploaded yet.</p>

            ) : (

                <div className="history-list">

                    {files.slice(0, 5).map((file) => (

                        <div
                            key={file.filename}
                            className="history-item"
                        >

                            <FileText size={20} />

                            <span>{file.filename}</span>

                        </div>

                    ))}

                </div>

            )}

        </section>
    );
}

export default UploadHistory;