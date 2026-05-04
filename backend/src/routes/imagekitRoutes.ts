import { Router } from "express";
import { getImageKitAuth } from "@/controllers/imagekitController.js";

const router = Router();

router.get("/auth", getImageKitAuth);

export default router;
