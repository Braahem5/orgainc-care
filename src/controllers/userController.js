const User = require("../models/User");
const UserNotUPDated = require("../utils/customErrors/UserNotUPDated");
const logger = require("../utils/logger/logger");

const createUser = async (req, res) => {
  // Create a user
};

const getUsers = async (req, res) => {
  // Get all users
  try {
    const users = await User.find();
    if (!users) throw new Error("No Users Found!");
    return res.status(200).json({ success: true, data: users });
  } catch (err) {
    console.log(`Error getting all users: ${err}`);
    logger.error(`Error getting all users: ${err}`);
    return res.status(404).json({ message: "No Users found." });
  }
};

// Get a specific user by ID
const getUser = async (req, res) => {
  try {
    const userId = req.query.user_Id;
    const user = await User.findById(userId);
    if (!user) throw new NotFound("User not found!");
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    logger.error(`Error getting all user: ${err}`);
    return res.status(404).send({ message: "No User found." });
  }
};

// Update a user by ID
const updateUser = async (req, res) => {
  try {
    const userId = req.query.user_Id;
    const { name, email } = req.body;
    const user = await User.findOneAndUpdate(
      userId,
      { name, email },
      { new: true }
    );
    if (!user) throw new UserNotUPDated("User not updated!");
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error(`Error updating user: ${err}`);
    logger.error(`Error updating  user: ${err}`);
    return res.status(500).send({ message: "Failed upadating user." });
  }
};

//Delete a user by ID
const deleteUser = async (req, res) => {
  const userId = req.query.user_Id;
  try {
    const deletedUser = await User.findOneAndDelete(userId);
    if (!deletedUser) {
      throw new UserNotFoundError("Failed Deleting User.");
    }
    return res.status(204).send();
  } catch (error) {
    console.error(`Error Deleting User: ${err}`);
    logger.error(`Error Deleting  ser: ${err}`);
    return res.status(404).send({ message: "Failed Deleting User." });
  }
};

module.exports = { createUser, getUsers, getUser, updateUser, deleteUser };
