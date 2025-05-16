const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const photoRouter = require("./routes/PhotoRouter");
const CommentRouter = require("./routes/CommentRouter");

dbConnect();

app.use(cors());
app.use(express.json());
app.use("/api/user", UserRouter);
app.use("/api/photosOfUser", photoRouter);

// Serve static image files from the photo-sharing-v1 project
app.use("/images", express.static(path.join(__dirname, "../photo-sharing-v1/public/images")));

app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});

app.listen(8081, () => {
  console.log("server listening on port 8081");
});