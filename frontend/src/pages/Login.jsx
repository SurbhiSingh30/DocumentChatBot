import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 
  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("LOGIN BUTTON CLICKED");

    setLoading(true);
    setError("");

    try {

        const data = await loginUser(email, password);

        localStorage.setItem(
            "access_token",
            data.access_token
        );

        navigate("/");

    } catch (err) {

        setError("Invalid email or password.");

    } finally {

        setLoading(false);

    }
};

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>Welcome Back</h1>
        <p>Sign in to continue to Stratum</p>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Login"}
         </button>
         {
           error && (
            <p className="login-error">
                {error}
            </p>)
          }

        </form>

      </div>

    </div>
  );
}

export default Login;