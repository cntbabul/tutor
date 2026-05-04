import type { Request, Response } from "express";
export declare const getListings: (req: Request, res: Response) => Promise<void>;
export declare const getListingById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createListing: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateListing: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteListing: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=listingController.d.ts.map