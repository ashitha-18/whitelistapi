import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import User from "../models/user";
import { BAD_REQUEST, CREATED, NOT_FOUND, INTERNAL_SERVER_ERROR, OK} from "../utils/constants.utils";
class UserController{
    getUser = async (_req: Request, res: Response) => {
        try {
            // Call find with an empty filter object, meaning it returns all documents in the collection. 
            const users = await collections.users.find({}).toArray();
    
            return res.status(OK).send(users);
        } catch (error) {
            return res.status(INTERNAL_SERVER_ERROR).send(error.message);
        }
    };

    getUserByEmail = async (req: Request, res: Response) => {
    
        const email = req?.params?.email;
        console.log('Request object:', req?.params?.email);
       
    
        try {
            const query = { email: email };
            const user = await collections.users.findOne(query);
    
            if (user) {
               return res.status(OK).send(user);
            }
        } catch (error) {
            return res.status(NOT_FOUND).send(`Unable to find matching document with email: ${req.params.email}`);
        }
    };


    createUser = async (req: Request, res: Response) => {
        try {
            const newUser = req.body as User;
            const result = await collections.users.insertOne(newUser);
    
            return result
                ? res.status(CREATED).send(`Successfully created a new user with id ${result.insertedId}`)
                : res.status(INTERNAL_SERVER_ERROR).send("Failed to create a new user.");
        } catch (error) {
            console.error(error);
            return res.status(BAD_REQUEST).send(error.message);
        }
    };

    deleteUser = async (req: Request, res: Response) => {
        const id = req?.params?.id;
    
        try {
            const query = { _id: new ObjectId(id) };
            const result = await collections.users.deleteOne(query);
    
            if (result && result.deletedCount) {
                return res.status(202).send(`Successfully removed user with id ${id}`);
            } else if (!result) {
                return res.status(BAD_REQUEST).send(`Failed to remove user with id ${id}`);
            } else if (!result.deletedCount) {
                return res.status(NOT_FOUND).send(`user with id ${id} does not exist`);
            }
        } catch (error) {
            console.error(error.message);
            return res.status(BAD_REQUEST).send(error.message);
        }
    };
}

export default new UserController();