import { ObjectId } from "mongodb";
import { House, Product, User } from "./database";

// These will be quite explicit, as i do not trust
// mongo

// Each one returns true if the passed object is the correct type

export const tg_is_user = (p_obj: any): p_obj is User =>
{
    return p_obj._id instanceof ObjectId &&
        typeof p_obj.email === "string" &&
        typeof p_obj.password === "string";
}

export const tg_is_product = (p_obj: any): p_obj is Product =>
{
    return p_obj._id instanceof ObjectId &&
        typeof p_obj.upc === "string" &&
        p_obj.owner_id instanceof ObjectId &&
        p_obj.house_id instanceof ObjectId &&
        typeof p_obj.name === "string" &&
        p_obj.use_by instanceof Date &&
        !isNaN(p_obj.quantity)
}

export const tg_is_house = (p_obj: any): p_obj is House =>
{
    return p_obj._id instanceof ObjectId &&
        typeof p_obj.name === "string" &&
        p_obj.owner_id instanceof Object &&
        p_obj.members instanceof Array &&
        (p_obj.members as Array<unknown>).reduce<boolean>((prev, curr) => prev && curr instanceof ObjectId, true)
}