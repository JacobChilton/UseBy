import { Request, Response } from "express";
import { exists } from "../util/bingus";
import { std_response } from "../util/standard_response";
import { HTTP } from "../util/http";
import { ObjectId } from "mongodb";
import { db_user_get_by_id } from "../database/interface_users";

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

                std_response(res, HTTP.OK, { id: user._id, email: user.email });
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