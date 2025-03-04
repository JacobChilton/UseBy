import crypto from "crypto";

export const password_hash = (p_password: string, p_salt?: string) =>
{

    let salt: string;

    if (p_salt)
    { // If salt was passed in

        salt = p_salt; // Use the passed in salt
    }
    else
    { // If salt was not passed in

        salt = crypto.randomBytes(16).toString("hex"); // Generate salt
    }

    return new Promise((resolve, reject) =>
    {
        crypto.scrypt(p_password, salt, 32, (err, derivedKey) => // Hashes password and adds salt
        {
            if (err) reject(err);

            else resolve(derivedKey.toString("hex") + ":" + salt);
        });
    });
}