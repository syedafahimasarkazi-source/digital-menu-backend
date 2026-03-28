const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

// ✅ DB
const connectDB = require("./config/db");

// ✅ Routes
const menuRoutes = require("./routes/menuRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const authRoutes = require("./routes/authRoutes");

// ✅ Middlewares
const { authMiddleware } = require("./middlewares/authMiddleware");
const { roleMiddleware } = require("./middlewares/roleMiddleware");

const app = express();
const server = http.createServer(app);

// ✅ Trust proxy (for deployment like Render)
app.set("trust proxy", 1);

// ==========================
// ✅ CONNECT DATABASE
// ==========================
connectDB();

// ==========================
// ✅ GLOBAL MIDDLEWARES (ORDER MATTERS)
// ==========================

// 🔥 Body parser FIRST (CRITICAL)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// 🔒 Security
app.use(helmet());

// 📄 Logger
app.use(morgan("dev"));

// 🚦 Rate Limiter (apply AFTER basic middlewares)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// ==========================
// ✅ ROUTES
// ==========================

app.get("/", (req, res) => {
  res.send("API Running...");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// 🔐 Auth Routes
app.use("/api/auth", authRoutes);

// 📂 Category Routes
app.use("/api/categories", categoryRoutes);

// 🍽 Menu Routes
app.use("/api/menu", menuRoutes);

// 🔐 Protected test routes (for debugging auth)
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ msg: "You are authorized", user: req.user });
});

app.get("/api/admin", authMiddleware, roleMiddleware("admin"), (req, res) => {
  res.json({ msg: "Welcome Admin" });
});

app.get(
  "/api/manager",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  (req, res) => {
    res.json({ msg: "Welcome Manager" });
  }
);

// ==========================
// ✅ SOCKET.IO
// ==========================

const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ==========================
// ✅ GLOBAL ERROR HANDLER
// ==========================

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ==========================
// ✅ START SERVER
// ==========================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});