"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const content_controller_1 = require("../controllers/content.controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.authenticator, content_controller_1.createContent);
router.get("/", authMiddleware_1.authenticator, content_controller_1.getUserContent);
router.get("/type/:type", authMiddleware_1.authenticator, content_controller_1.getContentByType);
router.get("/search", authMiddleware_1.authenticator, content_controller_1.searchContent);
router.put("/:id", authMiddleware_1.authenticator, content_controller_1.updateContent);
router.delete("/:id", authMiddleware_1.authenticator, content_controller_1.deleteContent);
exports.default = router;
