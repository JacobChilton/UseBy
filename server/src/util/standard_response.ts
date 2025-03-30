import { Response } from "express";
import { HTTP } from "./http";

export const std_response = (p_res: Response, p_status: HTTP, p_response: Record<string, any> | string) =>
{
    if (typeof p_response === "string") p_res.status(p_status).send(p_response);
    else p_res.status(p_status).json(p_response);
}