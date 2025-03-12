import express from "express";
import { requestOTP, signup , login} from "../controllers/auth.controller";
import { authenticator } from "../middleware/authMiddleware";
const router = express.Router();

router.post("/request-otp", requestOTP);
router.post("/signup", signup);
router.post("/login", login);

export default router;