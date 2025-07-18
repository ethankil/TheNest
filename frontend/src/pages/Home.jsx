import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useRef } from "react";
import { useState, useEffect } from "react";
import { deleteField } from "firebase/firestore";
import { where } from "firebase/firestore"; 
import { getDocs } from "firebase/firestore";
import {
  updateDoc, increment, getDoc, setDoc
} from "firebase/firestore";
import { 
  collection, onSnapshot, query, orderBy, doc, deleteDoc, addDoc, serverTimestamp 
} from "firebase/firestore";
import UNTLogo from "../assets/UNTLogo.png";

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const postRefs = useRef({});
  const [sortBy, setSortBy] = useState("newest");
  const [activeTag, setActiveTag] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [commentInputs, setCommentInputs] = useState({});
  const [comments, setComments] = useState({}); // { postId: [comments] }

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") e.preventDefault();
  };
  
    //Notifications
   const [followedTags, setFollowedTags] = useState([]);

   useEffect(() => {
      if (!user) return;
     const followsRef = collection(db, "follows");
     const q = query(followsRef, where("user_id", "==", user.uid));
     const unsubscribe = onSnapshot(q, (snapshot) => {
     const tags = snapshot.docs.map(doc => doc.data().target_id);
     setFollowedTags(tags);
   });

      return () => unsubscribe();
    }, [user]);

     const handleToggleFollow = async (tag) => {
     const followRef = collection(db, "follows");
     const q = query(followRef, where("user_id", "==", user.uid), where("target_id", "==", tag));
     const snapshot = await getDocs(q);

         if (!snapshot.empty) {
         await deleteDoc(snapshot.docs[0].ref); // Unfollow
         } else {
         await addDoc(followRef, {
          user_id: user.uid,
          target_id: tag,
          target_type: "tag",
          created_at: serverTimestamp(),
          }); 
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

      useEffect(() => {
         let q;
           try {
           if (sortBy === "" || sortBy === "newest") {
           q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
           } else if (sortBy === "oldest") {
           q = query(collection(db, "posts"), orderBy("createdAt", "asc"));
           } else if (sortBy === "Most Likes") {
           q = query(collection(db, "posts"), orderBy("likes", "desc"));
           } else {
           console.warn("Unexpected sortBy value:", sortBy);
           q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
         }
          if (!q) {
          console.error("Query could not be built. Skipping Firestore listener.");
          return;
     }
      

      const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs
           .map(doc => ({ id: doc.id, ...doc.data() }))
           .filter(post => post.createdAt);
           setPosts(fetchedPosts);

         // For each post, listen to its comments
          fetchedPosts.forEach(post => {
          const commentsRef = collection(db, "posts", post.id, "comments");
          const commentsQuery = query(commentsRef, orderBy("createdAt", "asc"));
          onSnapshot(commentsQuery, (snapshot) => {
          const postComments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setComments(prev => ({ ...prev, [post.id]: postComments }));
        });
      });
    });
       return () => unsubscribe();
  }
       catch (error) {
       console.error("Error setting up post listener:", error);
     }
  }, [sortBy]);

       const handleAddComment = async (postId) => {
       const text = commentInputs[postId];
       if (!text || !user) return;
       const commentsRef = collection(db, "posts", postId, "comments");
       await addDoc(commentsRef, {
       userId: user.uid,
       userName: user.displayName || user.email || "Anonymous",
       text,
       createdAt: serverTimestamp(),
    });
       setCommentInputs(prev => ({ ...prev, [postId]: "" }));
   };

        const handleDeleteComment = async (postId, commentId) => {
        const commentDoc = doc(db, "posts", postId, "comments", commentId);
        await deleteDoc(commentDoc);
    };

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
          {posts.slice(0, 5).map((post) => (
            <li
              key={post.id}
              onClick={() => {
                setSelectedPostId(post.id);
                const element = postRefs.current[post.id];
                if (element) {
                  element.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
              style={{ color: "#0077cc", cursor: "pointer", marginBottom: "0.5rem" }}
            >
              {post.title}
            </li>
          ))}
        </ul>
      </div>
          
      {/* Main Feed */}
      <div style={{ flex: 1, padding: "2rem", overflowY: "auto", backgroundColor: "#fafafa" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem", gap: "1rem" }}>
          <input type="text" placeholder="Search..." value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            style={{ flex: 1, padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }} />
          
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{
            padding: "10px", border: "1px solid #ccc", borderRadius: "4px"
          }}>
            <option value="">Sort</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="Most Likes">Most Likes</option>
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
            const postComments = comments[post.id] || [];
            const handleReaction = async (postId, type) => {
            const postRef = doc(db, "posts", postId);
            const postSnap = await getDoc(postRef);
            const postData = postSnap.data();

            if (!postData || !user) return;

            const reactions = postData.reactions || {};
            const userReaction = reactions[user.uid];

            const update = {};

            // Remove previous reaction count
            if (userReaction === "like") {
              update.likes = increment(-1);
            } else if (userReaction === "dislike") {
              update.dislikes = increment(-1);
            }

            if (userReaction === type) {
              // Toggle: user clicked same reaction again → remove it
              update[`reactions.${user.uid}`] = deleteField();
            } else {
              // New reaction
              update[`reactions.${user.uid}`] = type;
              if (type === "like") {
                update.likes = increment(1);
              } else if (type === "dislike") {
                update.dislikes = increment(1);
              }
            }

            await updateDoc(postRef, update);
          };
            return (
              <div key={post.id} ref={el => postRefs.current[post.id] = el} style={{
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
                    {post.createdAt && (
                      <div style={{ fontSize: "0.75rem", color: "#999" }}>
                        {post.createdAt.toDate().toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
                <h3>{post.title}</h3>
                <p>{post.description}</p>
                <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <button onClick={() => handleReaction(post.id, "like")} style={{
                    backgroundColor: "#00853e", color: "white", border: "none",
                    borderRadius: "4px", padding: "5px 10px", cursor: "pointer"
                  }}>
                    👍 Like ({post.likes || 0})
                  </button>
                  <button onClick={() => handleReaction(post.id, "dislike")} style={{
                    backgroundColor: "#ccc", color: "#333", border: "none",
                    borderRadius: "4px", padding: "5px 10px", cursor: "pointer"
                  }}>
                    👎 Dislike ({post.dislikes || 0})
                  </button>
                </div>
                {/* Comments Section */}
                <div style={{ marginTop: "10px", borderTop: "1px solid #ddd", paddingTop: "10px" }}>
                  <h4>Comments</h4>
                  {postComments.map(comment => (
                    <div key={comment.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                      <div>
                        <strong>{comment.userName}: </strong>{comment.text}
                        {comment.createdAt && (
                          <span style={{ marginLeft: "8px", fontSize: "0.75rem", color: "#999" }}>
                            {comment.createdAt.toDate().toLocaleString()}
                          </span>
                        )}
                        {!comment.createdAt && (
                          <span style={{ marginLeft: "8px", fontSize: "0.75rem", color: "#999" }}>
                          Just now
                          </span>
                        )}
                      </div>
                      {comment.userId === user?.uid && (
                        <button onClick={() => handleDeleteComment(post.id, comment.id)}
                            style={{ backgroundColor: "#ff4d4d", color: "white", border: "none", borderRadius: "4px", padding: "2px 5px", cursor: "pointer" }}>
                            Delete
                        </button>
                      )}
                    </div>
                  ))}
                  <div style={{ marginTop: "5px" }}>
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentInputs[post.id] || ""}
                      onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                      style={{ width: "80%", padding: "5px", marginRight: "5px" }}
                    />
                    <button onClick={() => handleAddComment(post.id)}
                      style={{ padding: "5px 10px", backgroundColor: "#00853e", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                      Comment
                    </button>
                  </div>
                </div>

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

                <button
                  onClick={() => navigate("/report", { state: { post } })}
                  style={{
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
           {["#homework", "#advice", "#events", "#clubs", "#housing"].map((tag) => {
           const isFollowed = followedTags.includes(tag);
            return (
            <li
              key={tag}
              style={{
              color: "#0077cc",
             }}
           >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span
                onClick={() => setActiveTag(tag)}
                style={{
                cursor: "pointer",
                flex:1,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
                 {tag}
                 </span>
                 <button
                 onClick={() => handleToggleFollow(tag)}
                  style={{
                  fontSize: "12px",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: isFollowed ? "#ff4d4d" : "#00853e",
                  color: "white",
                }}
               >
              {isFollowed ? "Unfollow" : "Follow"}
               </button>
              </div>
            </li>
            );
         })}
     </ul>

            {/* Followed Tags Section */}
            <h4 style={{ marginTop: "5rem", marginBottom: "0.5rem" }}>Followed Tags</h4>
             {followedTags.length === 0 ? (
             <p style={{ fontSize: "0.9rem", color: "#777", marginTop: "0.5rem" }}>
              You’re not following any Tags yet.
            </p>
         ) : (
            <ul style={{ paddingLeft: "0.5rem", fontSize: "0.95rem", listStyleType: "disc", listStylePosition: "inside" }}>
             {followedTags.map((tag) => (
           <li
                   key={tag}
                   onClick={() => setActiveTag(tag)}
                   style={{
                   color: "#0077cc",
                   cursor: "pointer",
                      }}
                      >
                   {tag}
                </li>
              ))}
            </ul>
           )}
        </div>
     </div>
     );
   }
export default Home;
        

