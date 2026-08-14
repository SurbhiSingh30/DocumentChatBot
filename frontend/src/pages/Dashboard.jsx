import { useEffect, useState } from "react";
import "./dashboard.css";

import ActionCard from "../components/common/ActionCard";
import HeroSection from "../components/dashboard/HeroSection";
import StatCard from "../components/dashboard/StatCard";
import ChatbotLauncher from "../components/chatbot/ChatbotLauncher";


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
                console.error(
                    "Failed to load dashboard documents:",
                    error
                );
            }
        };

        loadDocuments();
    }, []);

    const totalStorage = documents.reduce(
        (total, doc) => total + (doc.file_size || 0),
        0
    );

    const storageInMB = totalStorage / (1024 * 1024);

    const formattedStorage =
        totalStorage === 0
            ? "0 KB"
            : storageInMB < 1
                ? `${(totalStorage / 1024).toFixed(1)} KB`
                : `${storageInMB.toFixed(1)} MB`;

    return (
        <div className="dashboard-page">

            {/* =================================================
                HERO
            ================================================= */}

            <HeroSection />


            {/* =================================================
                STATS
            ================================================= */}

            <section className="stats-grid">

                <StatCard
                    title="Documents"
                    value={documents.length}
                    icon={FileText}
                    color="var(--brand-accent)"
                />

                <StatCard
                    title="Chats"
                    value="0"
                    icon={MessageSquare}
                    color="#3B82F6"
                />

                <StatCard
                    title="Knowledge Base"
                    value={`${documents.length} docs`}
                    icon={Database}
                    color="#8B5CF6"
                />

                <StatCard
                    title="Storage Used"
                    value={formattedStorage}
                    icon={HardDrive}
                    color="#F97316"
                />

            </section>


            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <section className="quick-actions">

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

            </section>
                 {/* =================================================
                FLOATING AI CHATBOT
            ================================================= */}

            <ChatbotLauncher />

        </div>
    );
}

export default Dashboard;