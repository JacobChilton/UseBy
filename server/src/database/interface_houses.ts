import { ObjectId } from "mongodb";
import type { House, HouseID, User, UserID } from "../types/database";
import { db_con } from "./connection"
import { DB_COLLECTION_HOUSES, DB_COLLECTION_USERS, DB_NAME } from "./info";
import { db_user_get_by_id } from "./interface_users";

// For now this just directly returns the promise
export const db_house_insert = async (p_house: Omit<House, "_id">) =>
{
    try
    {
        return await db_con.collection(DB_COLLECTION_HOUSES).insertOne(p_house);
    }
    catch (e)
    {
        console.error(e);
        throw new Error("Failed to create house");
    }
}

// Gets all members of a house excluding the owner
// Will error if the house does not exist
export const db_house_get_members = async (p_id: HouseID): Promise<Array<User>> =>
{
    try
    {
        // Fetch house
        const raw = await db_con.collection(DB_COLLECTION_HOUSES).findOne({ _id: p_id });

        // No house found
        if (!raw) throw new Error("House not found");

        // Find all the users inside the house
        const raw_user_ids: Array<UserID> = raw.members;

        // Get all user objects from the array of their ids
        const users = await db_con.collection(DB_COLLECTION_USERS).find({ _id: { $in: raw_user_ids } }).toArray();

        return users as Array<User>;
    }
    catch (e)
    {
        console.error(e);
        throw new Error("Failed to retrieve members");
    }
}

// Add a member to a house, will silently ignore if the user is already in the house
// will error if the user or house does not exist
export const db_house_add_member = async (p_house: HouseID, p_user: UserID) =>
{
    try
    {
        // Check user exists
        const user = await db_user_get_by_id(p_user);

        if (!user) throw new Error("User not found");

        // There is a possibility that a user could be deleted between here and the call below
        // I need to do this inside a transaction, but for now this will work

        // Adds a member to the house
        const result = await db_con.collection(DB_COLLECTION_HOUSES).updateOne({ _id: p_house }, { $addToSet: { members: p_user } });

        if (result.matchedCount === 0) throw new Error("House not found");
    }
    catch (e)
    {
        console.error(e);
        throw new Error("Failed to add member to house");
    }
}

// Remove a house
export const db_house_delete = async (p_id: HouseID) =>
{
    try
    {
        // Deletes any products under this house
        //await db_con.collection(DB_)

        // Deletes the house
        await db_con.collection(DB_COLLECTION_HOUSES).deleteOne({ _id: p_id })
    }
    catch (e)
    {
        console.error(e);
        throw new Error("Failed to delete house");
    }
}