import { Bell, Search, Moon } from "lucide-react";
import logo from "../../assets/logo/Stratum.png";

function Navbar() {
  return (
    <header className="navbar">

      <div className="navbar-left">
        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search documents..."
          />
        </div>
      </div>

      <div className="navbar-right">
        <Bell size={20} />

        <Moon size={20} />

        <img
          src={logo}
          alt="Stratum Logo"
          className="navbar-logo"
        />
      </div>

    </header>
  );
}

export default Navbar;