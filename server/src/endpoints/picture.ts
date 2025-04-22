import { Request, Response } from "express";
import { HTTP } from "../util/http";
import { std_response } from "../util/standard_response";
import { db_picture_delete_by_user, db_picture_get_by_user_id, db_picture_insert } from "../database/interface_pictures";
import { User } from "../types/database";
import { auth } from "../auth/endpoints";
import { exists } from "../util/requests";
import { ObjectId } from "mongodb";

// Im storing the images in b64 in a seperate collection
// The images may be larger and honestly b64 is not the most appropriate
// (It is the easiest however)
// It looks like GridFS may be a better alternative if we want to stay within mongo
// however still just gonna use this

// Seems 16MB its max doc size, ill limit images to 10MB
// Accounting for extra size from converting to b64
const MAX_FILE_SIZE_BYTES = 10485760;

export const ep_picture_post = auth(async (req: Request, res: Response, user: User) =>
{
    // Checks
    if (!exists(req.body, "b64"))
    {
        std_response(res, HTTP.BAD_REQUEST, { error: "missing params" });
        return;
    }

    if (req.body.b64 > MAX_FILE_SIZE_BYTES)
    {
        std_response(res, HTTP.BAD_REQUEST, { error: "file is too large, limit is 10MB" });
        return;
    }

    try
    {
        // Delete old
        await db_picture_delete_by_user(user._id);

        // Save new
        await db_picture_insert(req.body.b64, user._id);

        // Yay
        std_response(res, HTTP.OK, { message: "success" });
    }
    catch (e)
    {
        console.error(e);
        std_response(res, HTTP.INTERNAL_SERVER_ERROR, { error: "failed to save image" });
    }
});

export const ep_picture_get = async (req: Request, res: Response) =>
{
    if (!exists(req.params, "user_id"))
    {
        std_response(res, HTTP.BAD_REQUEST, { error: "missing params" });
        return;
    }

    // Get img data
    try
    {
        const data = await db_picture_get_by_user_id(new ObjectId(req.params.user_id));
        if (!data)
        {
            std_response(res, HTTP.NOT_FOUND, { error: "image not found" });
        }
        else
        {
            res.setHeader("Content-Type", "text/plain")
            std_response(res, HTTP.OK, data.b64);
        }
    }
    catch (e)
    {
        console.error(e);
    }

}
    ;

