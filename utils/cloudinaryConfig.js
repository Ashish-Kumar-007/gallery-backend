const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const getFileURL = async (file) => {
  try {

    // Assuming 'file' is a path to the local file you want to upload
    const result = await cloudinary.uploader.upload(file.path);

    // console.log(result);
    return result.url; // Return the public URL of the uploaded file
  } catch (err) {
    console.error("Error uploading file:", err);
    throw err; // Rethrow the error to handle it in the calling code
  }
};

module.exports = getFileURL;
