import express, { json } from "express";
import { User } from "./types/database";
import { db_user_get_by_id, db_user_insert } from "./database/interface_users";
import { ObjectId } from "mongodb";

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
            if (user) {

                res.status(200).json({id: user._id, email: user.email});
            }
            res.status(404).json({message: "user does not exist"});
        })
        .catch(() =>
        {
            res.status(500).json({message: "failed to retrieve user"});
        })
})

server.post("/users", (req, res) =>
{
    const user: Omit<User, "_id"> =
    {
        email: req.body.email,
        password: req.body.password,
    }
    db_user_insert(user)
    .then(() =>
    {
        res.status(201).json({ message: "success" })
    })
    .catch(() =>
    {
        res.status(500).json({ message: "failed to create user" });
    })
})

server.listen(3076, () =>
{
    console.log("HELLO")
})