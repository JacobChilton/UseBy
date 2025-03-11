import { Request, Response } from "express"
import { std_response } from "./standard_response"
import { HTTP } from "./http"

// NEEDS REDOING FOR AUTH
class EPAuthHandlerBuilder
{
    params: Set<string> = new Set()

    param = (name: string) =>
    {
        this.params.add(name);
        return this;
    }

    build = (handler: (req: Request, res: Response, params: Map<string, any>) => void) =>
    {
        return (req: Request, res: Response) =>
        {
            const params: Map<string, any> = new Map();

            const missing_params = Array.from(this.params).reduce<Array<string>>((prev, current) =>
            {
                if (!Object.keys(req.body).includes(current))
                {
                    return [...prev, current]
                }
                else 
                {
                    params.set(current, req.body[current])
                    return prev;
                }
            }, []);

            if (missing_params.length !== 0)
            {
                std_response(res, HTTP.BAD_REQUEST, { missing_params })
                return;
            }

            handler(req, res, params);
        }
    }
}

export const EP = new EPAuthHandlerBuilder