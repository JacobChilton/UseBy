import { Request, Response } from "express";
import { std_response } from "../util/standard_response";
import { db_user_get_by_email, db_user_insert } from "../database/interface_users";
import { exists } from "../util/bingus";
import { HTTP } from "../util/http";
import { password_verify } from "../auth/password_verify";
import { login_token_create } from "../auth/jwt";
import { password_hash } from "../auth/password_hash";
import { User } from "../types/database";

export const ep_login_post = async (req: Request, res: Response) =>
{
    // Required params exist
    if (!exists(req.body, "password", "email"))
    {
        std_response(res, HTTP.BAD_REQUEST, { message: "missing params" });
        return;
    }

    try
    {
        // Check user exists
        const user = await db_user_get_by_email(req.body.email);
        if (!user) throw "mismatch"

        // Invalid pass
        const valid_pass = await password_verify(req.body.password, user.password);
        if (!valid_pass) throw "mismatch"

        // Create token
        const token_expiry_days = 7;
        const token = await login_token_create(user._id, token_expiry_days);

        // Send to user
        std_response(res, HTTP.OK, { token: token });
    }
    catch (e)
    {
        if (e === "mismatch")
        {
            std_response(res, HTTP.FORBIDDEN, { error: "invalid credentials" });
        }
        else
        {
            std_response(res, HTTP.INTERNAL_SERVER_ERROR, { error: "unknown" })
        }
    }
}