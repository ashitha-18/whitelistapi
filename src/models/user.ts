import { ObjectId } from "mongodb";

export default interface User {
    name: string;
    email: string;
    bio: string;
    age: number;
    image: string;
    resume: string;
    id?: ObjectId;
}