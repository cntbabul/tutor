import { Router } from "express";
import listingRoutes from "@/routes/listingRoutes.js";
import userRoutes from "@/routes/userRoutes.js";
import categoryRoutes from "@/routes/categoryRoutes.js";
import imagekitRoutes from "@/routes/imagekitRoutes.js";
import chatRoutes from "@/routes/chatRoutes.js";
const router = Router();
router.use("/listings", listingRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/imagekit", imagekitRoutes);
router.use("/chats", chatRoutes);
export default router;
//# sourceMappingURL=index.js.map