const supertest = require("supertest");
const app = require("../app");
const { dbConnect, dbDisconnect } = require("./test-utils/dbConcUtils");
const { createShowtimingEntry } = require("./test-utils/dbUtils");

beforeAll(async () => dbConnect());
afterAll(async () => dbDisconnect());
const instance = supertest(app);

const user = {
  username: "testUser",
  password: "123test",
  email: "email@test.com",
};

const payload = {
  hallId: "624c6f1bdb6f7158e3101686",
  movieId: "624c5f3c39c252e0c0e3e8c0",
  showTimes: [
    {
      start: 900,
      availableSeats: 20,
    },
  ],
};

describe("/api/v1/movies", () => {
  test("should return with status code 200", async () => {
    const { status, text } = await instance.get("/api/v1/movies");
    expect(status).toBe(200);
    expect(JSON.parse(text)).toEqual({ data: [] });
  });
  test("should return with status code 201", async () => {
    const payload = {
      movieName: "test",
      duration: 110,
    };
    const response = await instance.post("/api/v1/movies").send(payload);
    const { status, text } = response;
    const { movieName, duration } = JSON.parse(text).data;
    expect(status).toBe(201);
    expect(movieName).toBe(payload.movieName);
    expect(duration).toBe(payload.duration);
  });
});

describe("/api/v1/movies/movieHalls", () => {
  test("should return with status code 200", async () => {
    const { status, text } = await instance.get("/api/v1/movies/movieHalls");
    expect(status).toBe(200);
    expect(JSON.parse(text)).toEqual({ data: [] });
  });
  test("should return with status code 201", async () => {
    const payload = {
      hallName: "testHall",
    };
    const response = await instance
      .post("/api/v1/movies/movieHalls")
      .send(payload);
    const { status, text } = response;
    const { hallName } = JSON.parse(text).data;
    expect(status).toBe(201);
    expect(hallName).toBe(payload.hallName);
  });
});

describe("/api/v1/movies/showTimings", () => {
  createShowtimingEntry(payload);
  test("should return result with status code 200", async () => {
    const response = await instance.get("/api/v1/movies/showTimings");
    const { status, text } = response;
    const { data } = JSON.parse(text);
    const { hallId, movieId, showTimes } = data[0];
    expect(status).toBe(200);
    expect(hallId).toBe(payload.hallId);
    expect(movieId).toBe(payload.movieId);
    expect(showTimes[0].start).toBe(payload.showTimes[0].start);
    expect(showTimes[0].availableSeats).toBe(
      payload.showTimes[0].availableSeats
    );
  });
  test("should return result with query aparameters", async () => {
    const response = await instance.get("/api/v1/movies/showTimings").query({
      hallId: "624c6f1bdb6f7158e3101686",
    });
    const { status, text } = response;
    const { data } = JSON.parse(text);
    const { hallId, movieId, showTimes } = data[0];
    expect(status).toBe(200);
    expect(hallId).toBe(payload.hallId);
    expect(movieId).toBe(payload.movieId);
    expect(showTimes[0].start).toBe(payload.showTimes[0].start);
    expect(showTimes[0].availableSeats).toBe(
      payload.showTimes[0].availableSeats
    );
  });
  test("should return empty result if query params donot match", async () => {
    const response = await instance.get("/api/v1/movies/showTimings").query({
      hallId: "624c6f1bdb6f7158e3101687",
    });
    const { status, text } = response;
    expect(status).toBe(200);
    expect(JSON.parse(text)).toEqual({ data: [] });
  });
  test("should return unauthorised if post request is made without access token", async () => {
    const response = await instance.post("/api/v1/movies/showTimings").send({
      quantity: 2,
      hallId: payload.hallId,
      movieId: payload.movieId,
      time: payload.showTimes[0].start,
    });
    const { status } = response;
    expect(status).toBe(401);
  });
  test("should return status 200 if post request is made with access token", async () => {
    await instance.post("/api/v1/auth/register").send(user);
    const loginResponse = await instance.post("/api/v1/auth/login").send({
      username: user.username,
      password: user.password,
    });
    const { accessToken } = JSON.parse(loginResponse.text);
    const response = await instance
      .post("/api/v1/movies/showTimings")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        quantity: 2,
        hallId: payload.hallId,
        movieId: payload.movieId,
        time: payload.showTimes[0].start,
      });
    const { status, text } = response;
    const { success, seatsBooked } = JSON.parse(text);
    expect(status).toBe(200);
    expect(success).toBe(true);
    expect(seatsBooked).toBe(2);
  });
  test("should return status 400 if seats are unavailable for booking", async () => {
    const loginResponse = await instance.post("/api/v1/auth/login").send({
      username: user.username,
      password: user.password,
    });
    const { accessToken } = JSON.parse(loginResponse.text);
    const response = await instance
      .post("/api/v1/movies/showTimings")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        quantity: 60,
        hallId: payload.hallId,
        movieId: payload.movieId,
        time: payload.showTimes[0].start,
      });
    const { status } = response;
    expect(status).toBe(400);
  });
});
