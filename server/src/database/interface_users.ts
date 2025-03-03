import { ObjectId } from "mongodb";
import type { User } from "../types/database";
import { db_con } from "./connection"
import { DB_COLLECTION_USERS } from "./info";

// For now this just directly returns the promise, in the future
// it may check for different errors, such as dupe email (most likely will be the cause of errors)
export const db_user_insert = async (p_user: Omit<User, "id">) =>
{
    return db_con.collection(DB_COLLECTION_USERS).insertOne(p_user);
}

// Gets user from db using id
export const db_user_get_by_id = async (p_id: string): Promise<User | undefined> =>
{
    try
    {
        // Fetch
        const raw = await db_con.collection(DB_COLLECTION_USERS).findOne({ _id: new ObjectId(p_id) });

        // No use found
        if (!raw) return undefined;

        // This should never happen (so long as we keep the code safe), but to be safe
        if (!raw.email || !raw.password) throw new Error("User has an invalid record");

        const user: User =
        {
            id: raw._id.toHexString(),
            email: raw.email,
            password: raw.password
        };

        return user;
    }
    catch (e)
    {
        console.error(e);
        throw new Error("Failed to retrieve user");
    }
}

// Gets user from db using id
export const db_user_get_by_email = async (p_email: string): Promise<User | undefined> =>
{
    try
    {
        // Fetch
        const raw = await db_con.collection(DB_COLLECTION_USERS).findOne({ email: p_email });

        // No use found
        if (!raw) return undefined;

        // This should never happen (so long as we keep the code safe), but to be safe
        if (!raw.email || !raw.password) throw new Error("User has an invalid record");

        const user: User =
        {
            id: raw._id.toHexString(),
            email: raw.email,
            password: raw.password
        };

        return user;
    }
    catch (e)
    {
        console.error(e);
        throw new Error("Failed to retrieve user");
    }
}

db_user_get_by_id("67c6251e8501696ea98ae677").then(console.log)
db_user_get_by_email("bingus").then(console.log)