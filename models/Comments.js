const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    image_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Images",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comments", commentSchema);

