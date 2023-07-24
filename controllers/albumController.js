// Importing required models and utility functions
const Albums = require("../models/Albums");
const Images = require("../models/Images");
const ImageAlbumlink = require("../models/ImageAlbumLink");
const getFileURL = require("../utils/cloudinaryConfig");

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

    res
      .status(201)
      .json({ message: "Album created successfully", album: album });
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

module.exports = {
  createAlbum,
  addImageToAlbum,
  getAlbums,
  getAlbumDetails,
};
