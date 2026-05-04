import imagekit from "../config/imagekit.js";
export const getImageKitAuth = (req, res) => {
    try {
        const result = imagekit.helper.getAuthenticationParameters();
        res.json(result);
    }
    catch (error) {
        console.error("ImageKit Auth Error:", error);
        res.status(500).json({ error: "Failed to generate auth parameters" });
    }
};
//# sourceMappingURL=imagekitController.js.map