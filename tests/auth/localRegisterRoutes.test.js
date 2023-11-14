const request = require("supertest");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const app = require("../../server"); 
const User = require("../../src/models/User"); 

jest.mock("bcrypt");

// Mock User.findOne method to simulate database behavior
jest.mock("../../src/models/user", () => ({
  findOne: jest.fn(),
}));
jest.mock("express-validator");

describe("Register Endpoint", () => {
  it("should register a new user successfully with local authentication", async () => {
    const newUser = {
      authMethod: "local",
      username: "testuser",
      email: "test@example.com",
      password: "testpassword",
    };

    // Mock bcrypt functions
    bcrypt.genSalt.mockResolvedValue("salt");
    bcrypt.hash.mockResolvedValue("hashedpassword");

    // Mock express-validator
    validationResult.mockReturnValue({ isEmpty: () => true });

    // Mock User model functions
    User.findOne.mockResolvedValue(null);
    User.prototype.save.mockResolvedValue({
      _id: "fakeUserId",
      username: newUser.username,
      email: newUser.email,
      role: "user",
    });

    const res = await request(app)
      .post("/api/auth/local-register")
      .send(newUser)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Account Created");
    expect(res.body.token).toBeDefined();

    // Clean up: Reset the mock state
    jest.resetAllMocks();
  });

  it("should return a 400 status for an invalid authentication method", async () => {
    const invalidUser = {
      authMethod: "invalid",
      username: "testuser",
      email: "test@example.com",
      password: "testpassword",
    };

    await request(app)
      .post("/api/auth/local-register")
      .send(invalidUser)
      .expect(400);
  });

  it("should return a 422 status and validation errors for invalid input", async () => {
    const invalidUser = {
      authMethod: "local",
      username: "testuser",
      email: "invalid-email", // Invalid email format
      password: "testpassword",
    };

    // Mock express-validator
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ param: "email", msg: "Invalid email format" }],
    });

    const res = await request(app)
      .post("/api/auth/local-register")
      .send(invalidUser)
      .expect(422);

    expect(res.body.errors).toBeDefined();
    expect(res.body.errors.length).toBeGreaterThan(0);
    expect(res.body.errors[0].param).toBe("email");
    expect(res.body.errors[0].msg).toBe("Invalid email format");
  });

  it("should return a 409 status for an existing email address with local authentication", async () => {
    // Assuming there's already a user with the email 'existing@example.com'
    User.findOne.mockResolvedValue({
      _id: "existingUserId",
      username: "existinguser",
      email: "existing@example.com",
      role: "user",
    });

    const existingUser = {
      authMethod: "local",
      username: "existinguser",
      email: "existing@example.com",
      password: "existingpassword",
    };

    const res = await request(app)
      .post("/api/auth/local-register")
      .send(existingUser)
      .expect(409);

    expect(res.body.error).toBe("Email already in use");
  });

  // Clean up: Reset the mock state after all tests
  afterAll(() => {
    jest.restoreAllMocks();
  });
});
