import type { Request, Response, NextFunction } from "express";

export const protectRoute = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.headers["x-user-id"];
    
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: Missing x-user-id header" });
    }
    
    next();
};
