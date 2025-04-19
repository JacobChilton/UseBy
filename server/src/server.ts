import express, { json } from "express";
import { ep_login_post } from "./endpoints/auth";
import { ep_users_get, ep_users_post } from "./endpoints/users";
import { ep_house_delete, ep_house_get_for_user, ep_house_member_add, ep_house_member_remove, ep_house_patch, ep_houses_post } from "./endpoints/houses";
import { ep_products_delete, ep_products_get, ep_products_patch, ep_products_post } from "./endpoints/products";
import { ep_barcode } from "./endpoints/barcode";
import cors from "cors"
import { ep_profile_get } from "./endpoints/profile";
import { ep_picture_get, ep_picture_post } from "./endpoints/picture";
import fs from "fs"
import multer from "multer";


const server = express();

// Makes it easy to manage file uploading
const mem = multer.memoryStorage();
const file_uploader = multer({ storage: mem });

// Parse the body of contenttype application/json
server.use(json());
server.use(cors());


//////////
// AUTH //
//////////

server.post("/auth/login", ep_login_post);

///////////
// USERS //
///////////

// Get user
server.get("/users/:id", ep_users_get);

// Create new user
server.post("/users", ep_users_post);

server.get("/profile", ep_profile_get)

////////////
// HOUSES //
////////////

// Create new house
server.post("/houses", ep_houses_post);
server.get("/houses", ep_house_get_for_user);
server.delete("/houses/:house_id", ep_house_delete);
server.patch("/houses/:house_id", ep_house_patch);
server.post("/houses/:house_id/members", ep_house_member_add);
server.delete("/houses/:house_id/members/:user_id", ep_house_member_remove);

//////////////
// PRODUCTS //
//////////////

// Create new product in house
server.post("/houses/:house_id/products", ep_products_post);
server.get("/houses/:house_id/products", ep_products_get);
server.delete("/houses/:house_id/products/:product_id", ep_products_delete);
server.patch("/houses/:house_id/products/:product_id", ep_products_patch);

/////////////
// BARCODE //
/////////////
server.get("/barcode", ep_barcode);

/////////////
// PICTURE //
/////////////
server.post("/images", file_uploader.single("image"), ep_picture_post);
server.get("/images/:user_id", ep_picture_get);

// Launch server
server.listen(3076, () =>
{
    console.log("Server running: http://localhost:3076")
})