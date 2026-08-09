import "./actionCard.css";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ActionCard({
    icon: Icon,
    title,
    description,
    route,
}) {
    const navigate = useNavigate();

    return (
        <div
            className="action-card"
            onClick={() => navigate(route)}
        >

            <div className="card-icon">
                <Icon size={30} />
            </div>

            <h3>{title}</h3>

            <p>{description}</p>

            <div className="card-arrow">
                <ArrowUpRight size={22} />
            </div>

        </div>
    );
}

export default ActionCard;