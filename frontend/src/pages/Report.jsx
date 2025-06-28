import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth } from "../firebase";
import { submitReport } from "../lib/report";
import { createPortal } from "react-dom";
import UNTLogo from "../assets/UNTLogo.png";

const ModalPortal = ({children}) => createPortal(children, document.body);

function Report () {

    const location = useLocation();
    const navigate = useNavigate();
    const post = location.state?.post;
    const postID = post?.id;
    const [category, setCategory] = useState("");
    const [message, setMessage] = useState("");
    const [showOther, setShowOther] = useState(false);


    const handleSubmit = async () => {
        const user = auth.currentUser;
        const email = user?.email;
        
        if (!category) {
            alert("Please select a reason for reporting.");
            return;
        }

        if (category === "Other" && !message.trim()){
            alert("Please provide a message containing the reason for your report.");
            return;
        }

        try {
            await submitReport(postID, category, message, email);
            navigate("/report-submit");
        }
        catch (err) {
            alert( "Error: " + err.message );
        }
    }

    if (!post) return <p>No post selected for reporting.</p>;

    return (
        <div style={{ backgroundColor: "white", position: "absolute", left: "0%", top: "0%", bottom: "0%", right: "0%",}}>
        <div style={{ backgroundColor: "white", position: "absolute", left: "18%", top: "0%", bottom: "0%", right: "0%",

        }}>

        <div style={{width: "80%", height: "90%", background: "white", borderRadius: "8px", position: "absolute", top: "45%",
            right: "45%", left: "40%", transform: "translate(-40%, -45%)", padding: "2rem", boxSizing: "border-box",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)", display: "flex", justifyContent: "center", alignItems: "center"
        }}>
            <div style={{ height: "58vh", left: "5%", right: "5%", maxHeight: "", position: "absolute", top: "70px", padding: "1rem", borderRadius: "8px", 
                backgroundColor: "#f9f9f9", overflowY: "auto", wordWrap: "break-word", boxSizing: "border-box"}}>
                <h3 style={{ fontSize: "24px", marginBottom: "0.5rem", color: "black"}}>Posted by: {post.userEmail || "Unknown"} | Tag: {post.tag}</h3>
                <p style={{ marginBottom: "0.5rem", }}>Title: {post.title}</p>
                <p style={{ fontSize: "0.9rem", color: "#555"}}>{post.description}</p>
            </div>

                <h3 style={{ fontFamily: "Georgia, serif", color: "#00853e", position: "absolute", top: "-18px", fontSize: "35px", }}>Report Post</h3>

                <p style={{fontFamily: "Georgia, serif", color: "#00853e", fontSize: "25px", position: "absolute", left: "5%", top: "73%"}}>Why are you reporting this post?</p>

                <select value={category} onChange={(e) => {
                    const selected = e.target.value;
                    if (selected === "Other") {
                        setShowOther(true);
                    }
                    else {
                        setCategory(selected);
                        setMessage("");
                    }
                 }} style={{ display: "block", marginBottom: "1rem", 
                    width: "90%", backgroundColor: "#f9f9f9", height: "40px", position: "absolute", top: "83%", fontSize: "14px", color: "black",
                    borderColor: "none"}}>
                    <option value = "">Select</option>
                    <option value = "Explicit language">Explicit language</option>
                    <option value = "Offensive language">Offensive language</option>
                    <option value = "Bullying or harrassment">Bullying or harrassment</option>
                    <option value = "Threats or violence">Threats or violence</option>
                    <option value = "Exposes personal information">Exposes personal information</option>
                    <option value = "Not school-appropriate">Not school-appropriate</option>
                        {category && !["Explicit language", "Threats or violence", "Bullying or harrassment", "Offensive language", "Exposes personal information", 
                        "Not school-appropriate"].includes(category) && (
                        <option value={category}>{category}</option>
                        )}
                    <option value = "Other">Other...</option>
                </select>

                {showOther && (
                    <ModalPortal>
                        <div style={{
                            position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.4)",
                            backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
                        }}>
                            <div style={{
                                backgroundColor: "white", padding: "2rem", borderRadius: "8px", width: "90%", maxWidth: "400px",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)", textAlign: "center",
                            }}>
                                <h3 style={{ marginBottom: "1rem", color: "#00853", }}>Report Message</h3>
                                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Please type the reason for your report here..."
                                    style= {{ width: "100%", height: "100px", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px",
                                        resize: "vertical", marginBottom: "1rem", 
                                    }}></textarea>
                                    <div style={{ display: "flex", justifyContent: "center", gap: "1rem"}}>
                                        <button onClick={() => {
                                            if (!message.trim()) {
                                                alert("Please enter a message.");
                                                return;
                                            }
                                            setCategory(message);
                                            setShowOther(false);
                                        }} style={{ padding: "0.5rem 1rem", backgroundColor: "#00853e", color: "white", border: "none", borderRadius: "4px", 
                                            cursor: "pointer", 
                                        }}>Done</button>
                                        <button onClick={() => {
                                            setShowOther(false);
                                            setMessage("");
                                            setCategory("");
                                        }} style={{ padding: "0.5rem 1rem", backgroundColor: "#ccc", color: "back", border: "none", borderRadius: "4px",
                                            cursor: "pointer", 
                                        }}>Cancel</button>
                                </div>
                        </div>
                    </div>
                    </ModalPortal>
                )}

                
                <button onClick={handleSubmit} style={{fontFamily: "Georgia, serif", fontSize: "18px",
                color: "white", backgroundColor: "#00853e", verticalAlign: "middle", textAlign: "center", border: "2px solid #00853e",
                position: "absolute", top: "91%", height: "42px", width: "12%", minWidth: "100px", maxWidth: "130px", lineHeight: "10px",}}>Submit</button>

            </div>

        </div>
            <div style={{
                width: "220px", backgroundColor: "#f0f0f0", padding: "1rem", position: "absolute", left: "0%",
                top: "0%", bottom: "0%", alignItems: "center",
          }}>

            <img src={UNTLogo} alt="UNT Logo" style={{ width: "100%", height: "252px", marginBottom: "-10px" }} />

            <button 
            onClick={() => navigate("/home")}
            style={{
                fontFamily: "Georgia, serif", fontSize: "1.5rem",
                color: "#00853e", marginTop: "0.5rem", textAlign: "center", border: "2px solid #00853e",
                width: "150px", position: "absolute", top: "250px", left: "50px",
            }}>Home</button>

          </div>

</div>
    );
}

export default Report;