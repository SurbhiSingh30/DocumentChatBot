import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    // Later this will come from profile API
    const profileImage = null;

    const userInitial = "S";

    return (
        <header className="navbar">

            {/* LEFT SIDE */}
            <div className="navbar-left">
                {/* intentionally empty */}
            </div>

            {/* RIGHT SIDE */}
            <div className="navbar-right">

                {/* Notifications */}
                <button
                    type="button"
                    className="navbar-icon-btn"
                    aria-label="Notifications"
                    title="Notifications"
                >
                    <Bell size={20} />
                </button>

                {/* Profile */}
                <button
                    type="button"
                    className="navbar-profile"
                    onClick={() => navigate("/profile")}
                    aria-label="Profile"
                    title="Profile"
                >

                    {profileImage ? (
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="navbar-profile-image"
                        />
                    ) : (
                        <span className="navbar-profile-initial">
                            {userInitial}
                        </span>
                    )}

                </button>

            </div>

        </header>
    );
}

export default Navbar;