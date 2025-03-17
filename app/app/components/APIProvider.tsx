import React, { createContext, useContext, useState } from 'react'
import { APIError } from './APIError';

// temp
const API_URL_BASE = "http://172.23.157.244:3076";

interface APIProviderInterface
{
    logged_in: boolean,
    login: (p_email: string, p_password: string) => Promise<void>
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
        logged_in: !!token,
        login: async (p_email: string, p_password: string): Promise<void> =>
        {
            try
            {
                console.log(API_URL_BASE + "/auth/login", { email: p_email, password: p_password })
                const response = await fetch(API_URL_BASE + "/auth/login",
                    {
                        method: "post",
                        body: JSON.stringify({ email: p_email, password: p_password }),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })

                const json = await response.json();

                if (json.token)
                {
                    set_token(json.token);
                    console.log(json.token)
                    return;
                }
                else
                {
                    throw new APIError(json.message || json.error || "Unknown error")
                }
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

    }

    return (
        <context.Provider value={exported}>
            {children}
        </context.Provider>
    )
}

export default APIProvider;
