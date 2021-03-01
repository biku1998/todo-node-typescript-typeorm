import request from "supertest";
import { app } from "../../app";
import { setup } from "../setup/database";

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

/*
 * To test
 [x] sign up with invalid data
 [x] sign up with valid data
 [x] login with invalid credentials
 [x] login with valid credentials
*/

const ROUTE_PREFIX = "/api/v1";

test("should not sign up with invalid data", async () => {
  await request(app)
    .post(ROUTE_PREFIX + "/users")
    .send({
      abc: "123",
    })
    .expect(400);
});

test("should sign up a new user", async () => {
  const response = await request(app)
    .post(ROUTE_PREFIX + "/users")
    .send({
      email: "test@gmail.com",
      name: "test",
      password: "hello world",
    })
    .expect(201);
  // make sure we are returning the user instance
  expect(Object.keys(response.body)).toContain("user");
  // make sure we are returning token with user instance
  expect(Object.keys(response.body.user)).toContain("token");
});

test("should not login with invalid credentials", async () => {
  await request(app)
    .post(ROUTE_PREFIX + "/users")
    .send({
      email: "test@gmail.com",
      name: "test",
      password: "hello world",
    })
    .expect(201);

  await request(app)
    .post(ROUTE_PREFIX + "/users/login")
    .send({
      email: "test@gmail.com",
      password: "wrong password",
    })
    .expect(400);
});

test("should login with valid credentials", async () => {
  await request(app)
    .post(ROUTE_PREFIX + "/users")
    .send({
      email: "test@gmail.com",
      name: "test",
      password: "hello world",
    })
    .expect(201);

  await request(app)
    .post(ROUTE_PREFIX + "/users/login")
    .send({
      email: "test@gmail.com",
      password: "hello world",
    })
    .expect(200);
});
