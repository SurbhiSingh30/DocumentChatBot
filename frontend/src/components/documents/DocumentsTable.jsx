import {
    FileText,
    Eye,
    Download,
    Trash2,
} from "lucide-react";

function DocumentsTable({
    documents,
    onDelete,
    onDownload,
    onView,
}) {
    return (
        <section className="documents-table">

            {/* =================================================
                TABLE HEADER
            ================================================= */}

            <div className="table-header">
                <span>Name</span>
                <span>Type</span>
                <span>Size</span>
                <span>Uploaded</span>
                <span>Actions</span>
            </div>


            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {documents.length === 0 ? (

                <div className="empty-documents">
                    <div className="empty-documents-icon">
                        <FileText
                            size={28}
                            strokeWidth={1.7}
                        />
                    </div>

                    <div>
                        <h3>No documents yet</h3>

                        <p>
                            Upload a document to start building
                            your knowledge base.
                        </p>
                    </div>
                </div>

            ) : (

                /* =================================================
                   DOCUMENT ROWS
                ================================================= */

                documents.map((doc) => {

                    const fileType =
                        doc.file_type
                            ?.toUpperCase() ||
                        doc.filename
                            ?.split(".")
                            .pop()
                            ?.toUpperCase() ||
                        "FILE";

                    const fileSize =
                        doc.file_size > 0
                            ? `${(
                                doc.file_size / 1024
                            ).toFixed(1)} KB`
                            : "—";

                    return (
                        <div
                            className="table-row"
                            key={doc.filename}
                        >

                            {/* NAME */}

                            <div className="doc-name">

                                <div className="document-icon">
                                    <FileText
                                        size={20}
                                        strokeWidth={1.8}
                                    />
                                </div>

                                <div className="document-name-content">
                                    <span
                                        className="document-filename"
                                        title={doc.filename}
                                    >
                                        {doc.filename}
                                    </span>
                                </div>

                            </div>


                            {/* TYPE */}

                            <span className="document-type">
                                {fileType}
                            </span>


                            {/* SIZE */}

                            <span className="document-size">
                                {fileSize}
                            </span>


                            {/* UPLOADED */}

                            <span className="document-uploaded">
                                —
                            </span>


                            {/* ACTIONS */}

                            <div className="actions">

                                <button
                                    type="button"
                                    className="table-action view-action"
                                    onClick={() =>
                                        onView(doc.filename)
                                    }
                                    aria-label={`View ${doc.filename}`}
                                    title="View document"
                                >
                                    <Eye
                                        size={18}
                                        strokeWidth={1.8}
                                    />
                                </button>


                                <button
                                    type="button"
                                    className="table-action download-action"
                                    onClick={() =>
                                        onDownload(doc.filename)
                                    }
                                    aria-label={`Download ${doc.filename}`}
                                    title="Download document"
                                >
                                    <Download
                                        size={18}
                                        strokeWidth={1.8}
                                    />
                                </button>


                                <button
                                    type="button"
                                    className="table-action delete-action"
                                    onClick={() =>
                                        onDelete(doc.filename)
                                    }
                                    aria-label={`Delete ${doc.filename}`}
                                    title="Delete document"
                                >
                                    <Trash2
                                        size={18}
                                        strokeWidth={1.8}
                                    />
                                </button>

                            </div>

                        </div>
                    );
                })
            )}

        </section>
    );
}

export default DocumentsTable;