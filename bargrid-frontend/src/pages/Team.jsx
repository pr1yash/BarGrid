import React, { useState, useEffect } from "react";
import "./Team.css";
import { API_URL } from "../config";

const ROLES = ["Bartender", "Server", "Cook", "Dishwasher"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const SHIFT_OPTIONS = ["Morning", "Evening", "Mix"];

const Team = () => {
    const [teamData, setTeamData] = useState({});
    const [editing, setEditing] = useState({});
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const response = await fetch(`${API_URL}/team`);
                const data = await response.json();

                const grouped = data.reduce((acc, member) => {
                    const roleKey = member.role || "Other";
                    if (!acc[roleKey]) acc[roleKey] = [];
                    acc[roleKey].push(member);
                    return acc;
                }, {});

                setTeamData(grouped);
            } catch (error) {
                console.error("Error fetching team data:", error);
            }
        };

        fetchTeam();
    }, []);

    const handleAddRow = async (role) => {
        try {
            const response = await fetch(`${API_URL}/team`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: "",
                    role,
                    userId: 1,
                }),
            });

            const newMember = await response.json();

            setTeamData((prev) => ({
                ...prev,
                [role]: [...(prev[role] || []), newMember],
            }));

            setEditing({ role, index: (teamData[role]?.length || 0) });
        } catch (error) {
            console.error("Error adding team member:", error);
        }
    };

    const updateMember = async (memberId, updates) => {
        try {
            await fetch(`${API_URL}/team/${memberId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
        } catch (error) {
            console.error("Error updating team member:", error);
        }
    };

    const handleNameChange = (role, index, newName) => {
        const member = teamData[role][index];
        if (!member) return;
        updateMember(member.id, { name: newName });

        setTeamData((prev) => ({
            ...prev,
            [role]: prev[role].map((m, i) =>
                i === index ? { ...m, name: newName } : m
            ),
        }));
    };

    const handleShiftPreferenceChange = (role, index, newPref) => {
        const member = teamData[role][index];
        updateMember(member.id, { shiftPreference: newPref });

        setTeamData((prev) => ({
            ...prev,
            [role]: prev[role].map((m, i) =>
                i === index ? { ...m, shiftPreference: newPref } : m
            ),
        }));
    };

    const handleMustHaveDaysChange = (role, index, day) => {
        const member = teamData[role][index];
        const currentDays = member.mustHaveDays || [];

        const updatedDays = currentDays.includes(day)
            ? currentDays.filter(d => d !== day)
            : [...currentDays, day];

        updateMember(member.id, { mustHaveDays: updatedDays });

        setTeamData((prev) => ({
            ...prev,
            [role]: prev[role].map((m, i) =>
                i === index ? { ...m, mustHaveDays: updatedDays } : m
            ),
        }));
    };

    const handleNumberOfDaysChange = (role, index, value) => {
        const member = teamData[role][index];
        const num = parseInt(value);
        updateMember(member.id, { numberOfDays: num });

        setTeamData((prev) => ({
            ...prev,
            [role]: prev[role].map((m, i) =>
                i === index ? { ...m, numberOfDays: num } : m
            ),
        }));
    };

    const handleDeleteRow = async () => {
        const { role, index } = deleteConfirm;
        const member = teamData[role][index];

        try {
            await fetch(`${API_URL}/team/${member.id}`, {
                method: "DELETE",
            });
        } catch (error) {
            console.error("Error deleting team member:", error);
        }

        setTeamData((prev) => ({
            ...prev,
            [role]: prev[role].filter((_, i) => i !== index),
        }));
        setDeleteConfirm(null);
    };

    return (
        <div className="team-container">
            <h1 className="team-header">Team</h1>

            {ROLES.map((role) => (
                <div key={role} className="team-section">
                    <h2>{role}</h2>
                    <table className="team-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Shift Time</th>
                                <th>Must Have</th>
                                <th>Number of Days</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(teamData[role] || []).map((member, index) => (
                                <tr key={member.id || index}>
                                    <td className="name-cell">
                                        {editing.role === role && editing.index === index ? (
                                            <input
                                                type="text"
                                                value={member.name}
                                                onChange={(e) =>
                                                    handleNameChange(role, index, e.target.value)
                                                }
                                                onBlur={() => setEditing({})}
                                                autoFocus
                                                placeholder="Enter name..."
                                            />
                                        ) : (
                                            <>
                                                {member.name || <span className="placeholder">Unnamed</span>}
                                                <button
                                                    className="icon-btn"
                                                    onClick={() => setEditing({ role, index })}
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="icon-btn"
                                                    onClick={() => setDeleteConfirm({ role, index })}
                                                >
                                                    🗑️
                                                </button>
                                            </>
                                        )}
                                    </td>
                                    <td>
                                        <select
                                            value={member.shiftPreference || "Mix"}
                                            onChange={(e) =>
                                                handleShiftPreferenceChange(role, index, e.target.value)
                                            }
                                        >
                                            <option value="">-- Select --</option>
                                            {SHIFT_OPTIONS.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <div className="day-checkboxes">
                                            {DAYS.map((day) => (
                                                <label key={day}>
                                                    <input
                                                        type="checkbox"
                                                        checked={member.mustHaveDays?.includes(day) || false}
                                                        onChange={() =>
                                                            handleMustHaveDaysChange(role, index, day)
                                                        }
                                                    />
                                                    {day.slice(0, 3)}
                                                </label>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            min="0"
                                            value={member.numberOfDays || ""}
                                            onChange={(e) =>
                                                handleNumberOfDaysChange(role, index, e.target.value)
                                            }
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className="add-row-btn" onClick={() => handleAddRow(role)}>
                        + Add More...
                    </button>
                </div>
            ))}

            {deleteConfirm && (
                <div className="popup-overlay">
                    <div className="popup">
                        <p>Are you sure you want to delete this person?</p>
                        <div className="popup-buttons">
                            <button onClick={handleDeleteRow}>Yes, Delete</button>
                            <button onClick={() => setDeleteConfirm(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Team;
