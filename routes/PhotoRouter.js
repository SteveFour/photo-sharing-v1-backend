const express = require("express");
const Photo = require("../db/photoModel");
const router = express.Router();

router.get("/:id", async (request, response) => {
  try {
    const userId = request.params.id;
    
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return response.status(400).json({ message: "Invalid user ID format" });
    }
    
    const photos = await Photo.find({ user_id: userId })
      .populate({
        path: 'comments.user_id',
        select: '_id first_name last_name',
        model: 'Users'
      })
      .lean();
    
    // Transform the data to match the expected format
    const formattedPhotos = photos.map(photo => {
      const formattedPhoto = { ...photo };
      if (formattedPhoto.comments) {
        formattedPhoto.comments = formattedPhoto.comments.map(comment => {
          return {
            _id: comment._id,
            comment: comment.comment,
            date_time: comment.date_time,
            user: comment.user_id, // Rename user_id to user after population
            photo_id: photo._id
          };
        });
      }
      return formattedPhoto;
    });
    
    return response.status(200).json(formattedPhotos);
  } catch (error) {
    console.error("Error fetching user photos:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;