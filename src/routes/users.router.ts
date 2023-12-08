import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import User from "../models/user";
export const usersRouter = express.Router();

usersRouter.use(express.json());

usersRouter.get("/", async (_req: Request, res: Response) => {
    try {
        // Call find with an empty filter object, meaning it returns all documents in the collection. 
        const users = await collections.users.find({}).toArray();

        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Example route: http://localhost:8080/users/emailid

// to retrieve the users information based on an email
usersRouter.get("/:email", async (req: Request, res: Response) => {
    const email = req?.params?.email;

    try {
        const query = { email: email };
        const game = await collections.users.findOne(query);

        if (game) {
            res.status(200).send(game);
        }
    } catch (error) {
        res.status(404).send(`Unable to find matching document with email: ${req.params.email}`);
    }
});



usersRouter.post("/", async (req: Request, res: Response) => {
    try {
        const newGame = req.body as User;
        const result = await collections.users.insertOne(newGame);

        result
            ? res.status(201).send(`Successfully created a new game with id ${result.insertedId}`)
            : res.status(500).send("Failed to create a new game.");
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});

usersRouter.put("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const updatedGame = req.body;
        const query = { _id: new ObjectId(id) };
        // $set adds or updates all fields
        const result = await collections.users.updateOne(query, { $set: updatedGame });

        result
            ? res.status(200).send(`Successfully updated game with id ${id}`)
            : res.status(304).send(`Game with id: ${id} not updated`);
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});

usersRouter.delete("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const query = { _id: new ObjectId(id) };
        const result = await collections.users.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed game with id ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove game with id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Game with id ${id} does not exist`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});