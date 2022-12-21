require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "../public")));

// your API calls
app.get('/manifest/:rover(curiosity|opportunity|spirit)?', async (req, res) => {
    var rover = req.params.rover;
    try {
        let response = await fetch(
            `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=${process.env.API_KEY}`
        ).then((res) => res.json());
        res.send({ response });
    } catch (err) {
        console.log("error:", err);
    }
});

app.get("/Curiosity/:sol", async (req, res) => {
  try {
    let image = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${req.params.sol}&api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ image });
  } catch (err) {
    console.log("error:", err);
  }
});

app.get("/Opportunity/:sol", async (req, res) => {
  try {
    let image = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/opportunity/photos?sol=${req.params.sol}&api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ image });
  } catch (err) {
    console.log("error:", err);
  }
});

app.get("/Spirit/:sol", async (req, res) => {
  try {
    let image = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/spirit/photos?sol=${req.params.sol}&api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ image });
  } catch (err) {
    console.log("error:", err);
  }
});

app.listen(port, () => console.log(`MarsDashboard app listening on port ${port}!`));

