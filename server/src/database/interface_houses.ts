import { ObjectId } from "mongodb";
import type { House, HouseID, User, UserID } from "../types/database";
import { db_con } from "./connection"
import { DB_COLLECTION_HOUSES, DB_COLLECTION_USERS, DB_NAME } from "./info";
import { db_user_get_by_id } from "./interface_users";
import { tg_is_house, tg_is_user } from "../types/database_typeguards";
import { db_product_delete_by_house_id } from "./interface_products";
import { std_response } from "../util/standard_response";

// For now this just directly returns the promise
export const db_house_insert = async (p_house: Omit<House, "_id">): Promise<HouseID> =>
{
    try
    {
        return (await db_con.collection(DB_COLLECTION_HOUSES).insertOne(p_house)).insertedId;
    }
    catch (e)
    {
        console.error(e);
        throw new Error("failed to create house");
    }
}

export const db_house_get_by_id = async (p_id: HouseID): Promise<House | undefined> =>
{
    try
    {
        // Fetch
        const raw = await db_con.collection(DB_COLLECTION_HOUSES).findOne({ _id: p_id });

        // No product found
        if (!tg_is_house(raw)) return undefined;

        return raw;
    }
    catch (e)
    {
        console.error(e);
        throw new Error("failed to retrieve house");
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

        // Check each user is valid
        if (!users.every(tg_is_user)) throw new Error("invalid user retrieved");

        return users;
    }
    catch (e)
    {
        console.error(e);
        throw new Error("failed to retrieve members");
    }
}

// Add a member to a house, will silently ignore if the user is already in the house
// will error if the user or house does not exist
export const db_house_member_add = async (p_house: HouseID, p_user: UserID) =>
{
    try
    {
        // Check user exists
        const user = await db_user_get_by_id(p_user);

        if (!user) throw new Error("user not found");

        // There is a possibility that a user could be deleted between here and the call below
        // I need to do this inside a transaction, but for now this will work

        // Adds a member to the house
        const result = await db_con.collection(DB_COLLECTION_HOUSES).updateOne({ _id: p_house }, { $addToSet: { members: p_user } });

        if (result.matchedCount === 0) throw new Error("house not found");
    }
    catch (e)
    {
        console.error(e);
        throw new Error("failed to add member to house");
    }
}

// Remove a house
export const db_house_delete = async (p_id: HouseID) =>
{
    try
    {
        // Deletes any products under this house
        await db_product_delete_by_house_id(p_id)

        // Deletes the house
        await db_con.collection(DB_COLLECTION_HOUSES).deleteOne({ _id: p_id })
    }
    catch (e)
    {
        console.error(e);
        throw new Error("failed to delete house");
    }
}

// Gets house from db using house name and owner id
export const db_house_get_by_name_and_owner_id = async (p_name: string, p_owner_id: UserID): Promise<House | undefined> =>
{
    try
    {
        // Fetch
        const raw = await db_con.collection(DB_COLLECTION_HOUSES).findOne({ name: p_name, owner_id: p_owner_id });

        // No house found
        if (!tg_is_house(raw)) return undefined;

        return raw;
    }
    catch (e)
    {
        console.error(e);
        throw new Error("failed to retrieve house");
    }
}

// Gets any houses the owner is a member of, or owns
export const db_house_get_user_houses = async (p_user: UserID): Promise<Array<House>> =>
{
    try
    {
        // Fetch
        const raw = await db_con.collection(DB_COLLECTION_HOUSES).find(
            {
                // If any of these conditions are satisfied
                $or:
                    [
                        // If owns
                        { owner_id: p_user },
                        // If member
                        { members: p_user }
                    ]
            }).toArray();

        // Check each house is valid
        if (!raw.every(tg_is_house))
        {
            console.error("invalid house object encountered")
            throw new Error("failed to retrieve houses")
        }

        return raw;
    }
    catch (e)
    {
        console.error(e);
        throw new Error("failed to retrieve houses");
    }
}

export const db_house_member_remove = async (p_house: HouseID, p_user: UserID) =>
{
    try
    {
        // Check user exists
        const user = await db_user_get_by_id(p_user);

        if (!user) throw new Error("user not found");

        // There is a possibility that a user could be deleted between here and the call below
        // I need to do this inside a transaction, but for now this will work

        // Remove a member from the house
        const result = await db_con.collection<House>(DB_COLLECTION_HOUSES).updateOne({ _id: p_house }, { $pull: { members: user._id } });

        if (result.matchedCount === 0) throw new Error("house not found");
    }
    catch (e)
    {
        console.error(e);
        throw new Error("failed to add member to house");
    }
}

// Will check if the name already exists
export const db_house_name_patch = async (p_house: HouseID, p_name: string, p_user: UserID) =>
{
    try
    {
        // Check house name does not already exists
        if (await db_house_get_by_name_and_owner_id(p_name, p_user))
        {
            throw new Error("house name already exists")
        }

        // There may need to be some check after this, but its fine for now
        await db_con.collection<House>(DB_COLLECTION_HOUSES)
            .updateOne({ _id: p_house }, { $set: { name: p_name } });
    }
    catch (e)
    {
        throw e
    }
}

