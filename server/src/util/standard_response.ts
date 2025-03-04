import { Response } from "express";
import { HTTP } from "./http";

export const response = (p_res: Response, p_status: HTTP, p_json: Record<string, any>) =>
{
    p_res.status(p_status).json(p_json);
}