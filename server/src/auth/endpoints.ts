import { Request, Response } from "express"
import { User } from "../types/database"
import { std_response } from "../util/standard_response";
import { HTTP } from "../util/http";
import { login_token_validate } from "./jwt";
import { db_user_get_by_id } from "../database/interface_users";
import { ObjectId } from "mongodb";


// This wraps authentication around a handler, allowing the dev to use the
// logged in user, with certainty
export const auth = (handler: (req: Request, res: Response, user: User) => void) =>
{
    return async (req: Request, res: Response) =>
    {
        // Extract the token, will look like "Bearer cd83fg...."
        const raw_token = req.headers.authorization;

        // If the value does not start with bearer, its invalid
        if (!raw_token?.startsWith("Bearer "))
        {
            std_response(res, HTTP.UNAUTHORIZED, { error: "unauthorized" })
            return
        }

        // At this point we know token starts with "Bearer ",
        // using replace will replace only the first instance, which is the beginning
        const token = raw_token.replace("Bearer ", "")

        try
        {
            // Validate the token, returns the user id, throws an error if its invalid
            const user_id = await login_token_validate(token)

            // Get entire user object
            const user = await db_user_get_by_id(new ObjectId(user_id));

            // So I dont need to repeat std_response, i just throw an error, catch will send unauth
            if (!user) throw new Error("unauthorized")

            // Call the handler with the user object
            handler(req, res, user)
        }
        catch (e)
        {
            // For now idc about the error, if these failed, the user is not authed
            std_response(res, HTTP.UNAUTHORIZED, { error: "unauthorized" })
        }
    }
}