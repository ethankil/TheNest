import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";
import UNTLogo from "../assets/UNTLogo.png"; // ✅ Make sure this path is correct

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      width: "100vw",
      fontFamily: "sans-serif"
    }}>
      {/* Left Sidebar */}
      <div style={{
        width: "220px",
        backgroundColor: "#f0f0f0",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center"
      }}>
        <img
          src={UNTLogo}
          alt="UNT Logo"
          style={{ width: "100%", marginBottom: "-10px" }}
        />
        <h2 style={{
          fontFamily: "Georgia, serif",
          fontSize: "2.5rem",
          color: "#00853e",
          marginTop: "-1rem",
          textAlign: "center"
        }}>
          The Nest
        </h2>

        <button
          onClick={() => navigate("/ask")}
          style={{
            marginTop: "1rem",
            width: "100%",
            padding: "10px",
            backgroundColor: "#00853e",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Create Post
        </button>

        <h4 style={{ marginTop: "2rem", alignSelf: "flex-start" }}>Recent Posts</h4>
        <ul style={{ paddingLeft: "1rem", fontSize: "0.95rem", alignSelf: "flex-start" }}>
          <li>Post A</li>
          <li>Post B</li>
          <li>Post C</li>
        </ul>
      </div>

      {/* Center Feed */}
      <div style={{
        flex: 1,
        padding: "2rem",
        overflowY: "auto",
        backgroundColor: "#fafafa"
      }}>
        {/* Top bar */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem"
        }}>
          <input
            type="text"
            placeholder="Search..."
            style={{
              flex: 1,
              padding: "10px",
              marginRight: "1rem",
              border: "1px solid #ccc",
              borderRadius: "4px"
            }}
          />
          <div style={{ position: "relative" }}>
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "#ccc",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer"
              }}
              title="Profile"
            >
              🧑
            </div>
            {dropdownOpen && (
              <div style={{
                position: "absolute",
                right: 0,
                top: "50px",
                backgroundColor: "white",
                border: "1px solid #ddd",
                borderRadius: "4px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
              }}>
                <button onClick={() => navigate("/profile")} style={{
                  padding: "10px 20px",
                  width: "100%",
                  border: "none",
                  backgroundColor: "white",
                  cursor: "pointer",
                  textAlign: "left"
                }}>Edit Profile</button>
                <button onClick={handleLogout} style={{
                  padding: "10px 20px",
                  width: "100%",
                  border: "none",
                  backgroundColor: "white",
                  cursor: "pointer",
                  textAlign: "left"
                }}>Logout</button>
              </div>
            )}
          </div>
        </div>

        {/* Feed */}
        <h2 style={{ marginBottom: "1rem" }}>Feed</h2>

        <div style={{
          backgroundColor: "#fff",
          padding: "1rem",
          marginBottom: "1rem",
          borderRadius: "6px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
        }}>
          <h3>Post Title</h3>
          <p>This is a sample post description.</p>
          <span style={{ fontSize: "0.85rem", color: "#888" }}>#tag1</span>
        </div>

        <div style={{
          backgroundColor: "#fff",
          padding: "1rem",
          borderRadius: "6px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
        }}>
          <h3>Post Title 2</h3>
          <p>This is another placeholder post.</p>
          <span style={{ fontSize: "0.85rem", color: "#888" }}>#tag2</span>
        </div>
      </div>

      {/* Right Sidebar */}
      <div style={{
        width: "220px",
        backgroundColor: "#f7f7f7",
        padding: "1rem"
      }}>
        <h4>Categories / Tags</h4>
        <ul style={{ paddingLeft: "1rem", fontSize: "0.95rem" }}>
          <li>#tag1</li>
          <li>#tag2</li>
          <li>#tag3</li>
        </ul>
      </div>
    </div>
  );
}

export default Home;
