import type { ObjectId } from "mongodb";

export type UserID = ObjectId;
export type HouseID = ObjectId;
export type ProductID = ObjectId;

export interface User
{
    _id: UserID,
    email: string,
    password: string
}

export interface Product
{
    _id: ProductID,
    upc: string,
    owner_id: UserID,
    name: string,
    use_by: Date,
    quantity: number
}

export interface House
{
    _id: HouseID,
    name: string
    owner_id: UserID,
    members: Array<UserID>
}