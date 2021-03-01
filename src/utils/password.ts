import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

const hashPassword = async (plainPassword: string): Promise<string> => {
  const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);
  return hashedPassword;
};

const matchPassword = async (
  hashedPassword: string,
  password: string
): Promise<boolean> => {
  const matched = await bcrypt.compare(password, hashedPassword);
  return matched;
};

export { hashPassword, matchPassword };
