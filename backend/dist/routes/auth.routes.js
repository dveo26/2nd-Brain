"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const router = express_1.default.Router();
router.post("/request-otp", auth_controller_1.requestOTP);
router.post("/signup", auth_controller_1.signup);
router.post("/login", auth_controller_1.login);
exports.default = router;
