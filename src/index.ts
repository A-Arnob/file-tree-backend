// src/index.ts
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
// import mongoose from "mongoose";
import { connectToDatabase, getDb } from "../data/database";
import router from "./routes/folders";
import cors from "cors";
import bodyParser from "body-parser";

// const db = connectToDatabase;

/*
 * Load up and parse configuration details from
 * the `.env` file to the `process.env`
 * object of Node.js
 */
dotenv.config();

/*
 * Create an Express application and get the
 * value of the PORT environment variable
 * from the `process.env`
 */
const app: Express = express();
// const port = process.env.PORT || 3000;
const port = 8080;

app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(express.json());
app.use(bodyParser.json());

/* Define a route for the root path ("/")
 using the HTTP GET method */

app.get("/", (req: Request, res: Response) => {
  res.send("My Server");
});

app.use(router);

/* Start the Express app and listen
 for incoming requests on the specified port */

connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
});
