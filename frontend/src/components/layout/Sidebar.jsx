import {
  LayoutDashboard,
  MessageSquare,
  Files,
  Upload,
  User,
  Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar({ collapsed }) {

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

      <div className="logo-section">

        <img
          src="/src/assets/logo/Stratum.png"
          alt="Stratum Logo"
          className="logo"
        />

        <div>

          <h2>STRATUM</h2>

          <p>AI Document Intelligence</p>

        </div>

      </div>

      <nav>
        
        <NavLink to="/">
           <LayoutDashboard size={20}/>
           <span>Dashboard</span>
        </NavLink>

        <NavLink to="/chat">
          <MessageSquare size={20} />
          <span>Chat</span>
        </NavLink>

        <NavLink to="/documents">
          <Files size={20} />
          <span>Documents</span>
        </NavLink>

        <NavLink to="/upload" >
          <Upload size={20} />
          <span>Upload</span>
        </NavLink>

      </nav>

      <div className="bottom-nav">

        <NavLink to="/profile">
          <User size={20} />
          <span>Profile</span>
        </NavLink>

        <NavLink to="/settings">
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>

      </div>

    </aside>
  );
}

export default Sidebar;