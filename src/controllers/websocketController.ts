// controllers/websocketController.ts
import { WebSocketServer, WebSocket } from "ws";
import Message from "../models/message";
import { colorGenerate, colorUnique } from "../services/colorService";

const userColors = new Map<WebSocket, string>();

export const handleWebSocket = (wss: WebSocketServer) => {
  wss.on("connection", async (ws: WebSocket) => {
    const userColor = await colorUnique(colorGenerate());
    userColors.set(ws, userColor);
    console.log("🟢 Client connecté avec couleur:", userColor);

    ws.on("message", async (data: string) => {
      const message = data.toString();
      const color = userColors.get(ws) || "#000000";

      try {
        const savedMessage = await Message.create({
          sender: color,
          content: message,
          timestamp: new Date(),
        });

        const payload = JSON.stringify({
          message: savedMessage.content,
          color: savedMessage.sender,
          timestamp: savedMessage.timestamp,
        });

        wss.clients.forEach((client) => {
          if (client.readyState === client.OPEN) {
            client.send(payload);
          }
        });
      } catch (error) {
        console.error("❌ Erreur en sauvegardant le message :", error);
      }
    });

    ws.on("close", () => {
      userColors.delete(ws);
      console.log("🔴 Client déconnecté");
    });
  });
};
