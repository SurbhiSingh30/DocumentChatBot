import { useState } from "react";
import "./upload.css";

import UploadZone from "../components/upload/UploadZone";
import UploadHistory from "../components/upload/UploadHistory";

function Upload() {
    const [refreshHistory, setRefreshHistory] = useState(0);

    const handleUploadSuccess = () => {
        setRefreshHistory((previous) => previous + 1);
    };

    return (
        <main className="upload-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="upload-header">

                <div className="upload-header-content">

                    <h1>Upload Documents</h1>

                    <p>
                        Upload your PDFs, DOCX, and TXT files
                        to build your AI knowledge base.
                    </p>

                </div>

            </header>


            {/* =================================================
                UPLOAD ZONE
            ================================================= */}

            <section className="upload-section">
                <UploadZone
                    onUploadSuccess={handleUploadSuccess}
                />
            </section>


            {/* =================================================
                UPLOAD HISTORY
            ================================================= */}

            <section className="upload-history-section">
                <UploadHistory
                    refresh={refreshHistory}
                />
            </section>

        </main>
    );
}

export default Upload;