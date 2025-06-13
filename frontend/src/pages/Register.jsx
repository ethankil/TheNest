import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import UNTLogo from "../assets/UNTLogo.png";
import Background from "../assets/Background.jpg";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const { minLength, hasNumber, hasCapital } = checkPasswordStrength(password);
    if (!minLength || !hasNumber || !hasCapital) {
      setError("Password does not meet strength requirements.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setSuccess("Registration successful! Welcome, " + userCredential.user.email);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  const checkPasswordStrength = (password) => {
    const minLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasCapital = /[A-Z]/.test(password);
    return { minLength, hasNumber, hasCapital };
  };

  return (
    <div
      style={{
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
      }}
    >
      <img
        src={UNTLogo}
        alt="UNT Logo"
        style={{
          width: "500px",
          marginBottom: "-91px"
        }}
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
        marginBottom: "30px"
      }}>
        User Registration
      </h2>

      <form onSubmit={handleRegister} style={{
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

        <div style={{ fontSize: "0.85rem", textAlign: "left", width: "100%" }}>
          <p style={{ color: password.length >= 8 ? "green" : "red", margin: 0 }}>
            • At least 8 characters
          </p>
          <p style={{ color: /\d/.test(password) ? "green" : "red", margin: 0 }}>
            • Contains a number
          </p>
          <p style={{ color: /[A-Z]/.test(password) ? "green" : "red", margin: 0 }}>
            • Contains a capital letter
          </p>
        </div>

        <button type="submit" style={{
          padding: "10px",
          backgroundColor: "#00853e",
          color: "white",
          border: "none",
          width: "100%",
          cursor: "pointer"
        }}>
          Register
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      {success && <p style={{ color: "green", marginTop: "10px" }}>{success}</p>}
      <p style={{ marginTop: "10px" }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Register;
