import { Picture, PictureID, UserID } from "../types/database";
import { tg_is_picture } from "../types/database_typeguards";
import { db_con } from "./connection";
import { DB_COLLECTION_PICTURES } from "./info";


// Returns the created id
export const db_picture_insert = async (p_base64: string, p_user: UserID): Promise<PictureID> =>
{
    const insert: Partial<Picture> =
    {
        b64: p_base64,
        owner_id: p_user
    }

    try
    {
        return (await db_con.collection(DB_COLLECTION_PICTURES).insertOne(insert)).insertedId;
    }
    catch (e)
    {
        console.error(e);
        throw new Error("failed to upload image data");
    }
}

export const db_picture_delete_by_user = async (p_user: UserID): Promise<void> =>
{
    const deleter: Partial<Picture> =
    {
        owner_id: p_user
    }

    try
    {
        await db_con.collection(DB_COLLECTION_PICTURES).deleteMany(deleter);
    }
    catch (e)
    {
        console.error(e);
        throw new Error("failed to delete image data");
    }
}


export const db_picture_get_by_user_id = async (p_id: UserID): Promise<Picture | undefined> =>
{
    try
    {
        // Fetch
        const raw = await db_con.collection(DB_COLLECTION_PICTURES).findOne({ owner_id: p_id });

        // No product found
        if (!tg_is_picture(raw)) return undefined;

        return raw;
    }
    catch (e)
    {
        console.error(e);
        throw new Error("failed to retrieve picture");
    }
}