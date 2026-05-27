export default function Notification({ notification }) {
  if (!notification) return null;
  const isError = notification.type === "error";
  return (
    <div style={{
      position: "fixed", top: 20, right: 20, zIndex: 9999,
      background: isError ? "#7f1d1d" : "#052e16",
      border: `1px solid ${isError ? "#dc2626" : "#16a34a"}`,
      color: isError ? "#fca5a5" : "#86efac",
      padding: "12px 20px", borderRadius: 12, fontSize: 14,
      boxShadow: "0 8px 32px #000a", animation: "slideIn .3s ease",
    }}>
      {notification.msg}
    </div>
  );
}
