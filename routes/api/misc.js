const express = require("express");
const router = express.Router();

const Parser = require("rss-parser");
const e = require("express");
const parser = new Parser();

//@route GET api/misc/location
//@desc get suburb, postcode in Australia
//@access Public
router.get('location', (req, res) => {
    const locations =require('../api/data/locations.json')
    res.send(locations)
});