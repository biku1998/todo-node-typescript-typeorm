import request from "supertest";
import { app } from "../../app";
import { ROUTE_PREFIX, setup } from "../setup/database";

beforeAll(async () => {
  await setup.createConnection();
});
afterAll(async () => {
  await setup.closeConnection();
});
beforeEach(async () => {
  await setup.flushDatabase();
});
afterEach(async () => {
  await setup.flushDatabase();
});

test("should not create a todo without authorization", async () => {
  await request(app)
    .post(ROUTE_PREFIX + "/todos")
    .send({
      content: "do task A",
    })
    .expect(401);
});

test("should not create a todo with invalid data", async () => {
  const userResp = await request(app)
    .post(ROUTE_PREFIX + "/users")
    .send({
      email: "test@gmail.com",
      name: "test",
      password: "hello world",
    })
    .expect(201);

  await request(app)
    .post(ROUTE_PREFIX + "/todos")
    .set("Authorization", "JWT " + userResp.body.user.token)
    .send({
      anything: "do task A",
    })
    .expect(400);
});

test("should create a todo with valid data", async () => {
  const userResp = await request(app)
    .post(ROUTE_PREFIX + "/users")
    .send({
      email: "test@gmail.com",
      name: "test",
      password: "hello world",
    })
    .expect(201);

  const resp = await request(app)
    .post(ROUTE_PREFIX + "/todos")
    .set("Authorization", "JWT " + userResp.body.user.token)
    .send({
      content: "do task A",
    })
    .expect(201);

  // make sure we are returning todo instance
  expect(Object.keys(resp.body)).toContain("todo");
  // make sure owner of the todo is correct
  expect(resp.body.todo.user.email).toEqual("test@gmail.com");
  // make sure the content of the todo is the same
  expect(resp.body.todo.content).toEqual("do task A");
});

test("should not get all todos without authorization", async () => {
  await request(app)
    .get(ROUTE_PREFIX + "/todos")
    .send()
    .expect(401);
});

test("should get all todos ", async () => {
  const userResp = await request(app)
    .post(ROUTE_PREFIX + "/users")
    .send({
      email: "test@gmail.com",
      name: "test",
      password: "hello world",
    })
    .expect(201);

  await request(app)
    .post(ROUTE_PREFIX + "/todos")
    .set("Authorization", "JWT " + userResp.body.user.token)
    .send({
      content: "do task A",
    })
    .expect(201);

  const resp = await request(app)
    .get(ROUTE_PREFIX + "/todos")
    .set("Authorization", "JWT " + userResp.body.user.token)
    .send()
    .expect(200);

  expect(Object.keys(resp.body)).toContain("todos");
  expect(resp.body.todos.length).toEqual(1);
  expect(resp.body.todos[0].content).toEqual("do task A");
});

test("should not update todo without authorization ", async () => {
  const userResp = await request(app)
    .post(ROUTE_PREFIX + "/users")
    .send({
      email: "test@gmail.com",
      name: "test",
      password: "hello world",
    })
    .expect(201);

  const todoResp = await request(app)
    .post(ROUTE_PREFIX + "/todos")
    .set("Authorization", "JWT " + userResp.body.user.token)
    .send({
      content: "do task A",
    })
    .expect(201);

  await request(app)
    .patch(ROUTE_PREFIX + "/todos/" + todoResp.body.todo.id)
    .send()
    .expect(401);
});

test("should update a todo", async () => {
  const userResp = await request(app)
    .post(ROUTE_PREFIX + "/users")
    .send({
      email: "test@gmail.com",
      name: "test",
      password: "hello world",
    })
    .expect(201);

  const todoResp = await request(app)
    .post(ROUTE_PREFIX + "/todos")
    .set("Authorization", "JWT " + userResp.body.user.token)
    .send({
      content: "do task A",
    })
    .expect(201);

  const resp = await request(app)
    .patch(ROUTE_PREFIX + "/todos/" + todoResp.body.todo.id)
    .set("Authorization", "JWT " + userResp.body.user.token)
    .send({
      finished: true,
    })
    .expect(200);
  expect(resp.body.todo.finished).toEqual(true);
});

test("should not delete todo without authorization ", async () => {
  const userResp = await request(app)
    .post(ROUTE_PREFIX + "/users")
    .send({
      email: "test@gmail.com",
      name: "test",
      password: "hello world",
    })
    .expect(201);

  const todoResp = await request(app)
    .post(ROUTE_PREFIX + "/todos")
    .set("Authorization", "JWT " + userResp.body.user.token)
    .send({
      content: "do task A",
    })
    .expect(201);

  await request(app)
    .delete(ROUTE_PREFIX + "/todos/" + todoResp.body.todo.id)
    .send()
    .expect(401);
});

test("should delete a todo", async () => {
  const userResp = await request(app)
    .post(ROUTE_PREFIX + "/users")
    .send({
      email: "test@gmail.com",
      name: "test",
      password: "hello world",
    })
    .expect(201);

  const todoResp = await request(app)
    .post(ROUTE_PREFIX + "/todos")
    .set("Authorization", "JWT " + userResp.body.user.token)
    .send({
      content: "do task A",
    })
    .expect(201);

  await request(app)
    .delete(ROUTE_PREFIX + "/todos/" + todoResp.body.todo.id)
    .set("Authorization", "JWT " + userResp.body.user.token)
    .send()
    .expect(200);
});
