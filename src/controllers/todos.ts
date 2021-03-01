import { Todo } from "../models/Todo";
import { getRepository } from "typeorm";
import { User } from "../models/User";
import { removePasswordFromUser } from "../utils/security";

interface todoPayload {
  content: string;
  user: User;
}

interface todoUpdatePayload {
  content: string;
  finished: boolean;
}

const createTodo = async (
  payload: todoPayload,
  email: string
): Promise<Todo> => {
  const user = await getRepository(User).findOne(email);
  if (!user) throw new Error("user does not exists");
  const userCleaned = removePasswordFromUser(user);
  payload.user = userCleaned;
  const todo = await getRepository(Todo).save(payload);
  return todo;
};

const getTodo = async (todoId: string, email: string): Promise<Todo> => {
  const todo = await getRepository(Todo).findOne(todoId, {
    relations: ["user"],
  });

  if (!todo) throw new Error("todo not found");
  if (todo.user.email !== email) throw new Error("invalid user email");
  // remove the password
  todo.user = removePasswordFromUser(todo.user);
  return todo;
};

const getTodos = async (email: string): Promise<Todo[]> => {
  // load the user with todos
  const user = await getRepository(User).findOne(email, {
    relations: ["todos"],
  });
  if (!user) throw new Error("user does not exists");
  return user.todos;
};

const updateTodo = async (
  todoId: string,
  email: string,
  payload: todoUpdatePayload
): Promise<Todo> => {
  const todo = await getRepository(Todo).findOne(todoId, {
    relations: ["user"],
  });
  if (!todo) throw new Error("todo not found");
  if (todo.user.email !== email) throw new Error("invalid user email");

  const resp = await getRepository(Todo).update(todoId, payload);
  if (resp.affected !== 0) {
    const todo = await getRepository(Todo).findOne(todoId);
    if (todo) return todo;
  }
  return todo;
};

const deleteTodo = async (todoId: string, email: string): Promise<boolean> => {
  const todo = await getRepository(Todo).findOne(todoId, {
    relations: ["user"],
  });
  if (!todo) throw new Error("todo not found");
  if (todo.user.email !== email) throw new Error("invalid user email");

  const resp = await getRepository(Todo).delete(todoId);
  return resp.affected !== 0;
};

export { createTodo, getTodo, getTodos, updateTodo, deleteTodo };
