import express, { json, response } from "express";
import { User } from "./types/database";
import { db_user_get_by_email, db_user_get_by_id, db_user_insert } from "./database/interface_users";
import { ObjectId } from "mongodb";
import { password_hash } from "./auth/password_hash";
import { std_response } from "./util/standard_response";
import { HTTP } from "./util/http";
import { verify } from "crypto";
import { password_verify } from "./auth/password_verify";
import { login_token_create } from "./auth/jwt";
import { EP } from "./util/endpoints";

const server = express();

server.use(json());

server.post("/auth/login", EP.param("email").param("password").build((req, res, params) =>
{

    db_user_get_by_email(req.body.password)

        .then(async (user) =>
        {
            if (!user) {

                std_response(res, HTTP.NOT_FOUND, { message: "user does not exist" });
            }
            else {

                if (await password_verify(req.body.password, user.password)) {
                    
                    const token = await login_token_create(user._id, 7);
                    std_response(res, HTTP.OK, {message: token});
                }
                else {

                    std_response(res, HTTP.FORBIDDEN, { message: "password email mismatch" });
                }
            }
        })
        .catch(() =>
        {
            std_response(res, HTTP.NOT_FOUND, { message: "failed to retrieve user" });
        })
}))

server.get("/users/:id", (req, res) =>
{
    db_user_get_by_id(new ObjectId(req.params.id))
        .then((user) =>
        {
            if (user) {

                std_response(res, HTTP.OK, { id: user._id, email: user.email });
            }
            else {

                std_response(res, HTTP.NOT_FOUND, { message: "user does not exist" });
            }
        })
        .catch(() =>
        {
            std_response(res, HTTP.NOT_FOUND, { message: "failed to retrieve user" });
        })
})

server.post("/users", EP.param("email").param("password").build( async (req, res) =>
{

    if (await db_user_get_by_email(req.body.email)) {

        std_response(res, HTTP.CONFLICT, { message: "email already exists"});
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
            password: hash
        };

        // Insert the user into the database
        const id = await db_user_insert(user);

        // Send user the new id
        std_response(res, HTTP.CREATED, { user_id: id.toHexString() });
    }
    catch (e)
    {
        std_response(res, HTTP.INTERNAL_SERVER_ERROR, { message: "error creating account"});
        console.error(e);
    }
}))


server.listen(3076, () =>
{
    console.log("HELLO")
})