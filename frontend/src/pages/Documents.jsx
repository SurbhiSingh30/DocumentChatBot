import { useEffect, useState } from "react";
import DocumentsTable from "../components/documents/DocumentsTable";
import {
    getDocuments,
    deleteDocument,
    downloadDocument,
    viewDocument
} from "../services/documentService";
import "./documents.css";
import { useNavigate } from "react-router-dom";

function Documents() {

    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        try {
            const data = await getDocuments();
            setDocuments(data.documents || []);
        } catch (error) {
            console.error("Failed to load documents:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (filename) => {

        try {

            await deleteDocument(filename);

            // Remove deleted document immediately from UI
            setDocuments((prev) =>
                prev.filter((doc) => doc.filename !== filename)
            );

        } catch (error) {

            console.error("Failed to delete document:", error);

        }

    };

    const handleDownload = async (filename) => {

        console.log("DOWNLOAD CLICKED:", filename);

        try {

            await downloadDocument(filename);

        } catch (error) {

            console.error("DOWNLOAD ERROR:", error);

        }

    };

const handleView = async (filename) => {

    try {

        await viewDocument(filename);

    } catch (error) {

        console.error("VIEW ERROR:", error);

    }

};

const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
        loadDocuments();
        return;
    }

    try {
        const response = await fetch(
            `http://127.0.0.1:8000/documents/search?query=${encodeURIComponent(query)}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            }
        );

        const data = await response.json();

        setDocuments(
            (data.documents || []).map((filename) => ({
                filename,
                file_type: filename.split(".").pop(),
                file_size: 0,
            }))
        );

    } catch (error) {
        console.error("Search failed:", error);
    }
};

const navigate = useNavigate();

    return (
        <div className="documents-page">

            <div className="documents-header">

                <div>

                    <h1>Documents</h1>

                    <p>
                        Manage, organize and search your uploaded documents.
                    </p>

                </div>

                <div className="document-search">
                    <input
                        type="text"
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>

                <button 
                className="primary-btn"
                onClick={() => navigate("/upload")}>
                    Upload New
                </button>

            </div>

            {loading ? (

                <p>Loading documents...</p>

            ) : (

                <DocumentsTable
                    documents={documents}
                    onDelete={handleDelete}
                    onDownload={handleDownload}
                    onView={handleView}
                />

            )}

        </div>
    );
}

export default Documents;