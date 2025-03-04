import crypto from "crypto";

export const password_hash = (p_password:string) => {

    const salt = crypto.randomBytes(16);

    return new Promise((resolve, reject) =>
    {
        crypto.scrypt(p_password, salt, 32, (err, derivedKey) =>
            {
                if (err) reject(err);

                else resolve(derivedKey.toString("hex") + ":" + salt);
            });
    });
}