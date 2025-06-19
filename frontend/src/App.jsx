import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { AuthProvider, useAuth } from "./context/AuthContext";
import CreatePost from "./pages/CreatePost";

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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function RegisterRedirect() {
  const { user } = useAuth();
  return user ? <Navigate to="/home" /> : <Register />;
}

function LoginRedirect() {
  const { user } = useAuth();
  return user ? <Navigate to="/home" /> : <Login />;
}

export default App;
