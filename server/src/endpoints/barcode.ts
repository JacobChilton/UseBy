import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { auth } from "../auth/endpoints";
import { User } from "../types/database";
import { HTTP } from "../util/http";
import { std_response } from "../util/standard_response";
import { barcode } from "../barcode";
import { exists } from "../util/requests";

export const ep_barcode = auth(async (req: Request, res: Response, user: User) =>
{
    try
    {
        // Ensure that the barcode is a string
        if (!exists(req.query, "barcode") || (req.query.barcode as string).length < 5) {

            std_response(res, HTTP.BAD_REQUEST, { error: "Barcode invalid" });
            return;
        }

        const productData = await barcode(req.query.barcode as string);

        if (!productData.name) {

            std_response(res, HTTP.NOT_FOUND, { error: "no product data found" });
            return;
        }

        std_response(res, HTTP.OK, productData);
    }
    catch (e)
    {
        std_response(res, HTTP.INTERNAL_SERVER_ERROR, { error: "failed to get product data" });
        return;
    }
})