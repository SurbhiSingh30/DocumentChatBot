import { FileText, MoreVertical } from "lucide-react";

const docs = [
  {
    name: "TTL_Project_Report.pdf",
    date: "Today",
    size: "2.4 MB",
  },
  {
    name: "Resume.pdf",
    date: "Yesterday",
    size: "420 KB",
  },
  {
    name: "Research_Paper.pdf",
    date: "3 days ago",
    size: "5.1 MB",
  },
];

function RecentDocuments() {
  return (
    <section className="recent-documents">

      <h2>Recent Documents</h2>

      <div className="document-list">

        {docs.map((doc) => (

          <div className="document-item" key={doc.name}>

            <div className="document-icon">
              <FileText size={20}/>
            </div>

            <div className="document-info">
              <h4>{doc.name}</h4>
              <p>{doc.date} • {doc.size}</p>
            </div>

            <MoreVertical size={18}/>

          </div>

        ))}

      </div>

    </section>
  );
}

export default RecentDocuments;