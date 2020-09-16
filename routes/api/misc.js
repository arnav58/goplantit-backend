const express = require("express");
const router = express.Router();
const { response } = require("express");


//@route GET api/misc/location
//@desc get suburb, postcode in Australia
//@access Public
router.get('/location', (req, res) => {
    const locations =require('../api/data/locations.json')
    res.send(locations)
});

module.exports = router;