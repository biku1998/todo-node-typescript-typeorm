import { Router, Request, Response } from "express";
import { createTodo, getTodos } from "../controllers/todos";
import { userAuthentication } from "../middlewares/authentication";
import { getFormattedError } from "../utils/error";

const todosRoute = Router();

todosRoute.get(
  "/",
  userAuthentication,
  async (req: Request, resp: Response) => {
    try {
      const todos = await getTodos((req as any).user.email);
      resp.send({ todos });
    } catch (err) {
      resp.status(500).send(getFormattedError(["internal server error"]));
    }
  }
);

todosRoute.post(
  "/",
  userAuthentication,
  async (req: Request, resp: Response) => {
    try {
      const todo = await createTodo(req.body, (req as any).user.email);
      resp.status(201).send({ todo });
    } catch (err) {
      if (err.message) {
        return resp.status(400).send(getFormattedError([err.message]));
      }
      resp
        .status(500)
        .send(getFormattedError(["internal server error", err.toString()]));
    }
  }
);

export { todosRoute };
