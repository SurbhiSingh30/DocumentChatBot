import { useEffect, useState } from "react";
import { getProfile } from "../../services/profileService";
import {Sparkles} from "lucide-react";
function HeroSection() {
    const [username, setUsername] = useState("Amigo");

    useEffect(() => {
        getProfile()
            .then((data) => {
                setUsername(data?.username?.trim() || "Amigo");
            })
            .catch((error) => {
                console.error("Failed to load profile:", error);
                setUsername("Amigo");
            });
    }, []);

    return (
        <section className="hero-section">

            <div
                className="hero-glow"
                aria-hidden="true"
            />

            <div className="hero-content">

                <div className="hero-badge">
                    <span aria-hidden="true">
                        <Sparkles />
                    </span>
                    <span>
                        AI Document Intelligence Platform
                    </span>
                </div>

                <h1>
                    Ready when you are
                    <span> {username}</span>
                </h1>

                <p>
                    Ready when you are,{" "}
                    <strong>{username}</strong>.
                    Your documents, knowledge base and AI
                    workspace are ready to go.
                </p>

            </div>

        </section>
    );
}

export default HeroSection;