import React, { createContext, useCallback, useContext, useRef, useState } from 'react'
import { APIError } from '../lib/api/APIError';
import { barcode_fetch, house_create, house_delete, house_get_all, house_member_add, house_member_remove, house_product_add, house_product_delete, house_product_get_all, house_product_update, house_update_name, login, picture_get, picture_upload, profile_get, user_create, user_get } from '../lib/api/interface';
import { House, HouseID, Product, ProductID, User, UserID } from '../lib/api/APITypes';
import { AggHouse } from '../lib/api/aggregated';

// temp
const API_URL_BASE = "https://useby-server-mgdvu.ondigitalocean.app";

interface APIProviderInterface
{
    logged_in: boolean,
    // Create a new user
    user_create: (p_email: string, p_password: string, p_name: string) => Promise<UserID>;
    // Returns the user
    user_get: (p_id: UserID) => Promise<Omit<User, "password" | "email">>;
    // Returns logged in user profile
    profile_get: () => Promise<Omit<User, | "password">>;
    // Logs in a user and returns a token
    login: (p_email: string, p_password: string) => Promise<void>;
    // Logs out the current user
    logout: () => void;
    // Returns house ID
    house_create: (p_name: string) => Promise<HouseID>;
    // Returns houses the logged in user either owns or is a member of
    house_get_all: () => Promise<Array<AggHouse>>;
    // Deletes a house via id
    house_delete: (p_house: HouseID) => Promise<void>;
    // Change house name
    house_update_name: (p_house: HouseID, p_new_name: string) => Promise<void>;
    // Add a member to a house
    house_member_add: (p_house: HouseID, p_member: UserID) => Promise<void>;
    // Remove a member from a house
    house_member_remove: (p_house: HouseID, p_member: UserID) => Promise<void>;
    // Add product to a house
    house_product_add: (p_house: HouseID, p_product: Omit<Product, "_id" | "owner_id" | "house_id">) => Promise<ProductID>;
    // Add get all products in house
    house_product_get_all: (p_house: HouseID) => Promise<Array<Product & { house_name: string }>>;
    // Delete a product in house
    house_product_delete: (p_house: HouseID, p_product: ProductID) => Promise<void>;
    // Update a product in house
    house_product_update: (p_house: HouseID, p_product: ProductID, p_updates: Partial<Omit<Product, "_id" | "owner_id" | "house_id">>) => Promise<void>;
    // Get name and image from barcode
    barcode_fetch: (p_barcode: string) => Promise<{ name: string, image: string } | undefined>
    // Get image by user id
    picture_get: (p_user_id: string) => Promise<string>;
    // Upload image for user
    picture_upload: (p_b64: string) => Promise<void>;
}

const context = createContext<APIProviderInterface | null>(null)

export const useAPI = () =>
{
    const api = useContext(context);
    if (!api) throw new Error("useAPI() can only be used from within an <APIProvder> tag");
    return api;
}

interface APIProviderProps
{
    children?: React.ReactNode
}

const APIProvider: React.FC<APIProviderProps> = ({ children }) =>
{
    const [token, set_token] = useState<string>("");
    const image_cache = useRef(new Map<UserID, string>());

    const exported: APIProviderInterface =
    {
        // May be worth doing more checks
        logged_in: !!token,

        // Login user
        login: async (p_email: string, p_password: string) =>
        {
            // Not handling error on purpose
            const response = await login(p_email, p_password);
            set_token(response);
        },
        logout: () => set_token(""),
        user_create: (p_email: string, p_password: string, p_name: string) => user_create(p_email, p_password, p_name),
        user_get: (p_id: UserID) => user_get(token, p_id),
        profile_get: () => profile_get(token),
        house_create: (p_name: string) => house_create(token, p_name),
        house_get_all: () => house_get_all(token),
        house_delete: (p_house: HouseID) => house_delete(token, p_house),
        house_update_name: (p_house: HouseID, p_new_name: string) => house_update_name(token, p_house, p_new_name),
        house_member_add: (p_house: HouseID, p_member: UserID) => house_member_add(token, p_house, p_member),
        house_member_remove: (p_house: HouseID, p_member: UserID) => house_member_remove(token, p_house, p_member),
        house_product_add: (p_house: HouseID, p_product: Omit<Product, "_id" | "owner_id" | "house_id">) => house_product_add(token, p_house, p_product),
        house_product_get_all: (p_house: HouseID) => house_product_get_all(token, p_house),
        house_product_delete: (p_house: HouseID, p_product: ProductID) => house_product_delete(token, p_house, p_product),
        house_product_update: (p_house: HouseID, p_product: ProductID, p_updates: Partial<Omit<Product, "_id" | "owner_id" | "house_id">>) => house_product_update(token, p_house, p_product, p_updates),
        barcode_fetch: (p_barcode: string) => barcode_fetch(token, p_barcode),
        picture_get: async (p_user_id: string) => 
        {
            if (image_cache.current.has(p_user_id))
            {
                console.log("Cache hit");
                return image_cache.current.get(p_user_id) || ""
            }

            try
            {
                console.log("Cache miss");
                const pic = await picture_get(p_user_id);

                // Set even if invalid, as dont want to check if i know no image exists
                image_cache.current.set(p_user_id, pic || "");

                return pic || "";
            }
            catch (e)
            {
                // Probably 404, so I wont check.
                image_cache.current.set(p_user_id, "");
                return "";
            }
        },
        picture_upload: (p_b64: string) => 
        {
            // Super lazy rn, just delete entire img cache
            image_cache.current.clear();

            return picture_upload(token, p_b64)
        }
    }

    return (
        <context.Provider value={exported}>
            {children}
        </context.Provider>
    )
}

export default APIProvider;
