const express = require("express");
const User = require("../db/userModel");
const router = express.Router();

/**
 * POST endpoint for creating a new user - implementation not needed for this task
 */
router.post("/", async (request, response) => {
  // Implementation omitted
});

/**
 * GET endpoint for retrieving all users (minimal info for sidebar)
 * Returns only _id, first_name, last_name for each user
 */
router.get("/list", async (request, response) => {
  try {
    const users = await User.find({}, { first_name: 1, last_name: 1 });
    return response.status(200).json(users);
  } catch (error) {
    console.error("Error fetching user list:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
});

/**
 * GET endpoint for retrieving a specific user by ID
 * Returns detailed user information
 */
router.get("/:id", async (request, response) => {
  try {
    const userId = request.params.id;
    
    // Validate if userId is a valid MongoDB ObjectId
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return response.status(400).json({ message: "Invalid user ID format" });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }
    
    return response.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;