// src/components/Sidebar.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    const businessName = "John Tavern";
    const initial = businessName.charAt(0).toUpperCase();

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: '📊' },
        { name: 'Team', path: '/team', icon: '👥' },
        { name: 'Schedule', path: '/schedule', icon: '🗓️' },
        { name: 'Settings', path: '/settings', icon: '⚙️' }
    ];

    return (
        <div className="sidebar-wrapper">
            {/* Left fixed column */}
            <div className="sidebar-mini">
                <div className="sidebar-brand">BarGrid</div>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="sidebar-toggle"
                    title={collapsed ? 'Collapse' : 'Expand'}
                >
                    {initial}
                </button>
            </div>

            {/* Expandable sidebar */}
            <div className={`sidebar-expandable ${collapsed ? 'expanded' : 'collapsed'}`}>
                {collapsed && (
                    <>
                        <div className="sidebar-title">{businessName}</div>
                        <ul className="sidebar-nav">
                            {navItems.map(({ name, path, icon }) => {
                                const isActive = location.pathname === path;
                                return (
                                    <li key={name}>
                                        <Link
                                            to={path}
                                            className={`sidebar-link ${isActive ? 'active' : ''}`}
                                        >
                                            <span className="sidebar-icon">{icon}</span>
                                            <span className="sidebar-label">{name}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
}
