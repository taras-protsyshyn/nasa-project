const request = require("supertest");
const app = require("../../app");

describe("Test GET/launches", () => {
  test("It should respond with 200 success", async () => {
    await request(app).get("/launches").expect(200);
  });
});

describe("Test POST/launches", () => {
  const launchDataWithoutDate = {
    mission: "Test",
    rocket: "Explorer IS2",
    target: "Kepler-168 f",
  };

  const launchDataWithInvalidDate = {
    ...launchDataWithoutDate,
    launchDate: "Hello",
  };

  const launchData = {
    ...launchDataWithoutDate,
    launchDate: "January 16, 2030",
  };

  test("It should respond with 201 success", async () => {
    const res = await request(app)
      .post("/launches")
      .send(launchData)
      .expect("Content-Type", /json/)
      .expect(201);
    const reqDate = new Date(launchData.launchDate).valueOf();
    const resDate = new Date(res.body.launchDate).valueOf();

    expect(reqDate).toBe(resDate);
    expect(res.body).toMatchObject(launchDataWithoutDate);
  });

  test("It should catch missing require properties", async () => {
    await request(app)
      .post("/launches")
      .send(launchDataWithoutDate)
      .expect("Content-Type", /json/)
      .expect(400);
  });

  test("It should catch invalid date", async () => {
    await request(app)
      .post("/launches")
      .send(launchDataWithInvalidDate)
      .expect("Content-Type", /json/)
      .expect(400);
  });
});
