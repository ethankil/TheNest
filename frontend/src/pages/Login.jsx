import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import UNTLogo from "../assets/UNTLogo.png";
import Background from "../assets/Background.jpg";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess("Login successful!");
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      minHeight: "100vh",
      height: "100vh",
      width: "100vw",
      fontFamily: "sans-serif",
      paddingTop: "50px",
      boxSizing: "border-box",
      backgroundImage: `url(${Background})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    }}>
      <img
        src={UNTLogo}
        alt="UNT Logo"
        style={{ width: "500px", marginBottom: "-91px" }}
      />

      <h1 style={{
        color: "#00853e",
        fontSize: "3.5rem",
        fontWeight: "bold",
        fontFamily: "Georgia, 'Times New Roman', serif",
        margin: "5px 0"
      }}>
        The Nest
      </h1>

      <h2 style={{
        fontWeight: "normal",
        fontSize: "1.5rem",
        marginBottom: "10px"
      }}>
        User Login
      </h2>

      <form onSubmit={handleLogin} style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        alignItems: "center",
        width: "300px"
      }}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "8px", width: "100%" }}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "8px", width: "100%" }}
        />
        <button type="submit" style={{
          padding: "10px",
          backgroundColor: "#00853e",
          color: "white",
          border: "none",
          width: "100%",
          cursor: "pointer"
        }}>
          Login
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      {success && <p style={{ color: "green", marginTop: "10px" }}>{success}</p>}

      <p style={{ marginTop: "15px" }}>
        Don’t have an account? <Link to="/">Register here</Link>
      </p>
    </div>
  );
}

export default Login;
