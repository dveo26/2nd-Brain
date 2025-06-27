"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.generateOTP = void 0;
const otp_generator_1 = __importDefault(require("otp-generator"));
const otpStore = new Map();
const generateOTP = (email) => {
    const otp = otp_generator_1.default.generate(6, { digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
    otpStore.set(email, otp);
    return otp;
};
exports.generateOTP = generateOTP;
const verifyOTP = (email, userOTP) => {
    const otp = otpStore.get(email);
    if (otp === userOTP) {
        otpStore.delete(email);
        return true;
    }
    else {
        return false;
    }
};
exports.verifyOTP = verifyOTP;
