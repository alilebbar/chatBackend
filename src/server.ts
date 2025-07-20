
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database';
import router from './routes/messagesRoutes';
import cors from 'cors';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import Message from './models/message';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route HTTP
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

// Routes HTTP REST
app.use('/api/messages', router);

// Couleurs possibles à attribuer aux utilisateurs
const colors = ['#FF5733', '#33FF57', '#3357FF', '#F39C12', '#8E44AD'];
const userColors = new Map<import('ws').WebSocket, string>();

// WebSocket: Nouveau client
wss.on('connection', (ws) => {
  const userColor = colors[Math.floor(Math.random() * colors.length)];
  userColors.set(ws, userColor);
  console.log('🟢 Client connecté avec couleur:', userColor);

  // Lorsqu’un client envoie un message
  ws.on('message', async (data: string) => {
    const message = data.toString();
    const color = userColors.get(ws) || '#000000'; // couleur par défaut

    try {
      // Enregistrer en base de données
      const savedMessage = await Message.create({
        sender: color,
        content: message,
        timestamp: new Date(),
      });

      // Préparer et envoyer le message aux autres
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
      console.error('❌ Erreur en sauvegardant le message :', error);
    }
  });

  // Déconnexion client
  ws.on('close', () => {
    userColors.delete(ws);
    console.log('🔴 Client déconnecté');
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server (HTTP + WS) running on port ${PORT}`);
});
