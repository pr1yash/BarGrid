import React, { useState } from "react";
import "./Team.css";

const initialTeamData = {
    Bartender: ["Jason", "Abu", "Shirley", "Jones"],
    Cook: ["Jason", "Abu"],
    Dishwasher: ["Jason"],
};

const Team = () => {
    const [teamData, setTeamData] = useState(initialTeamData);
    const [editing, setEditing] = useState({}); // { role: index }
    const [deleteConfirm, setDeleteConfirm] = useState(null); // { role, index }

    const handleAddRow = (role) => {
        setTeamData((prev) => ({
            ...prev,
            [role]: [...prev[role], ""],
        }));
        setEditing({ role, index: teamData[role].length });
    };

    const handleDeleteRow = () => {
        const { role, index } = deleteConfirm;
        setTeamData((prev) => ({
            ...prev,
            [role]: prev[role].filter((_, i) => i !== index),
        }));
        setDeleteConfirm(null);
    };

    const handleNameChange = (role, index, newName) => {
        setTeamData((prev) => ({
            ...prev,
            [role]: prev[role].map((name, i) => (i === index ? newName : name)),
        }));
    };

    const roles = Object.keys(teamData);

    return (
        <div className="team-container">
            <h1 className="team-header">Team</h1>
            {roles.map((role) => (
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
                            {teamData[role].map((name, index) => (
                                <tr key={index}>
                                    <td className="name-cell">
                                        {editing.role === role && editing.index === index ? (
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) =>
                                                    handleNameChange(role, index, e.target.value)
                                                }
                                                onBlur={() => setEditing({})}
                                                autoFocus
                                                placeholder="Enter name..."
                                            />
                                        ) : (
                                            <>
                                                {name || <span className="placeholder">Unnamed</span>}
                                                <button
                                                    className="icon-btn"
                                                    onClick={() => setEditing({ role, index })}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="14"
                                                        height="14"
                                                        fill="currentColor"
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path d="M12.146.854a.5.5 0 0 1 .708 0l2.292 2.292a.5.5 0 0 1 0 .708L13.207 5.793l-3-3L12.146.854ZM10.5 3.207l-7.5 7.5V13h2.293l7.5-7.5-2.293-2.293Z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    className="icon-btn"
                                                    onClick={() => setDeleteConfirm({ role, index })}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="14"
                                                        height="14"
                                                        fill="currentColor"
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path d="M5.5 5.5a.5.5 0 0 1 .5-.5h.5v7h-.5a.5.5 0 0 1-.5-.5v-6Zm3 0a.5.5 0 0 1 .5-.5h.5v7h-.5a.5.5 0 0 1-.5-.5v-6ZM3 2.5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1V3H3v-.5ZM1 4a.5.5 0 0 1 .5-.5H2V13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3.5h.5a.5.5 0 0 1 0 1H15v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5H1.5a.5.5 0 0 1-.5-.5Z" />
                                                    </svg>
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
