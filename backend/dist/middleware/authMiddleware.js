"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticator = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const authenticator = (req, res, next) => {
    try {
        let token = req.header("Authorization");
        console.log("Received Token:", token);
        if (!token) {
            res.status(401).json({ msg: "No token, authorization denied" });
            return;
        }
        // Extract token if using "Bearer <token>"
        const tokenParts = token.split(" ");
        if (tokenParts.length === 2 && tokenParts[0] === "Bearer") {
            token = tokenParts[1];
        }
        const secretKey = process.env.JWT_SECRET;
        if (!secretKey) {
            console.error("JWT_SECRET is not defined in .env");
            res.status(500).json({ msg: "Server error: Missing JWT secret" });
            return;
        }
        // Verify JWT
        const verified = jsonwebtoken_1.default.verify(token, secretKey);
        if (!verified || !verified.id) {
            res.status(401).json({ msg: "Invalid token" });
            return;
        }
        // Attach user data to the request
        req.user = { id: verified.id };
        console.log("Authenticated User:", req.user);
        next();
    }
    catch (error) {
        console.error("JWT Verification Error:", error);
        res.status(401).json({ msg: "Invalid or expired token" });
    }
};
exports.authenticator = authenticator;
