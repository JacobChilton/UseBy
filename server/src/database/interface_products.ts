import { ObjectId } from "mongodb";
import type { House, HouseID, Product, ProductID, User, UserID } from "../types/database";
import { db_con } from "./connection"
import { DB_COLLECTION_PRODUCTS } from "./info";
import { db_user_get_by_id } from "./interface_users";

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