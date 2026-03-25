const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const menuRoutes = require("./routes/menuRoutes");


const connectDB = require("./config/db");

const categoryRoutes = require("./routes/categoryRoutes");
const authRoutes = require("./routes/authRoutes");

const { authMiddleware } = require("./middlewares/authMiddleware");
const { roleMiddleware } = require("./middlewares/roleMiddleware");

const app = express();
const server = http.createServer(app);

// ✅ Trust proxy (Render fix)
app.set("trust proxy", 1);

// ✅ Connect DB
connectDB();

// ✅ Security
app.use(helmet());
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use("/api/menu", menuRoutes);
app.use(limiter);

// ✅ Middlewares
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json());

// ✅ Routes
app.get("/", (req, res) => {
  res.send("API Running...");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ msg: "You are authorized", user: req.user });
});

app.get("/api/admin", authMiddleware, roleMiddleware("admin"), (req, res) => {
  res.json({ msg: "Welcome Admin" });
});

app.get("/api/manager", authMiddleware, roleMiddleware("admin", "manager"), (req, res) => {
  res.json({ msg: "Welcome Manager" });
});

// ✅ Socket.IO
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong",
    error: err.message
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});