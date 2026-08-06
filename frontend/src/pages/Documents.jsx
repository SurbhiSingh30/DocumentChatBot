import "./documents.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DocumentsTable from "../components/documents/DocumentsTable";
import { getDocuments } from "../services/documentService";

function Documents() {

    const [documents, setDocuments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadDocuments();
    }, []);

    async function loadDocuments() {
        try {
            const response = await getDocuments();
            setDocuments(response.documents || []);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="documents-page">

            <div className="documents-header">

                <div>

                    <h1>Documents</h1>

                    <p>
                        Manage, organize and search your uploaded documents.
                    </p>

                </div>

                <button
                    className="primary-btn"
                    onClick={() => navigate("/upload")}
                >
                    Upload New
                </button>

            </div>

            <DocumentsTable documents={documents} />

        </div>
    );
}

export default Documents;