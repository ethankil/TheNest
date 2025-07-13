import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { createPortal } from "react-dom";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { getDoc } from "firebase/firestore";
import UNTLogo from "../assets/UNTLogo.png";


const mod_emails = ["emmatripp12@gmail.com", "emmaroset29@gmail.com"];
const ModalPortal = ({ children }) => createPortal(children, document.body);


function Moderator () {


   const [user, setUser] = useState(null);
   const [isModerator, setModerator] = useState(false);
   const [reports, setReports] = useState([]);             //to display report summary
   const [searchID, setSearchID] = useState("");
   const [filterOption, setFilter] = useState("all");
   const [selectReport, setSelected] = useState(null);     //to display full report
   const [showModal, setModal] = useState(false);
   const [postData, setData] = useState(null);
   const [modDecision, setDecision] = useState(null);
   const navigate = useNavigate();


{/* Check for moderator status */}
   useEffect (() => {
       const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
           setUser(currentUser);
           if (currentUser && mod_emails.includes(currentUser.email)) {
               setModerator(true);
           }
           else {
               setModerator(false);
           }
       });
       return () => unsubscribe();
   }, []);


{/* Retrieve Firestore reports */}
   useEffect(() => {
       const fetchReports = async () => {
           try {
               const querySnapshot = await getDocs(collection(db, "reports"));
               const reportData = querySnapshot.docs.map((doc) => ({
                   id: doc.id,
                   ...doc.data(),
               }));
               setReports(reportData);
           }
           catch(err) {
               console.error("Error fetching reports: ", err);
           }
       };


       if (isModerator) {
           fetchReports();
       }
   }, [isModerator]);


{/* handleLogout (by Ethan Kilpatrick) */}
   const handleLogout = async () => {
       await signOut(auth);
       navigate("/login");
     };




   if (!user) return <p>Please log in to access the moderator panel.</p>;
   if (!isModerator) return <p>You do not have permission to view this page.</p>;


{/* Filter Reports Logic */}
     const filteredReports = reports
       .filter((report) => {
           const matchSearch = report.id.toLowerCase().includes(searchID.toLowerCase());
           if (filterOption === "pending") return matchSearch && report.status === "pending";
           if (filterOption === "resolved") return matchSearch && (report.status === "resolved" || report.status === "deleted");
           if (filterOption === "mine") return matchSearch && report.handled_by === user.email;
           if (filterOption === "all") return matchSearch;
       })
       .sort((a, b) => b.created_at?.seconds - a.created_at?.seconds);     //newest first


{/* Moderator Decision Logic */}
       const handleDecision = async (action) => {
           if (!selectReport) return;


           const reportRef = doc(db, "reports", selectReport.id);
           try {
               await updateDoc(reportRef, {
                   handled_by: user.email,
                   resolution: action,
               });
               if (action === "delete") {
                   await deleteDoc(doc(db, "posts", selectReport.post_id));
                   }


                   const querySnapshot = await getDocs(collection(db, "reports"));
                   const batchUpdates = querySnapshot.docs
                       .filter(doc => doc.data().post_id === selectReport.post_id)
                       .map(docSnap => updateDoc(doc(db, "reports", docSnap.id), {
                           status: action === "delete" ? "deleted" : "resolved",
                           handled_by: user.email,
                           resolution: action,
                       }));
                       await Promise.all(batchUpdates);


                       setDecision(action);
               } catch(err) {
                   alert("Error processing report: " + err.message);
           }
       };




   return(


       <div style={{ backgroundColor: "white", position: "absolute", left: "0%", top: "0%", bottom: "0%",
           right: "0%", }}>
              
           <div style={{ backgroundColor: "white", padding: "1rem", position: "absolute", left: "0%",
           top: "0%", right: "0%", height: "120px",
           }}>
              
               <h1 style={{ position: "absolute", left: "280px", top: "40px", fontSize: "50px", }}>Moderator Dashboard</h1>
          
           </div>


           <div style={{
               position: "absolute", left: "280px", top: "170px", right: "230px"
           }}>


{/* Search Bar */}
           <div style={{ position: "absolute", left: "0px", width: "100%" }}>
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
               width: "78vw", marginBottom: "20px"
               }}>
               <input type="text" placeholder="Search by Report ID" value={searchID}
               onChange={(e) => setSearchID(e.target.value)} style={{
                   padding: "10px", fontSize: "16px", flex: 1, marginRight: "20px",
                   border: "1px solid #ccc", borderRadius: "4px",
               }} />


