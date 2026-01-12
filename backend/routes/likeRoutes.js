import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { toggleLike, getLikeCount } from "../controllers/likeController.js";

const router = express.Router();

router.post("/toggle", authenticateToken, toggleLike);
router.get("/count/:type/:id", getLikeCount);

export default router;
