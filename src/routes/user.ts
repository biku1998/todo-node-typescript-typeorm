import { Router, Request, Response } from "express";
import { deleteUser, getUserByEmail } from "../controllers/users";
import { userAuthentication } from "../middlewares/authentication";
import { getFormattedError } from "../utils/error";
import { removePasswordFromUser } from "../utils/security";

const userRoute = Router();

userRoute.get(
  "/:email",
  userAuthentication,
  async (req: Request, resp: Response) => {
    try {
      const { email } = req.params;
      const user = await getUserByEmail(email);
      // remove the password
      const userPayload = removePasswordFromUser(user);
      resp.send({ user: userPayload });
    } catch (err) {
      if (err.message) {
        return resp.status(404).send(getFormattedError([err.message]));
      }
      resp
        .status(500)
        .send(getFormattedError(["internal server error", err.toString()]));
    }
  }
);

userRoute.delete(
  "/:email",
  userAuthentication,
  async (req: Request, resp: Response) => {
    try {
      const { email } = req.params;
      const deleted = await deleteUser(email);
      if (deleted) {
        resp.send();
      } else {
        resp.status(404).send();
      }
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

// TODO : implement patch request

export { userRoute };
