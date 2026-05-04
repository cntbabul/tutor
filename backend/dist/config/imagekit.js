import ImageKit from "@imagekit/nodejs";
import dotenv from "dotenv";
dotenv.config();
const options = {
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
};
const imagekit = new ImageKit(options); // ImageKit constructor still needs 'any' or their specific type, but we validated the options.
export default imagekit;
//# sourceMappingURL=imagekit.js.map