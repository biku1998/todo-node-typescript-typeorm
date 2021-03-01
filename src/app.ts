import express, { Request, Response } from "express";
import cors from "cors";
import { createConnection } from "typeorm";

// routes
import { todoRoute } from "./routes/todo";
import { todosRoute } from "./routes/todos";
import { usersRoute } from "./routes/users";
import { userRoute } from "./routes/user";

export const app = express();
app.use(express.json());
app.use(cors());

export async function initializeDatabase() {
  try {
    await createConnection({
      type: "postgres",
      host: process.env.DB_URI,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + "/models/**/*.js"],
      logging: true,
      synchronize: process.env.ENV === "development" ? true : false,
      logger: "advanced-console",
    });
  } catch (err) {
    console.log({ err });
  }
}

app.get("/api/v1/ping", (req: Request, resp: Response) => {
  resp.send({ status: "running", reply: "pong" });
});

app.use("/api/v1/todos", todosRoute);
app.use("/api/v1/todos", todoRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/users", userRoute);
