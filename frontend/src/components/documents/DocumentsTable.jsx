import {
    FileText,
    Eye,
    Download,
    Trash2
} from "lucide-react";

function DocumentsTable({ documents, onDelete, onDownload, onView }) {

    return (
        <div className="documents-table">

            <div className="table-header">

                <span>Name</span>
                <span>Type</span>
                <span>Size</span>
                <span>Uploaded</span>
                <span>Actions</span>

            </div>

            {documents.length === 0 ? (

                <div className="empty-documents">
                    <p>No documents uploaded yet.</p>
                </div>

            ) : (

                documents.map((doc) => (

                    <div
                        className="table-row"
                        key={doc.filename}
                    >

                        <div className="doc-name">

                            <FileText size={20} />

                            <span>{doc.filename}</span>

                        </div>

                        <span>
                            {doc.file_type.toUpperCase()}
                        </span>

                        <span>
                            {(doc.file_size / 1024).toFixed(1)} KB
                        </span>

                        <span>
                            —
                        </span>

                      <div className="actions">

                            <Eye 
                                size={18} 
                                 onClick={() => onView(doc.filename)}
                                 style={{ cursor: "pointer" }}
                                />

                            <Download
                                size={18}
                                onClick={() => onDownload(doc.filename)}
                                style={{ cursor: "pointer" }}
                            />

                            <Trash2
                                size={18}
                                onClick={() => onDelete(doc.filename)}
                                style={{ cursor: "pointer" }}
                            />

                        </div> 

                    </div>

                ))

            )}

        </div>
    );
}

export default DocumentsTable;