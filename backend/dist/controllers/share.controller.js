"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLink = exports.createLink = void 0;
const link_1 = __importDefault(require("../model/link"));
const content_1 = __importDefault(require("../model/content"));
const crypto_1 = __importDefault(require("crypto"));
const createLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get userId from the authenticated user instead of request body
        const userId = req.user.id;
        const hash = crypto_1.default.randomBytes(6).toString("hex");
        const newLink = new link_1.default({
            hash,
            userId,
        });
        yield newLink.save();
        console.log("Link saved successfully:", newLink);
        res.status(201).json({
            message: "Shareable link generated successfully",
            hash: hash,
        });
    }
    catch (error) {
        console.error("Error creating link:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createLink = createLink;
const getLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hash } = req.params;
        console.log("Received hash:", hash);
        const sharedLink = yield link_1.default.findOne({ hash });
        console.log("Fetched link from DB:", sharedLink);
        if (!sharedLink) {
            console.log("Link not found in DB!");
            return res.status(404).json({ message: "Link not found" });
        }
        const getContent = yield content_1.default.find({ userId: sharedLink.userId });
        console.log("Fetched content:", getContent);
        if (!getContent || getContent.length === 0) {
            return res
                .status(404)
                .json({ message: "No content found for this user" });
        }
        res.status(200).json(getContent);
    }
    catch (error) {
        console.error("Error fetching link:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getLink = getLink;