{/* Filter Reports Display */}
               <select value={filterOption} onChange={(e) => setFilter(e.target.value)} style={{
                   padding: "10px", fontSize: "16px", width: "160px", border: "1px solid #ccc", borderRadius: "4px",
                   textAlign: "right",
               }}>
                   <option value="all">All Reports</option>
                   <option value="pending">Current Reports</option>
                   <option value="resolved">Past Reports</option>
                   <option value="mine">My Reports</option>
               </select>
           </div>
           </div>


{/* Displays Reports on Dashboard */}
           {filteredReports.length === 0 ? (
               <p style={{ fontSize: "16px", position: "absolute", left: "10px", top: "70px"}}>No matching reports found.</p>
           ) : (
               <div style={{ position: "absolute", left: "0px", right: "-120px", top: "70px" }}>
                   {filteredReports.map((report) => (
                       <div key={report.id} onClick={async () => {
                           setSelected(report);
                           setModal(true);
                           setDecision(report.resolution || null);
                               try {
                                   const postRef = doc(db, "posts", report.post_id);
                                   const postSnap = await getDoc(postRef);
                                   if (postSnap.exists()) {
                                       setData(postSnap.data());
                                   } else{
                                       setData({title: "Unknown", description: "Post not found", userEmail: "Unknown"});
                                   }
                               } catch (err) {
                                   console.error("Error loading post:", err);
                                   setData({title: "Error", description: "Could not load post", userEmail: "Unknown"});
                               }
                           }}
                       style={{
                           display: "flex", justifyContent: "space-between", alignItems: "center",
                           padding: "12px 20px", marginBottom: "12px", border: "1px solid #ccc",
                           borderRadius: "6px", backgroundColor: "#f9f9f9", fontFamily: "Arial, sans-serif"
                       }}>
                           <div>
                               <p style={{ margin: "0", fontWeight: "bold", fontSize: "16px" }}>Report ID: {report.id}</p>
                               <p style={{ margin: "0", fontSize: "14px", color: "#333" }}>Reported User: {report.reported_user || "Unknown"}</p>
                           </div>
                           <div style={{ textAlign: "right" }}>
                               <p style={{ margin: "0", fontSize: "14px", color: "#333" }}>
                                   Date: {report.created_at?.toDate ? report.created_at.toDate().toLocaleString() : "N/A"}
                               </p>
                               <p style={{ margin: "0", fontSize: "14px", fontWeight: "bold",
                                   color:
                                       report.status === "pending" ? "#d97706" :
                                       "#000"
                                   }}>Status: {report.status}</p>
                                   {(report.status === "resolved" || report.status === "deleted") && report.handled_by && (
                                   <p style={{ margin: "0", fontSize: "13px" }}>Handled by: {report.handled_by}</p>
                                   )}
                           </div>
                       </div>
                   ))}
               </div>
               )}
           </div>


{/* Left Sidebar */}
           <div style={{
               width: "220px", backgroundColor: "#f0f0f0", padding: "1rem", position: "fixed", left: "0%",
               top: "0%", bottom: "0%", alignItems: "center",
           }}>
               <button onClick={handleLogout} style={{
                   fontFamily: "Georgia, serif", fontSize: "1.5rem",
                   color: "#00853e", marginTop: "0.5rem", textAlign: "center", border: "2px solid #00853e",
                   width: "150px", position: "absolute", top: "87%", left: "50px",
               }}>Logout</button>


               <img src={UNTLogo} alt="UNT Logo" style={{ width: "100%", maxWidth: "225px", height: "252px",
                   position: "absolute", top: "0px", left: "5px", marginBottom: "-10px" }} />
           </div>




