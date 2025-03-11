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
import { exists } from "./util/bingus";
import { auth } from "./auth/endpoints";
<<<<<<< Updated upstream
import { ep_login_post, ep_users_post } from "./endpoints/auth";
import { ep_users_get } from "./endpoints/users";
import { ep_houses_post } from "./endpoints/houses";
=======
import { ep_login_post } from "./endpoints/auth";
import { ep_users_get, ep_users_post } from "./endpoints/users";
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
// Create new house
server.post("/houses", ep_houses_post)
=======
>>>>>>> Stashed changes

server.listen(3076, () =>
{
    console.log("Server running: http://localhost:3076")
})