const request = require("supertest");
const app = require("../../server");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/User");
const {
  handleGoogleAuthResult,
} = require("../../src/controllers/authController"); // Replace with the actual path to your function

// Mock JWT signing for testing purposes
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe("handleGoogleAuthResult", () => {
  it("should create or log in a user and return a JWT token", async () => {
    const mockReq = {
      user: {
        _id: "googleUserId",
        displayName: "John Doe",
        email: [{ value: "johndoe@example.com" }],
        photos: [{ value: "profilePicURL" }],
      },
    };

    const mockExistingUser = {
      _id: "existingUserId",
      username: "ExistingUser",
      email: "existinguser@example.com",
      role: "user",
    };

    const mockSavedUser = {
      _id: "newlyCreatedUserId",
      name: "John Doe",
      email: "johndoe@example.com",
      profilePicURL: "profilePicURL",
      googleId: "googleUserId",
      role: "user",
    };

    User.findOne = jest.fn();
    User.findOne.mockResolvedValue(mockExistingUser);

    User.prototype.save = jest.fn();
    User.prototype.save.mockResolvedValue(mockSavedUser);

    jwt.sign.mockReturnValue("mockToken");

    const response = await request(app)
      .get("/api/auth/auth/google/callback")
      .send(mockReq);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Account Created");
    expect(response.body.token).toBe("Bearer mockToken");

    expect(User.findOne).toHaveBeenCalledWith({ googleid: "googleUserId" });
    expect(User.prototype.save).not.toHaveBeenCalled();

    expect(jwt.sign).toHaveBeenCalledWith(
      {
        id: "existingUserId",
        username: "ExistingUser",
        email: "existinguser@example.com",
        role: "user",
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );
  });

  it("should handle the case when the user does not exist and fails to save the user", async () => {
    const mockReq = {
      user: {
        _id: "googleUserId",
        displayName: "John Doe",
        email: [{ value: "johndoe@example.com" }],
        photos: [{ value: "profilePicURL" }],
      },
    };

    User.findOne = jest.fn();
    User.findOne.mockResolvedValue(null);

    User.prototype.save = jest.fn();
    User.prototype.save.mockRejectedValue(new Error("Failed to save user"));

    const response = await request(app)
      .get("/api/auth/auth/google/callback")
      .send(mockReq);

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Server Error");
    expect(User.findOne).toHaveBeenCalledWith({ googleid: "googleUserId" });
    expect(User.prototype.save).toHaveBeenCalled();
  });

  it("should handle errors thrown during execution", async () => {
    const mockReq = {
      user: {
        _id: "googleUserId",
        displayName: "John Doe",
        email: [{ value: "johndoe@example.com" }],
        photos: [{ value: "profilePicURL" }],
      },
    };

    User.findOne = jest.fn();
    User.findOne.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .get("api/auth/auth/google/callback")
      .send(mockReq);

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe(
      "Server error during Google OAuth authentication"
    );
    expect(User.findOne).toHaveBeenCalledWith({ googleid: "googleUserId" });
  });
});
