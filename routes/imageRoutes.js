const express = require("express");
const controller = require("../controllers/imageController");
const upload = require("../utils/multerConfig");
const router = express.Router();

router.post("/upload", upload.single("image"), controller.uploadImage);
router.get("/get-images", controller.getAllImages);
router.get("/images/:id", controller.getImageDetails);
router.post("/create-album", upload.single("image"), controller.createAlbum);
router.post("/:id/image-id", controller.addImageToAlbum);
router.get("/albums", controller.getAlbums);
router.get("/albums/:id", controller.getAlbumDetails);
router.post("/images/:id/add-like", controller.addLike);
router.post("/images/:id/add-comment", controller.addComment);
router.get("/search", controller.search);
router.get("/filter", controller.filter);

module.exports = router;
