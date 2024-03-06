import express, { Express, NextFunction, Request, Response } from "express";
import { getDb } from "../../data/database";
import multer from "multer";
import controller from "../controller/file.controller";
import * as fs from 'fs';
import verifySignUp from "../middleware/verifySignUp";
import signController from "../controller/signUpSignIn.controller";
import {verifyRefreshToken, verifyToken} from "../middleware/authJwt";

import { userId } from "../middleware/authJwt";

const router = express.Router();

// Create a Multer instance with a destination folder for file uploads
// const upload = multer({ dest: "./FileUploads/" });

interface folderObject {
  name: string;
  parent: string;
}




////////Authorization////////

router.post("/signup", verifySignUp.checkDuplicateUserOrEmail, signController.signUp);

router.post("/signin", signController.signIn);

router.post("/token", signController.refreshTokenCheck);

router.get("/test/user", verifyToken);

router.post("/refreshtoken", verifyRefreshToken);


router.use(verifyToken);



router.get("/folders/:parent", async function (req: Request, res: Response) {

  const parentName = req.params.parent;
  const folders = await getDb()
    .collection("folders")
    .find({ parent: parentName, user: userId })
    .toArray();

  const files = await getDb()
    .collection("files")
    .find({ parent: parentName })
    .toArray();

  res.send(folders);
});

router.get("/files/:parent", async function (req: Request, res: Response) {
  const parentName = req.params.parent;

  const files = await getDb()
    .collection("files")
    .find({ parent: parentName, user: userId })
    .toArray();

  const filteredFiles = files.map(({ path, ...rest }) => { return rest; })

  res.send(filteredFiles);
});

//// Upload File////

router.get('/file/:filename', async (req, res) => {
  const fileName = req.params.filename;

  const file = await getDb()
    .collection("files")
    .findOne({ name: fileName,  user: userId });

  if (!file) {
    res.send("Couldn't Find File");
    return;
  }

  const filePath = file.path;

  // const stream = fs.createReadStream(filePath);

  // res.setHeader('Content-Type', "multipart/form-data");
  // res.setHeader('Content-Disposition', `inline; filename= ${file.originalname}`);
  // res.setHeader('Content-Disposition', 'attachment');

  // stream.pipe(res);

  res.download(filePath);
});


// async function deleteNestedFiles(folderOriginalName: string) {
//   const childsList = await getDb().collection("files").find({ parent: folderOriginalName }).toArray();

//   if (childsList.length > 0) {
//     childsList.map((file) => deleteNestedFiles())
//   }
// }

async function deleteFolder(folderName: string) {
  const childsList = await getDb().collection("folders").find({ parent: folderName }).toArray();
  const childFileList = await getDb().collection("files").find({ parent: folderName }).toArray();

  childFileList.map((file) => deleteFile(file.name));

  if (childsList.length > 0) {
    childsList.map((folder) => deleteFolder(folder.name))
  }
  console.log("Deleted Folder: " + folderName);

  return await getDb()
    .collection("folders")
    .deleteMany({ name: folderName });

}

router.post(
  "/folders/delete/:name",
  async function (req: Request, res: Response) {
    const folderName = req.params.name;

    deleteFolder(folderName);
    res.send("Deleted");
  }
);

async function deleteFile(fileName: string) {
  const fileForDelete = await getDb().collection("files").deleteOne({ name: fileName });

  const filePath = `./FileUploads/${fileName}`;

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting the file:', err);
    } else {
      console.log('File deleted successfully!');
    }
  });

  console.log("File Deleted: " + fileName);
}

router.post("/file/delete/:filename", async function (req: Request, res: Response) {
  const fileName = req.params.filename;

  deleteFile(fileName);
  res.send("File Deleted");

})

router.post("/folders/addfolder", async function (req: Request, res: Response) {
  const obj: folderObject = req.body;

  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const uniqueName = uniqueSuffix + "-" + obj.name;

  console.log(obj);

  await getDb()
    .collection("folders")
    .insertOne({ originalName: obj.name, name: uniqueName, parent: obj.parent, user: userId });
  console.log(obj);
  res.send("Object received");
});

//File Uploades

// router.post("/fileupload", upload.single("file"), (req, res) => {
//   try {
//     // Access the uploaded file using req.file
//     console.log(req.file);
//     return res.status(201).send({ message: "File uploaded successfully" });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send({ error: "Error uploading file" });
//   }
// });

router.post("/fileupload", controller.upload);










export default router;
