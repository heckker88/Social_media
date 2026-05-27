import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";
import api from "../utils/api";

const fmt = (iso) => {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(iso).toLocaleDateString();
};

export default function PostCard({ post, onUpdate, onDelete, notify }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);

  const liked = post.likes.includes(user._id);

  const toggleLike = async () => {
    try {
      const { data } = await api.put(`/posts/${post._id}/like`);
      onUpdate({ ...post, likes: data.likes });
    } catch { notify("Failed to like post", "error"); }
  };

  const addComment = async () => {
    if (!commentText.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post(`/posts/${post._id}/comment`, { text: commentText });
      onUpdate({ ...post, comments: [...post.comments, data] });
      setCommentText("");
      notify("Comment added!");
    } catch { notify("Failed to add comment", "error"); }
    setLoading(false);
  };

  const deletePost = async () => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await api.delete(`/posts/${post._id}`);
      onDelete(post._id);
      notify("Post deleted");
    } catch { notify("Failed to delete post", "error"); }
  };

  const deleteComment = async (commentId) => {
    try {
      await api.delete(`/posts/${post._id}/comment/${commentId}`);
      onUpdate({ ...post, comments: post.comments.filter((c) => c._id !== commentId) });
      notify("Comment deleted");
    } catch { notify("Failed to delete comment", "error"); }
  };

  return (
    <div style={{
      background: "#13131a", border: "1px solid #ffffff0d", borderRadius: 18,
      marginBottom: 16, overflow: "hidden", animation: "fadeUp .4s ease both",
      transition: "border-color .2s",
    }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = "#ffffff1a"}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = "#ffffff0d"}
    >
      {/* Header */}
      <div style={{ padding: "18px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", cursor: "pointer" }}
          onClick={() => navigate(`/profile/${post.user._id}`)}>
          <Avatar name={post.user.name} size={42} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{post.user.name}</div>
            <div style={{ color: "#555", fontSize: 12 }}>@{post.user.username} · {fmt(post.createdAt)}</div>
          </div>
        </div>
        {post.user._id === user._id && (
          <button onClick={deletePost} style={{
            background: "transparent", border: "none", color: "#444",
            cursor: "pointer", fontSize: 20, padding: "2px 8px", borderRadius: 6,
          }}
            onMouseEnter={(e) => e.target.style.color = "#dc2626"}
            onMouseLeave={(e) => e.target.style.color = "#444"}>×</button>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "14px 20px 16px", fontSize: 15, lineHeight: 1.65, color: "#ccc" }}>
        {post.content}
      </div>

      {/* Actions */}
      <div style={{ padding: "14px 20px 16px", display: "flex", gap: 6, borderTop: "1px solid #ffffff08" }}>
        <ActionBtn icon={liked ? "♥" : "♡"} label={`${post.likes.length}`}
          active={liked} activeColor="#f43f5e" onClick={toggleLike} />
        <ActionBtn icon="💬" label={`${post.comments.length}`}
          active={showComments} activeColor="#6366f1"
          onClick={() => setShowComments((s) => !s)} />
      </div>

      {/* Comments section */}
      {showComments && (
        <div style={{ borderTop: "1px solid #ffffff08", padding: "16px 20px" }}>
          {post.comments.length === 0 && (
            <p style={{ color: "#444", fontSize: 13, marginBottom: 12 }}>No comments yet.</p>
          )}
          {post.comments.map((c) => (
            <div key={c._id} style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <div onClick={() => navigate(`/profile/${c.user._id}`)} style={{ cursor: "pointer" }}>
                <Avatar name={c.user.name} size={30} />
              </div>
              <div style={{ background: "#0d0d14", borderRadius: 10, padding: "8px 12px", flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#818cf8", marginBottom: 2 }}>
                  @{c.user.username}
                </div>
                <div style={{ fontSize: 13, color: "#bbb", lineHeight: 1.4 }}>{c.text}</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: "#444" }}>{fmt(c.createdAt)}</span>
                  {c.user._id === user._id && (
                    <span onClick={() => deleteComment(c._id)} style={{ fontSize: 11, color: "#555", cursor: "pointer" }}
                      onMouseEnter={(e) => e.target.style.color = "#dc2626"}
                      onMouseLeave={(e) => e.target.style.color = "#555"}>delete</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add comment */}
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <Avatar name={user.name} size={30} />
            <div style={{ flex: 1, display: "flex", gap: 8 }}>
              <input value={commentText} onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment…"
                onKeyDown={(e) => { if (e.key === "Enter") addComment(); }}
                style={{
                  flex: 1, background: "#0d0d14", border: "1px solid #ffffff10",
                  borderRadius: 10, padding: "8px 12px", color: "#e8e6f0",
                  fontSize: 13, outline: "none",
                }}
                onFocus={(e) => e.target.style.borderColor = "#6366f1"}
                onBlur={(e) => e.target.style.borderColor = "#ffffff10"}
              />
              <button onClick={addComment} disabled={!commentText.trim() || loading} style={{
                background: commentText.trim() ? "#6366f1" : "#1a1a24",
                color: commentText.trim() ? "#fff" : "#444",
                border: "none", padding: "8px 14px", borderRadius: 10,
                fontSize: 13, fontWeight: 600, cursor: commentText.trim() ? "pointer" : "default",
              }}>Post</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionBtn({ icon, label, active, onClick, activeColor }) {
  return (
    <button onClick={onClick} style={{
      background: active ? `${activeColor}18` : "transparent",
      border: `1px solid ${active ? activeColor + "40" : "#ffffff0a"}`,
      color: active ? activeColor : "#666",
      padding: "7px 14px", borderRadius: 10, cursor: "pointer",
      fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 6,
      transition: "all .2s",
    }}>
      <span style={{ fontSize: 15 }}>{icon}</span>{label}
    </button>
  );
}
