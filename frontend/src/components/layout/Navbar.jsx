import { Bell, Search, Moon } from "lucide-react";
import logo from "../../assets/logo/Stratum.png";

function Navbar() {
  return (
    <header className="navbar">

      {/* Left */}
      <div className="navbar-left">

        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search documents..."
          />
        </div>

      </div>

      {/* Right */}
      <div className="navbar-right">

        <Bell className="nav-icon" size={20} />

        <Moon className="nav-icon" size={20} />

        <img
          src={logo}
          alt="Stratum"
          className="navbar-logo"
        />

      </div>

    </header>
  );
}

export default Navbar;