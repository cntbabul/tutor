import prisma from "@/config/db.js";
export const getListings = async (req, res) => {
    const { q } = req.query;
    try {
        const listings = await prisma.listing.findMany({
            where: q ? {
                OR: [
                    { title: { contains: q, mode: 'insensitive' } },
                    { description: { contains: q, mode: 'insensitive' } },
                    { category: { name: { contains: q, mode: 'insensitive' } } },
                    { subCategory: { name: { contains: q, mode: 'insensitive' } } },
                ]
            } : {},
            include: {
                tutor: {
                    include: {
                        user: true
                    }
                },
                category: true,
                subCategory: true,
            },
            orderBy: { createdAt: 'desc' }
        });
        const formattedListings = listings.map(l => ({
            id: l.id,
            title: l.title,
            description: l.description,
            price: l.price,
            location: "India",
            tutor: {
                name: l.tutor?.user?.name ?? "Anonymous Tutor",
                qualification: l.tutor?.qualification ?? "Not specified",
                experience: l.tutor?.experience ?? 0,
                rating: l.tutor?.rating ?? 0,
                image: l.tutor?.user?.image ?? "",
            },
            category: l.category?.name ?? "General",
            subCategory: l.subCategory?.name ?? "Other",
            images: (l.images && l.images.length > 0) ? l.images : ["https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=800&q=80"],
            isFeatured: false
        }));
        res.json(formattedListings);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch listings" });
    }
};
export const getListingById = async (req, res) => {
    const id = req.params.id;
    try {
        const listing = await prisma.listing.findUnique({
            where: { id },
            include: {
                tutor: {
                    include: {
                        user: true
                    }
                },
                category: true,
                subCategory: true,
            }
        });
        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }
        const l = listing;
        const formattedListing = {
            id: l.id,
            title: l.title,
            description: l.description,
            price: l.price,
            location: "India",
            tutor: {
                name: l.tutor?.user?.name ?? "Anonymous Tutor",
                qualification: l.tutor?.qualification ?? "Not specified",
                experience: l.tutor?.experience ?? 0,
                rating: l.tutor?.rating ?? 0,
                image: l.tutor?.user?.image ?? "",
                bio: l.tutor?.bio ?? "",
                userId: l.tutor?.userId,
            },
            category: l.category?.name ?? "General",
            subCategory: l.subCategory?.name ?? "Other",
            subjects: l.subjects,
            images: (l.images && l.images.length > 0) ? l.images : ["https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=800&q=80"],
            isFeatured: false
        };
        res.json(formattedListing);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch listing" });
    }
};
export const createListing = async (req, res) => {
    const userId = req.headers["x-user-id"];
    const { title, description, price, category, images, } = req.body;
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        let user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    id: userId,
                    email: `${userId}@clerk.user`,
                    name: "New User",
                    role: "TUTOR"
                }
            });
        }
        let tutor = await prisma.tutor.findUnique({ where: { userId: user.id } });
        if (!tutor) {
            tutor = await prisma.tutor.create({
                data: {
                    userId: user.id,
                    bio: "New Tutor",
                    qualification: "N/A",
                    experience: 0,
                    hourlyRate: Number(price) || 0,
                }
            });
        }
        const parentCategoryName = "Education & Classes";
        const parentCategorySlug = "education-classes";
        const categoryRecord = await prisma.category.upsert({
            where: { slug: parentCategorySlug },
            update: {},
            create: { name: parentCategoryName, slug: parentCategorySlug }
        });
        const subCategorySlug = category.toLowerCase().replace(/\s+/g, '-');
        const subCategoryRecord = await prisma.subCategory.upsert({
            where: { id: `sc-${subCategorySlug}` },
            update: {},
            create: {
                id: `sc-${subCategorySlug}`,
                name: category.charAt(0).toUpperCase() + category.slice(1),
                slug: subCategorySlug,
                categoryId: categoryRecord.id
            }
        });
        const safePrice = parseFloat(price) || 0;
        const listing = await prisma.listing.create({
            data: {
                title,
                description,
                price: safePrice,
                tutorId: tutor.id,
                categoryId: categoryRecord.id,
                subCategoryId: subCategoryRecord.id,
                subjects: [category],
                images: Array.isArray(images) ? images : [],
            }
        });
        res.json(listing);
    }
    catch (error) {
        console.error("Error creating listing:", error);
        res.status(500).json({ error: "Failed to create listing" });
    }
};
export const updateListing = async (req, res) => {
    const id = req.params.id;
    const userId = req.headers["x-user-id"];
    const { title, description, price, images } = req.body;
    if (!userId)
        return res.status(401).json({ error: "Unauthorized" });
    try {
        const listing = await prisma.listing.findUnique({
            where: { id },
            include: { tutor: true }
        });
        if (!listing)
            return res.status(404).json({ error: "Listing not found" });
        if (listing.tutor.userId !== userId)
            return res.status(403).json({ error: "Forbidden" });
        const safePrice = parseFloat(price) || 0;
        const updatedListing = await prisma.listing.update({
            where: { id },
            data: {
                title,
                description,
                price: safePrice,
                images: Array.isArray(images) ? images : listing.images,
            }
        });
        res.json(updatedListing);
    }
    catch (error) {
        console.error("Error updating listing:", error);
        res.status(500).json({ error: "Failed to update listing" });
    }
};
export const deleteListing = async (req, res) => {
    const id = req.params.id;
    const userId = req.headers["x-user-id"];
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const listing = await prisma.listing.findUnique({
            where: { id },
            include: { tutor: true }
        });
        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }
        if (listing.tutor.userId !== userId) {
            return res.status(403).json({ error: "Forbidden: You do not own this listing" });
        }
        await prisma.listing.delete({
            where: { id }
        });
        res.json({ message: "Listing deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete listing" });
    }
};
//# sourceMappingURL=listingController.js.map