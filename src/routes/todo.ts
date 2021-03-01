import { Router, Request, Response } from "express";
import { deleteTodo, getTodo, updateTodo } from "../controllers/todos";
import { userAuthentication } from "../middlewares/authentication";
import { getFormattedError } from "../utils/error";

const todoRoute = Router();

todoRoute.get(
  "/:id",
  userAuthentication,
  async (req: Request, resp: Response) => {
    try {
      const { id } = req.params;
      const todo = await getTodo(id, (req as any).user.email);
      resp.send({ todo });
    } catch (err) {
      if (err.message) {
        resp.status(404).send(getFormattedError([err.message]));
      }
    }
  }
);

todoRoute.patch(
  "/:id",
  userAuthentication,
  async (req: Request, resp: Response) => {
    try {
      const { id } = req.params;
      const todo = await updateTodo(id, (req as any).user.email, req.body);
      resp.send({ todo });
    } catch (err) {
      if (err.message) {
        resp.status(404).send(getFormattedError([err.message]));
      }
    }
  }
);

todoRoute.delete(
  "/:id",
  userAuthentication,
  async (req: Request, resp: Response) => {
    try {
      const { id } = req.params;
      const todoRemoved = await deleteTodo(id, (req as any).user.email);
      if (todoRemoved) {
        resp.send();
      } else {
        resp.status(500).send(getFormattedError(["failed to remove todo"]));
      }
    } catch (err) {
      if (err.message) {
        resp.status(404).send(getFormattedError([err.message]));
      }
    }
  }
);

export { todoRoute };
