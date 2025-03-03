import express, { json } from "express";

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

server.listen(3076, () =>
{
    console.log("HELLO")
})