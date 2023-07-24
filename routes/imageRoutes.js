const express = require("express");
const controller = require("../controllers/imageController");
const upload = require("../utils/multerConfig");
const router = express.Router();

router.post("/upload", upload.single("image"), controller.uploadImage);
router.get("/get-images", controller.getAllImages);
router.get("/images/:id", controller.getImageDetails);
router.post("/create-album", upload.single("image"), controller.createAlbum);
router.get("/albums", controller.getAlbums);
router.get("/albums/:id", controller.getAlbumDetails);
router.post("/images/:id/add-like", controller.addLike);
router.post("/images/:id/remove-like", controller.removeLike);
router.post("/images/:id/add-comment", controller.addComment);

module.exports = router;
