import { v2 as cloudinary } from 'cloudinary';
export { cloudinary };
export declare function uploadToCloudinary(file: Express.Multer.File, folder?: string): Promise<{
    url: string;
    publicId: string;
}>;
export declare function deleteFromCloudinary(publicId: string): Promise<void>;
