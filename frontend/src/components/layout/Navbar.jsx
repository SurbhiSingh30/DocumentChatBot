import { Bell, Search, Moon, Menu } from "lucide-react";

function Navbar({ collapsed, setCollapsed }) {
  return (
    <header className="navbar">
        <button
         className="menu-btn"
         onClick={() => setCollapsed(!collapsed)}>
        <Menu size={22} />
       </button>

      <div className="search-box">

        <Search size={18} />

        <input
          type="text"
          placeholder="Search documents..."
        />

      </div>

      <div className="navbar-right">

        <Bell size={20} />

        <Moon size={20} />

        <div className="avatar">
          
        </div>

      </div>

    </header>
  );
}

export default Navbar;