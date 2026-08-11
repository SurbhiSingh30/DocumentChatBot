
import { useState } from "react";
import "./settings.css";

import api from "../services/api";

function Settings() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        if (newPassword.length < 8) {
            setError("New password must be at least 8 characters.");
            return;
        }

        setLoading(true);

        try {
            const response = await api.put(
                "/settings/password",
                {
                    current_password: currentPassword,
                    new_password: newPassword,
                }
            );

            setMessage(
                response.data.message ||
                "Password changed successfully."
            );

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (error) {
            console.error("Password change error:", error);

            setError(
                error.response?.data?.detail ||
                "Unable to change password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="settings-page">

            <h1>Settings</h1>

            {/* SECURITY */}

            <div className="setting-card security-card">

                <div className="setting-header">
                    <div>
                        <h3>Security</h3>
                        <p>
                            Manage your Stratum account password.
                        </p>
                    </div>
                </div>

                <form
                    className="password-form"
                    onSubmit={handleChangePassword}
                >

                    <div className="form-group">
                        <label>Current Password</label>

                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) =>
                                setCurrentPassword(e.target.value)
                            }
                            placeholder="Enter current password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>New Password</label>

                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(e.target.value)
                            }
                            placeholder="Enter new password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm New Password</label>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            placeholder="Confirm new password"
                            required
                        />
                    </div>

                    {error && (
                        <div className="settings-error">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="settings-success">
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="primary-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "Changing Password..."
                            : "Change Password"}
                    </button>

                </form>

            </div>

            {/* APPEARANCE */}

            <div className="setting-card">

                <div>
                    <h3>Appearance</h3>

                    <p>
                        Customize how Stratum looks.
                    </p>
                </div>

                <button className="secondary-btn">
                    Toggle Dark Mode
                </button>

            </div>

            {/* NOTIFICATIONS */}

            <div className="setting-card">

                <div>
                    <h3>Notifications</h3>

                    <p>
                        Manage your notification preferences.
                    </p>
                </div>

                <button className="secondary-btn">
                    Manage Notifications
                </button>

            </div>

            {/* ACCOUNT */}

            <div className="setting-card danger-card">

                <div>
                    <h3>Delete Account</h3>

                    <p>
                        Permanently delete your Stratum account
                        and associated data.
                    </p>
                </div>

                <button className="danger-btn">
                    Delete Account
                </button>

            </div>

        </div>
    );
}

export default Settings;
