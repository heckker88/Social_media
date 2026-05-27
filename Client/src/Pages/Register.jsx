import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { AuthLayout, Field, SubmitBtn, ErrorBox } from "./Login.jsx";

export default function RegisterPage({ notify }) {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]     = useState({ name: "", username: "", email: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await register(form.name, form.username, form.email, form.password);
      notify("Account created! Welcome 🎉");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
    setLoading(false);
  };

  const f = (key) => ({ value: form[key], onChange: (v) => setForm({ ...form, [key]: v }) });

  return (
    <AuthLayout title="Create account" subtitle="Join the conversation">
      <form onSubmit={handleSubmit}>
        {error && <ErrorBox>{error}</ErrorBox>}
        <Field label="Full Name"  type="text"     placeholder="Your name"        {...f("name")} />
        <Field label="Username"   type="text"     placeholder="choose_username"  {...f("username")} />
        <Field label="Email"      type="email"    placeholder="you@example.com"  {...f("email")} />
        <Field label="Password"   type="password" placeholder="min 6 characters" {...f("password")} />
        <SubmitBtn loading={loading}>Create Account</SubmitBtn>
      </form>
      <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#555" }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "#818cf8", fontWeight: 600, textDecoration: "none" }}>Sign In</Link>
      </p>
    </AuthLayout>
  );
}
