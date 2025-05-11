const express = require("express");
const Photo = require("../db/photoModel");
const router = express.Router();

/**
 * POST endpoint for creating a new photo - implementation not needed for this task
 */
router.post("/", async (request, response) => {
  // Implementation omitted
});

/**
 * GET endpoint for listing all photos - implementation not needed for this task
 */
router.get("/", async (request, response) => {
  // Implementation omitted
});

/**
 * GET endpoint for retrieving photos of a specific user
 * Returns photos with user_id matching the provided id
 * Each photo includes comments with minimal user information
 */
router.get("/:id", async (request, response) => {
  try {
    const userId = request.params.id;
    
    // Validate if userId is a valid MongoDB ObjectId
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return response.status(400).json({ message: "Invalid user ID format" });
    }
    
    // Find photos by user_id and populate the comments with minimal user info
    const photos = await Photo.find({ user_id: userId })
      .populate({
        path: 'comments.user',
        select: '_id first_name last_name', // Only select minimal user fields
        model: 'User' // Make sure this matches your User model name
      })
      .lean(); // Convert to plain JavaScript object for manipulation
    
    if (!photos || photos.length === 0) {
      return response.status(200).json([]); // Return empty array if no photos found
    }
    
    return response.status(200).json(photos);
  } catch (error) {
    console.error("Error fetching user photos:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;