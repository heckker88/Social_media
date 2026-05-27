import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Notification from "./components/Notification.jsx";
import LoginPage from "./Pages/Login.jsx";
import RegisterPage from "./Pages/Register.jsx";
import FeedPage from "./Pages/Feed.jsx";
import ProfilePage from "./Pages/Profile.jsx";
import { useState } from "react";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  const [notification, setNotification] = useState(null);

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <>
      <Notification notification={notification} />
      <Routes>
        <Route path="/login"    element={<LoginPage notify={notify} />} />
        <Route path="/register" element={<RegisterPage notify={notify} />} />
        <Route path="/" element={
          <PrivateRoute>
            <Navbar />
            <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 16px" }}>
              <FeedPage notify={notify} />
            </div>
          </PrivateRoute>
        } />
        <Route path="/profile/:id" element={
          <PrivateRoute>
            <Navbar />
            <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 16px" }}>
              <ProfilePage notify={notify} />
            </div>
          </PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
