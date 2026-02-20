const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

const PORT = process.env.PORT || 5000;

// If Mongo URI exists then connect
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB Connected");
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch(err => {
      console.log("MongoDB Connection Error:", err.message);
      app.listen(PORT, () => {
        console.log(`Server running without DB on port ${PORT}`);
      });
    });
} else {
  console.log("No MongoDB URI found. Running without DB.");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}