import type { Request, Response } from "express";
import prisma from "@/config/db.js";
import type { CategoryWithSubCategories } from "@/types/types.js";

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subCategories: true
      }
    });

    const formattedCategories = (categories as CategoryWithSubCategories[]).map(c => ({
      name: c.name,
      slug: c.slug,
      classes: c.subCategories.map(sc => sc.name)
    }));

    res.json(formattedCategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};
