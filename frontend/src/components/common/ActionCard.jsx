import "./actionCard.css";
import { ArrowUpRight } from "lucide-react";

function ActionCard({ icon:Icon, title, description }) {
  return (
    <div className="action-card">

      <div className="card-icon">
        <Icon size={30}/>
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