// Importing required models and utility functions
const Comments = require("../models/Comments");
const Images = require("../models/Images");
const Likes = require("../models/Likes");

// Controller for POST /search
const search = async (req, res) => {
  try {
    const { keyword } = req.body;

    // Use regular expression with case-insensitive search for more flexible matching
    const regex = new RegExp(keyword, "i");
    const images = await Images.find({ caption: regex }).lean();
    console.log(images);
    res.status(200).json({ images });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller for POST /filter
const filter = async (req, res) => {
  try {
    const { filter } = req.query;
    const criteria = filter.toString().toLowerCase(); // Convert the filter to lowercase for consistency

    let images;
    if (criteria === "most commented" || criteria === "most liked") {
      // Get all images and populate likes and comments counts
      images = await Images.find({}).lean();

      for (let i = 0; i < images.length; i++) {
        const imageId = images[i]._id;
        // console.log(imageId);
        // Get likes count
        const likes = await Likes.find({ image_id: imageId }).lean();
        images[i].likes_count = likes.likes_count;

        // Get comments count
        const comments = await Comments.find({ image_Id: imageId }).lean();
        images[i].comments_count = comments.length;
      }

      // Sort the images based on the filter options
      images.sort((a, b) => b[`${criteria}_count`] - a[`${criteria}_count`]);

      // Get the top 5 images
      images = images.slice(0, 5);
    } else if (criteria === "most recent") {
      images = await Images.find({}, null, {
        sort: { createdAt: -1 }, // Sort by the createdAt field in descending order (most recent first)
        limit: 5,
      }).lean();
    } else {
      throw new Error("Invalid filter criteria");
    }

    res.status(200).json(images);
  } catch (err) {
    console.error("Error retrieving filtered images:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller for GET /images/:id/download
// const downloadImage = async (req, res) => {
//   try {
//     const imageId = req.params.id;
//     console.log(imageId);
//     const imageData = await Images.findById({ _id: imageId });
//     res.status(200).download(imageData.image_url);
//     console.log(imageData);
//   } catch (error) {
//     console.error("Error", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

module.exports = {
  search,
  filter,
//   downloadImage,
};
