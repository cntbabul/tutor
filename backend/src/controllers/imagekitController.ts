import type { Request, Response } from "express";
import imagekit from "../config/imagekit.js";

export const getImageKitAuth = (req: Request, res: Response) => {
  try {
    const result = imagekit.helper.getAuthenticationParameters();
    res.json(result);
  } catch (error) {
    console.error("ImageKit Auth Error:", error);
    res.status(500).json({ error: "Failed to generate auth parameters" });
  }
};
