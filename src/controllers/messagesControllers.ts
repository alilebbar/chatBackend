import { Response, Request } from "express";
import Message from "../models/message";

export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (error) {
    console.error("Erreur d'apportée du data", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const postMessage = (req: Request, res: Response) => {
  const { sender, content } = req.body;

  if (!sender || !content) {
    return res.status(400).json({ message: "Sender and content are required" });
  }

  const newMessage = new Message({
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
