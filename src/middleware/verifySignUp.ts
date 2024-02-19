import { NextFunction, Request, Response } from "express";
import db from "../models/mongoosedb";


const users = db.users;



const checkDuplicateUserOrEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await users.findOne({ userName: req.body.userName }).exec();
        if (user) {
            res.status(400).send({ message: "Failed! Username is already in use!" });
            return;
        }
        const email = await users.findOne({ email: req.body.email })
        if (email) {
            res.status(400).send({ message: "Failed! Email is already in use!" });
            return;
        }

        next();
    }
    catch (err) {
        res.status(500).send({ message: err });
        return;
    }
}

export default checkDuplicateUserOrEmail;