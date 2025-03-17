export const exists = (p_obj: Record<string, any>, ...p_key: Array<string>): boolean =>
{
    const keys = Object.keys(p_obj);
    return p_key.every((k) => keys.includes(k));
}