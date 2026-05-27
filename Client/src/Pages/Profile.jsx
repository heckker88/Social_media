import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import PostCard from "../components/Postcard.jsx";
import Avatar from "../components/Avatar.jsx";
import api from "../utils/api.js";
import { Spinner, Empty } from "./Feed.jsx";

export default function ProfilePage({ notify }) {
  const { id } = useParams();
  const { user: me } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/users/${id}`),
      api.get(`/posts/user/${id}`),
    ])
      .then(([u, p]) => { setProfile(u.data); setPosts(p.data); })
      .catch(() => notify("Failed to load profile", "error"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (!profile) return <Empty>User not found.</Empty>;

  const totalLikes = posts.reduce((s, p) => s + p.likes.length, 0);

  const handleUpdate = (updated) =>
    setPosts((ps) => ps.map((p) => (p._id === updated._id ? updated : p)));
  const handleDelete = (delId) =>
    setPosts((ps) => ps.filter((p) => p._id !== delId));

  return (
    <div style={{ animation: "fadeUp .4s ease" }}>
      {/* Profile header */}
      <div style={{
        background: "#13131a", border: "1px solid #ffffff0d",
        borderRadius: 18, padding: "32px 28px", marginBottom: 24, textAlign: "center",
      }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <Avatar name={profile.name} size={80} />
        </div>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 24, marginBottom: 4 }}>{profile.name}</h2>
        <p style={{ color: "#555", fontSize: 14, marginBottom: 8 }}>@{profile.username}</p>
        {profile.bio && <p style={{ color: "#888", fontSize: 14, marginBottom: 20 }}>{profile.bio}</p>}

        <div style={{ display: "flex", justifyContent: "center", gap: 32 }}>
          {[["Posts", posts.length], ["Likes", totalLikes], ["Comments", posts.reduce((s, p) => s + p.comments.length, 0)]].map(([l, v]) => (
            <div key={l}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 22 }}>{v}</div>
              <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 16, color: "#888" }}>
        {id === me._id ? "Your posts" : `${profile.name}'s posts`}
      </h3>

      {posts.length === 0
        ? <Empty>No posts yet.</Empty>
        : posts.map((p) => (
          <PostCard key={p._id} post={p} onUpdate={handleUpdate} onDelete={handleDelete} notify={notify} />
        ))
      }
    </div>
  );
}
