import { NextFunction, Request, Response, response } from "express";
import bcrypt from "bcryptjs"
import jwt, { VerifyErrors } from "jsonwebtoken"
import db from "../models/mongoosedb"
import secretKey from "../config/auth.config"
import tokenKeys from "../config/auth.config";

const User = db.users;

const refreshTokens: string[] = [];

async function signUp(req: Request, res: Response) {
    const user = new User({
        userName: req.body.userName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
    });

    try {
        await user.save();
        console.log("User Saved: ", user);
        res.send({ message: "User Saved" })
    } catch (err) {
        res.status(500).send({ message: err });
    }
}

async function signIn(req: Request, res: Response) {
    try {

        const findUser = await User.findOne({
            email: req.body.email
        }).exec();

        if (!findUser) {
            return res.status(404).send({ message: "User Not found." });
        }

        const isPasswordValid = bcrypt.compareSync(
            req.body.password,
            findUser.password
        );

        if (!isPasswordValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }

        const token = jwt.sign({ id: findUser._id }, tokenKeys.secretKey, { expiresIn: 30 * 60 });
        const refreshToken = jwt.sign({ id: findUser._id }, tokenKeys.refreshSecretKey, { expiresIn: 86400 });
        refreshTokens.push(refreshToken);

        res.status(200).send({
            id: findUser._id,
            userName: findUser.userName,
            email: findUser.email,
            accessToken: token,
            refreshToken: refreshToken
        })
    } catch (err) {
        res.status(500).send({ message: err, message2: "From catch" })
    }

}

async function refreshTokenCheck(req: Request, res: Response) {
    const refreshToken = req.headers['x-access-token'] as string;
    console.log("Into Refresh");
    if (refreshToken == null) return res.status(401).send({ message: "Found no refresh token" });
    if (!refreshTokens.includes(refreshToken)) return res.status(403).send({ message: "Refresh token not matched" });

    try {
        const decodedRefreshToken = jwt.verify(refreshToken, tokenKeys.refreshSecretKey) as jwt.JwtPayload;
        const accessToken = generateAccessToken(decodedRefreshToken.id, 10);
        res.status(201).send(accessToken);

    } catch (error) {
        return res.status(403).send({ message: "Invalid Refresh Token. Log In Again" });
    }

}

export function generateAccessToken(userId: any, expireTime: number) {
    return jwt.sign({ id: userId }, tokenKeys.secretKey, { expiresIn: expireTime });
}

const signController = {
    signIn,
    signUp,
    refreshTokenCheck
}
export default signController;


