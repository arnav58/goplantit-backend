const express = require("express");
const router = express.Router();

const Parser = require('rss-parser');
const parser = new Parser();

  //@route GET api/warnings
  //@desc  return the parsed json object of the severe weather warnings
  //@access Public
  router.get("/", (req, res) => {
    // Parsing the warnings data for Victoria
    parser.parseURL('http://www.bom.gov.au/fwo/IDZ00059.warnings_vic.xml', function(err, parsed) {
        // Returning the json array of all warnings issued.
        res.json(parsed.items);
    });
  })

module.exports=router;