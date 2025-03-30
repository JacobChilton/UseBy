import { Request, Response } from "express";
import { User } from "../types/database";
import { auth } from "../auth/endpoints";
import { std_response } from "../util/standard_response";
import { HTTP } from "../util/http";

export const ep_profile_get = auth(async (req: Request, res: Response, user: User) =>
{
    // Just send user email, and ect
    std_response(res, HTTP.OK, { email: user.email, name: user.name, _id: user._id, picture: user.picture });
});