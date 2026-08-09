function StatCard({
    title,
    value,
    icon: Icon,
    color,
}) {
    return (
        <div className="stat-card">

            <div
                className="stat-icon"
                style={{ background: color }}
            >
                <Icon size={22} />
            </div>

            <div className="stat-content">

                <p>{title}</p>

                <h2>{value}</h2>

            </div>

        </div>
    );
}

export default StatCard;