import prisma from "@/config/db.js";
export const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                subCategories: true
            }
        });
        const formattedCategories = categories.map(c => ({
            name: c.name,
            slug: c.slug,
            classes: c.subCategories.map(sc => sc.name)
        }));
        res.json(formattedCategories);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch categories" });
    }
};
//# sourceMappingURL=categoryController.js.map