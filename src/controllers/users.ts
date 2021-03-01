import { getRepository } from "typeorm";
import { User } from "../models/User";
import { hashPassword, matchPassword } from "../utils/password";

import { generateAuthenticationToken } from "../utils/jwt";
interface userPayload {
  name: string;
  email: string;
  password: string;
}

interface userLoginPayload {
  email: string;
  password: string;
}

const createUser = async (payload: userPayload): Promise<User> => {
  // check if the user already exists
  const userCheck = await getUserByEmail(payload.email);
  if (userCheck) {
    throw new Error("user already exists");
  }
  // hash the password before saving
  const hashedPassword = await hashPassword(payload.password);
  payload.password = hashedPassword;
  const user = await getRepository(User).save(payload);

  // create a jwt token
  user.token = generateAuthenticationToken(
    JSON.stringify({
      email: user.email,
      name: user.name,
    })
  );
  return user;
};

const getUserByEmail = async (email: string): Promise<User | null> => {
  const user = await getRepository(User).findOne(email);
  if (user) {
    return user;
  }
  return null;
};

const deleteUser = async (email: string): Promise<boolean> => {
  const resp = await getRepository(User).delete({ email });
  return resp.affected !== 0;
};

const loginUser = async (payload: userLoginPayload): Promise<User> => {
  if (!payload.email) throw new Error("email is required");

  if (!payload.password) throw new Error("password is required");

  const user = await getRepository(User).findOne(payload.email);

  if (!user) throw new Error("invalid credentials");

  const passwordMatched = await matchPassword(user.password, payload.password);

  if (!passwordMatched) throw new Error("invalid credentials");

  // create a jwt token
  user.token = generateAuthenticationToken(
    JSON.stringify({
      email: user.email,
      name: user.name,
    })
  );
  return user;
};

export { createUser, deleteUser, getUserByEmail, loginUser };
