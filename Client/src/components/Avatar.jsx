const COLORS = [
  ["#6366f1", "#1e1b4b"], ["#f59e0b", "#92400e"], ["#10b981", "#064e3b"],
  ["#ec4899", "#4a044e"], ["#3b82f6", "#1e3a5f"], ["#ef4444", "#450a0a"],
];

const getColor = (name = "") => COLORS[name.charCodeAt(0) % COLORS.length];

export default function Avatar({ name = "?", size = 40 }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const [bg, shadow] = getColor(name);

  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${bg}, ${shadow})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Syne', sans-serif", fontWeight: 700,
      fontSize: size * 0.35, color: "#fff", flexShrink: 0,
      boxShadow: `0 2px 8px ${bg}55`,
    }}>{initials}</div>
  );
}
