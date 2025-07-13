import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { AuthProvider, useAuth } from "./context/AuthContext";
import CreatePost from "./pages/CreatePost";
import ForgotPassword from "./pages/ForgotPassword";
import Report from "./pages/Report";
import ReportSubmit from "./pages/ReportSubmit";
import Moderator from "./pages/Moderator";


function App() {
 return (
   <AuthProvider>
     <Router>
       <Routes>
         <Route path="/" element={<RegisterRedirect />} />
         <Route path="/login" element={<LoginRedirect />} />
         <Route path="/home" element={<Home />} />
         <Route path="/profile" element={<Profile />} />
         <Route path="/createpost" element={<CreatePost />} />
         <Route path="/forgot-password" element={<ForgotPassword />} />
         <Route path="/report" element={<Report />} />
         <Route path="/report-submit" element={<ReportSubmit />} />
         <Route path="/moderator" element={<Moderator />} />
       </Routes>
     </Router>
   </AuthProvider>
 );
}


function RegisterRedirect() {
 const { user } = useAuth();
 return user ? <Navigate to="/home" /> : <Register />;
}


const mod_emails = ["emmatripp12@gmail.com", "emmaroset29@gmail.com"];


function LoginRedirect() {
 const { user } = useAuth();
 if(!user) return <Login />;

 if(mod_emails.includes(user.email)) {
   return <Navigate to="/moderator" />;
 }

 return <Navigate to="/home" />;
}


export default App;