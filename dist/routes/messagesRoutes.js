"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messagesControllers_1 = require("../controllers/messagesControllers");
const app = (0, express_1.default)();
const router = express_1.default.Router();
router.get('/', messagesControllers_1.getMessages);
router.post('/', messagesControllers_1.postMessage);
exports.default = router;
