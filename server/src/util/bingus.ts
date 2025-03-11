export const exists = (p_obj: Record<string, any>, ...p_key: Array<string>): boolean =>
{
    return p_key.every((k) => !!p_obj[k]);
}