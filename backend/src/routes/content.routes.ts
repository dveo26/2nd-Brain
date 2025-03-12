import express from "express";
import {
  createContent,
  getUserContent,
  getContentByType,
  searchContent,
  updateContent,
  deleteContent,
} from "../controllers/content.controller";
import { authenticator } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authenticator, createContent);
router.get("/", authenticator, getUserContent);
router.get("/type/:type", authenticator, getContentByType);
router.get("/search", authenticator, searchContent);
router.put("/:id", authenticator, updateContent);
router.delete("/:id", authenticator, deleteContent);

export default router;
