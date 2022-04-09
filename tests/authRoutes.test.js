const supertest = require("supertest");
const app = require("../app");
const { dbConnect, dbDisconnect } = require("./test-utils/dbConcUtils");
const { createUserEntry } = require("./test-utils/dbUtils");

beforeAll(async () => dbConnect());
afterAll(async () => dbDisconnect());
const instance = supertest(app);

const payload = {
  username: "testUser",
  password: "123test",
  email: "email@test.com",
};

describe("/api/v1/auth/register", () => {
  test("should return with status code 201 if successful", async () => {
    const response = await instance.post("/api/v1/auth/register").send(payload);
    const { status, text } = response;
    const { success } = JSON.parse(text);
    expect(status).toBe(201);
    expect(success).toBe(true);
  });
  test("should return with status code 400 if password not preset", async () => {
    const response = await instance.post("/api/v1/auth/register").send({
      username: payload.username,
    });
    const { status } = response;
    expect(status).toBe(400);
  });
  test("should return with status code 409 if user already present", async () => {
    createUserEntry(payload);
    const response = await instance.post("/api/v1/auth/register").send(payload);
    const { status } = response;
    expect(status).toBe(409);
  });
});

describe("/api/v1/auth/login", () => {
  test("should return 200 if login is successful", async () => {
    const response = await instance.post("/api/v1/auth/login").send({
      username: payload.username,
      password: payload.password,
    });
    const { status, text } = response;
    const { success, accessToken } = JSON.parse(text);
    expect(status).toBe(200);
    expect(success).toBe(true);
    expect(accessToken).toBeTruthy();
  });
  test("should return 404 if user does not exist", async () => {
    createUserEntry(payload);
    const response = await instance.post("/api/v1/auth/login").send({
      username: "testUser2",
      password: payload.password,
    });
    const { status } = response;
    expect(status).toBe(404);
  });
  test("should return 400 if username is not provided", async () => {
    createUserEntry(payload);
    const response = await instance.post("/api/v1/auth/login").send({
      username: payload.username,
    });
    const { status } = response;
    expect(status).toBe(400);
  });
  test("should return 400 if password is not provided", async () => {
    createUserEntry(payload);
    const response = await instance.post("/api/v1/auth/login").send({
      password: payload.password,
    });
    const { status } = response;
    expect(status).toBe(400);
  });
});
