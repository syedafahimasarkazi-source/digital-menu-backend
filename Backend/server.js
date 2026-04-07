const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

//  DB
const connectDB = require("./config/db");

// Routes
const menuRoutes = require("./routes/menuRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const authRoutes = require("./routes/authRoutes");

//  Middlewares
const { authMiddleware } = require("./middlewares/authMiddleware");
const { roleMiddleware } = require("./middlewares/roleMiddleware");

const app = express();
const server = http.createServer(app);

//  Trust proxy
app.set("trust proxy", 1);

// ==========================
// CONNECT DATABASE
// ==========================
connectDB();

// ==========================
// GLOBAL MIDDLEWARES
// ==========================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "https://digital-menu-backend-qm9f.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(helmet());
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// ==========================
// ROUTES
// ==========================

app.get("/", (req, res) => {
  res.send("API Running...");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/menu", menuRoutes);

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
//  SOCKET.IO
// ==========================

const io = new Server(server, {
  cors: { origin: "*" },
});

// 🔥 IMPORTANT: MAKE IO GLOBAL
global.io = io;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // OPTIONAL: Join room (future for outlet-based system)
  socket.on("joinOutlet", (outletId) => {
    socket.join(outletId);
    console.log(`Socket ${socket.id} joined outlet ${outletId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ==========================
// GLOBAL ERROR HANDLER
// ==========================

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ==========================
// START SERVER
// ==========================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
