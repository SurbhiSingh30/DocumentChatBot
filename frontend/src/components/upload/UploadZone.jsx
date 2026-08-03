import { UploadCloud } from "lucide-react";

function UploadZone() {
  return (
    <div className="upload-zone">

      <UploadCloud size={70} />

      <h2>Drag & Drop Files</h2>

      <p>

        Upload PDF, DOCX or TXT files

      </p>

      <button className="primary-btn">

        Choose Files

      </button>

    </div>
  );
}

export default UploadZone;