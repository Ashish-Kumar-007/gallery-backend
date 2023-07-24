const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");
const { fileURLToPath } = require("url");
const connectDB = require("./ConnectDB/ConnectDB.js");
const multer = require("multer");
const imageRoutes = require("./routes/imageRoutes.js");
const fileUpload = require("express-fileupload");

/* CONFIGURATION */
// const __filename = fileURLToPath(const.meta.url);
// const __dirname = path.dirname(__filename);
const app = express();
// app.use(
//   fileUpload({
//     useTempFiles: true,
//   })
// );
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000", "https://secure-mock-wallet.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    headers: ["Authorization", "Content-Type"],
  })
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* FILE STORAGE */
// const storage = multer.diskStorage({
//   destination: function (req, res, cb) {
//     cb(null, "public/assets");
//   },
//   filename: function (req, res, cb) {
//     cb(null, cb.originalname);
//   },
// });
// const upload = multer({ storage });

/* MONGODB CONNECTION */
connectDB();

/* ROUTES */
app.use("/api", imageRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port: ${process.env.PORT}`);
});
