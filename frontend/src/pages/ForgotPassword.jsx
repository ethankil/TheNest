import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import UNTLogo from "../assets/UNTLogo.png";
import Background from "../assets/Background.jpg";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Check your inbox.");
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
      <img src={UNTLogo} alt="UNT Logo" style={{ width: "500px", marginBottom: "-91px" }} />

      <h1 style={{
        color: "#00853e",
        fontSize: "3.5rem",
        fontWeight: "bold",
        fontFamily: "Georgia, 'Times New Roman', serif",
        margin: "5px 0"
      }}>
        The Nest
      </h1>

      <h2 style={{ fontWeight: "normal", fontSize: "1.5rem", marginBottom: "30px" }}>
        Reset Your Password
      </h2>

      <form onSubmit={handleReset} style={{
        display: "flex",
        flexDirection: "column",
        width: "300px",
        gap: "10px"
      }}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "10px" }}
        />
        <button type="submit" style={{
          padding: "10px",
          backgroundColor: "#00853e",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}>
          Send Reset Link
        </button>
      </form>

      {message && <p style={{ color: "green", marginTop: "10px" }}>{message}</p>}
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
}

export default ForgotPassword;
