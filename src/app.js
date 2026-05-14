import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/tasks.route.js";
import quoteRoutes from "./routes/qoutes.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Allowed origins (local frontend + optional env)
const rawAllowed =
  process.env.ALLOWED_ORIGINS ||
  "http://localhost:3000,http://127.0.0.1:5173,http://localhost:5173";
const allowedOrigins = rawAllowed
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// ✅ Clean CORS config
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin like curl/postman
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      return callback(new Error("CORS policy: This origin is not allowed."));
    },
    methods: ["POST", "GET", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// ✅ Middleware



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/quotes", quoteRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

app.options("/send", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.headers.origin && req.headers.origin.startsWith("http")) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Credentials", "http://localhost:5173");
  }
  return res.sendStatus(204);
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
