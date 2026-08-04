import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { uploadDocument } from "../../services/documentService";

function UploadZone() {
  const fileInputRef = useRef(null);

  const [uploading, setUploading] = useState(false);

  const handleChooseFile = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    try {
      setUploading(true);

      const response = await uploadDocument(file);

      alert(response.message);

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.detail ||
        "Upload failed."
      );

    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-zone">

      <UploadCloud size={70} />

      <h2>Drag & Drop Files</h2>

      <p>
        Upload PDF, DOCX or TXT files
      </p>

      <button
        className="primary-btn"
        onClick={handleChooseFile}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Choose Files"}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        style={{ display: "none" }}
        onChange={handleUpload}
      />

    </div>
  );
}

export default UploadZone;