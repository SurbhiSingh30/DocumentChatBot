import { useEffect, useRef, useState } from "react";
import {
    Camera,
    Trash2,
    LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    getProfile,
    updateProfile,
    uploadProfileImage,
    removeProfileImage
} from "../../services/profileService";

function ProfileCard() {

    const navigate = useNavigate();

    const fileInputRef = useRef(null);

    const [profile, setProfile] = useState(null);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [organization, setOrganization] = useState("");
    const [role, setRole] = useState("");
    const [bio, setBio] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {

        const loadProfile = async () => {

            try {

                const data = await getProfile();

                setProfile(data);

                setUsername(data.username || "");
                setEmail(data.email || "");
                setOrganization(
                    data.organization || ""
                );
                setRole(data.role || "");
                setBio(data.bio || "");

            } catch (error) {

                console.error(
                    "Failed to load profile:",
                    error
                );

                setError(
                    "Failed to load profile."
                );

            } finally {

                setLoading(false);

            }
        };

        loadProfile();

    }, []);

    const handleSave = async () => {

        setSaving(true);
        setMessage("");
        setError("");

        try {

            const formData = new FormData();

            formData.append(
                "username",
                username
            );

            formData.append(
                "email",
                email
            );

            formData.append(
                "organization",
                organization
            );

            formData.append(
                "role",
                role
            );

            formData.append(
                "bio",
                bio
            );

            await updateProfile(formData);

            setMessage(
                "Profile updated successfully."
            );

        } catch (error) {

            console.error(
                "Profile update error:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Failed to update profile."
            );

        } finally {

            setSaving(false);

        }
    };

    const handleImageSelect = async (event) => {

        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setUploadingImage(true);
        setMessage("");
        setError("");

        try {

            const response =
                await uploadProfileImage(file);

            setProfile((prev) => ({
                ...prev,
                profile_image:
                    response.profile_image
            }));

            setMessage(
                "Profile photo updated."
            );

        } catch (error) {

            console.error(
                "Profile image error:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Failed to upload profile photo."
            );

        } finally {

            setUploadingImage(false);

            event.target.value = "";
        }
    };

    const handleRemoveImage = async () => {

        setUploadingImage(true);
        setMessage("");
        setError("");

        try {

            await removeProfileImage();

            setProfile((prev) => ({
                ...prev,
                profile_image: null
            }));

            setMessage(
                "Profile photo removed."
            );

        } catch (error) {

            console.error(
                "Remove image error:",
                error
            );

            setError(
                "Failed to remove profile photo."
            );

        } finally {

            setUploadingImage(false);

        }
    };

    const handleLogout = () => {

        localStorage.removeItem(
            "access_token"
        );

        window.location.href = "/login";
    };

    if (loading) {

        return (
            <div className="profile-card">
                <p>Loading profile...</p>
            </div>
        );
    }

    const initials = username
        ? username
            .split(" ")
            .map((name) => name[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        : "U";

    const profileImage = profile?.profile_image
        ? `http://127.0.0.1:8000${profile.profile_image}`
        : null;

    return (
        <div className="profile-card">

            {/* PROFILE HEADER */}

            <div className="profile-header">

                <div className="profile-avatar-wrapper">

                    {profileImage ? (

                        <img
                            src={profileImage}
                            alt="Profile"
                            className="profile-avatar-image"
                        />

                    ) : (

                        <div className="profile-avatar">
                            {initials}
                        </div>

                    )}

                    <button
                        className="avatar-camera"
                        onClick={() =>
                            fileInputRef.current?.click()
                        }
                        disabled={uploadingImage}
                    >
                        <Camera size={16} />
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        hidden
                        onChange={handleImageSelect}
                    />

                </div>

                <div className="profile-heading">

                    <h2>{username}</h2>

                    <p>{email}</p>

                    <button
                        className="profile-photo-button"
                        onClick={() =>
                            fileInputRef.current?.click()
                        }
                    >
                        {uploadingImage
                            ? "Uploading..."
                            : "Change photo"}
                    </button>

                    {profileImage && (
                        <button
                            className="remove-photo-button"
                            onClick={handleRemoveImage}
                        >
                            <Trash2 size={14} />
                            Remove
                        </button>
                    )}

                </div>

            </div>


            {/* PERSONAL INFORMATION */}

            <div className="profile-section">

                <div className="profile-section-heading">

                    <h3>Personal Information</h3>

                    <p>
                        Update your personal details.
                    </p>

                </div>

                <div className="profile-form">

                    <div className="profile-field">

                        <label>Full Name</label>

                        <input
                            value={username}
                            onChange={(e) =>
                                setUsername(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <div className="profile-field">

                        <label>Email</label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <div className="profile-field">

                        <label>Organization</label>

                        <input
                            value={organization}
                            onChange={(e) =>
                                setOrganization(
                                    e.target.value
                                )
                            }
                            placeholder="Your organization"
                        />

                    </div>

                    <div className="profile-field">

                        <label>Role</label>

                        <input
                            value={role}
                            onChange={(e) =>
                                setRole(
                                    e.target.value
                                )
                            }
                            placeholder="Your role"
                        />

                    </div>

                    <div className="profile-field">

                        <label>Bio</label>

                        <textarea
                            value={bio}
                            onChange={(e) =>
                                setBio(
                                    e.target.value
                                )
                            }
                            placeholder="Tell us a little about yourself..."
                            rows={4}
                        />

                    </div>

                </div>

            </div>


            {/* ACCOUNT */}

            <div className="profile-section">

                <div className="profile-section-heading">

                    <h3>Account & Security</h3>

                    <p>
                        Manage your account.
                    </p>

                </div>

                <div className="profile-account-row">

                    <div>
                        <strong>
                            Account Security
                        </strong>

                        <p>
                            Manage your password and account security settings.
                        </p>
                    </div>

                    <button
                        className="secondary-btn"
                        onClick={() => navigate("/settings")}
                    >
                        Security Settings
                    </button>

                </div>

                <div className="profile-account-row">

                    <div>
                        <strong>
                            Sign out
                        </strong>

                        <p>
                            Sign out of your Stratum account.
                        </p>
                    </div>

                    <button
                        className="danger-btn"
                        onClick={handleLogout}
                    >
                        <LogOut size={17} />
                        Log out
                    </button>

                </div>

            </div>


            {/* ACCOUNT DATE */}

            {profile?.created_at && (

                <p className="member-since">

                    Member since{" "}

                    {new Date(
                        profile.created_at
                    ).toLocaleDateString(
                        undefined,
                        {
                            month: "long",
                            year: "numeric"
                        }
                    )}

                </p>

            )}


            {/* FEEDBACK */}

            {message && (
                <p className="profile-success">
                    {message}
                </p>
            )}

            {error && (
                <p className="profile-error">
                    {error}
                </p>
            )}


            {/* SAVE */}

            <div className="profile-actions">

                <button
                    className="primary-btn"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving
                        ? "Saving..."
                        : "Save Changes"}
                </button>

            </div>

        </div>
    );
}

export default ProfileCard;