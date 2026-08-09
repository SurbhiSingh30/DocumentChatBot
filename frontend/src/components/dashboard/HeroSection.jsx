import { useNavigate } from "react-router-dom";

function HeroSection() {
    const navigate = useNavigate();

    return (
        <section className="hero-section">

            <div className="hero-glow"></div>

            <div className="hero-content">

                <div className="hero-badge">
                    ✨ AI Document Intelligence Platform
                </div>

                <h1>
                    Good Morning,
                    <span> Surbhi</span>
                </h1>

                <p>
                    Welcome back to <strong>Stratum</strong>.
                    Organize, search, analyze and chat with your documents
                    using enterprise-grade AI.
                </p>

                <div className="hero-buttons">

                    <button
                        className="primary-btn"
                        onClick={() => navigate("/upload")}
                    >
                        Upload Documents
                    </button>

                    <button
                        className="secondary-btn"
                        onClick={() => navigate("/chat")}
                    >
                        Start Chat
                    </button>

                </div>

            </div>

        </section>
    );
}

export default HeroSection;