import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import UNTLogo from "../assets/UNTLogo.png";

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [activeTag, setActiveTag] = useState(null);
  
  // FR6 Search
   const [searchKeyword, setSearchKeyword] = useState("");
   const handleSearchKeyDown = (e) => {
      if (e.key === "Enter") {
          e.preventDefault();
            }
         };
     const filteredPosts = posts.filter((post) => {
     const matchesTag = activeTag ? post.tag === activeTag : true;
     const matchesKeyword = searchKeyword
    ? post.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      post.description.toLowerCase().includes(searchKeyword.toLowerCase())
    : true;

       return matchesTag && matchesKeyword;
     });
  
    const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  
  useEffect(() => {  // FR7 Sort Functionality
  let q;
    if (sortBy === "" || sortBy === "newest") {
       q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
         } else if (sortBy === "oldest") {
           q = query(collection(db, "posts"), orderBy("createdAt", "asc"));
             } else if (sortBy === "tag") {
                q = query(collection(db, "posts"), orderBy("tag", "asc"));
            }
    const unsubscribe = onSnapshot(q, (snapshot) => {
    const fetchedPosts = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(post => post.createdAt); 
        setPosts(fetchedPosts);
      });

       return () => unsubscribe();
       }, [sortBy]);

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", fontFamily: "sans-serif" }}>
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
        <img src={UNTLogo} alt="UNT Logo" style={{ width: "100%", marginBottom: "-10px" }} />
        <h2 style={{
          fontFamily: "Georgia, serif", fontSize: "1.5rem",
          color: "#00853e", marginTop: "0.5rem", textAlign: "center"
        }}>The Nest</h2>

        <button onClick={() => navigate("/createpost")} style={{
          marginTop: "1.5rem", width: "100%", padding: "10px",
          backgroundColor: "#00853e", color: "white", border: "none",
          borderRadius: "4px", cursor: "pointer"
        }}>Create Post</button>

        <h4 style={{ marginTop: "2rem", alignSelf: "flex-start" }}>Recent Posts</h4>
        <ul style={{ paddingLeft: "1rem", fontSize: "0.95rem", alignSelf: "flex-start" }}>
          <li>Post A</li>
          <li>Post B</li>
          <li>Post C</li>
        </ul>
      </div>
          
      {/* Main Feed */}
      <div style={{ flex: 1, padding: "2rem", overflowY: "auto", backgroundColor: "#fafafa" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem", gap: "1rem" }}>
          <input type="text" placeholder="Search..." value= {searchKeyword}  onChange={(e) => setSearchKeyword(e.target.value)}
           onKeyDown={handleSearchKeyDown}

          style={{
            flex: 1, padding: "10px", border: "1px solid #ccc", borderRadius: "4px"
          }} />
          
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{
            padding: "10px", border: "1px solid #ccc", borderRadius: "4px"
          }}>
            <option value= "">Sort</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="tag">By Tag</option>
          </select>

          <div style={{ position: "relative" }}>
            <div onClick={() => setDropdownOpen(!dropdownOpen)} style={{
              width: "40px", height: "40px", backgroundColor: "#ccc",
              borderRadius: "50%", display: "flex", alignItems: "center",
              justifyContent: "center", cursor: "pointer"
            }} title="Profile">🧑</div>
            {dropdownOpen && (
              <div style={{
                position: "absolute", right: 0, top: "50px", zIndex: 999,
                backgroundColor: "white", border: "1px solid #ddd",
                borderRadius: "4px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
              }}>
                <button onClick={() => navigate("/profile")} style={{
                  padding: "10px 20px", width: "100%", border: "none",
                  backgroundColor: "white", cursor: "pointer", textAlign: "left"
                }}>Edit Profile</button>
                <button onClick={handleLogout} style={{
                  padding: "10px 20px", width: "100%", border: "none",
                  backgroundColor: "white", cursor: "pointer", textAlign: "left"
                }}>Logout</button>
              </div>
            )}
          </div>
        </div>

        <h2 style={{ marginBottom: "1rem" }}>Feed</h2>
        {activeTag && (
          <button onClick={() => setActiveTag(null)} style={{
            marginBottom: "1rem", padding: "5px 10px", backgroundColor: "#ccc",
            border: "none", borderRadius: "4px", cursor: "pointer"
          }}>Remove Tag Filter</button>
        )}

        {filteredPosts.length === 0 ? (
          <p style={{ color: "#999" }}>No posts found for the current search or selected tag.</p>
        ) : (
          filteredPosts.map((post) => {
            const isOwner = post.userId === user?.uid;
            return (
              <div key={post.id} style={{
                display: "flex", flexDirection: "column", position: "relative",
                backgroundColor: "#fff", padding: "1rem", marginBottom: "1rem",
                borderRadius: "6px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
              }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                  {post.photoURL ? (
                    <img src={post.photoURL} alt="avatar" style={{
                      width: "40px", height: "40px", borderRadius: "50%",
                      objectFit: "cover", marginRight: "10px"
                    }} />
                  ) : (
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "50%",
                      backgroundColor: "#ccc", display: "flex",
                      alignItems: "center", justifyContent: "center", marginRight: "10px"
                    }}>🧑</div>
                  )}
                  <div>
                    <div style={{ fontWeight: "bold", fontSize: "0.95rem" }}>{post.userEmail || "Unknown"}</div>
                    <div style={{ fontSize: "0.8rem", color: "#777" }}>{post.tag}</div>
                    {/*Time Stamp */}
                    {post.createdAt && (
                      <div style={{ fontSize: "0.75rem", color: "#999" }}>
                        {post.createdAt.toDate().toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
                <h3>{post.title}</h3>
                <p>{post.description}</p>
                {isOwner && (
                  <button onClick={async () => {
                    try {
                      await deleteDoc(doc(db, "posts", post.id));
                    } catch (err) {
                      console.error("Delete failed", err);
                    }
                  }} style={{
                    position: "absolute", top: "1rem", right: "1rem",
                    backgroundColor: "#ff4d4d", color: "white",
                    border: "none", padding: "5px 10px",
                    borderRadius: "4px", cursor: "pointer"
                  }}>Delete</button>
                )}
                {/* Report Button */}
                <button
                  onClick={() => navigate("/report", { state: { post } })}
                  style = {{
                    height: "20px", width: "55px", padding: "1px 8px", position: "absolute",
                    top: "10%", left: "90%", backgroundColor: "#00853e", color: "white", 
                    fontSize: "12px", border: "none", borderRadius: "4px", cursor: "pointer"
                  }}>Report</button>
              </div>
            );
          })
        )}
      </div>

      {/* Right Sidebar */}
      <div style={{ width: "220px", backgroundColor: "#f7f7f7", padding: "1rem" }}>
        <h4>Tags</h4>
        <ul style={{ paddingLeft: "1rem", fontSize: "0.95rem" }}>
          {["#homework", "#advice", "#events", "#clubs", "#housing"].map((tag) => (
            <li key={tag} style={{ cursor: "pointer", color: "#0077cc" }} onClick={() => setActiveTag(tag)}>{tag}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;
