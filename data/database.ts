import mongodb, { MongoClient } from "mongodb";

let database: mongodb.Db;

// const mongoClient = mongodb?.MongoClient;

async function connectToDatabase() {
  const client = await MongoClient.connect("mongodb://localhost:27017");
  database = client.db("file-demoNew");
}

function getDb() {
  if (!database) {
    throw { message: "Database not connected!" };
  }
  return database;
}

export { getDb, connectToDatabase };
