import "./settings.css";

function Settings() {

    return (

        <div className="settings-page">

            <h1>Settings</h1>

            <div className="setting-card">

                <h3>Appearance</h3>

                <button className="secondary-btn">

                    Toggle Dark Mode

                </button>

            </div>

            <div className="setting-card">

                <h3>Notifications</h3>

                <button className="secondary-btn">

                    Manage Notifications

                </button>

            </div>

            <div className="setting-card">

                <h3>Account</h3>

                <button className="secondary-btn">

                    Delete Account

                </button>

            </div>

        </div>

    );

}

export default Settings;