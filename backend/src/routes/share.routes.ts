import { authenticator } from "../middleware/authMiddleware";
import { Router } from "express";
import { createLink, getLink } from "../controllers/share.controller";

const router = Router();

router.post("/link", authenticator, createLink);
router.get("/link/:hash", getLink);

export default router;