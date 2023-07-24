const mongoose = require("mongoose");

const imageAlbumLinkSchema = new mongoose.Schema(
  {
    image_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Images",
      required: true,
    },
    album_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Albums",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ImageAlbumLink", imageAlbumLinkSchema);