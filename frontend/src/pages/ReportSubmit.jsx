import { useNavigate } from "react-router-dom";
import UNTLogo from "../assets/UNTLogo.png";

function ReportSubmit() {
    const navigate = useNavigate();

    return (
    <div style={{ height: "100%", minHeight: "fit-content", backgroundColor: "#f0f0f0", position: "absolute", left: "0%", top: "0%", 
        bottom: "0%", right: "0%",  display: "flex", justifyContent: "center", alignItems: "center"
     }}>
        <div style={{width: "80%", height: "fit-content", position: "relative", background: "white", borderRadius: "8px", textAlign: "center",
             padding: "2rem", boxSizing: "border-box", boxShadow: "0 2px 6px rgba(0,0,0,0.1)", margin: "2rem" }}>

            <img src={UNTLogo} alt="Centered" style={{ width: "250px", height: "252px", position: "relative", top: "-50px"}} />

            <h2 style={{ fontFamily: "Georgia, serif", color: "black", fontSize: "30px", marginTop: "-5rem" }}
            >Thank you for bringing this to our attention.</h2>

            <p style={{ color: "black", fontSize: "20px", margin: "2rem 8rem 2rem 8rem", wordWrap: "break-word", }}>
                Our moderators will look into the issue and contact you when they have reached their conclusion.
                Remember to always practice our university's community standards found in our code of conduct below.
            </p>

            <a href="https://policy.unt.edu/sites/policy.unt.edu/files/07.012_CodeOfStudConduct.Final8_.19.format_0_0.pdf" target="_blank"
                rel="noopener noreferrer" style={{ fontSize: "20px", color: "black", textDecoration: "underline", fontWeight: "bold",
                marginBottom:"1.5rem", display: "block" }}>UNT Code of Conduct</a>

            
            
            <button 
            onClick={() => navigate("/home")}
            style={{
                fontFamily: "Georgia, serif", fontSize: "1.5rem",
                color: "white", textAlign: "center", border: "2px solid #00853e",
                width: "150px", backgroundColor: "#00853e", marginTop: "2rem", marginBottom: "2rem"
            }}>Home</button>

                </div>
        </div>
    );
}

export default ReportSubmit;
