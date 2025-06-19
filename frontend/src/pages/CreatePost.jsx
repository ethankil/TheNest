import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

function CreatePost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "posts"), {
        userEmail: user.email,
        userId: user.uid,
        title,
        description,
        tag,
        createdAt: serverTimestamp()
      });
      navigate("/home");
    } catch (err) {
      console.error("Error adding post:", err);
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "4rem",
      width: "100vw",
      minHeight: "100vh",
      backgroundColor: "#f5f5f5",
      justifyContent: "center",
      fontFamily: "sans-serif"
    }}>
      <h2 style={{ color: "#00853e", marginBottom: "1rem" }}>Create a New Post</h2>
      <form onSubmit={handleSubmit} style={{
        width: "100%",
        maxWidth: "500px",
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
      }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={6}
          style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          required
          style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        >
          <option value="">Select a tag</option>
          <option value="#homework">#homework</option>
          <option value="#advice">#advice</option>
          <option value="#events">#events</option>
          <option value="#clubs">#clubs</option>
          <option value="#housing">#housing</option>
        </select>

        <button type="submit" style={{
          padding: "10px",
          backgroundColor: "#00853e",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}>
          Post
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
