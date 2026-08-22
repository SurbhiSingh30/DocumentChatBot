import "./actionCard.css";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useTheme from "../../hooks/useTheme";

function ActionCard({
    icon: Icon,
    title,
    description,
    route,
}) {
    const navigate = useNavigate();
    const { theme } = useTheme();

    const handleNavigate = () => {
        if (route) {
            navigate(route);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleNavigate();
        }
    };

    return (
        <article
            className={`action-card${theme === "dark" ? " action-card--dark" : ""}`}
            onClick={handleNavigate}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`${title}: ${description}`}
        >
            {/* Icon */}
            <div className="card-icon">
                {Icon && <Icon size={26} strokeWidth={1.8} />}
            </div>

            {/* Content */}
            <div className="action-card-content">
                <h3>{title}</h3>

                <p>{description}</p>
            </div>

            {/* Arrow */}
            <div className="card-arrow" aria-hidden="true">
                <ArrowUpRight size={20} strokeWidth={1.8} />
            </div>
        </article>
    );
}

export default ActionCard;
