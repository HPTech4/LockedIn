import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/tasks.route.js";
import quoteRoutes from "./routes/qoutes.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ OPEN CORS 
app.use(cors());

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;