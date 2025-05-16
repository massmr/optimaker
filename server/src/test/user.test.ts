import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import User from "../models/User";
import dotenv from "dotenv";
dotenv.config();

beforeAll(async () => {
  // Connecte à la base de test (tu peux utiliser une URI différente si besoin)
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI non défini");
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

afterEach(async () => {
  // Nettoie la collection User après chaque test
  await User.deleteMany({});
});

describe("POST /api/users/register", () => {
  it("should register a new project-owner", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({
        email: "owner@example.com",
        password: "password123",
        role: "project_owner",
        name: "Project Owner"
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.user).toHaveProperty("email", "owner@example.com");
    expect(res.body.user).toHaveProperty("role", "project_owner");
  });

  it("should not allow duplicate email", async () => {
    await request(app)
      .post("/api/users/register")
      .send({
        email: "owner@example.com",
        password: "password123",
        role: "project_owner"
      });
    const res = await request(app)
      .post("/api/users/register")
      .send({
        email: "owner@example.com",
        password: "password123",
        role: "project_owner"
      });
    expect(res.statusCode).toBe(409);
  });

  it("should not allow non-project_owner role", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({
        email: "student@example.com",
        password: "password123",
        role: "student"
      });
    expect(res.statusCode).toBe(400);
  });
});