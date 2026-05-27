import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(10,10,15,.85)", backdropFilter: "blur(20px)",
      borderBottom: "1px solid #ffffff12", padding: "0 24px",
      display: "flex", alignItems: "center", justifyContent: "space-between", height: 60,
    }}>
      <div onClick={() => navigate("/")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: "linear-gradient(135deg, #6366f1, #a855f7)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
        }}>◈</div>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: "-0.5px" }}>
          nexus
        </span>
      </div>

      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => navigate("/")} style={navBtn()}>Feed</button>
          <div onClick={() => navigate(`/profile/${user._id}`)} style={{ cursor: "pointer" }}>
            <Avatar name={user.name} size={34} />
          </div>
          <button onClick={() => { logout(); navigate("/login"); }} style={{
            background: "transparent", border: "1px solid #ffffff20", color: "#888",
            padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13,
          }}>Logout</button>
        </div>
      )}
    </nav>
  );
}

const navBtn = () => ({
  background: "transparent", border: "none", color: "#888",
  padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 500,
});
