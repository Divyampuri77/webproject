// Import required modules
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tell 'config' package where to look for default.json
process.env["NODE_CONFIG_DIR"] = path.join(__dirname, "config");

// Import other modules
import config from "config";
import userRouter from "./controllers/userController.js";
import adminRouter from "./controllers/adminController.js";
import "./utils/dbConnect.js";
import authMiddleware from "./middleware/users/authMiddleware.js";
import publicUserRouter from "./controllers/public/register.js";

// Create an instance of Express
const app = express();
app.use(cors());

// Get port from config
const PORT = process.env.PORT || config.get("PORT");

// Middleware - Parse incoming requests as JSON
app.use(express.json());

// Serve frontend build (if using React)
app.use(express.static(path.join(__dirname, "dist")));

// API routes
app.use("/public", publicUserRouter);
app.use("/user", authMiddleware, userRouter);
app.use("/admin", authMiddleware, adminRouter);

// All other GET requests not handled before will return the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).send("404 - Route Not Found");
});

// Handle other errors
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).send("500 - Internal Server Error");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on PORT ${PORT}`);
});