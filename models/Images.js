const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
    },
    filename: {
      type: String,
      required: true,
    },
    image_url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Images", imageSchema);
