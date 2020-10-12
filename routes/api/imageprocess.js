const express = require("express");
const router = express.Router();

const axios = require("axios");
const { response } = require("express");

const { JSDOM } = require("jsdom");
const dom = new JSDOM("");
const canvas = require("canvas");
global.document = dom.window.document;
global.HTMLVideoElement = dom.window.HTMLVideoElement;


global.fetch = require("node-fetch");

// Import tensorflow for node
const tf = require("@tensorflow/tfjs");
const tmImage = require("@teachablemachine/image");

// URL for the built ML model
const URL = 'https://teachablemachine.withgoogle.com/models/XV5e-6dgo/';

// Declare model and preds
let model, maxPredictions;

// Load Teachable Machine Model
async function loadTeachableMachineModel() {

  const modelURL = URL + 'model.json';
  const metadataURL = URL + 'metadata.json';

  model = await tmImage.load(modelURL, metadataURL);
  // maxPredictions = model.getTotalClasses();

  return model;
}

router.post("/", (req, res) => {
  // Fetching the state selected
  var image_data = req.body.data;
  // console.log(req.body.data);
  async function process(imageData) {
    
    const image = new canvas.Image();
     image.src = imageData;
     
     // Load model
     const model = await loadTeachableMachineModel();

     // Get top prediction
     const prediction = await model.predictTopK(image, maxPredictions = 1, false);
    //  console.log(prediction);

    // Send Predicgtion to show on the frontend
     res.send(prediction);
   
   }
   process(image_data);
  
});

module.exports = router;