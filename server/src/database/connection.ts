import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import path from "path"

// Putting this here, incase the file is called from other than index
dotenv.config({ path: path.join(__dirname, "../../.env") });

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const protocol = process.env.DB_PROTOCOL;

// Replace the uri string with your connection string.
const uri = `${protocol}://${username}:${password}@${host}${port ? ":" + port : ""}`;

console.log(uri)
const client = new MongoClient(uri);


// Its fine to just use this everywhere for this
// for testing we can replace this if needed to a new db
export const db_con = client.db("useby");