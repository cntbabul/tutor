import type { Request, Response } from "express";
import prisma from "@/config/db.js";
import type { UserWithTutorProfile } from "@/types/types.js";

export const getUserProfile = async (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        tutor: {
          include: {
            listings: {
              include: {
                category: true,
                subCategory: true
              }
            }
          }
        }
      }
    }) as UserWithTutorProfile | null;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  const { name, email, image, role, bio, qualification, experience, hourlyRate } = req.body;

  if (!userId || !email) {
    return res.status(400).json({ error: "Missing userId or email" });
  }

  try {
    const user = await prisma.user.upsert({
      where: { id: userId },
      update: { name, email, image, role },
      create: { id: userId, name, email, image, role }
    });

    let tutor = null;
    if (role === "TUTOR" && bio) {
      const safeExperience = parseInt(experience) || 0;
      const safeHourlyRate = parseFloat(hourlyRate) || 0;

      tutor = await prisma.tutor.upsert({
        where: { userId: userId },
        update: {
          bio,
          qualification,
          experience: safeExperience,
          hourlyRate: safeHourlyRate
        },
        create: {
          userId: userId,
          bio,
          qualification,
          experience: safeExperience,
          hourlyRate: safeHourlyRate,
          isVerified: false
        }
      });
    }

    res.json({ ...user, tutor });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Failed to save user profile" });
  }
};
