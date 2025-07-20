import express from "express";
import { getMessages, postMessage } from "../controllers/messagesControllers";
const app = express(); 
const router = express.Router(); 

router.get('/', getMessages);
router.post('/', postMessage);
export default router;