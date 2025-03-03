import { MongoClient } from "mongodb";

// Replace the uri string with your connection string.
const uri = "mongodb://mongo:password@localhost:27017";
const client = new MongoClient(uri);


// Its fine to just use this everywhere for this
// for testing we can replace this if needed to a new db
export const db_con = client.db("useby");