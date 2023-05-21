process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("./app");
let items = require("./fakeDb");

let banana = { name: "baba", price: 3.49 };

beforeEach(function () {
  items.push(banana);
});

afterEach(function () {
  // make sure this *mutates*, not redefines, `cats`
  items.length = 0;
});

describe("GET /items", () => {
  test("Get all items", async () => {
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ items: [banana] });
  });
});

describe("GET /items/:name", () => {
  test("Get item by name", async () => {
    const res = await request(app).get(`/items/${banana.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ item: banana });
  });
  test("Responds with 404 for invalid item", async () => {
    const res = await request(app).get(`/items/icecube`);
    expect(res.statusCode).toBe(404);
  });
});

describe("POST /items", () => {
  test("Creating an item", async () => {
    const res = await request(app)
      .post("/items")
      .send({ name: "apple", price: 1.49 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ added: { name: "apple", price: 1.49 } });
  });
  test("Responds with 400 if name is missing", async () => {
    const res = await request(app).post("/items").send({});
    expect(res.statusCode).toBe(400);
  });
});

describe("/PATCH /items/:name", () => {
  test("Updating a item's name", async () => {
    const res = await request(app)
      .patch(`/items/${banana.name}`)
      .send({ name: "cherry" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      updated: { name: "cherry", price: banana.price },
    });
  });
  //   test("Responds with 404 for invalid name", async () => {
  //     const res = await request(app)
  //       .patch(`/cats/Piggles`)
  //       .send({ name: "Monster" });
  //     expect(res.statusCode).toBe(404);
  //   });
});

// describe("/DELETE /cats/:name", () => {
//   test("Deleting a cat", async () => {
//     const res = await request(app).delete(`/cats/${pickles.name}`);
//     expect(res.statusCode).toBe(200);
//     expect(res.body).toEqual({ message: "Deleted" });
//   });
//   test("Responds with 404 for deleting invalid cat", async () => {
//     const res = await request(app).delete(`/cats/hamface`);
//     expect(res.statusCode).toBe(404);
//   });
// });
