import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DocumentsTable from "../components/documents/DocumentsTable";
import {
    getDocuments,
    deleteDocument,
    downloadDocument,
    viewDocument,
} from "../services/documentService";

import "./documents.css";

function Documents() {
    const navigate = useNavigate();

    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    /* =========================================================
       LOAD DOCUMENTS
    ========================================================= */

    const loadDocuments = async () => {
        try {
            setLoading(true);

            const data = await getDocuments();

            setDocuments(data.documents || []);
        } catch (error) {
            console.error("Failed to load documents:", error);
            setDocuments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDocuments();
    }, []);

    /* =========================================================
       DELETE
    ========================================================= */

    const handleDelete = async (filename) => {
        try {
            await deleteDocument(filename);

            setDocuments((previousDocuments) =>
                previousDocuments.filter(
                    (document) => document.filename !== filename
                )
            );
        } catch (error) {
            console.error("Failed to delete document:", error);
        }
    };

    /* =========================================================
       DOWNLOAD
    ========================================================= */

    const handleDownload = async (filename) => {
        try {
            await downloadDocument(filename);
        } catch (error) {
            console.error("Failed to download document:", error);
        }
    };

    /* =========================================================
       VIEW
    ========================================================= */

    const handleView = async (filename) => {
        try {
            await viewDocument(filename);
        } catch (error) {
            console.error("Failed to view document:", error);
        }
    };

    /* =========================================================
       SEARCH
    ========================================================= */

    const handleSearch = async (event) => {
        const query = event.target.value;

        setSearchQuery(query);

        // Restore complete document list
        // when search is cleared.
        if (!query.trim()) {
            loadDocuments();
            return;
        }

        try {
            const token = localStorage.getItem("access_token");

            const response = await fetch(
                `http://127.0.0.1:8000/documents/search?query=${encodeURIComponent(
                    query
                )}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Document search failed");
            }

            const data = await response.json();

            const searchResults = (data.documents || []).map(
                (filename) => ({
                    filename,
                    file_type:
                        filename.split(".").pop()?.toUpperCase() || "",
                    file_size: 0,
                })
            );

            setDocuments(searchResults);
        } catch (error) {
            console.error("Search failed:", error);
        }
    };

    /* =========================================================
       RENDER
    ========================================================= */

    return (
        <div className="documents-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="documents-header">

                <div className="documents-header-content">

                    <h1>Documents</h1>

                    <p>
                        Manage, organize and search your uploaded
                        documents.
                    </p>

                </div>

                <div className="documents-header-actions">

                    <div className="document-search">

                        <input
                            type="text"
                            placeholder="Search documents..."
                            value={searchQuery}
                            onChange={handleSearch}
                            aria-label="Search documents"
                        />

                    </div>

                    <button
                        type="button"
                        className="primary-btn"
                        onClick={() => navigate("/upload")}
                    >
                        Upload New
                    </button>

                </div>

            </div>

            {/* =================================================
                DOCUMENTS
            ================================================= */}

            {loading ? (

                <div className="documents-loading">
                    <p>Loading documents...</p>
                </div>

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