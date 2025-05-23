// src/pages/Dashboard.jsx
import './Dashboard.css';
import DashboardCard from '../components/DashboardCard';
import TeamSummary from '../components/TeamSummary';
import HoursWorkedChart from '../components/HoursWorkedChart';

import { Calendar, AlertTriangle, Clock } from 'lucide-react';

export default function Dashboard() {
    return (
        <div className="dashboard-page">
            <h1 className="dashboard-title">Dashboard</h1>

            <div className="dashboard-cards">
                <DashboardCard
                    icon={Calendar}
                    label="Current Week"
                    value="May 19 - May 25"
                />
                <DashboardCard
                    icon={AlertTriangle}
                    label="Unassigned Shifts"
                    value="2 Slots"
                />
                <DashboardCard
                    icon={Clock}
                    label="Schedule Reset In"
                    value="3 Days"
                />
            </div>

            <TeamSummary
                data={{
                    bartenders: 7,
                    servers: 3,
                    cooks: 2,
                    dishwashers: 1,
                }}
            />

            <HoursWorkedChart
                data={[
                    { name: 'John', hours: 60 },
                    { name: 'Bob', hours: 75 },
                    { name: 'Randy', hours: 10 },
                    { name: 'Melanie', hours: 35 },
                    { name: 'Tisha', hours: 90 },
                    { name: 'Abu', hours: 20 },
                    { name: 'Jose', hours: 40 },
                    { name: 'Fernando', hours: 15 },
                ]}
            />
        </div>
    );
}
