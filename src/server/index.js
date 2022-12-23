require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");
const { Map } = require('immutable');

const app = express();
const port = 3000;
const rovers = Map({1:'Curiosity', 2: "Opportunity", 3:"Spirit"});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "../public")));

// Mission manifest API call
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

// Looping over the Map 'rovers' for the photos API calls
const getPhotos = (rovers) => {

  for(let i = 1; i<=rovers.size; i++){
    app.get(`/${rovers.get(i+'')}/:sol`, async (req, res) => {
    try {
      let image = await fetch(
        `https://api.nasa.gov/mars-photos/api/v1/rovers/${rovers.get(i+'')}/photos?sol=${req.params.sol}&api_key=${process.env.API_KEY}`
      ).then((res) => res.json());
      res.send({ image });
    } catch (err) {
      console.log("error:", err);
    }
  });
  }

}

getPhotos(rovers);

app.listen(port, () => console.log(`MarsDashboard app listening on port ${port}!`));

