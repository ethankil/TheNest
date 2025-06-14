import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import UNTLogo from "../assets/UNTLogo.png";
import Background from "../assets/Background.jpg";
import { signOut } from "firebase/auth";

function Profile() {
  const { user, authLoading } = useAuth();
  console.log("authLoading:", authLoading);
  console.log("user:", user);
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    major: "",
    gradYear: "",
    bio: ""
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
      setLoading(false);
    };

    loadProfile();
  }, [user, authLoading, navigate]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await setDoc(doc(db, "users", user.uid), profile);
    navigate("/home");
  } catch (err) {
    setMessage("Error saving profile.");
  }
};

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  if (authLoading || loading) return <p>Loading...</p>;

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
        style={{ width: "500px", marginBottom: "-120px" }}
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
        Edit Your Profile
      </h2>

      <form onSubmit={handleSubmit} style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        alignItems: "center",
        width: "300px"
      }}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={profile.name}
          onChange={handleChange}
          required
          style={{ padding: "8px", width: "100%" }}
        />
        <input
          type="text"
          name="major"
          placeholder="Major"
          value={profile.major}
          onChange={handleChange}
          required
          style={{ padding: "8px", width: "100%" }}
        />
        <input
          type="text"
          name="gradYear"
          placeholder="Graduation Year"
          value={profile.gradYear}
          onChange={handleChange}
          required
          style={{ padding: "8px", width: "100%" }}
        />
        <textarea
          name="bio"
          placeholder="Bio"
          value={profile.bio}
          onChange={handleChange}
          style={{ padding: "8px", width: "100%", minHeight: "100px" }}
        />
        <button type="submit" style={{
          padding: "10px",
          backgroundColor: "#00853e",
          color: "white",
          border: "none",
          width: "100%",
          cursor: "pointer"
        }}>
          Save Profile
        </button>
      </form>

      {message && <p style={{ color: "green", marginTop: "10px" }}>{message}</p>}

      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button onClick={() => navigate("/home")} style={{
          padding: "10px 20px",
          backgroundColor: "#004d28",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}>
          Back to Home
        </button>
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

export default Profile;
