import { Request, Response } from "express";
import { std_response } from "../util/standard_response";
import { db_user_get_by_email, db_user_insert } from "../database/interface_users";
import { exists } from "../util/bingus";
import { HTTP } from "../util/http";
import { password_hash } from "../auth/password_hash";
import { House, User } from "../types/database";
import { auth } from "../auth/endpoints";
import { db_house_insert } from "../database/interface_houses";

// Creates a new house belonging to logged in user
export const ep_houses_post = auth( async(req: Request, res: Response, user: User) =>
{
    if (!exists(req.body, "name"))
    {
        std_response(res, HTTP.BAD_REQUEST, { message: "missing params" });
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



    
    
    
    // need to make one of this to check if house name already exists for that user
    /*
    if (await db_user_get_by_email(req.body.email))
    {
        std_response(res, HTTP.CONFLICT, { message: "email already exists" });
        return;
    }
        */

    try 
    {
        // Hash the password for storage
        const hash = await password_hash(req.body.password);

        // Construct the new user, we do not know ID yet so it is ommited
        const user: Omit<User, "_id"> =
        {
            email: req.body.email,
            password: hash
        };

        // Insert the user into the database
        const id = await db_user_insert(user);

        // Send user the new id
        std_response(res, HTTP.CREATED, { user_id: id.toHexString() });
    }
    catch (e)
    {
        std_response(res, HTTP.INTERNAL_SERVER_ERROR, { message: "error creating account" });
        console.error(e);
    }
})