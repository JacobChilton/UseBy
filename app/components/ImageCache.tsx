import React, { createContext, useContext, useState } from 'react'
import { useAPI } from '~/app/components/APIProvider';
import { UserID } from '~/app/lib/api/APITypes';


// This is a very basic img cache, no timeout or anything

interface Exported
{
    get_image: (p_user: UserID) => Promise<string>
}

const context = createContext<Exported>({ get_image: async () => "" });

export const useImageCache = () =>
{
    if (!context) throw new Error("Image cache used outside the provider");

    const con = useContext(context);

    return con;
}

interface Props
{
    children: React.ReactNode
}

// Stores past images
const cache: Map<UserID, string> = new Map();

const ImageCache: React.FC<Props> = ({ children }) =>
{
    const api = useAPI();

    const get_image = async (p_user: string) =>
    {
        if (cache.has(p_user))
        {
            console.log("Cache hit");
            return cache.get(p_user) || "";
        }

        console.log("No cache hit");

        try
        {
            const pic = await api.picture_get(p_user)

            // Set even if invalid, as dont want to check if i know no image exists
            cache.set(p_user, pic || "");

            return pic || "";
        }
        catch (e)
        {
            // No img, this is fine
            cache.set(p_user, "");

            // Well ig its possible this error is network or server error, but its fine for now like this
            return "";
        }
    }


    return (
        <context.Provider value={{ get_image }}>
            {children}
        </context.Provider>
    )
}

export default ImageCache;
