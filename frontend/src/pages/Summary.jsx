import { useEffect, useState } from "react";
import {
    FileText,
    Sparkles,
    ChevronDown,
    WandSparkles,
} from "lucide-react";

import {
    getDocuments,
    generateSummary,
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

            {/* =====================================================
                HEADER
            ===================================================== */}

            <section className="summary-hero">

                <div className="summary-hero-glow"></div>

                <div className="summary-hero-content">

                    <div className="summary-eyebrow">
                        <Sparkles size={16} />
                        AI POWERED
                    </div>

                    <div className="summary-title">
                        <h1>
                            AI <span>Summary</span>
                        </h1>
                    </div>

                    <p>
                        Turn your documents into clear, concise insights
                        with Stratum's AI-powered summarization.
                    </p>

                </div>

                <div className="summary-hero-icon">
                    <WandSparkles size={42} />
                </div>

            </section>


            {/* =====================================================
                SUMMARY WORKSPACE
            ===================================================== */}

            <section className="summary-workspace">

                <div className="workspace-header">

                    <div>
                        <h2>Create a Summary</h2>

                        <p>
                            Choose a document and decide how detailed
                            you want your summary to be.
                        </p>
                    </div>

                    <div className="workspace-status">
                        <span></span>
                        Ready
                    </div>

                </div>


                <div className="summary-controls">

                    {/* DOCUMENT */}

                    <div className="summary-field">

                        <label htmlFor="summary-document">
                            Document
                        </label>

                        <div className="select-wrapper">

                            <FileText size={18} />

                            {loading ? (
                                <div className="select-loading">
                                    Loading documents...
                                </div>
                            ) : documents.length === 0 ? (
                                <div className="select-loading">
                                    No documents uploaded
                                </div>
                            ) : (
                                <select
                                    id="summary-document"
                                    value={selectedDocument}
                                    onChange={(e) => {
                                        setSelectedDocument(e.target.value);
                                        setSummary("");
                                        setError("");
                                    }}
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

                            {!loading &&
                                documents.length > 0 && (
                                    <ChevronDown
                                        className="select-arrow"
                                        size={18}
                                    />
                                )}

                        </div>

                    </div>


                    {/* LENGTH */}

                    <div className="summary-field">

                        <label htmlFor="summary-length">
                            Summary Length
                        </label>

                        <div className="select-wrapper">

                            <Sparkles size={18} />

                            <select
                                id="summary-length"
                                value={summaryLength}
                                onChange={(e) =>
                                    setSummaryLength(e.target.value)
                                }
                            >
                                <option value="short">
                                    Short
                                </option>

                                <option value="medium">
                                    Medium
                                </option>

                                <option value="detailed">
                                    Detailed
                                </option>
                            </select>

                            <ChevronDown
                                className="select-arrow"
                                size={18}
                            />

                        </div>

                    </div>


                    {/* BUTTON */}

                    <button
                        className="summary-generate-btn"
                        onClick={handleGenerateSummary}
                        disabled={
                            generating ||
                            loading ||
                            documents.length === 0
                        }
                    >
                        <Sparkles size={18} />

                        <span>
                            {generating
                                ? "Generating..."
                                : "Generate Summary"}
                        </span>
                    </button>

                </div>


                {error && (
                    <div className="summary-error">
                        {error}
                    </div>
                )}

            </section>


            {/* =====================================================
                EMPTY STATE
            ===================================================== */}

            {!summary && !generating && documents.length > 0 && (
                <section className="summary-empty">

                    <div className="summary-empty-icon">
                        <Sparkles size={28} />
                    </div>

                    <h2>
                        Your summary will appear here
                    </h2>

                    <p>
                        Select a document above and generate a summary
                        to see AI-powered insights.
                    </p>

                </section>
            )}


            {/* =====================================================
                GENERATING STATE
            ===================================================== */}

            {generating && (
                <section className="summary-result generating-state">

                    <div className="summary-result-header">

                        <div className="result-icon">
                            <Sparkles size={22} />
                        </div>

                        <div>
                            <h2>Generating summary</h2>

                            <p>
                                Analyzing {selectedDocument}...
                            </p>
                        </div>

                    </div>

                    <div className="summary-loading-lines">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                </section>
            )}


            {/* =====================================================
                RESULT
            ===================================================== */}

            {summary && !generating && (
                <section className="summary-result">

                    <div className="summary-result-header">

                        <div className="result-icon">
                            <FileText size={22} />
                        </div>

                        <div className="result-title">

                            <h2>Summary</h2>

                            <p>
                                {selectedDocument}
                            </p>

                        </div>

                        <div className="result-badge">
                            <Sparkles size={14} />
                            AI Generated
                        </div>

                    </div>


                    <div className="summary-content">
                        {summary}
                    </div>

                </section>
            )}

        </div>
    );
}

export default Summary;