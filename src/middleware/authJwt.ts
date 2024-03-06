import jwt, { JwtPayload } from "jsonwebtoken"
import secretKey from "../config/auth.config"
import db from "../models/mongoosedb"
import { Request, Response, NextFunction } from "express";
import tokenKeys from "../config/auth.config";

const user = db.users;
const { TokenExpiredError } = jwt;

export let userId: string = "1";


export function verifyToken(req: Request, res: Response, next: NextFunction) {
    let token = req.headers["x-access-token"] as string;

    if (!token) {
        return res.status(403).send({ message: "No Token Provided" });
    }
    try {
        const decodedToken = jwt.verify(token, tokenKeys.secretKey) as JwtPayload;
        // console.log(decodedToken.id);
        userId = decodedToken.id as string;
        if (userId === "1") return;
        // res.send(decodedToken);
        


    } catch (err) {
        if (err instanceof TokenExpiredError) {
            return res.status(401).send();
        }
        return res.status(401).send({message: "Unauthorized Token"});
    }
    next();

}

export function verifyRefreshToken(req: Request, res: Response, next: NextFunction){
    const {refreshToken} = req.body;
    // console.log(req.body);

    if(!refreshToken){
        return res.status(403).send("No Refresh Token");
    }
    try{
        const decodedToken = jwt.verify(refreshToken, tokenKeys.refreshSecretKey) as JwtPayload;
        const userId = decodedToken.id as string;
        const token = jwt.sign({ id: userId }, tokenKeys.secretKey, { expiresIn: 60 });
        const newRefreshToken = jwt.sign({ id: userId }, tokenKeys.refreshSecretKey, { expiresIn: 60*30 });

        res.status(200).send({
            accessToken: token,
            refreshToken: newRefreshToken
        })
        // return;

    }catch(err){
        if(err instanceof TokenExpiredError){
            return res.status(403).send("Refresh Token Expired");
        }
        return res.status(401).send("Invalide Refresh Token");
    }

    next();
}

// export default verifyToken;