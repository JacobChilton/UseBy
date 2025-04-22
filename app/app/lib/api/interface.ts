import { AggHouse } from "./aggregated";
import { APIError } from "./APIError";
import { House, HouseID, Product, ProductID, User, UserID } from "./APITypes";

const API_URL_BASE = "https://useby-server-mgdvu.ondigitalocean.app";
//const API_URL_BASE = "http://localhost:3076";

const call = async (p_path: string, p_method: "DELETE" | "POST" | "GET" | "PATCH", p_body?: Record<string, any>): Promise<{ status: number; ok: boolean; json: Record<string, any>; }> =>
{
    const response = await fetch(API_URL_BASE + p_path,
        {
            method: p_method,
            body: JSON.stringify(p_body || {}),
            headers: {
                "Content-Type": "application/json"
            }
        })

    const json = await response.json();

    return { status: response.status, ok: response.ok, json };
}

const call_auth = async (p_token: string, p_path: string, p_method: "DELETE" | "POST" | "GET" | "PATCH", p_body?: Record<string, any>): Promise<{ status: number; ok: boolean; json: Record<string, any>; }> =>
{
    const response = await fetch(API_URL_BASE + p_path,
        {
            method: p_method,
            body: p_body ? JSON.stringify(p_body) : undefined,
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + p_token
            }
        })

    const json = await response.json();

    return { status: response.status, ok: response.ok, json };
}

// Create a new user
export const user_create = async (p_email: string, p_password: string, p_name: string): Promise<UserID> =>
{
    try
    {
        const { json } = await call("/users", "POST", { email: p_email, password: p_password, name: p_name });

        if (json.user_id) return json.user_id as UserID;
        else throw new APIError(json.message || json.error || "Unknown error");
    }
    catch (e)
    {
        if (e instanceof APIError) throw e;
        else
        {
            console.error(e);
            throw new APIError("Failed to create user");
        }
    }
}

// Returns the user
export const user_get = async (p_token: string, p_id: UserID): Promise<Omit<User, "password" | "email">> =>
{
    try
    {
        const { json, ok } = await call_auth(p_token, "/users/" + p_id, "GET");

        if (ok) return json as Omit<User, "password" | "email">;
        else throw new APIError(json.message || json.error || "Unknown error")
    }
    catch (e)
    {
        if (e instanceof APIError) throw e;
        else
        {
            console.error(e);
            throw new APIError("Failed to get user")
        }
    }
}

// Returns the user
export const profile_get = async (p_token: string): Promise<Omit<User, "password">> =>
{
    try
    {
        console.log({ p_token })
        const { json, ok } = await call_auth(p_token, "/profile", "GET");

        if (ok) return json as Omit<User, "password">;
        else throw new APIError(json.message || json.error || "Unknown error")
    }
    catch (e)
    {
        if (e instanceof APIError) throw e;
        else
        {
            console.error(e);
            throw new APIError("Failed to get user profile")
        }
    }
}

export const login = async (p_email: string, p_password: string): Promise<string> =>
{
    try
    {
        const { json } = await call("/auth/login", "POST", { email: p_email, password: p_password });

        if (json.token) return json.token;
        else throw new APIError(json.message || json.error || "Unknown error")
    }
    catch (e)
    {
        if (e instanceof APIError) throw e;
        else
        {
            console.error(e);
            throw new APIError("Failed to login")
        }
    }
}

// Returns house ID
export const house_create = async (p_token: string, p_name: string): Promise<HouseID> =>
{
    try
    {
        const { json } = await call_auth(p_token, "/houses", "POST", { name: p_name });

        if (json.house_id) return json.house_id;
        else throw new APIError(json.message || json.error || "Unknown error")
    }
    catch (e)
    {
        if (e instanceof APIError) throw e;
        else
        {
            console.error(e);
            throw new APIError("Failed to create house")
        }
    }
}

// Returns houses the logged in user either owns or is a member of
export const house_get_all = async (p_token: string): Promise<Array<AggHouse>> =>
{
    try
    {
        const { json } = await call_auth(p_token, "/houses", "GET");

        if (Array.isArray(json)) return json as Array<AggHouse>;
        else throw new APIError(json.message || json.error || "Unknown error")
    }
    catch (e)
    {
        if (e instanceof APIError) throw e;
        else
        {
            console.error(e);
            throw new APIError("Failed to get houses")
        }
    }
}

// Deletes a house via id
export const house_delete = async (p_token: string, p_house: HouseID): Promise<void> =>
{
    try
    {
        const { ok, json } = await call_auth(p_token, "/houses/" + p_house, "DELETE");

        if (!ok) throw new APIError(json.message || json.error || "Unknown error")
    }
    catch (e)
    {
        if (e instanceof APIError) throw e;
        else
        {
            console.error(e);
            throw new APIError("Failed to delete house")
        }
    }
}

// Change house name
export const house_update_name = async (p_token: string, p_house: HouseID, p_new_name: string): Promise<void> =>
{
    try
    {
        const { ok, json } = await call_auth(p_token, "/houses/" + p_house, "PATCH", { name: p_new_name });

        if (!ok) throw new APIError(json.message || json.error || "Unknown error")
    }
    catch (e)
    {
        if (e instanceof APIError) throw e;
        else
        {
            console.error(e);
            throw new APIError("Failed to update house")
        }
    }
}

