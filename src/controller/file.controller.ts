// Configuring the Upload for POST Route

import uploadFile from "../middleware/upload";
import { Request, Response } from "express";

const upload = async (req: Request, res: Response) => {
    try {
        await uploadFile(req, res);

        if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }

        console.log(req.file);
        console.log(req.body);
        const obj = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }

        console.log(obj); // { title: 'product' }
        console.log(obj.parent);



        res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
        });
    } catch (err) {
        res.status(500).send({
            message: `Could not upload the file:`,
        })
    }
}

const controller = {
    upload,
}

export default controller;