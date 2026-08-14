function StatCard({
    title,
    value,
    icon: Icon,
    color,
}) {
    return (
        <article className="stat-card">
            <div
                className="stat-icon"
                style={{
                    "--stat-color": color,
                }}
                aria-hidden="true"
            >
                {Icon && (
                    <Icon
                        size={22}
                        strokeWidth={1.8}
                    />
                )}
            </div>

            <div className="stat-content">
                <p>{title}</p>
                <h2>{value}</h2>
            </div>
        </article>
    );
}

export default StatCard;