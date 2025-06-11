import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import UNTLogo from "../assets/UNTLogo.png";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setSuccess("Registration successful! Welcome, " + userCredential.user.email);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",  // changed from "center" to start layout from top
  minHeight: "100vh",
  height: "100vh",
  width: "100vw",
  fontFamily: "sans-serif",
  paddingTop: "50px",             // added top spacing
  boxSizing: "border-box"
}}>
  <img
    src={UNTLogo}
    alt="UNT Logo"
    style={{
      width: "500px",              // made the logo larger
      marginBottom: "1px"
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
</div>
  );
}

export default Register;
