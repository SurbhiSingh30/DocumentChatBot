import "./dashboard.css";
import ActionCard from "../components/common/ActionCard";
import HeroSection from "../components/dashboard/HeroSection";
import StatCard from "../components/dashboard/StatCard";
import RecentDocuments from "../components/dashboard/RecentDocuments";

import {
  FileText,
  MessageSquare,
  Database,
  HardDrive,
  Search,
  Sparkles,
} from "lucide-react";

function Dashboard() {
  return (
    <div className="dashboard">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          title="Documents"
          value="24"
          icon={FileText}
          color="#4f9409"
        />

        <StatCard
          title="Chats"
          value="12"
          icon={MessageSquare}
          color="#2563EB"
        />

        <StatCard
          title="Knowledge Base"
          value="1.8 GB"
          icon={Database}
          color="#7C3AED"
        />

        <StatCard
          title="Storage Used"
          value="34%"
          icon={HardDrive}
          color="#EA580C"
        />
      </div>

      {/* Quick Actions */}
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
      {/* Recent Documents */}
      <RecentDocuments />
    </div>
  );
}

export default Dashboard;