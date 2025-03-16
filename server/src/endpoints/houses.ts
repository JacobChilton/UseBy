import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { auth } from "../auth/endpoints";
import { db_house_delete, db_house_get_by_id, db_house_get_by_name_and_owner_id, db_house_get_user_houses, db_house_insert, db_house_member_add, db_house_member_remove, db_house_name_update } from "../database/interface_houses";
import { House, User } from "../types/database";
import { exists } from "../util/bingus";
import { HTTP } from "../util/http";
import { std_response } from "../util/standard_response";
import { db_user_get_by_id } from "../database/interface_users";

// Creates a new house belonging to logged in user
export const ep_houses_post = auth(async (req: Request, res: Response, user: User) =>
{
    try
    {
        if (await db_house_get_by_name_and_owner_id(req.body.name, user._id))
        {
            std_response(res, HTTP.CONFLICT, { error: "house already exists" });
            return;
        }


        // Construct the new house, we do not know ID yet so it is ommited
        const house: Omit<House, "_id"> =
        {
            name: req.body.name,
            owner_id: user._id,
            members: []
        };

        // Insert the house into the database
        const id = await db_house_insert(house);

        // Send user the new house id
        std_response(res, HTTP.CREATED, { house_id: id.toHexString() });
    }
    catch (e)
    {

        std_response(res, HTTP.INTERNAL_SERVER_ERROR, { error: "error creating house" });
        console.error(e);
    }
})

// Creates a new house belonging to logged in user
export const ep_house_get_for_user = auth(async (req: Request, res: Response, user: User) =>
{
    try
    {
        const houses = await db_house_get_user_houses(user._id)
        std_response(res, HTTP.OK, houses);
    }
    catch (e)
    {

        std_response(res, HTTP.INTERNAL_SERVER_ERROR, { error: "error fetching houses" });
        console.error(e);
    }
})

// Add member to house
export const ep_house_member_add = auth(async (req: Request, res: Response, user: User) =>
{
    if (!exists(req.body, "user_id"))
    {
        std_response(res, HTTP.BAD_REQUEST, { error: "missing params" });
        return;
    }

    if (!exists(req.params, "house_id"))
    {
        std_response(res, HTTP.BAD_REQUEST, { error: "missing params" });
        return;
    }

    try
    {
        // Check both exist
        if (!ObjectId.isValid(req.params.house_id) || !await db_house_get_by_id(new ObjectId(req.params.house_id)))
        {
            std_response(res, HTTP.NOT_FOUND, { error: "house not found" });
            return;
        }
        if (!ObjectId.isValid(req.body.user_id) || !await db_user_get_by_id(new ObjectId(req.body.user_id as string)))
        {
            std_response(res, HTTP.NOT_FOUND, { error: "user not found" });
            return;
        }

        // Try to add the member
        await db_house_member_add(new ObjectId(req.params.house_id), new ObjectId(req.body.user_id as string))
        std_response(res, HTTP.OK, { message: "success" });
    }
    catch (e)
    {
        // Could not add the member
        std_response(res, HTTP.INTERNAL_SERVER_ERROR, { error: "error adding member to house" });
        console.error(e);
    }
})

// Remove member from house
export const ep_house_member_remove = auth(async (req: Request, res: Response, user: User) =>
{
    if (!exists(req.params, "house_id", "user_id"))
    {
        std_response(res, HTTP.BAD_REQUEST, { error: "missing params" });
        return;
    }

    try
    {
        // Check both exist
        if (!ObjectId.isValid(req.params.house_id) || !await db_house_get_by_id(new ObjectId(req.params.house_id)))
        {
            std_response(res, HTTP.NOT_FOUND, { error: "house not found" });
            return;
        }


        if (!ObjectId.isValid(req.params.user_id) || !await db_user_get_by_id(new ObjectId(req.params.user_id)))
        {
            std_response(res, HTTP.NOT_FOUND, { error: "user not found" });
            return;
        }

        // Try to remove the member
        await db_house_member_remove(new ObjectId(req.params.house_id), new ObjectId(req.params.user_id))
        std_response(res, HTTP.OK, { message: "success" });
    }
    catch (e)
    {
        // Could not remove the member
        std_response(res, HTTP.INTERNAL_SERVER_ERROR, { error: "failed removing member from house" });
        console.error(e);
    }
})

// Remove member from house
export const ep_house_delete = auth(async (req: Request, res: Response, user: User) =>
{
    try
    {
        // Check house exists
        if (!ObjectId.isValid(req.params.house_id) || !await db_house_get_by_id(new ObjectId(req.params.house_id)))
        {
            std_response(res, HTTP.NOT_FOUND, { error: "house not found" });
            return;
        }

        // Remove house
        db_house_delete(new ObjectId(req.params.house_id))
        std_response(res, HTTP.OK, { message: "success" });
    }
    catch (e)
    {
        // Could not delete the house
        std_response(res, HTTP.INTERNAL_SERVER_ERROR, { error: "failed deleting house" });
        console.error(e);
    }
})

// Only supporting name changes right now
export const ep_house_patch = auth(async (req: Request, res: Response, user: User) =>
{

    if (!exists(req.body, "name"))
    {
        std_response(res, HTTP.BAD_REQUEST, { error: "missing params" });
        return;
    }

    try
    {
        // Check house exists
        if (!ObjectId.isValid(req.params.house_id) || !await db_house_get_by_id(new ObjectId(req.params.house_id)))
        {
            std_response(res, HTTP.NOT_FOUND, { error: "house not found" });
            return;
        }
    }
    catch (e)
    {
        std_response(res, HTTP.INTERNAL_SERVER_ERROR, { error: "failed patching house" });
        console.error(e);
    }

    try
    {
        await db_house_name_update(new ObjectId(req.params.house_id), req.body.name, user._id);
        std_response(res, HTTP.OK, { message: "success" });
    }
    catch (e: any)
    {
        if (e.message == "house name already exists")
        {
            std_response(res, HTTP.CONFLICT, { error: e.message });
        }
        else 
        {
            std_response(res, HTTP.INTERNAL_SERVER_ERROR, { error: "failed patching house" });
        }
    }
})