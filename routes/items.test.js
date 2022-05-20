process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const items = require('../fakeDb');

let popsicle = {name: "popsicle", price: 1.45};
let granola_bar = {name: "granola_bar", price: 2.00};
let oreo = {name: "Oreo", price: 1.80}

beforeEach(function() {
  items.push(popsicle, granola_bar)
});

afterEach(function() {
  items.length = 0;
})


describe("GET /items", () => {
  test("Get all items", async () => {
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ items: [popsicle, granola_bar] });
  });
});


describe("POST /items", () => {
  test("Creating an item", async () => {
    const res = await request(app).post("/items").send(oreo);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ added: oreo });
  });
  test("Responds with 400 for missing name", async () => {
    const res = await request(app).post("/items").send({ name: "", price: 3.50 });
    expect(res.statusCode).toBe(400);
  });
  test("Responds with 400 for missing price", async () => {
    const res = await request(app).post("/items").send({ name: "oreo" });
    expect(res.statusCode).toBe(400);
  });
  test("Responds with 400 for invalid price", async () => {
    const res = await request(app).post("/items").send({ name: "oreo", price: -1.00 });
    expect(res.statusCode).toBe(400);
  });
});


describe("GET /items", () => {
  test("Get one item", async () => {
    const res = await request(app).get("/items/popsicle");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ item: popsicle });
  });
  test("Responds with 404 for invalid item", async () => {
    const res = await request(app).get("/items/magnum");
    expect(res.statusCode).toBe(404);
  });
});


describe("PATCH /items", () => {
  test("Updating an item", async () => {
    const res = await request(app).patch("/items/popsicle").send({ name: "popsicle", price: 1.60 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ updated: {name: "popsicle", price: 1.60} })
  });
  test("Responds with 404 for invalid item", async () => {
    const res = await request(app).patch("/items/magnum").send({ name: "magnum", price: 1.60 });
    expect(res.statusCode).toBe(404);
  });
});


describe("DELETE /items", () => {
  test("Deleting an item", async () => {
    const res = await request(app).delete("/items/popsicle");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Deleted" });
  });
  test("Responds with 404 for invalid item", async () => {
    const res = await request(app).delete("/items/magnum");
    expect(res.statusCode).toBe(404);
  });
});
