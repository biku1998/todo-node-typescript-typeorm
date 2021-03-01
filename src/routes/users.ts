import { Router, Request, Response } from "express";
import { createUser, loginUser } from "../controllers/users";
import { getFormattedError } from "../utils/error";
import { removePasswordFromUser } from "../utils/security";

const usersRoute = Router();

usersRoute.post("/", async (req: Request, resp: Response) => {
  try {
    const user = await createUser(req.body);
    // remove the password
    const userPayload = removePasswordFromUser(user);
    resp.status(201).send({ user: userPayload });
  } catch (err) {
    if (err.message) {
      return resp.status(400).send(getFormattedError([err.message]));
    }
    resp
      .status(500)
      .send(getFormattedError(["internal server error", err.toString()]));
  }
});

usersRoute.post("/login", async (req: Request, resp: Response) => {
  try {
    const user = await loginUser(req.body);
    // remove the password
    const userPayload = removePasswordFromUser(user);
    resp.send({ user: userPayload });
  } catch (err) {
    if (err.message) {
      return resp.status(400).send(getFormattedError([err.message]));
    }
    resp
      .status(500)
      .send(getFormattedError(["internal server error", err.toString()]));
  }
});

export { usersRoute };
