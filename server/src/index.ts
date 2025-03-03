import dotenv from "dotenv";

import "./server"

// Putting this here, incase the file is called from other than index
dotenv.config({ path: ".env" });

console.log("HELLO")