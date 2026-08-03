import "./documents.css";
import DocumentsTable from "../components/documents/DocumentsTable";

function Documents() {
  return (
    <div className="documents-page">

      <div className="documents-header">

        <div>

          <h1>Documents</h1>

          <p>
            Manage, organize and search your uploaded documents.
          </p>

        </div>

        <button className="primary-btn">

          Upload New

        </button>

      </div>

      <DocumentsTable />

    </div>
  );
}

export default Documents;