import { useRef, useState } from "react";
import { UploadCloud, FileUp } from "lucide-react";

import { uploadDocument } from "../../services/documentService";

function UploadZone({ onUploadSuccess }) {
    const fileInputRef = useRef(null);

    const [uploading, setUploading] = useState(false);

    const handleChooseFile = () => {
        if (!uploading) {
            fileInputRef.current?.click();
        }
    };

    const handleUpload = async (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        try {
            setUploading(true);

            const response = await uploadDocument(file);

            alert(response.message);

            if (onUploadSuccess) {
                onUploadSuccess();
            }
        } catch (error) {
            console.error("Upload failed:", error);

            alert(
                error.response?.data?.detail ||
                "Upload failed."
            );
        } finally {
            setUploading(false);

            // Allows the same file to be selected again.
            event.target.value = "";
        }
    };

    return (
        <section className="upload-zone">

            {/* Decorative glow */}
            <div
                className="upload-zone-glow"
                aria-hidden="true"
            />

            {/* Upload icon */}
            <div className="upload-icon">
                {uploading ? (
                    <FileUp
                        size={38}
                        strokeWidth={1.7}
                    />
                ) : (
                    <UploadCloud
                        size={38}
                        strokeWidth={1.7}
                    />
                )}
            </div>

            {/* Content */}
            <div className="upload-zone-content">

                <h2>
                    {uploading
                        ? "Uploading your document..."
                        : "Upload your documents"}
                </h2>

                <p>
                    {uploading
                        ? "Please wait while Stratum processes your file."
                        : "PDF, DOCX and TXT files are supported."}
                </p>

            </div>

            {/* Action */}
            <button
                type="button"
                className="primary-btn upload-button"
                onClick={handleChooseFile}
                disabled={uploading}
            >
                {uploading
                    ? "Uploading..."
                    : "Choose Files"}
            </button>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleUpload}
                hidden
                disabled={uploading}
            />

            {/* Supporting text */}
            <span className="upload-zone-hint">
                Maximum supported formats: PDF · DOCX · TXT
            </span>

        </section>
    );
}

export default UploadZone;