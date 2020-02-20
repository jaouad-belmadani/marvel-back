const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const formidableMiddleware = require("express-formidable");
const uid2 = require("uid2");
app.use(cors());
app.use(formidableMiddleware());

const md5 = require("md5");
const publicKey = process.env.REACT_APP_PUBLIC_KEY;
const privateKey = process.env.REACT_APP_PRIVATE_KEY;
const ts = uid2(8);
const hash = md5(ts + privateKey + publicKey);

app.get("/characters", async (req, res) => {
  try {
    const response = await axios.get(
      `http://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=100&offset=0`
    );
    console.log(response.data);

    res.json(response.data);
  } catch (error) {
    console.error(error.message);
  }
});

app.get("/characters/comics/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const response = await axios.get(
      `http://gateway.marvel.com/v1/public/characters/${id}/comics?ts=${ts}&apikey=${publicKey}&hash=${hash}`
    );
    console.log(response.data.data.results);
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
  }
});

app.get("/comics", async (req, res) => {
  try {
    const response = await axios.get(
      `http://gateway.marvel.com/v1/public/comics?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=100&offset=0`
    );
    console.log(response.data.data.results);
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
  }
});

app.all("*", function(req, res) {
  res.json({ message: "all routes" });
});
app.listen(3001, () => {
  console.log("server has started");
});
