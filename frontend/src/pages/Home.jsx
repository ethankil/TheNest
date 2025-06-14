import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      fontFamily: "sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      padding: "2rem",
      boxSizing: "border-box"
    }}>
      {/* Profile Icon */}
      <div
        onClick={() => navigate("/profile")}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: "#ccc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontWeight: "bold"
        }}
        title="Go to Profile"
      >
        🧑
      </div>

      {/* Centered Content */}
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
          Welcome to The Nest!
        </h1>
        <p style={{ marginBottom: "1.5rem" }}>You are logged in.</p>
        <button onClick={handleLogout} style={{
          padding: "10px 20px",
          backgroundColor: "#a10000",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Home;
