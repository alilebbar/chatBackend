// server.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import connectDB from "./config/database";
import router from "./routes/messagesRoutes";
import { WebSocketServer } from "ws";
import { handleWebSocket } from "./controllers/websocketController";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/messages", router);

// 🔌 WebSocket init
handleWebSocket(wss);

server.listen(PORT, () => {
  console.log(`🚀 Server (HTTP + WS) running on port ${PORT}`);
});
