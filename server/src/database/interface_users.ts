import { ObjectId } from "mongodb";
import type { User, UserID } from "../types/database";
import { db_con } from "./connection"
import { DB_COLLECTION_USERS } from "./info";
import { tg_is_user } from "../types/database_typeguards";

// For now this just directly returns the promise, in the future
// it may check for different errors, such as dupe email (most likely will be the cause of errors)
export const db_user_insert = async (p_user: Omit<User, "_id">): Promise<UserID> =>
{
    try
    {
        return (await db_con.collection(DB_COLLECTION_USERS).insertOne(p_user)).insertedId;
    }
    catch (e)
    {
        console.error(e);
        throw new Error("Failed to create user");
    }
}

// Gets user from db using id
export const db_user_get_by_id = async (p_id: UserID): Promise<User | undefined> =>
{
    try
    {
        // Fetch
        const raw = await db_con.collection(DB_COLLECTION_USERS).findOne({ _id: p_id });

        // No user found
        if (!raw) return undefined;

        // This should never happen (so long as we keep the code safe), but to be safe
        if (!tg_is_user(raw)) throw new Error("User has an invalid record");

        return raw;
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
        if (!tg_is_user(raw)) throw new Error("User has an invalid record");

        return raw;
    }
    catch (e)
    {
        console.error(e);
        throw new Error("Failed to retrieve user");
    }
}