import { useState } from "react";
import "./upload.css";

import UploadZone from "../components/upload/UploadZone";
import UploadHistory from "../components/upload/UploadHistory";

function Upload() {

    const [refreshHistory, setRefreshHistory] = useState(0);

    const handleUploadSuccess = () => {
        setRefreshHistory((prev) => prev + 1);
    };

    return (
        <div className="upload-page">

            <div className="upload-header">

                <h1>Upload Documents</h1>

                <p>
                    Upload your PDFs, DOCX, and TXT files to build your AI knowledge base.
                </p>

            </div>

            <UploadZone onUploadSuccess={handleUploadSuccess} />

            <UploadHistory refresh={refreshHistory} />

        </div>
    );
}

export default Upload;