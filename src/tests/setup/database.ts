import { createConnection, getConnection, getRepository } from "typeorm";
import { Todo } from "../../models/Todo";
import { User } from "../../models/User";

export const setup = {
  async createConnection() {
    await createConnection({
      type: "postgres",
      host: process.env.DB_URI,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Todo, User],
      logging: false,
      synchronize: true,
      dropSchema: true,
    });
  },
  async closeConnection() {
    await getConnection().close();
  },
  async flushDatabase() {
    await getRepository(Todo).query(`DELETE FROM todos`);
    await getRepository(User).query(`DELETE FROM users`);
  },
};
