import { db_con } from "./connection"
import { DB_COLLECTION_USERS } from "./info"

// Ensures database is setup, such as indexes
// I believe mongo will create any databases/collections we use if they
// do not exist at the time
export const db_setup = async () =>
{
    const collection = db_con.collection(DB_COLLECTION_USERS);

    // Ensure emails are unique
    // Returning it, this function should be within trycatch / caught
    return collection.createIndex({ email: 1 }, { unique: true });
}

db_setup();