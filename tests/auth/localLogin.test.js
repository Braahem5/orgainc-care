const request = require("supertest");
const app = require("../../server");
const User = require("../../src/models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Mock User.findOne method to simulate database behavior
jest.mock("../../src/models/user", () => ({
  findOne: jest.fn(),
}));

// Mock bcrypt.compare method
jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

// Mock jwt.sign method
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe("Login function", () => {
  it("should return a 422 status and validation errors if request parameters are invalid", async () => {
    const response = await request(app).post("/login").send({
      /* Invalid request body */
    });

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty("success", false);
    expect(response.body).toHaveProperty("error");
  });

  it("should return a 404 status if the user is not found", async () => {
    // Mock User.findOne to return null, simulating user not found
    User.findOne.mockResolvedValue(null);

    const response = await request(app)
      .post("/login")
      .send({ username: "nonexistentuser", password: "password" });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("success", false);
    expect(response.body).toHaveProperty("message", "User not found");
  });

  it("should return a 401 status if the provided password is incorrect", async () => {
    // Mock User.findOne to return a user
    User.findOne.mockResolvedValue({
      username: "existinguser",
      password: "hashedpassword",
    });

    // Mock bcrypt.compare to return false, simulating incorrect password
    bcrypt.compare.mockResolvedValue(false);

    const response = await request(app)
      .post("/api/auth/login")
      .send({ username: "existinguser", password: "incorrectpassword" });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("success", false);
    expect(response.body).toHaveProperty("message", "Password incorrect");
  });

  it("should return a 200 status with a JWT token if authentication is successful", async () => {
    // Mock User.findOne to return a user
    const mockUser = {
      _id: "123456",
      username: "existinguser",
      password: "hashedpassword",
      email: "user@example.com",
      role: "user",
    };
    User.findOne.mockResolvedValue(mockUser);

    // Mock bcrypt.compare to return true, simulating correct password
    bcrypt.compare.mockResolvedValue(true);

    // Mock jwt.sign to return a mock token
    jwt.sign.mockReturnValue("mockedjwt");

    const response = await request(app)
      .post("/api/auth/login")
      .send({ username: "existinguser", password: "correctpassword" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty("message", "Authenticated!");
    expect(response.body).toHaveProperty("token", "Bearer mockedjwt");
  });

  it("should return a 500 status and an error message if an internal server error occurs", async () => {
    // Mock User.findOne to throw an error, simulating an internal server error
    User.findOne.mockRejectedValue(new Error("Mocked internal server error"));

    const response = await request(app)
      .post("/api/auth/login")
      .send({ username: "existinguser", password: "correctpassword" });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("success", false);
    expect(response.body).toHaveProperty("message", "Internal server error");
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
