import { Request, Response } from "express";
import { std_response } from "../util/standard_response";
import { db_user_get_by_email, db_user_insert } from "../database/interface_users";
import { exists } from "../util/bingus";
import { HTTP } from "../util/http";
import { password_hash } from "../auth/password_hash";
import { House, User } from "../types/database";
import { auth } from "../auth/endpoints";
import { db_house_get_by_name_and_owner_id, db_house_insert } from "../database/interface_houses";

// Creates a new house belonging to logged in user
export const ep_houses_post = auth( async(req: Request, res: Response, user: User) =>
{
    if (!exists(req.body, "name"))
    {
        std_response(res, HTTP.BAD_REQUEST, { message: "missing params" });
        return;
    }

    if (await db_house_get_by_name_and_owner_id(req.body.name, user._id))
        {
            std_response(res, HTTP.CONFLICT, { message: "house already exists" });
            return;
        }

    try {

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
    catch (e) {

        std_response(res, HTTP.INTERNAL_SERVER_ERROR, { message: "error creating house" });
        console.error(e);
    }
})