import jwt from "jsonwebtoken";

const generateAuthenticationToken = (information: string): string => {
  const token = jwt.sign(information, process.env.JWT_SECRET_KEY as string);
  return token;
};

const verifyAuthenticationToken = (token: string) => {
  const information = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
  return information;
};

export { generateAuthenticationToken, verifyAuthenticationToken };
