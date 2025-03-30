import React, { createContext, useCallback, useContext, useState } from 'react'
import { APIError } from '../lib/api/APIError';
import { barcode_fetch, house_create, house_delete, house_get_all, house_member_add, house_member_remove, house_product_add, house_product_delete, house_product_get_all, house_product_update, house_update_name, login, picture_get, profile_get, user_create, user_get } from '../lib/api/interface';
import { House, HouseID, Product, ProductID, User, UserID } from '../lib/api/APITypes';

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
    house_get_all: () => Promise<Array<House>>;
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
    house_product_get_all: (p_house: HouseID) => Promise<Array<Product>>;
    // Delete a product in house
    house_product_delete: (p_house: HouseID, p_product: ProductID) => Promise<void>;
    // Update a product in house
    house_product_update: (p_house: HouseID, p_product: ProductID, p_updates: Partial<Omit<Product, "_id" | "owner_id" | "house_id">>) => Promise<void>;
    // Get name and image from barcode
    barcode_fetch: (p_barcode: string) => Promise<{ name: string, image: string } | undefined>
    // Get image by id
    picture_get: (p_id: string) => Promise<string | undefined>;
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
    const [token, set_token] = useState<string>("")

    const exported: APIProviderInterface =
    {
        // May be worth doing more checks
        logged_in: !!token,

        // Login user
        login: useCallback(async (p_email: string, p_password: string) =>
        {
            // Not handling error on purpose
            const response = await login(p_email, p_password);
            set_token(response);
        }, []),
        logout: useCallback(() => set_token(""), []),
        user_create: useCallback((p_email: string, p_password: string, p_name: string) => user_create(p_email, p_password, p_name), []),
        user_get: useCallback((p_id: UserID) => user_get(token, p_id), [token]),
        profile_get: useCallback(() => profile_get(token), [token]),
        house_create: useCallback((p_name: string) => house_create(token, p_name), [token]),
        house_get_all: useCallback(() => house_get_all(token), [token]),
        house_delete: useCallback((p_house: HouseID) => house_delete(token, p_house), [token]),
        house_update_name: useCallback((p_house: HouseID, p_new_name: string) => house_update_name(token, p_house, p_new_name), [token]),
        house_member_add: useCallback((p_house: HouseID, p_member: UserID) => house_member_add(token, p_house, p_member), [token]),
        house_member_remove: useCallback((p_house: HouseID, p_member: UserID) => house_member_remove(token, p_house, p_member), [token]),
        house_product_add: useCallback((p_house: HouseID, p_product: Omit<Product, "_id" | "owner_id" | "house_id">) => house_product_add(token, p_house, p_product), [token]),
        house_product_get_all: useCallback((p_house: HouseID) => house_product_get_all(token, p_house), [token]),
        house_product_delete: useCallback((p_house: HouseID, p_product: ProductID) => house_product_delete(token, p_house, p_product), [token]),
        house_product_update: useCallback((p_house: HouseID, p_product: ProductID, p_updates: Partial<Omit<Product, "_id" | "owner_id" | "house_id">>) => house_product_update(token, p_house, p_product, p_updates), [token]),
        barcode_fetch: useCallback((p_barcode: string) => barcode_fetch(token, p_barcode), [token]),
        picture_get: useCallback((p_id: string) => picture_get(p_id), []),
    }

    return (
        <context.Provider value={exported}>
            {children}
        </context.Provider>
    )
}

export default APIProvider;
