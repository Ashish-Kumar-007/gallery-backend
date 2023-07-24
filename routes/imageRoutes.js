const express = require("express");
const controller = require("../controllers/imageController");
const albumController = require("../controllers/albumController")
const actionController = require("../controllers/actionController")
const upload = require("../utils/multerConfig");
const router = express.Router();

router.post("/upload", upload.single("image"), controller.uploadImage);

// image routes
router.get("/get-images", controller.getAllImages);
router.get("/images/:id", controller.getImageDetails);
router.post("/images/:id/add-like", controller.addLike);
router.post("/images/:id/add-comment", controller.addComment);

// Action routes
router.get("/search", actionController.search);
router.get("/filter-images", actionController.filter);
// router.get("/images/:id/download", actionController.downloadImage);

// Album routes 
router.post("/create-album", upload.single("image"), albumController.createAlbum);
router.post("/:id/image-id", albumController.addImageToAlbum);
router.get("/albums", albumController.getAlbums);
router.get("/albums/:id", albumController.getAlbumDetails);

module.exports = router;
