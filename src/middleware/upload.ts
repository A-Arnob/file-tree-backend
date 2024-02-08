// Middleware for file upload
// configuring multer


import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import util from "util";

const maxSize = 10 * 1024 * 1024;

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;


const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    callback: DestinationCallback
  ): void => {
    // Define your destination folder logic here
    // For example:
    callback(null, "./FileUploads/");
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    callback: FileNameCallback
  ): void => {
    // Define your filename logic here
    // For example, using a unique timestamp:
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    callback(null, file.originalname + "-" + uniqueSuffix);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);

export default uploadFileMiddleware;
