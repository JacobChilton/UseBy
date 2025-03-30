import type { ObjectId } from "mongodb";

export type UserID = ObjectId;
export type HouseID = ObjectId;
export type ProductID = ObjectId;
export type PictureID = ObjectId;

export enum Availability
{
    UP_FOR_GRABS = "UP_FOR_GRABS",
    PRIVATE = "PRIVATE",
    COMMUNAL = "COMMUNAL"
}

export interface User
{
    _id: UserID,
    email: string,
    password: string,
    name: string,
    picture?: PictureID
}

export interface Product
{
    _id: ProductID,
    upc?: string,
    owner_id: UserID,
    house_id: HouseID,
    name: string,
    use_by: Date,
    quantity: number,
    availability: Availability,
    frozen: boolean
}

export interface House
{
    _id: HouseID,
    name: string
    owner_id: UserID,
    members: Array<UserID>
}

export interface Picture
{
    _id: PictureID,
    b64: string
}