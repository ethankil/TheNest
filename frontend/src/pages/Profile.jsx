import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { signOut } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import UNTLogo from "../assets/UNTLogo.png";
import Background from "../assets/Background.jpg";

function Profile() {
  const { user, authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    major: "",
    gradYear: "",
    bio: "",
    photoURL: ""
  });
  const [file, setFile] = useState(null);
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
        setProfile({ ...profile, ...docSnap.data() });
      }
      setLoading(false);
    };

    loadProfile();
  }, [authLoading, user, navigate]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Saving...");
    try {
      let updatedProfile = { ...profile };

      if (file) {
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        updatedProfile.photoURL = url;
      }

      await setDoc(doc(db, "users", user.uid), updatedProfile);
      setMessage("Profile updated successfully.");
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Error updating profile.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    try {
      await setDoc(doc(db, "users", user.uid), {}, { merge: true }); // Optional: clear Firestore data
      // Firebase may require recent login before deletion
      await user.delete(); // Delete Firebase Auth user
      navigate("/login");
    } catch (error) {
      console.error("Failed to delete account:", error);
      alert("Error deleting account. Please re-authenticate and try again.");
    }
  };

  if (authLoading || loading) return <p>Loading...</p>;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      minHeight: "100vh",
      width: "100vw",
      fontFamily: "sans-serif",
      paddingTop: "50px",
      boxSizing: "border-box",
      backgroundImage: `url(${Background})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      position: "relative"
    }}>
      {/* Top-right profile bubble */}
      <div style={{ position: "absolute", top: "20px", right: "20px" }}>
        <img
          src={profile.photoURL ? profile.photoURL : "https://via.placeholder.com/40"}
          alt="Profile"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid #00853e"
          }}
        />
      </div>

      <img src={UNTLogo} alt="UNT Logo" style={{ width: "500px", marginBottom: "-91px" }} />

      <h1 style={{
        color: "#00853e",
        fontSize: "3.5rem",
        fontWeight: "bold",
        fontFamily: "Georgia, 'Times New Roman', serif",
        margin: "5px 0"
      }}>The Nest</h1>

      <h2 style={{
        fontWeight: "normal",
        fontSize: "1.5rem",
        marginBottom: "30px"
      }}>Edit Your Profile</h2>

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
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
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
          Save Profile
        </button>

        <button onClick={handleDeleteAccount} className="btn btn-danger mt-3" style={{
          marginTop: "10px",
          padding: "10px",
          backgroundColor: "#b00020",
          color: "white",
          border: "none",
          width: "100%",
          cursor: "pointer"
        }}>
          Delete Account
        </button>
      </form>

      {message && <p style={{ color: "red", marginTop: "10px" }}>{message}</p>}

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => navigate("/home")} style={{
          padding: "10px 20px",
          backgroundColor: "#004d28",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default Profile;
