import { Request, Response } from "express";
import { exists } from "../util/requests";
import { std_response } from "../util/standard_response";
import { HTTP } from "../util/http";
import { ObjectId } from "mongodb";
import { db_user_get_by_email, db_user_get_by_id, db_user_insert } from "../database/interface_users";
import { password_hash } from "../auth/password_hash";
import { User } from "../types/database";

export const ep_users_get = (req: Request, res: Response) =>
{
    if (!exists(req.params, "id"))
    {
        std_response(res, HTTP.BAD_REQUEST, { message: "missing params" });
        return;
    }

    db_user_get_by_id(new ObjectId(req.params.id))
        .then((user) =>
        {
            if (user)
            {

                std_response(res, HTTP.OK, { id: user._id, name: user.name });
            }
            else
            {

                std_response(res, HTTP.NOT_FOUND, { message: "user does not exist" });
            }
        })
        .catch(() =>
        {
            std_response(res, HTTP.NOT_FOUND, { message: "failed to retrieve user" });
        })
}

export const ep_users_post = async (req: Request, res: Response) =>
{
    // Ensure that required params exist
    if (!exists(req.body, "password", "email", "name"))
    {
        std_response(res, HTTP.BAD_REQUEST, { message: "missing params" });
        return;
    }

    // If user already exists, they cannot create an account
    if (await db_user_get_by_email(req.body.email))
    {
        std_response(res, HTTP.CONFLICT, { message: "email already exists" });
        return;
    }

    try 
    {
        // Hash the password for storage
        const hash = await password_hash(req.body.password);

        // Construct the new user, we do not know ID yet so it is ommited
        const user: Omit<User, "_id"> =
        {
            email: req.body.email,
            password: hash,
            name: req.body.name
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
}