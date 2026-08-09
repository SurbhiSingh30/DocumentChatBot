import { useEffect, useState } from "react";
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

import { getDocuments } from "../services/documentService";

function Dashboard() {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        const loadDocuments = async () => {
            try {
                const data = await getDocuments();
                setDocuments(data.documents || []);
            } catch (error) {
                console.error("Failed to load dashboard documents:", error);
            }
        };

        loadDocuments();
    }, []);

    const totalStorage = documents.reduce(
        (total, doc) => total + (doc.file_size || 0),
        0
    );

    const storageInMB = totalStorage / (1024 * 1024);

    return (
        <div className="dashboard-page">

            {/* Hero Section */}
            <HeroSection />

            {/* Stats Grid */}
            <div className="stats-grid">

                <StatCard
                    title="Documents"
                    value={documents.length}
                    icon={FileText}
                    color="#4f9409"
                />

                <StatCard
                    title="Chats"
                    value="0"
                    icon={MessageSquare}
                    color="#2563EB"
                />

                <StatCard
                    title="Knowledge Base"
                    value={`${documents.length} docs`}
                    icon={Database}
                    color="#7C3AED"
                />

                <StatCard
                    title="Storage Used"
                    value={
                        storageInMB < 1
                            ? `${(totalStorage / 1024).toFixed(1)} KB`
                            : `${storageInMB.toFixed(1)} MB`
                    }
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
                    route="/upload"
                />

                <ActionCard
                    icon={MessageSquare}
                    title="New Chat"
                    description="Ask questions about your documents."
                    route="/chat"
                />

                <ActionCard
                    icon={Search}
                    title="Search Knowledge"
                    description="Find information instantly."
                    route="/documents"
                />

                <ActionCard
                    icon={Sparkles}
                    title="AI Summary"
                    description="Generate concise summaries."
                    route="/summary"
                />

            </div>

            {/* Recent Documents */}
            <RecentDocuments />

        </div>
    );
}

export default Dashboard;