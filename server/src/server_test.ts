import express, { json } from "express";
import { User } from "./types/database";
import { db_user_insert } from "./database/interface_users";

const server = express();


server.use(json());

server.post("/auth/login", (req, res) =>
{
    if (req.body.email === "bingus" && req.body.password === "password")
    {
        res.status(200).json({ "token": "kejfhglsdkfjvhsldkfjghnveriuvtylas" });
    }
    else return
    {
        res.status(401).json({ "message": "credentials invalid" })
    }
})

server.post("/users/:id", (req, res) =>
{
    req.params.id;
    req.query.limit;
})

server.get("/auth/login", (req, res) =>
{
    res.json({ "token": "kejfhglsdkfjvhsldkfjghnveriuvtylas" });
})

server.post("/users", (req, res) =>
{
    const user: Omit<User, "_id"> =
    {
        email: req.body.email,
        password: req.body.password,
    }
    db_user_insert(user);
})

server.listen(3076, () =>
{
    console.log("HELLO")
})