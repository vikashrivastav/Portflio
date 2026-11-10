require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { login, current, logout } = require("./auth");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      const isVercelOrigin =
        origin && /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin);

      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        isVercelOrigin
      ) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());

function requireAuth(req, res, next) {
  const user = current(req.cookies.portfolio_session);

  if (!user) {
    return res.status(401).json({
      error: "Authentication required"
    });
  }

  req.user = user;
  next();
}

app.get("/", (req, res) => {
  res.json({
    name: "Portfolio API",
    status: "running",
    health: "/api/health"
  });
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  const token = login(email, password);

  if (!token) {
    return res.status(401).json({
      error: "Invalid email or password"
    });
  }

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("portfolio_session", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 86400000
  });

  res.json({
    user: {
      email
    }
  });
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({
    user: req.user
  });
});

app.post("/api/auth/logout", (req, res) => {
  logout(req.cookies.portfolio_session);

  res.clearCookie("portfolio_session", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  });

  res.json({
    ok: true
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});