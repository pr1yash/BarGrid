import './HoursWorkedChart.css';

export default function HoursWorkedChart({ data }) {
    const maxHours = Math.max(...data.map(item => item.hours));
    const chartHeight = 160; // px

    return (
        <div className="hours-chart">
            <div className="hours-chart-header">
                <h2 className="hours-chart-title">Hours Worked</h2>
                <select className="hours-chart-filter">
                    <option>This Week</option>
                    <option>Last Week</option>
                    <option>2 Weeks Ago</option>
                    <option>3 Weeks Ago</option>
                </select>
            </div>
            <div className="hours-chart-bars">
                {data.map(({ name, hours }) => {
                    const height = (hours / maxHours) * chartHeight;
                    return (
                        <div key={name} className="hours-bar-item">
                            <div
                                className="bar"
                                style={{ height: `${height}px` }}
                                title={`${hours} hours`}
                            ></div>
                            <div className="bar-name">{name}</div>
                            <div className="bar-hours">{hours}h</div>
                        </div>
                    );
                })}
            </div>
        </div >
    );
}
