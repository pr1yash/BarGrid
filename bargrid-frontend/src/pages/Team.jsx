import React, { useState, useEffect } from "react";
import "./Team.css";
import { API_URL } from "../config";

const ROLES = ["Bartender", "Server", "Cook", "Dishwasher"]; // Ensure consistency

const Team = () => {
    const [teamData, setTeamData] = useState({});
    const [editing, setEditing] = useState({});
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Fetch team data from API
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

    // Add new team member
    const handleAddRow = async (role) => {
        try {
            const response = await fetch(`${API_URL}/team`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: "",
                    role,
                    userId: 1, // Hardcoded userId for now
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

    // Edit team member name
    const handleNameChange = async (role, index, newName) => {
        const member = teamData[role][index];

        if (member.id) {
            try {
                await fetch(`${API_URL}/team/${member.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: newName }),
                });
            } catch (error) {
                console.error("Error updating team member:", error);
            }
        }

        setTeamData((prev) => ({
            ...prev,
            [role]: prev[role].map((m, i) =>
                i === index ? { ...m, name: newName } : m
            ),
        }));
    };

    // Delete team member
    const handleDeleteRow = async () => {
        const { role, index } = deleteConfirm;
        const member = teamData[role][index];

        if (member.id) {
            try {
                await fetch(`${API_URL}/team/${member.id}`, {
                    method: "DELETE",
                });
            } catch (error) {
                console.error("Error deleting team member:", error);
            }
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
                                        <select>
                                            <option>---Select---</option>
                                            <option>Morning</option>
                                            <option>Evening</option>
                                            <option>Mixed</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select>
                                            <option>---Select---</option>
                                            <option>Monday</option>
                                            <option>Tuesday</option>
                                            <option>Wednesday</option>
                                            <option>Thursday</option>
                                            <option>Friday</option>
                                            <option>Saturday</option>
                                            <option>Sunday</option>
                                        </select>
                                    </td>
                                    <td>
                                        <input type="number" min="0" />
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
