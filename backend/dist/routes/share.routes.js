"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authMiddleware_1 = require("../middleware/authMiddleware");
const express_1 = require("express");
const share_controller_1 = require("../controllers/share.controller");
const router = (0, express_1.Router)();
router.post("/link", authMiddleware_1.authenticator, share_controller_1.createLink);
router.get("/link/:hash", share_controller_1.getLink);
exports.default = router;
