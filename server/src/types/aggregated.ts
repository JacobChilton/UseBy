import { House, UserID } from "./database";

export interface AggHouse extends Omit<House, "members">
{
    members: Array<{ name: string, _id: UserID }>,
    owner_name: string
}