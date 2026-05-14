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
const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

// If you later add deployed frontend
if (process.env.CORS_ORIGIN) {
  allowedOrigins.push(process.env.CORS_ORIGIN);
}

// ✅ Clean CORS config
const corsOptions = {
  origin: (origin, callback) => {
    console.log("Incoming Origin:", origin); // 🔍 debug

    // Allow requests with no origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // ❗ DO NOT throw error — just block silently
    return callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// ✅ Middleware
app.use(cors(corsOptions));

// 🔥 VERY IMPORTANT (fixes your exact error)
app.options("*", cors(corsOptions));

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
