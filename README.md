# 🔷 Nexus — MERN Social Media App

A full-stack social media application built with MongoDB, Express, React, and Node.js.
Users can register, log in, create posts, like posts, and comment on them.

---

## 📁 Project Structure

```
nexus/
│
├── server/                        ← Node.js + Express backend
│   ├── models/
│   │   ├── User.js                ← User schema (name, email, password, bio)
│   │   └── Post.js                ← Post schema (content, likes, comments)
│   │
│   ├── routes/
│   │   ├── auth.js                ← /api/auth/register and /api/auth/login
│   │   ├── posts.js               ← /api/posts (CRUD, like, comment)
│   │   └── users.js               ← /api/users/:id (profile)
│   │
│   ├── middleware/
│   │   └── auth.js                ← JWT token verification (protects routes)
│   │
│   ├── server.js                  ← App entry point, connects to MongoDB
│   ├── .env                       ← Secret config (Mongo URI, JWT secret)
│   └── package.json               ← Server dependencies
│
└── client/                        ← React + Vite frontend
    ├── src/
    │   ├── components/
    │   │   ├── Avatar.jsx          ← Colored circle with user initials
    │   │   ├── Navbar.jsx          ← Top navigation bar
    │   │   ├── Notification.jsx    ← Toast popup (success/error messages)
    │   │   └── PostCard.jsx        ← Single post with like & comment features
    │   │
    │   ├── context/
    │   │   └── AuthContext.jsx     ← Global auth state (user, login, logout)
    │   │
    │   ├── pages/
    │   │   ├── LoginPage.jsx       ← Login form
    │   │   ├── RegisterPage.jsx    ← Register form
    │   │   ├── FeedPage.jsx        ← Home feed with post composer
    │   │   └── ProfilePage.jsx     ← User profile with their posts & stats
    │   │
    │   ├── utils/
    │   │   └── api.js              ← Axios instance (auto-attaches JWT token)
    │   │
    │   ├── App.jsx                 ← Routes and layout
    │   ├── main.jsx                ← React app entry point
    │   └── index.css               ← Global styles and animations
    │
    ├── index.html                  ← HTML template
    ├── vite.config.js              ← Vite config (proxies /api to port 5000)
    └── package.json                ← Client dependencies
```

---

## 🧠 How Each File Works

### Backend

| File | What it does |
|------|-------------|
| `server.js` | Starts Express, connects to MongoDB, registers all routes |
| `models/User.js` | Defines user structure, hashes password before saving |
| `models/Post.js` | Defines post structure with likes array and comments array |
| `middleware/auth.js` | Reads JWT token from request header, attaches user to `req.user` |
| `routes/auth.js` | Handles register (creates user) and login (returns JWT token) |
| `routes/posts.js` | Create, delete, like/unlike posts, add/delete comments |
| `routes/users.js` | Get user profile by ID, update profile |
| `.env` | Stores `MONGO_URI`, `JWT_SECRET`, `PORT` — never commit this to git |

### Frontend

| File | What it does |
|------|-------------|
| `App.jsx` | Defines all routes (`/`, `/login`, `/register`, `/profile/:id`) |
| `main.jsx` | Wraps app in `BrowserRouter` and `AuthProvider` |
| `context/AuthContext.jsx` | Stores logged-in user globally, exposes `login`, `register`, `logout` |
| `utils/api.js` | Axios with base URL `/api`, auto-attaches `Bearer token` to every request |
| `components/Navbar.jsx` | Shows logo, Feed link, avatar, logout button |
| `components/Avatar.jsx` | Generates a colored circle from the user's name initials |
| `components/PostCard.jsx` | Renders one post — handles like, comment, delete actions |
| `components/Notification.jsx` | Shows green/red toast in top-right corner for 3 seconds |
| `pages/LoginPage.jsx` | Email + password form, calls `AuthContext.login()` |
| `pages/RegisterPage.jsx` | Name + username + email + password form |
| `pages/FeedPage.jsx` | Loads all posts, shows post composer at the top |
| `pages/ProfilePage.jsx` | Loads one user's profile and all their posts |

---

## 🔐 How Authentication Works

```
User fills login form
        ↓
POST /api/auth/login  (email + password sent to server)
        ↓
Server checks password with bcrypt
        ↓
Server returns JWT token
        ↓
Token saved in localStorage
        ↓
Every future API request sends:
  Authorization: Bearer <token>
        ↓
middleware/auth.js verifies token
and attaches user to req.user
```

---

## 📝 How Creating a Post Works

```
User types in the composer box (FeedPage)
        ↓
Clicks "Post" button
        ↓
POST /api/posts  { content: "Hello world" }
  + Authorization header (JWT token)
        ↓
middleware/auth.js verifies token → req.user = logged in user
        ↓
routes/posts.js creates Post in MongoDB
  { user: req.user._id, content, likes: [], comments: [] }
        ↓
New post returned and added to the top of the feed
```

---

## ❤️ How Likes Work

