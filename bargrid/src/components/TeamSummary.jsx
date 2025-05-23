import './TeamSummary.css';

export default function TeamSummary({ data }) {
    return (
        <div className="team-summary">
            <h2 className="team-summary-title">Team</h2>
            <div className="team-summary-grid">
                <div className="team-summary-item">
                    <div className="team-count">{data.bartenders}</div>
                    <div className="team-role">Bartenders</div>
                </div>
                <div className="team-summary-item">
                    <div className="team-count">{data.servers}</div>
                    <div className="team-role">Servers</div>
                </div>
                <div className="team-summary-item">
                    <div className="team-count">{data.cooks}</div>
                    <div className="team-role">Cooks</div>
                </div>
                <div className="team-summary-item">
                    <div className="team-count">{data.dishwashers}</div>
                    <div className="team-role">Dishwashers</div>
                </div>
            </div>
        </div>
    );
}