// Add a member to a house
export const house_member_add = async (p_token: string, p_house: HouseID, p_member: UserID): Promise<void> =>
{
    try
    {
        const { ok, json } = await call_auth(p_token, "/houses/" + p_house + "/members", "POST", { user_id: p_member });

        if (!ok) throw new APIError(json.message || json.error || "Unknown error")
    }
    catch (e)
    {
        if (e instanceof APIError) throw e;
        else
        {
            console.error(e);
            throw new APIError("Failed to add member to house")
        }
    }
}

// Remove a member from a house
export const house_member_remove = async (p_token: string, p_house: HouseID, p_member: UserID): Promise<void> =>
{
    try
    {
        const { ok, json } = await call_auth(p_token, "/houses/" + p_house + "/members/" + p_member, "DELETE");

        if (!ok) throw new APIError(json.message || json.error || "Unknown error")
    }
    catch (e)
    {
        if (e instanceof APIError) throw e;
        else
        {
            console.error(e);
            throw new APIError("Failed to remove member from house")
        }
    }
}

// Add product to a house
export const house_product_add = async (p_token: string, p_house: HouseID, p_product: Omit<Product, "_id" | "owner_id" | "house_id">): Promise<ProductID> =>
{
    try
    {
        const { json } = await call_auth(p_token, "/houses/" + p_house + "/products", "POST", p_product);

        if (json.id) return json.id as ProductID
        else throw new APIError(json.message || json.error || "Unknown error")
    }
    catch (e)
    {
        if (e instanceof APIError) throw e;
        else
        {
            console.error(e);
            throw new APIError("Failed to add product to house")
        }
    }
}

// Add get all products in house
export const house_product_get_all = async (p_token: string, p_house: HouseID): Promise<Array<Product & { house_name: string }>> =>
{
    try
    {
        const { json } = await call_auth(p_token, "/houses/" + p_house + "/products", "GET");

        if (Array.isArray(json)) return json as Array<Product & { house_name: string }>;
        else throw new APIError(json.message || json.error || "Unknown error")
    }
    catch (e)
    {
        if (e instanceof APIError) throw e;
        else
        {
            console.error(e);
            throw new APIError("Failed to get products from house")
        }
    }
}

// Delete a product in house
export const house_product_delete = async (p_token: string, p_house: HouseID, p_product: ProductID): Promise<void> =>
{
    try
    {
        const { ok, json } = await call_auth(p_token, "/houses/" + p_house + "/products/" + p_product, "DELETE");

        if (!ok) throw new APIError(json.message || json.error || "Unknown error")
    }
    catch (e)
    {
        if (e instanceof APIError) throw e;
        else
        {
            console.error(e);
            throw new APIError("Failed to delete product")
        }
    }
}

// Update a product in house
export const house_product_update = async (p_token: string, p_house: HouseID, p_product: ProductID, p_updates: Partial<Omit<Product, "_id" | "owner_id" | "house_id">>): Promise<void> =>
{
    try
    {
        const { ok, json } = await call_auth(p_token, "/houses/" + p_house + "/products/" + p_product, "PATCH", p_updates);

        if (!ok) throw new APIError(json.message || json.error || "Unknown error")
    }
    catch (e)
    {
        if (e instanceof APIError) throw e;
        else
        {
            console.error(e);
            throw new APIError("Failed to update product")
        }
    }
}

// Get info from barcode
export const barcode_fetch = async (p_token: string, p_barcode: string): Promise<{ name: string, image: string } | undefined> =>
{
    try
    {
        const { ok, json } = await call_auth(p_token, "/barcode?barcode=" + p_barcode, "GET");

        if (!ok) throw new APIError(json.message || json.error || "Unknown error");
        if (!json.name || !json.image) throw new APIError("No data found");

        else return json as { name: string, image: string };
    }
    catch (e)
    {
        if (e instanceof APIError) throw e;
        else
        {
            console.error(e);
            throw new APIError("Failed to fetch barcode data")
        }
    }
}

// Get b64 img from user id
export const picture_get = async (p_user_id: string): Promise<string | undefined> =>
{
    try
    {
        const res = await fetch(API_URL_BASE + "/images/" + p_user_id, { method: "GET" });

        if (!res.ok) throw new APIError(await res.text() || "Unknown error");

        else return res.text();
    }
    catch (e)
    {
        if (e instanceof APIError) throw e;
        else
        {
            console.error(e);
            throw new APIError("Failed to fetch barcode data")
        }
    }
}

// Upload b64 img for user id
export const picture_upload = async (p_token: string, p_b64: string): Promise<void> =>
{
    try
    {
        const { ok, json } = await call_auth(p_token, "/images", "POST", { b64: p_b64 });

        if (!ok) throw new APIError(json.message || json.error || "Unknown error");
    }
    catch (e)
    {
        if (e instanceof APIError) throw e;
        else
        {
            console.error(e);
            throw new APIError("Failed to fetch barcode data")
        }
    }
}