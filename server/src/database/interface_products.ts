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

        return raw as Product;
    }
    catch (e)
    {
        console.error(e);
        throw new Error("Failed to retrieve product");
    }
}