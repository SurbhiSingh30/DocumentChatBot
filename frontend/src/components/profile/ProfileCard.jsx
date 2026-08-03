function ProfileCard() {
  return (
    <div className="profile-card">

      <div className="profile-avatar">

        SS

      </div>

      <div className="profile-info">

        <label>Full Name</label>
        <input defaultValue="Surbhi Singh" />

        <label>Email</label>
        <input defaultValue="surbhi@example.com" />

        <label>Organization</label>
        <input defaultValue="Stratum Workspace" />

      </div>

      <button className="primary-btn">

        Save Changes

      </button>

    </div>
  );
}

export default ProfileCard;