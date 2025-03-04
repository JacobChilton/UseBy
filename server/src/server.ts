import express, { json, response } from "express";
import { User } from "./types/database";
import { db_user_get_by_id, db_user_insert } from "./database/interface_users";
import { ObjectId } from "mongodb";
import { password_hash } from "./auth/password_hash";
import { std_response } from "./util/standard_response";
import { HttpStatusCode } from "axios";
import { HTTP } from "./util/http";

const server = express();

server.use(json());

server.post("/auth/login", (req, res) =>
{
    const email = req.body.email;
    const password = req.body.password;

})

server.get("/users/:id", (req, res) =>
{
    db_user_get_by_id(new ObjectId(req.params.id))
        .then((user) =>
        {
            if (user) std_response(res, HTTP.OK, { id: user._id, email: user.email });

            std_response(res, HTTP.NOT_FOUND, { message: "user does not exist" });
        })
        .catch(() =>
        {
            std_response(res, HTTP.NOT_FOUND, { message: "failed to retrieve user" });
        })
})

server.post("/users", async (req, res) =>
{
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
        // TODO make http code reflect the error sent
        std_response(res, HTTP.INTERNAL_SERVER_ERROR, { error: e })
    }
})


server.listen(3076, () =>
{
    console.log("HELLO")
})