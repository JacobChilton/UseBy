import express, { json } from "express";
import { ep_login_post } from "./endpoints/auth";
import { ep_users_get, ep_users_post } from "./endpoints/users";
import { ep_houses_post } from "./endpoints/houses";
import { ep_products_post } from "./endpoints/products";

const server = express();

// Parse the body of contenttype application/json
server.use(json());


//////////
// AUTH //
//////////

server.post("/auth/login", ep_login_post)

///////////
// USERS //
///////////

// Get user
server.get("/users/:id", ep_users_get)

// Create new user
server.post("/users", ep_users_post)

////////////
// HOUSES //
////////////

// Create new house
server.post("/houses", ep_houses_post)

//////////////
// PRODUCTS //
//////////////

// Create new product in house
server.post("/houses/:product_id/products", ep_products_post)

// Launch server
server.listen(3076, () =>
{
    console.log("Server running: http://localhost:3076")
})