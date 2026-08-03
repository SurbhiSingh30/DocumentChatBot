import "./upload.css";

import UploadZone from "../components/upload/UploadZone";
import UploadHistory from "../components/upload/UploadHistory";

function Upload() {
  return (
    <div className="upload-page">

      <div className="upload-header">

        <h1>Upload Documents</h1>

        <p>
          Upload your PDFs, DOCX, and TXT files to build your AI knowledge base.
        </p>

      </div>

      <UploadZone />

      <UploadHistory />

    </div>
  );
}

export default Upload;
