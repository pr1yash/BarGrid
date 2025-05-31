import React, { useState } from "react";
import "./Schedule.css";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const times = [
    "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
    "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM",
    "11:00 PM", "12:00 AM", "1:00 AM", "2:00 AM"
];

const teamMembers = {
    Bartenders: ["Jason", "Abu", "Shirley", "Jones"],
    Server: ["Shelly", "Durant", "Abigale"],
    Cook: ["Jason", "Abu"],
    Dishwasher: ["Shirley"],
};

const initialSchedule = {
    Bartenders: [
        { name: "Jason", day: "Monday", start: "11:00 AM", end: "6:00 PM", color: "#81C784" },
        { name: "Abu", day: "Monday", start: "11:00 AM", end: "6:00 PM", color: "#E57373" },
        { name: "Shirley", day: "Thursday", start: "1:00 PM", end: "5:00 PM", color: "#BA68C8" },
        { name: "Jones", day: "Friday", start: "6:00 PM", end: "12:00 AM", color: "#4FC3F7" },
    ],
    Server: [
        { name: "Shelly", day: "Friday", start: "11:00 AM", end: "3:00 PM", color: "#AED581" },
        { name: "Abigale", day: "Saturday", start: "2:00 PM", end: "8:00 PM", color: "#FF8A65" },
    ],
    Cook: [
        { name: "Jason", day: "Friday", start: "11:00 AM", end: "3:00 PM", color: "#AED581" },
        { name: "Abu", day: "Saturday", start: "2:00 PM", end: "8:00 PM", color: "#FF8A65" },
    ],
    Dishwasher: [
        { name: "Shirley", day: "Wednesday", start: "4:00 PM", end: "10:00 PM", color: "#64B5F6" },
    ],
};

const roles = ["Bartenders", "Server", "Cook", "Dishwasher"];

const Schedule = () => {
    const [scheduleData, setScheduleData] = useState(initialSchedule);
    const [selectedRole, setSelectedRole] = useState("Bartenders");
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState("grid");

    const handleRoleChange = (e) => setSelectedRole(e.target.value);

    const handleTimeChange = (name, day, type, value) => {
        setScheduleData((prev) => {
            const updated = { ...prev };
            let existingShift = updated[selectedRole].find((s) => s.name === name && s.day === day);

            if (existingShift) {
                existingShift[type] = value;
            } else {
                if (type === "start") {
                    updated[selectedRole].push({
                        name,
                        day,
                        start: value,
                        end: times[times.indexOf(value) + 1] || "2:00 AM",
                        color: prev[selectedRole].find((s) => s.name === name)?.color || "#90CAF9",
                    });
                }
            }

            return updated;
        });
    };

    const handleOffToggle = (name, day) => {
        setScheduleData((prev) => {
            const updated = { ...prev };
            updated[selectedRole] = prev[selectedRole].filter((s) => !(s.name === name && s.day === day));
            return updated;
        });
    };

    const buildTableData = () => {
        return teamMembers[selectedRole].map((name) => {
            const row = { name };
            days.forEach((day) => {
                const shifts = scheduleData[selectedRole].filter((s) => s.name === name && s.day === day);
                if (shifts.length > 0) {
                    row[day] = { start: shifts[0].start, end: shifts[0].end };
                } else {
                    row[day] = null; // OFF
                }
            });
            return row;
        });
    };

    return (
        <div className="schedule-container">
            <h1 className="schedule-header">Schedule</h1>

            <div className="schedule-controls">
                <button className="generate-btn">🔄 Generate Schedule</button>
                <div className="pagination">
                    <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>⬅️</button>
                    <span>{currentPage} of 12</span>
                    <button onClick={() => setCurrentPage((p) => Math.min(p + 1, 12))}>➡️</button>
                </div>
                <select value={selectedRole} onChange={handleRoleChange}>
                    {roles.map((role) => (
                        <option key={role}>{role}</option>
                    ))}
                </select>
                <button className="switch-view-btn" onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}>
                    {viewMode === "grid" ? "Switch to Table View" : "Switch to Grid View"}
                </button>
            </div>

            {viewMode === "grid" ? (
                <div className="schedule-grid">
                    <div className="time-label-header"></div>
                    {days.map((day, index) => (
                        <div key={day} className="day-header" style={{ gridColumn: index + 2 }}>
                            {day}
                        </div>
                    ))}
                    {times.map((time, rowIndex) => (
                        <React.Fragment key={time}>
                            <div className="time-label" style={{ gridRow: rowIndex + 2 }}>{time}</div>
                            {days.map((day, colIndex) => (
                                <div
                                    key={day + time}
                                    className="grid-cell"
                                    style={{
                                        gridColumn: colIndex + 2,
                                        gridRow: rowIndex + 2,
                                    }}
                                ></div>
                            ))}
                        </React.Fragment>
                    ))}
                    {Object.values(
                        scheduleData[selectedRole].reduce((acc, s) => {
                            const key = `${s.day}-${s.start}-${s.end}`;
                            if (!acc[key]) acc[key] = { ...s, names: [s.name] };
                            else acc[key].names.push(s.name);
                            return acc;
                        }, {})
                    ).map((s, i) => {
                        const startIndex = times.findIndex((t) => t === s.start);
                        const endIndex = times.findIndex((t) => t === s.end);
                        if (startIndex === -1 || endIndex === -1) return null;
                        const rowStart = startIndex + 2;
                        const rowSpan = endIndex - startIndex + 1;
                        const colStart = days.findIndex((d) => d === s.day) + 2;

                        return (
                            <div
                                key={i}
                                className="shift-block"
                                style={{
                                    gridColumn: colStart,
                                    gridRow: `${rowStart} / span ${rowSpan}`,
                                    backgroundColor: s.color,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                }}
                            >
                                {s.names.join(", ")}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="schedule-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                {days.map((day) => (
                                    <th key={day}>{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {buildTableData().map((row, i) => (
                                <tr key={i}>
                                    <td>{row.name}</td>
                                    {days.map((day) => {
                                        const shift = row[day];
                                        return (
                                            <td key={day}>
                                                {shift ? (
                                                    <>
                                                        <select
                                                            value={shift.start}
                                                            onChange={(e) => handleTimeChange(row.name, day, "start", e.target.value)}
                                                        >
                                                            {times.map((t) => (
                                                                <option key={t} value={t}>{t}</option>
                                                            ))}
                                                        </select>
                                                        {" - "}
                                                        <select
                                                            value={shift.end}
                                                            onChange={(e) => handleTimeChange(row.name, day, "end", e.target.value)}
                                                        >
                                                            {times
                                                                .filter((t) => times.indexOf(t) > times.indexOf(shift.start))
                                                                .map((t) => (
                                                                    <option key={t} value={t}>{t}</option>
                                                                ))}
                                                        </select>
                                                        <button onClick={() => handleOffToggle(row.name, day)} style={{ marginLeft: "0.5rem" }}>OFF</button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>OFF</span>
                                                        <button onClick={() => handleTimeChange(row.name, day, "start", "11:00 AM")} style={{ marginLeft: "0.5rem" }}>Add</button>
                                                    </>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Schedule;