{/* Full Report Popup After Selected */}
           {selectReport && (
               <ModalPortal>
                   <div style={{
                       position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                       backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)",
                       display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
                       }}>
                       <div style={{
                           backgroundColor: "white", padding: "2rem", borderRadius: "8px", width: "90%",
                           maxWidth: "900px", maxHeight: "90vh", overflowY: "auto",
                           boxShadow: "0 2px 8px rgba(0,0,0,0.2)", position: "relative",
                           }}>
                           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                               <div>
                                   <h2 style={{ marginBottom: "1rem", marginTop: "1rem", color: "#000853e", fontSize: "26px" }}>
                                       Report ID: {selectReport.id}
                                   </h2>
                               </div>
                               <div style={{ textAlign: "right" }}>
                                   <p style={{ marginBottom: "1rem", }}>
                                       Date Reported: {selectReport.created_at?.toDate().toLocaleString() || "N/A"}
                                   </p>
                               </div>
                           </div>


                           {postData ? (
                               <div style={{ backgroundColor: "#f9f9f9", borderRadius: "8px",
                                   padding: "1rem", magin: "1rem 0",
                                   }}>
                                  
                                   <h3 style={{ marginTop: "0rem", marginBottom: "0.5rem", fontSize: "22px" }}>
                                               Post ID: {selectReport.post_snapshot?.post_id || "N/A"}
                                           </h3>
                                           <p style={{ fontSize: "16px", marginBottom: "0.5rem" }}>
                                               <strong>Posted by:</strong> {selectReport.post_snapshot?.userEmail || "Unknown"}
                                           </p>
                                   <p><strong>Title:</strong> {selectReport.post_snapshot?.title}</p>
                                   <p><strong>Description:</strong> {selectReport.post_snapshot?.description}</p>
                                   </div>
                                  
                           ) : (
                               <p>Loading post details...</p>
                           )}
                               <p><strong>Report Message:</strong> {selectReport.category}</p>




                               <h3 style={{ marginTop: "2rem", marginBottom: "-0.8rem" }}>Would you like to delete this post?</h3>
                               <p style={{
                                   fontSize: "14px"
                               }}>(All decisions should be made following the UNT Code of Conduct)</p>


{/* Moderator Decision Options */}
                           <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
                               {!modDecision ? (
                                   <>
                               <button style={{
                                   backgroundColor: "#c62828", color: "white", padding: "0.5rem 1rem",
                                   border: "none", borderRadius: "4px", cursor: "pointer",
                               }}
                               onClick={() => {
                                   handleDecision("delete");
                               }}>Delete Post</button>
                               <button style={{
                                   backgroundColor: "#2e7d32", color: "white", padding: "0.5rem 1rem",
                                   border: "none", borderRadius: "4px", cursor: "pointer",
                               }} onClick={() => {
                                   handleDecision("keep");
                               }}>Keep post</button>
                               </>
                               ) : (
                                   <p style={{ fontWeight: "bold", marginTop: "0.5rem", marginBottom: "0.5rem",
                                       color: modDecision === "delete" ? "#c62828" : "#2e7d32",
                                       fontSize: "16px",
                                       }}>
                                       {modDecision === "delete" ? "Status: deleted" : "Status: resolved"}
                                       </p>
                               )}
                               <button onClick={() => {
                                   setSelected(null);
                                   setData(null);
                                   setModal(false);
                                   setDecision(null);
                               }} style={{
                                   marginLeft: "auto", backgroundColor: "#ccc", padding: "0.5rem 1rem",
                                   border: "none", borderRadius: "4px", cursor: "pointer", maxHeight: "35px",
                               }}>Close</button>
                           </div>
                       </div>
                   </div>
               </ModalPortal>
           )}


   </div>


);
}


export default Moderator;