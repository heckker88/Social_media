import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import PostCard from "../components/Postcard.jsx";
import Avatar from "../components/Avatar.jsx";
import api from "../utils/api.js";

export default function FeedPage({ notify }) {
  const { user } = useAuth();
  const [posts, setPosts]     = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    api.get("/posts")
      .then(({ data }) => setPosts(data))
      .catch(() => notify("Failed to load posts", "error"))
      .finally(() => setLoading(false));
  }, []);

  const handlePost = async () => {
    if (!content.trim()) return;
    setPosting(true);
    try {
      const { data } = await api.post("/posts", { content });
      setPosts((p) => [data, ...p]);
      setContent("");
      notify("Post published!");
    } catch { notify("Failed to create post", "error"); }
    setPosting(false);
  };

  const handleUpdate = (updated) =>
    setPosts((ps) => ps.map((p) => (p._id === updated._id ? updated : p)));

  const handleDelete = (id) =>
    setPosts((ps) => ps.filter((p) => p._id !== id));

  if (loading) return <Spinner />;

  return (
    <div style={{ animation: "fadeUp .4s ease" }}>
      {/* Composer */}
      <div style={{
        background: "#13131a", border: "1px solid #ffffff0f",
        borderRadius: 18, padding: 20, marginBottom: 24,
      }}>
        <div style={{ display: "flex", gap: 12 }}>
          <Avatar name={user.name} size={42} />
          <div style={{ flex: 1 }}>
            <textarea
              value={content} onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              rows={3}
              onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) handlePost(); }}
              style={{
                width: "100%", background: "#0d0d14", border: "1px solid #ffffff10",
                borderRadius: 12, padding: "12px 14px", color: "#e8e6f0",
                fontSize: 15, resize: "none", outline: "none", lineHeight: 1.5,
              }}
              onFocus={(e) => e.target.style.borderColor = "#6366f1"}
              onBlur={(e) => e.target.style.borderColor = "#ffffff10"}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
              <button onClick={handlePost} disabled={!content.trim() || posting} style={{
                background: content.trim() ? "linear-gradient(135deg,#6366f1,#a855f7)" : "#1a1a24",
                color: content.trim() ? "#fff" : "#444",
                border: "none", padding: "9px 22px", borderRadius: 10,
                fontWeight: 600, fontSize: 14, cursor: content.trim() ? "pointer" : "default",
              }}>
                {posting ? "Posting…" : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {posts.length === 0
        ? <Empty>No posts yet — be the first to share something!</Empty>
        : posts.map((p) => (
          <PostCard key={p._id} post={p} onUpdate={handleUpdate} onDelete={handleDelete} notify={notify} />
        ))
      }
    </div>
  );
}

export function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        border: "3px solid #ffffff10", borderTopColor: "#6366f1",
        animation: "spin 0.7s linear infinite",
      }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export function Empty({ children }) {
  return <p style={{ textAlign: "center", color: "#444", padding: "40px 0", fontSize: 14 }}>{children}</p>;
}
