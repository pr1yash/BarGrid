import './DashboardCard.css';

export default function DashboardCard({ icon: Icon, label, value }) {
    return (
        <div className="dashboard-card">
            <div className="dashboard-card-header">
                <Icon className="dashboard-card-icon" />
            </div>
            <div className="dashboard-card-label">{label}
            </div>
            <div className="dashboard-card-value">{value}</div>
        </div>
    );
}
