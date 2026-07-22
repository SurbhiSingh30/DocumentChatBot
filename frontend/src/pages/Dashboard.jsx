import "./dashboard.css";
import ActionCard from "../components/common/ActionCard";

import{
  FileText,
  MessageSquare,
  Search,
  Sparkles
} from "lucide-react"


function Dashboard() {
  return (
    <div className="dashboard">

      <div className="hero">

        <h1>Hey</h1>

        <p>
          Welcome back to <strong>Stratum</strong>.
          Your AI-powered document workspace is ready.
        </p>

      </div>

      <div className="quick-actions">

          <ActionCard
          icon={FileText}
          title="Upload Documents"
          description="Import PDFs, DOCX and TXT files."
          />

          <ActionCard
          icon={MessageSquare}
          title="New Chat"
          description="Ask questions about your documents."
          />

          <ActionCard
          icon={Search}
          title="Search Knowledge"
          description="Find information instantly."
          />

          <ActionCard
          icon={Sparkles}
          title="AI Summary"
          description="Generate concise summaries."
          />

          </div>
      </div>
  );
}

export default Dashboard;


