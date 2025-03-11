import jwt from "jsonwebtoken";
import { User, UserID } from "../types/database";
import { ObjectId } from "mongodb";

const AUDIENCE = "com.useby";
const SECRET = process.env.JWT_SECRET;

// If there is no secret I want the program to crash for now
if (!SECRET) throw new Error("No JWT secret defined");

// Creates a signed login token for the provided user id
export const login_token_create = (p_user: UserID, p_expire_in_days: number): Promise<string> =>
{
    // Setting info for the token, such as the user id (subject) and when this token
    // will expire
    const options: jwt.SignOptions =
    {
        audience: AUDIENCE,
        issuer: AUDIENCE,
        subject: p_user.toHexString(),
        expiresIn: `${Math.floor(p_expire_in_days)}d`
    }

    // Wrapping sign in a promise as it uses a callback
    return new Promise((resolve, reject) =>
    {
        jwt.sign({}, SECRET, options, (err, signed) =>
        {
            if (err) reject(err);
            else if (!signed) reject("Failed to sign token");

            // Return the signed token
            else resolve(signed);
        });
    });
}

// Returns the user id stated by a token, if the token is invalid it throws an error
export const login_token_validate = (p_token: string): Promise<UserID> =>
{
    // Ensures the correct issuer is stated
    const options: jwt.VerifyOptions =
    {
        issuer: AUDIENCE
    }

    return new Promise((resolve, reject) =>
    {
        // Ensure the token was signed by us
        jwt.verify(p_token, SECRET, options, (err, decoded) =>
        {
            // Get the user id, if anything is missing it is invalid
            if (err || !decoded) reject("Invalid token");
            const user_id = (decoded as jwt.JwtPayload).sub;
            if (!user_id) reject("Invalid token");

            // Construct the user id object and return it, as this is a valid token
            resolve(new ObjectId(user_id));
        });
    })
}

