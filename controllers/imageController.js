// Importing required models and utility functions
const Albums = require("../models/Albums");
const Comments = require("../models/Comments");
const Images = require("../models/Images");
const Likes = require("../models/Likes");
const ImageAlbumlink = require("../models/ImageAlbumLink");
const getFileURL = require("../utils/cloudinaryConfig");

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

    res.status(200).json({ message: "Image uploaded successfully", image: newImage });
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
      likes_count:  likesData.length == 0 ? 0 : likesData[0].likes_count,
      comments: commentsData,
    };

    res.status(201).json(imageDetails);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller for POST /create-album
const createAlbum = async (req, res) => {
  try {
    const { title, description } = req.body;
    const file = req.file;
    const url = await getFileURL(file);

    // Creating a new album document and saving it to the database
    const album = new Albums({
      title: title,
      description: description,
      album_image: url,
    });
    await album.save();

    res.status(201).json({ message: "Album created successfully", album: album });
  } catch (error) {
    console.error("Error creating album:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller for POST /:id/add-image
const addImageToAlbum = async (req, res) => {
  try {
    const { imageId, albumTitle } = req.body;
    const albumId = req.params.id;

    // Check if the combination of imageId and albumId already exists in a single object
    const existingLink = await ImageAlbumlink.findOne({
      image_id: imageId,
      album_id: albumId,
    });

    if (existingLink) {
      // If the link already exists, return a message indicating it
      return res.status(400).json({ message: "Already exists!" });
    }

    // If the link doesn't exist, create a new entry in the ImageAlbumlink collection
    const result = await ImageAlbumlink.create({
      image_id: imageId,
      album_id: albumId,
    });

    res.status(200).json({ message: `Image added to ${albumTitle}` });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller for GET /albums
const getAlbums = async (req, res) => {
  try {
    // Fetching all albums from the database
    const albums = await Albums.find();
    res.status(200).json(albums);
  } catch (error) {
    console.error("Error fetching albums:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller for GET /albums/:id
const getAlbumDetails = async (req, res) => {
  try {
    const albumId = req.params.id;

    // Find all the entries in the ImageAlbumlink collection with the given album_id
    const albumLinks = await ImageAlbumlink.find({ album_id: albumId });

    if (!albumLinks || albumLinks.length === 0) {
      return res.status(404).json({ error: "Album not found" });
    }

    // Get all the image ids from the album links
    const imageIds = albumLinks.map((link) => link.image_id);

    // Find all the images with the image ids from the album
    const albumImages = await Images.find({ _id: { $in: imageIds } });

    if (!albumImages || albumImages.length === 0) {
      return res.status(404).json({ error: "No images found in the album" });
    }

    res.status(200).json(albumImages);
  } catch (error) {
    console.error("Error fetching album:", error);
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

    res.status(200).json({ message: "Commented successfully", comment: newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller for POST /search
const search = async (req, res) => {
  try {
    const { keyword } = req.body;

    // Use regular expression with case-insensitive search for more flexible matching
    const regex = new RegExp(keyword, "i");
    const images = await Images.find({ caption: regex }).lean();

    res.status(200).json({ images });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller for POST /filter
const filter = async (req, res) => {
  try {
    const { criteria } = req.body;
    let filterOptions = {};

    if (criteria === "most_commented") {
      filterOptions = { comments_count: -1 };
    } else if (criteria === "most_liked") {
      filterOptions = { likes_count: -1 };
    } else if (criteria === "most_recent") {
      filterOptions = { createdAt: -1 };
    } else {
      throw new Error("Invalid filter criteria");
    }

    let images;
    if (criteria === "most_commented" || criteria === "most_liked") {
      // Get all images and populate likes and comments counts
      images = await Images.find({}).lean();

      for (let i = 0; i < images.length; i++) {
        const imageId = images[i]._id;

        // Get likes count
        const likes = await Likes.find({ image_id: imageId }).lean();
        images[i].likes_count = likes.length;

        // Get comments count
        const comments = await Comments.find({ image_Id: imageId }).lean();
        images[i].comments_count = comments.length;
      }

      // Sort the images based on the filter options
      images.sort((a, b) => b[filterOptions] - a[filterOptions]);

      // Get the top 5 images
      images = images.slice(0, 5);
    } else if (criteria === "most_recent") {
      images = await Images.find({}, null, {
        sort: filterOptions,
        limit: 5,
      }).lean();
    }

    res.status(200).json(images);
  } catch (err) {
    console.error("Error retrieving filtered images:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  uploadImage,
  getAllImages,
  getImageDetails,
  createAlbum,
  addImageToAlbum,
  getAlbums,
  getAlbumDetails,
  addLike,
  addComment,
  search,
  filter,
};