```
User clicks ♡ on a post
        ↓
PUT /api/posts/:id/like
        ↓
Server checks if user's ID is already in post.likes array
  → Not there? Add it   (like)
  → Already there? Remove it  (unlike)
        ↓
Returns updated likes array
        ↓
UI updates the count and fills/unfills the heart
```

---

## 💬 How Comments Work

```
User types in comment box and presses Enter (or Post button)
        ↓
POST /api/posts/:id/comment  { text: "Nice post!" }
        ↓
Server pushes { user, text, createdAt } into post.comments array
        ↓
New comment returned and shown instantly in the UI
```

---

## 🗄️ Database Structure

### Users Collection
```json
{
  "_id": "64abc...",
  "name": "Ravi Mehta",
  "username": "ravi_m",
  "email": "ravi@example.com",
  "password": "$2a$12$hashedpassword...",
  "bio": "Coffee & code ☕",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Posts Collection
```json
{
  "_id": "64def...",
  "user": "64abc...",
  "content": "Just shipped a new feature!",
  "likes": ["64abc...", "64xyz..."],
  "comments": [
    {
      "_id": "64ghi...",
      "user": "64xyz...",
      "text": "Congrats!",
      "createdAt": "2024-01-15T11:00:00Z"
    }
  ],
  "createdAt": "2024-01-15T10:45:00Z"
}
```

---

## 🌐 API Reference

### Auth
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | `name, username, email, password` | Create account |
| POST | `/api/auth/login` | `email, password` | Login, returns JWT |

### Posts
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/posts` | ✅ | Get all posts (feed) |
| POST | `/api/posts` | ✅ | Create a post |
| DELETE | `/api/posts/:id` | ✅ | Delete your post |
| PUT | `/api/posts/:id/like` | ✅ | Toggle like |
| POST | `/api/posts/:id/comment` | ✅ | Add comment |
| DELETE | `/api/posts/:id/comment/:cid` | ✅ | Delete your comment |
| GET | `/api/posts/user/:userId` | ✅ | Get posts by user |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/:id` | ✅ | Get user profile |
| PUT | `/api/users/profile` | ✅ | Update your profile |

> ✅ = Requires `Authorization: Bearer <token>` header

---

## ⚙️ Environment Variables

File: `server/.env`

```env
MONGO_URI=mongodb://localhost:27017/nexus
JWT_SECRET=your_long_random_secret_here
PORT=5000
```

| Variable | What it is |
|----------|-----------|
| `MONGO_URI` | MongoDB connection string. Use localhost for local, or Atlas URL for cloud |
| `JWT_SECRET` | Secret key used to sign tokens. Make it long and random |
| `PORT` | Port the server runs on (default 5000) |

---

## 🚀 Running the App

### Prerequisites
- Node.js v18+
- MongoDB installed and running locally **or** a MongoDB Atlas account

### Terminal 1 — Backend
```bash
cd server
npm install
npm run dev
```
Expected output:
```
✅ MongoDB connected
🚀 Server running on port 5000
```

### Terminal 2 — Frontend
```bash
cd client
npm install
npm run dev
```
Expected output:
```
VITE v4.x  ready in 300ms
➜  Local: http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

## 🐛 Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `MongoDB connection error` | MongoDB not running | Start MongoDB service |
| `Cannot GET /api/posts` | Server not running | Run `npm run dev` in server folder |
| `Network Error` in browser | Frontend can't reach backend | Make sure server is on port 5000 |
| `jwt malformed` | Bad or missing token | Log out and log back in |
| `nodemon not found` | Dev dependency missing | Run `npm install` in server folder |
| White screen on frontend | JS error in React | Check browser console for errors |

---

## 📦 Dependencies Explained

### Server
| Package | Purpose |
|---------|---------|
| `express` | Web framework — handles routes and HTTP requests |
| `mongoose` | MongoDB object modeling — defines schemas and queries |
| `bcryptjs` | Hashes passwords before storing in database |
| `jsonwebtoken` | Creates and verifies JWT tokens for auth |
| `cors` | Allows the React frontend to talk to the Express backend |
| `dotenv` | Loads variables from `.env` file into `process.env` |
| `nodemon` | Auto-restarts server when you save a file (dev only) |

### Client
| Package | Purpose |
|---------|---------|
| `react` | UI library |
| `react-dom` | Renders React into the browser |
| `react-router-dom` | Client-side routing (`/`, `/login`, `/profile/:id`) |
| `axios` | Makes HTTP requests to the backend API |
| `vite` | Fast dev server and build tool |

---

## 🔄 Data Flow Summary

```
Browser (React)
    ↕  axios (with JWT token)
Express Server
    ↕  mongoose
MongoDB Database
```

1. React sends requests via **axios** with a JWT token in the header
2. Express receives the request, **middleware** verifies the token
3. The route handler queries **MongoDB** via Mongoose
4. Data is returned as **JSON** back to React
5. React **updates the UI** with the new data
```
