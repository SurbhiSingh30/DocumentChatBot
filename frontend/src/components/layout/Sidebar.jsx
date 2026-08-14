import {
    LayoutDashboard,
    MessageSquare,
    Files,
    Upload,
    User,
    Settings,
    PanelLeftClose,
    PanelLeftOpen,
    Sun,
    Moon,
} from "lucide-react";
import logo from "../../assets/logo/Stratum.png";
import { NavLink } from "react-router-dom";
import useTheme from "../../hooks/useTheme";

function Sidebar({ collapsed, setCollapsed }) {
    const { theme, toggleTheme } = useTheme();

    const handleCollapse = () => {
        setCollapsed((current) => !current);
    };

    return (
        <aside
            className={`sidebar ${collapsed ? "collapsed" : ""}`}
            aria-label="Main navigation"
        >
            {/* BRAND */}
           <div className="brand-section">

                <img
                    src={logo}
                    alt="Stratum"
                    className="sidebar-logo"
                />

                {!collapsed && (
                    <div className="brand-text">
                        <h2>STRATUM</h2>
                        <p>AI Document Intelligence</p>
                    </div>
                )}

            </div>

            {/* COLLAPSE */}
            <div className="sidebar-top">
                <button
                    type="button"
                    className="collapse-btn"
                    onClick={handleCollapse}
                    aria-label={
                        collapsed
                            ? "Expand sidebar"
                            : "Collapse sidebar"
                    }
                    title={
                        collapsed
                            ? "Expand sidebar"
                            : "Collapse sidebar"
                    }
                >
                    {collapsed ? (
                        <PanelLeftOpen size={21} />
                    ) : (
                        <PanelLeftClose size={21} />
                    )}
                </button>
            </div>

            {/* MAIN NAVIGATION */}
            <nav className="sidebar-nav">
                <NavLink to="/" end>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>
            </nav>

            {/* BOTTOM NAVIGATION */}
            <div className="sidebar-bottom">
                <NavLink to="/profile">
                    <User size={20} />
                    <span>Profile</span>
                </NavLink>

                <NavLink to="/settings">
                    <Settings size={20} />
                    <span>Settings</span>
                </NavLink>

                {/* THEME TOGGLE */}
                <button
                    type="button"
                    className="theme-toggle"
                    onClick={toggleTheme}
                    aria-label={
                        theme === "dark"
                            ? "Switch to light mode"
                            : "Switch to dark mode"
                    }
                    title={
                        theme === "dark"
                            ? "Light mode"
                            : "Dark mode"
                    }
                >
                    {theme === "dark" ? (
                        <Sun size={20} />
                    ) : (
                        <Moon size={20} />
                    )}

                    <span>
                        {theme === "dark"
                            ? "Light mode"
                            : "Dark mode"}
                    </span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;