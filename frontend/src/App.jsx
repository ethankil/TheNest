import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { AuthProvider, useAuth } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<RegisterRedirect />} />
          <Route path="/login" element={<LoginRedirect />} />
          <Route path="/home" element={<Home />} />
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
