"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const messagesRoutes_1 = __importDefault(require("./routes/messagesRoutes"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const ws_1 = require("ws");
const message_1 = __importDefault(require("./models/message"));
dotenv_1.default.config();
(0, database_1.default)();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const wss = new ws_1.WebSocketServer({ server });
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Test route HTTP
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
// Routes HTTP REST
app.use('/api/messages', messagesRoutes_1.default);
// Couleurs possibles à attribuer aux utilisateurs
const colors = ['#FF5733', '#33FF57', '#3357FF', '#F39C12', '#8E44AD'];
const userColors = new Map();
// WebSocket: Nouveau client
wss.on('connection', (ws) => {
    const userColor = colors[Math.floor(Math.random() * colors.length)];
    userColors.set(ws, userColor);
    console.log('🟢 Client connecté avec couleur:', userColor);
    // Lorsqu’un client envoie un message
    ws.on('message', async (data) => {
        const message = data.toString();
        const color = userColors.get(ws) || '#000000'; // couleur par défaut
        try {
            // Enregistrer en base de données
            const savedMessage = await message_1.default.create({
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
        }
        catch (error) {
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
