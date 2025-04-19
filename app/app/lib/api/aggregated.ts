import { House, UserID } from "./APITypes";

export interface AggHouse extends Omit<House, "members">
{
    members: Array<{ name: string, _id: UserID }>,
    owner_name: string
}