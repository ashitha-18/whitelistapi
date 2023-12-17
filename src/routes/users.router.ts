import express, { Request, Response } from "express";
import { whitelistMiddleware } from "../middleware/middleware";
import usersController from "../controller/users.controller";

export const usersRouter = express.Router();

usersRouter.use(express.json());

usersRouter
    .get("/", usersController.getUser)
    // Example route: http://localhost:8080/users/emailid
    .get("/:email", whitelistMiddleware, usersController.getUserByEmail)
    .post("/", whitelistMiddleware, usersController.createUser)
    .delete("/:id",)


export default usersRouter;
