import jwt from "jsonwebtoken"
import secretKey from "../config/auth.config"
import db from "../models/mongoosedb"
import { Request, Response, NextFunction } from "express";
import tokenKeys from "../config/auth.config";

const user = db.users;
const { TokenExpiredError } = jwt;


function verifyToken(req: Request, res: Response, next: NextFunction) {
    let token = req.headers["x-access-token"] as string;

    if (!token) {
        return res.status(403).send({ message: "No Token Provided" });
    }
    try {
        const decodedToken = jwt.verify(token, tokenKeys.secretKey);
        // res.send(decodedToken);


    } catch (err) {
        if (err instanceof TokenExpiredError) {
            return res.status(403).send("Unauthorized! Access Token was expired!");
        }
        return res.status(401).send("Unauthorized TOken");
    }
    next();

}

export default verifyToken;