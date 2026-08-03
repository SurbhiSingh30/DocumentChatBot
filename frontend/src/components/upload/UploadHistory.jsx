import { FileText } from "lucide-react";

const files = [
  "Research.pdf",
  "Resume.pdf",
  "TTL_Project.docx",
];

function UploadHistory() {
  return (
    <section className="upload-history">

      <h2>Recent Uploads</h2>

      <div className="history-list">

        {files.map((file) => (

          <div
            key={file}
            className="history-item"
          >

            <FileText size={20}/>

            <span>{file}</span>

          </div>

        ))}

      </div>

    </section>
  );
}

export default UploadHistory;