export class APIError extends Error
{
    constructor(p_error: string)
    {
        super(p_error);
    }
}