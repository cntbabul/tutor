import { Router } from "express";
import { getUserProfile, updateUserProfile } from "@/controllers/userController.js";

const router = Router();

router.get("/profile", getUserProfile);
router.post("/profile", updateUserProfile);

export default router;
