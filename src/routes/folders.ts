import express, { Express, Request, Response } from "express";
import { getDb } from "../../data/database";
import multer from "multer";
import controller from "../controller/file.controller";
import * as fs from 'fs';

const router = express.Router();

// Create a Multer instance with a destination folder for file uploads
// const upload = multer({ dest: "./FileUploads/" });

interface folderObject {
  name: string;
  parent: string;
}

router.get("/folders/:parent", async function (req: Request, res: Response) {
  const parentName = req.params.parent;
  const folders = await getDb()
    .collection("folders")
    .find({ parent: parentName })
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
    .find({ parent: parentName })
    .toArray();

  res.send(files);
});

//// Upload File////

router.get('/file/:filename', async (req, res) => {
  const fileName = req.params.filename;

  const file = await getDb()
    .collection("files")
    .findOne({ filename: fileName });

  if (!file) {
    res.send("Couldn't Find File");
    return;
  }

  const filePath = file.path;

  const stream = fs.createReadStream(filePath);

  res.setHeader('Content-Type', "multipart/form-data");
  res.setHeader('Content-Disposition', `inline; filename= ${file.originalname}`);

  stream.pipe(res);
});

router.post(
  "/folders/delete/:name",
  async function (req: Request, res: Response) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    const folderName = req.params.name;

    const deleteChild = await getDb()
      .collection("folders")
      .deleteMany({ parent: folderName });

    const deleteFolder = await getDb()
      .collection("folders")
      .deleteMany({ name: folderName });

    console.log("deleteChild:" + deleteChild);
    console.log("deletefolder:" + deleteFolder);
    res.send("Deleted");
  }
);

router.post("/folders/addfolder", async function (req: Request, res: Response) {
  const obj: folderObject = req.body;
  await getDb()
    .collection("folders")
    .insertOne({ name: obj.name, parent: obj.parent });
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
