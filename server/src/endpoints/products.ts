import { Request, Response } from "express";
import { exists } from "../util/requests";
import { std_response } from "../util/standard_response";
import { HTTP } from "../util/http";
import { db_user_get_by_email, db_user_insert } from "../database/interface_users";
import { password_hash } from "../auth/password_hash";
import { Product, User } from "../types/database";
import { db_product_delete_by_product_id, db_product_get_by_house, db_product_get_by_id, db_product_get_by_name_and_owner, db_product_insert, db_product_patch } from "../database/interface_products";
import { auth } from "../auth/endpoints";
import { tg_is_availability } from "../types/database_typeguards";
import { db_house_get_by_id } from "../database/interface_houses";
import { ObjectId } from "mongodb";

export const ep_products_post = auth(async (req: Request, res: Response, user: User) =>
{
    // Ensure that required body params exist
    if (!exists(req.body, "name", "use_by", "quantity", "availability", "frozen"))
    {
        std_response(res, HTTP.BAD_REQUEST, { message: "missing params" });
        return;
    }

    // If availability is invalid
    if (!tg_is_availability(req.body.availability))
    {
        std_response(res, HTTP.BAD_REQUEST, { message: "availability is an invalid type" });
        return;
    }

    try
    {
        // Ensure that the house_id is valid
        if (!ObjectId.isValid(req.params.house_id) || !await db_house_get_by_id(new ObjectId(req.params.house_id)))
        {
            std_response(res, HTTP.NOT_FOUND, { error: "house not found" });
            return;
        }

        // If product name already exists, they cannot create it
        if (await db_product_get_by_name_and_owner(user._id, req.body.name))
        {
            std_response(res, HTTP.CONFLICT, { message: "product with this name already exists" });
            return;
        }
    }
    catch (e)
    {
        std_response(res, HTTP.INTERNAL_SERVER_ERROR, { error: "failed to create product" })
        return
    }

    const product: Omit<Product, "_id"> =
    {
        upc: req.body.upc || undefined,
        owner_id: user._id,
        house_id: new ObjectId(req.params.house_id),
        name: req.body.name,
        use_by: new Date(req.body.use_by),
        quantity: req.body.quantity,
        availability: req.body.availability,
        frozen: !!req.body.frozen // Convert it to bool, incase it is not
    }

    // Insert the product
    db_product_insert(product)
        .then(id =>
        {
            std_response(res, HTTP.CREATED, { id: id.toHexString() })
        })
        .catch((e) =>
        {
            console.error(e)
            std_response(res, HTTP.INTERNAL_SERVER_ERROR, { error: "failed to create product" })
        })
})

export const ep_products_get = auth(async (req: Request, res: Response, user: User) =>
{
    try
    {
        const house = await db_house_get_by_id(new ObjectId(req.params.house_id));

        // Ensure that the house_id is valid
        if (!ObjectId.isValid(req.params.house_id) || !house)
        {
            std_response(res, HTTP.NOT_FOUND, { error: "house not found" });
            return;
        }

        const products = await db_product_get_by_house(new ObjectId(req.params.house_id));

        // Adding house name
        const mapped_to_name = products.map(p => ({ ...p, house_name: house.name }))

        // Send, may want to set which values to send to be secure
        std_response(res, HTTP.OK, mapped_to_name);
    }
    catch (e)
    {
        std_response(res, HTTP.INTERNAL_SERVER_ERROR, { error: "failed to get products" });
        return;
    }
})

export const ep_products_delete = auth(async (req: Request, res: Response, user: User) =>
{
    try
    {
        // Ensure that the product_id is valid
        if (!ObjectId.isValid(req.params.product_id) || !await db_product_get_by_id(new ObjectId(req.params.product_id)))
        {
            std_response(res, HTTP.NOT_FOUND, { error: "product not found" });
            return;
        }
        if (!ObjectId.isValid(req.params.house_id) || !await db_house_get_by_id(new ObjectId(req.params.house_id)))
        {

            std_response(res, HTTP.NOT_FOUND, { error: "house not found" });
            return;
        }

        await db_product_delete_by_product_id(new ObjectId(req.params.product_id));

        std_response(res, HTTP.OK, { message: "success" });
    }
    catch (e)
    {
        std_response(res, HTTP.INTERNAL_SERVER_ERROR, { error: "failed to delete product" });
        return;
    }
})

export const ep_products_patch = auth(async (req: Request, res: Response, user: User) =>
{
    try
    {

        if (!ObjectId.isValid(req.params.product_id) || !await db_product_get_by_id(new ObjectId(req.params.product_id)))
        {
            std_response(res, HTTP.NOT_FOUND, { error: "product not found" });
            return;
        }

        const product: Record<string, any> = {}

        if (exists(req.body, "upc") && req.body.upc?.length <= 64) product.upc = req.body.upc;
        if (exists(req.body, "name") && req.body.name?.length <= 64) product.name = req.body.name;
        if (exists(req.body, "use_by") && req.body.use_by?.length <= 32) product.use_by = new Date(req.body.use_by);
        if (exists(req.body, "frozen")) product.frozen = !!req.body.frozen;
        if (!isNaN(req.body.quantity)) product.quantity = req.body.quantity;
        if (tg_is_availability(req.body.availability)) product.availability = req.body.availability;

        await db_product_patch(new ObjectId(req.params.product_id), product);
        std_response(res, HTTP.OK, { message: "success" });
    }
    catch (e)
    {
        std_response(res, HTTP.INTERNAL_SERVER_ERROR, { error: "failed to update product" });
        return;
    }
})