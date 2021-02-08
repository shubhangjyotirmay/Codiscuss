require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

const PORT = 3000 || process.env.PORT;

mongoose.connect("mongodb://localhost:27017/Codiscuss", {useNewUrlParser:true, useUnifiedTopology:true});
mongoose.connection.on("connected", () => {
    console.log("Connected to Database!");
});
mongoose.connection.on("error", () => {
    console.log("Failed to connect to database!");
});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.listen(PORT, () => {
    console.log("Server Started!");
});