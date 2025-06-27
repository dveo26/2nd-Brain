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
exports.login = exports.signup = exports.requestOTP = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../model/user"));
const email_1 = require("../utils/email");
const otp_1 = require("../utils/otp");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const requestOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const existingUser = yield user_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }
        const otp = (0, otp_1.generateOTP)(email);
        yield (0, email_1.sendOTPEmail)(email, otp);
        return res.status(200).json({ message: "OTP sent to email" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error sending OTP", error });
    }
});
exports.requestOTP = requestOTP;
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password, otp } = req.body;
        if (!username || !email || !password || !otp) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!(0, otp_1.verifyOTP)(email, otp)) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = new user_1.default({
            username,
            email,
            password: hashedPassword,
            isVerified: true,
        });
        yield user.save();
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        return res.status(201).json({ message: "Signup successful", token, user });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Signup failed", error });
    }
});
exports.signup = signup;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        return res.status(200).json({ message: "Login successful", token, user });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Login failed", error });
    }
});
exports.login = login;
