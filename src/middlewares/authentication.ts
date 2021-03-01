import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { User } from "../models/User";
import { getFormattedError } from "../utils/error";

// store all the authentication middleware here
import { verifyAuthenticationToken } from "../utils/jwt";
import { removePasswordFromUser } from "../utils/security";

const userAuthentication = async (
  req: Request,
  resp: Response,
  next: NextFunction
) => {
  try {
    // read token
    const header = req.header("Authorization");
    if (!header) {
      throw new Error("authentication token missing from the header");
    }
    const token: string = header.replace("JWT ", "");
    // extract information from the token

    const information = verifyAuthenticationToken(token) as any;

    if (!information.email) {
      return resp
        .status(500)
        .send(getFormattedError(["failed to decode jwt token"]));
    }
    const user = await getRepository(User).findOne(information.email);

    if (!user) {
      throw new Error("no user found");
    }

    // remove the password
    const userCleaned = removePasswordFromUser(user);
    (req as any).user = userCleaned;
    next();
  } catch (err) {
    resp
      .status(401)
      .send(getFormattedError(["authorization failed", err.message]));
  }
};

export { userAuthentication };
