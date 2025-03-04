import crypto from "crypto";
import { password_hash } from "./password_hash";

export const password_verify = async (p_password:string, p_hashed_password:string) => {

    const salt = p_hashed_password.split(":")[1]; // Gets the salt from the hashed password

    if (!salt) throw new Error("No salt"); // If there is no salt, error

    let check_password_hash;
    try {
        check_password_hash = await password_hash(p_password, salt) // Hash the password
    }
    catch(e)
    {
        console.error(e);
        throw new Error("Failed to verify password");
    }

    return (check_password_hash === p_hashed_password); // Finds if passed in hash matches new hash
}