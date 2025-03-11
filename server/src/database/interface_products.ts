import { ObjectId } from "mongodb";
import type { House, HouseID, Product, ProductID, User, UserID } from "../types/database";
import { db_con } from "./connection"
import { DB_COLLECTION_PRODUCTS } from "./info";
import { db_user_get_by_id } from "./interface_users";
import { tg_is_product } from "../types/database_typeguards";

// Creates a product, and returns the ID
export const db_product_insert = async (p_house: Omit<Product, "_id">): Promise<ProductID> =>
{
    try
    {
        return (await db_con.collection(DB_COLLECTION_PRODUCTS).insertOne(p_house)).insertedId;
    }
    catch (e)
    {
        console.error(e);
        throw new Error("Failed to create product");
    }
}

// Gets user from db using id
export const db_product_get_by_id = async (p_id: ProductID): Promise<Product | undefined> =>
{
    try
    {
        // Fetch
        const raw = await db_con.collection(DB_COLLECTION_PRODUCTS).findOne({ _id: p_id });

        // No product found
        if (!tg_is_product(raw)) return undefined;

        return raw;
    }
    catch (e)
    {
        console.error(e);
        throw new Error("Failed to retrieve product");
    }
}

// Gets product by name, for a specific user
export const db_product_get_by_name = async (p_user: UserID, p_name: string): Promise<Product | undefined> =>
{
    try
    {
        // Fetch
        const raw = await db_con.collection(DB_COLLECTION_PRODUCTS).findOne({ owner_id: p_user, name: p_name });

        // No product found
        if (!tg_is_product(raw)) return undefined;

        return raw;
    }
    catch (e)
    {
        console.error(e);
        throw new Error("Failed to retrieve product");
    }
}