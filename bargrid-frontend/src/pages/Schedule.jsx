import React, { useState, useEffect } from "react";
import "./Schedule.css";
import { API_URL } from "../config";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const times = [
    "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
    "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM",
    "11:00 PM", "12:00 AM", "1:00 AM", "2:00 AM"
];

const roles = ["Bartender", "Server", "Cook", "Dishwasher"];

const Schedule = () => {
    const [scheduleData, setScheduleData] = useState({});
    const [teamMembers, setTeamMembers] = useState({});
    const [selectedRole, setSelectedRole] = useState("Bartender");
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState("grid");

    useEffect(() => {
        fetchTeamData();
        fetchShiftData();
    }, []);

    const fetchTeamData = async () => {
        try {
            const res = await fetch(`${API_URL}/team`);
            const data = await res.json();
            const grouped = data.reduce((acc, member) => {
                if (!acc[member.role]) acc[member.role] = [];
                acc[member.role].push(member);
                return acc;
            }, {});
            setTeamMembers(grouped);
        } catch (error) {
            console.error("Error fetching team members:", error);
        }
    };

    const fetchShiftData = async () => {
        try {
            const res = await fetch(`${API_URL}/shifts`);
            const data = await res.json();
            const organized = {};

            for (const role of roles) {
                organized[role] = [];
            }

            data.forEach((shift) => {
                shift.teamMembers.forEach((tm) => {
                    if (!organized[tm.role]) organized[tm.role] = [];
                    organized[tm.role].push({
                        id: shift.id,
                        name: tm.name,
                        day: shift.day,
                        start: shift.startTime,
                        end: shift.endTime,
                        color: getColor(tm.name),
                    });
                });
            });

            setScheduleData(organized);
        } catch (error) {
            console.error("Error fetching shifts:", error);
        }
    };

    const getColor = (name) => {
        const colors = ["#81C784", "#E57373", "#BA68C8", "#4FC3F7", "#AED581", "#FF8A65", "#64B5F6"];
        let hash = 0;
        for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
        return colors[hash % colors.length];
    };

    const getMemberIds = (name) => {
        return (teamMembers[selectedRole] || [])
            .filter((m) => m.name === name)
            .map((m) => m.id);
    };

    const handleRoleChange = (e) => setSelectedRole(e.target.value);

    const handleTimeChange = async (name, day, type, value) => {
        setScheduleData((prev) => {
            const updated = { ...prev };
            const roleShifts = updated[selectedRole] || [];
            const memberShifts = roleShifts.filter((s) => s.name === name && s.day === day);
            const existingShift = memberShifts.length ? memberShifts[0] : null;

            if (existingShift) {
                existingShift[type] = value;

                fetch(`${API_URL}/shifts/${existingShift.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        day,
                        startTime: existingShift.start,
                        endTime: existingShift.end,
                        teamMemberIds: getMemberIds(name),
                    }),
                });
            } else {
                const start = value;
                const end = times[times.indexOf(start) + 1] || "2:00 AM";
                const newShift = {
                    day,
                    startTime: start,
                    endTime: end,
                    teamMemberIds: getMemberIds(name),
                };

                fetch(`${API_URL}/shifts`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newShift),
                })
                    .then((res) => res.json())
                    .then((created) => {
                        updated[selectedRole].push({
                            id: created.id,
                            name,
                            day,
                            start,
                            end,
                            color: getColor(name),
                        });
                        setScheduleData(updated);
                    });
            }

            return updated;
        });
    };

    const handleOffToggle = async (name, day) => {
        setScheduleData((prev) => {
            const updated = { ...prev };
            const roleShifts = updated[selectedRole] || [];
            const shiftToRemove = roleShifts.find((s) => s.name === name && s.day === day);

            if (shiftToRemove?.id) {
                fetch(`${API_URL}/shifts/${shiftToRemove.id}`, {
                    method: "DELETE",
                });
            }

            updated[selectedRole] = roleShifts.filter((s) => !(s.name === name && s.day === day));
            return updated;
        });
    };

    const buildTableData = () => {
        const members = teamMembers[selectedRole] || [];
        return members.map((member) => {
            const row = { name: member.name };
            days.forEach((day) => {
                const shifts = (scheduleData[selectedRole] || []).filter((s) => s.name === member.name && s.day === day);
                row[day] = shifts.length > 0 ? { start: shifts[0].start, end: shifts[0].end } : null;
            });
            return row;
        });
    };

    const handleGenerateSchedule = () => {
        console.log("🧠 Smart schedule logic will go here");
    };

    return (
        <div className="schedule-container">
            <h1 className="schedule-header">Schedule</h1>

            <div className="schedule-controls">
                <button className="generate-btn" onClick={handleGenerateSchedule}>🔄 Generate Schedule</button>
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
                        (scheduleData[selectedRole] || []).reduce((acc, s) => {
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
                        const rowSpan = endIndex - startIndex;
                        const colStart = days.findIndex((d) => d === s.day) + 2;

                        return (
                            <div
                                key={i}
                                className="shift-block"
                                style={{
                                    gridColumn: colStart,
                                    gridRow: `${rowStart} / span ${rowSpan}`,
                                    backgroundColor: s.color,
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
