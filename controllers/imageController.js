// Importing required models and utility functions
const Albums = require("../models/Albums");
const Comments = require("../models/Comments");
const Images = require("../models/Images");
const Likes = require("../models/Likes");
const ImageAlbumlink = require("../models/ImageAlbumLink");
const getFileURL = require("../utils/cloudinaryConfig");
const { EventEmitter } = require("events");

const myEmitter = new EventEmitter();

// Increase the maximum listeners limit to 20
myEmitter.setMaxListeners(20);
// Controller for POST /upload
const uploadImage = async (req, res) => {
  try {
    // Extracting necessary data from request
    const { caption } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }
    if (!caption) {
      return res.status(400).json({ message: "No caption written!" });
    }

    const file = req.file;
    const url = await getFileURL(file);

    // Creating a new image document and saving it to the database
    const newImage = new Images({
      caption: caption,
      filename: file.originalname,
      image_url: url,
    });
    await newImage.save();

    res
      .status(200)
      .json({ message: "Image uploaded successfully", image: newImage });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller for GET /get-images
const getAllImages = async (req, res) => {
  try {
    // Fetching all images from the database
    const images = await Images.find();
    res.status(200).json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller for GET /images/:id
const getImageDetails = async (req, res) => {
  try {
    const imageId = req.params.id;

    // Finding the image with the given id
    const image = await Images.findOne({ _id: imageId });
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Fetching additional data related to the image (likes and comments)
    const likesData = await Likes.find({ image_id: image._id });
    const commentsData = await Comments.find({ image_Id: image._id });

    // Preparing the image details response
    const imageDetails = {
      caption: image.caption,
      path: image.path,
      image_url: image.image_url,
      album_Id: image.album_Id,
      likes_count: likesData.length == 0 ? 0 : likesData[0].likes_count,
      comments: commentsData,
    };

    res.status(201).json(imageDetails);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



// Controller for POST /images/:id/add-like
const addLike = async (req, res) => {
  try {
    const imageId = req.params.id;

    // Find the existing Likes document by imageId and update it or create a new one if it doesn't exist
    const liked = await Likes.findOneAndUpdate(
      { image_id: imageId },
      { $inc: { likes_count: 1 } }, // Increment the likes_count field by 1
      { upsert: true } // Create a new document if it doesn't exist
    );

    res.status(200).json({ message: "Image liked successfully" });
  } catch (error) {
    console.error("Error adding like:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller for POST /images/:id/add-comment
const addComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const imageId = req.params.id;

    // Creating a new comment document and saving it to the database
    const newComment = new Comments({
      image_Id: imageId,
      comment: comment,
    });
    await newComment.save();

    res
      .status(200)
      .json({ message: "Commented successfully", comment: newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
  uploadImage,
  getAllImages,
  getImageDetails,
  addLike,
  addComment,
};
