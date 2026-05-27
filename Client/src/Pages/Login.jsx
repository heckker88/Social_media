import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage({ notify }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]     = useState({ email: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await login(form.email, form.password);
      notify("Welcome back!");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };

  return <AuthLayout title="Welcome back" subtitle="Sign in to continue">
    <form onSubmit={handleSubmit}>
      {error && <ErrorBox>{error}</ErrorBox>}
      <Field label="Email" type="email" value={form.email}
        onChange={(v) => setForm({ ...form, email: v })} placeholder="you@example.com" />
      <Field label="Password" type="password" value={form.password}
        onChange={(v) => setForm({ ...form, password: v })} placeholder="••••••••" />
      <SubmitBtn loading={loading}>Sign In</SubmitBtn>
    </form>
    <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#555" }}>
      No account?{" "}
      <Link to="/register" style={{ color: "#818cf8", fontWeight: 600, textDecoration: "none" }}>Register</Link>
    </p>
  </AuthLayout>;
}

// ─── shared auth UI ──────────────────────────────────────────────────────────

export function AuthLayout({ title, subtitle, children }) {
  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0f",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-20%", left: "60%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, #6366f130, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "-10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, #a855f720, transparent 70%)" }} />
      </div>
      <div style={{ width: "100%", maxWidth: 420, padding: "0 20px", animation: "fadeUp .5s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: "0 auto 16px",
            background: "linear-gradient(135deg, #6366f1, #a855f7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, boxShadow: "0 8px 32px #6366f155",
          }}>◈</div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 32, letterSpacing: "-1px" }}>nexus</h1>
          <p style={{ color: "#666", marginTop: 6, fontSize: 14 }}>{subtitle}</p>
        </div>
        <div style={{
          background: "#13131a", border: "1px solid #ffffff10",
          borderRadius: 20, padding: "32px 28px", boxShadow: "0 24px 64px #000a",
        }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 22, marginBottom: 24 }}>{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 6, letterSpacing: ".5px", textTransform: "uppercase" }}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        style={{
          width: "100%", padding: "11px 14px", borderRadius: 10,
          background: "#0a0a0f", border: "1px solid #ffffff15", color: "#e8e6f0",
          fontSize: 14, outline: "none",
        }}
        onFocus={(e) => e.target.style.borderColor = "#6366f1"}
        onBlur={(e) => e.target.style.borderColor = "#ffffff15"} />
    </div>
  );
}

export function SubmitBtn({ children, loading }) {
  return (
    <button type="submit" disabled={loading} style={{
      width: "100%", padding: "13px", borderRadius: 12, border: "none",
      background: "linear-gradient(135deg, #6366f1, #a855f7)",
      color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer",
      boxShadow: "0 4px 20px #6366f155", opacity: loading ? .7 : 1,
    }}>{loading ? "Please wait…" : children}</button>
  );
}

export function ErrorBox({ children }) {
  return (
    <div style={{
      background: "#7f1d1d33", border: "1px solid #dc2626", color: "#fca5a5",
      padding: "10px 14px", borderRadius: 10, marginBottom: 16, fontSize: 13,
    }}>{children}</div>
  );
}
