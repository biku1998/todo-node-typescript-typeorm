import { User } from "../models/User";

const removePasswordFromUser = (user: User) => {
  if (user.password) delete (user as any).password;
  return user;
};

export { removePasswordFromUser };
