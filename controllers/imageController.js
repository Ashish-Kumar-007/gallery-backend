const Albums = require("../models/Albums");
const Comments = require("../models/Comments");
const Images = require("../models/Images");
const Likes = require("../models/Likes");
const ImageAlbumlink = require("../models/ImageAlbumlink");
const getFileURL = require("../utils/cloudinaryConfig");

// Controller for POST /upload
const uploadImage = async (req, res) => {
  try {
    console.log(req.body);
    const { caption } = req.body;
    // const { originalname, buffer } = req.file;
    const file = req.file;
    const url = await getFileURL(file);
    console.log(url);

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
    const image = await Images.findOne({ _id: imageId });
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    Images.findOne({ _id: imageId })
      .then((image) => {
        if (!image) {
          return res.status(404).json({ error: "Image not found" });
        } else {
          const imageDetails = {
            caption: image.caption,
            path: image.path,
            image_url: image.image_url,
            album_Id: image.album_Id,
            likes_count: 0,
            comments: [],
          };

          Likes.find({ image_Id: image._id })
            .then((likesData) => {
              imageDetails.likes_count = likesData.length;

              Comments.find({ image_Id: image._id })
                .then((commentsData) => {
                  imageDetails.comments = commentsData;
                  console.log(
                    "Image details with like counts and comments:",
                    imageDetails
                  );
                  res.status(201).json(imageDetails);
                })
                .catch((err) => {
                  console.error("Error finding comments:", err);
                  res.status(500).json({ error: "Internal server error" });
                });
            })
            .catch((err) => {
              console.error("Error finding likes:", err);
              res.status(500).json({ error: "Internal server error" });
            });
        }
      })
      .catch((err) => {
        console.error("Error in finding image:", err);
        res.status(500).json({ error: "Internal server error" });
      });
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller for POST /create-album
const createAlbum = async (req, res) => {
  try {
    const { title, description} = req.body;
    console.log(req.body)
    const file = req.file;
    const url = await getFileURL(file);
    console.log(url);

    // Create a new album document
    const album = new Albums({
      title: title,
      description: description,
      album_image: url
    });

    // Save the new album to the database
    await album.save();
    console.log(album._id);
    // Create a new linking document to associate the image with the album
    // const newAlbumLink = new ImageAlbumlink({
    //   imageId: image_id,  // Use "imageId" instead of "image_id" as per the schema
    //   albumId: album._id, // Use "albumId" instead of "album_id" as per the schema
    // });

    // // Save the linking document to the database
    // await newAlbumLink.save();

    res
      .status(201)
      .json({ message: "Album created successfully", album: album });
  } catch (error) {
    console.error("Error creating album:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller for GET /albums
const getAlbums = async (req, res) => {
  try {
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
    const album = await ImageAlbumlink.find({ album_id: albumId });
    if (!album) {
      return res.status(404).json({ error: "Album not found" });
    }
    res.status(200).json(album);
  } catch (error) {
    console.error("Error fetching album:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller for POST /images/:id
const addLike = async (req, res) => {
  try {
    console.log(req.params.id);
    const imageId = req.params.id;

    // Fetch the existing likes for the image from the Likes collection
    const existingLikes = await Likes.findOne({ image_id: imageId });

    // Calculate the new likes_count based on the existing likes
    const likes_count = existingLikes ? existingLikes.likes_count + 1 : 1;

    // Create or update the like entry for the image
    await Likes.updateOne(
      { image_id: imageId },
      { image_id: imageId, likes_count: likes_count },
      { upsert: true } // Use upsert option to create a new entry if it doesn't exist
    );

    res.status(200).json({ message: "Image liked successfully" });
  } catch (error) {
    console.error("Error adding like:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller for POST /images/:id
const addComment = async (req, res) => {
  try {
    console.log(req.params.id, req.body);
    const {comment} = req.body
    const imageId = req.params.id;

    const newComment = new Comments({
      image_Id: imageId,
      comment: comment
    })

    await newComment.save()

    res.status(200).json({ message: "commented successfully", comment: newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const removeLike = async (req, res) => {
  try {
    console.log(req.params.id);
    const imageId = req.params.id;

    // Fetch the existing likes for the image from the Likes collection
    const existingLikes = await Likes.findOne({ image_id: imageId });

    // Calculate the new likes_count based on the existing likes
    const likes_count = existingLikes ? existingLikes.likes_count + 1 : 1;

    // Create or update the like entry for the image
    await Likes.updateOne(
      { image_id: imageId },
      { image_id: imageId, likes_count: likes_count },
      { upsert: true } // Use upsert option to create a new entry if it doesn't exist
    );

    res.status(200).json({ message: "Image liked successfully" });
  } catch (error) {
    console.error("Error adding like:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  uploadImage,
  getAllImages,
  getImageDetails,
  createAlbum,
  getAlbums,
  getAlbumDetails,
  addLike,
  removeLike,
  addComment
};
