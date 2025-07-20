"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postMessage = exports.getMessages = void 0;
const message_1 = __importDefault(require("../models/message"));
const getMessages = async (req, res) => {
    try {
        const messages = await message_1.default.find();
        res.status(200).json(messages);
    }
    catch (error) {
        console.error("Erreur d'apportée du data", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getMessages = getMessages;
const postMessage = (req, res) => {
    const { sender, content } = req.body;
    if (!sender || !content) {
        return res.status(400).json({ message: "Sender and content are required" });
    }
    const newMessage = new message_1.default({
        sender,
        content,
        timestamp: new Date(),
    });
    newMessage
        .save()
        .then((message) => res.status(201).json(message))
        .catch((error) => {
        console.error("Erreur d'enregistrement du message", error);
        res.status(500).json({ message: "Internal server error" });
    });
};
exports.postMessage = postMessage;
