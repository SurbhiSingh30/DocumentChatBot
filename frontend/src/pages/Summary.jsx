import { useEffect, useState } from "react";
import { FileText, Sparkles } from "lucide-react";
import {
    getDocuments,
    generateSummary
} from "../services/documentService";
import "./summary.css";

function Summary() {
    const [documents, setDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState("");
    const [summaryLength, setSummaryLength] = useState("medium");
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDocuments = async () => {
            try {
                const response = await getDocuments();

                const docs = response.documents || [];

                setDocuments(docs);

                if (docs.length > 0) {
                    setSelectedDocument(docs[0].filename);
                }
            } catch (error) {
                console.error("Failed to load documents:", error);
                setError("Failed to load documents.");
            } finally {
                setLoading(false);
            }
        };

        loadDocuments();
    }, []);

    const handleGenerateSummary = async () => {
    if (!selectedDocument) {
        setError("Please select a document.");
        return;
    }

    setGenerating(true);
    setError("");
    setSummary("");

    try {
        const response = await generateSummary(
            selectedDocument,
            summaryLength
        );

        setSummary(response.summary);

    } catch (error) {
        console.error("Summary error:", error);

        setError(
            error.response?.data?.detail ||
            "Failed to generate summary."
        );
    } finally {
        setGenerating(false);
    }
};
    return (
        <div className="summary-page">

            <div className="summary-header">

                <div>
                    <div className="summary-title">
                        <Sparkles size={30} />
                        <h1>AI Summary</h1>
                    </div>

                    <p>
                        Generate concise AI-powered summaries from your
                        uploaded documents.
                    </p>
                </div>

            </div>

            <div className="summary-card">

                <div className="summary-field">

                    <label>Select Document</label>

                    {loading ? (

                        <p>Loading documents...</p>

                    ) : documents.length === 0 ? (

                        <p>No documents uploaded yet.</p>

                    ) : (

                        <select
                            value={selectedDocument}
                            onChange={(e) =>
                                setSelectedDocument(e.target.value)
                            }
                        >
                            {documents.map((doc) => (
                                <option
                                    key={doc.filename}
                                    value={doc.filename}
                                >
                                    {doc.filename}
                                </option>
                            ))}
                        </select>

                    )}

                </div>

                <div className="summary-field">

                    <label>Summary Length</label>

                    <select
                        value={summaryLength}
                        onChange={(e) =>
                            setSummaryLength(e.target.value)
                        }
                    >
                        <option value="short">Short</option>
                        <option value="medium">Medium</option>
                        <option value="detailed">Detailed</option>
                    </select>

                </div>

                <button
                    className="primary-btn summary-button"
                    onClick={handleGenerateSummary}
                    disabled={
                        generating ||
                        loading ||
                        documents.length === 0
                    }
                >
                    <Sparkles size={18} />

                    {generating
                        ? "Generating..."
                        : "Generate Summary"}
                </button>

                {error && (
                    <p className="summary-error">
                        {error}
                    </p>
                )}

            </div>

            {summary && (

                <div className="summary-result">

                    <div className="summary-result-header">

                        <FileText size={22} />

                        <div>
                            <h2>Summary</h2>
                            <p>{selectedDocument}</p>
                        </div>

                    </div>

                    <div className="summary-content">
                        {summary}
                    </div>

                </div>

            )}

        </div>
    );
}

export default Summary;