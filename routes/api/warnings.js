const express = require("express");
const router = express.Router();

const Parser = require('rss-parser');
const parser = new Parser();

  //@route GET api/warnings
  //@desc  return the parsed json object of the severe weather warnings
  //@access Public
  router.get("/", (req, res) => {

    // Fetching the state selected
    var state_selected = req.query.state;

    // Handling edge case of no state selected
    if (state_selected === undefined) {
      state_selected = "VIC"
    }

    // Deciding the feed url based on the state selected.
    var feed_url = "";
    if (state_selected === "VIC") {
      feed_url = "http://www.bom.gov.au/fwo/IDZ00066.warnings_land_vic.xml";
    } else if (state_selected === "NSW") {
      feed_url = "http://www.bom.gov.au/fwo/IDZ00061.warnings_land_nsw.xml";
    } else if (state_selected === "QLD") {
      feed_url = "http://www.bom.gov.au/fwo/IDZ00063.warnings_land_qld.xml";
    } else if (state_selected === "WA") {
      feed_url = "http://www.bom.gov.au/fwo/IDZ00067.warnings_land_wa.xml";
    } else if (state_selected === "SA") {
      feed_url = "http://www.bom.gov.au/fwo/IDZ00064.warnings_land_sa.xml";
    } else if (state_selected === "TAS") {
      feed_url = "http://www.bom.gov.au/fwo/IDZ00065.warnings_land_tas.xml";
    } else if (state_selected === "NT") {
      feed_url = "http://www.bom.gov.au/fwo/IDZ00062.warnings_land_nt.xml";
    }

    // Parsing the warnings data for Victoria
    parser.parseURL(feed_url, function(err, parsed) {

      // Initializing empty response array
      var warnings_data = [];

      // Iterating over each rss entry
      parsed.items.forEach(function(item, index){

        // Deciding the tag for the item based on the title
        var tag = "";
        if (item.title.toLowerCase().includes("flood")) {
          tag = "Flood";
        } else if (item.title.toLowerCase().includes("frost")) {
          tag = "Frost";
        } else if (item.title.toLowerCase().includes("sheep")) {
          tag = "Sheep";
        } else if (item.title.toLowerCase().includes("wind")) {
          tag = "Wind";
        } else if (item.title.toLowerCase().includes("severe weather")) {
          tag = "Severe Weather";
        } else if (item.title.toLowerCase().includes("fire")) {
          tag = "Fire";
        } else if (item.title.toLowerCase().includes("cyclone")) {
          tag = "Cyclone";
        } else if (item.title.toLowerCase().includes("tsunami")) {
          tag = "Tsunami";
        } else if (item.title.toLowerCase().includes("thunderstorm")) {
          tag = "Thunderstorm";
        }

        // Re-packing all items
        warnings_data.push({
          "title": item.title,
          "link": item.link,
          "pubDate": item.pubDate,
          "tag": tag,
          "isoDate": item.isoDate
        })
      });

      // Returning the json array of all warnings issued.
      res.json(warnings_data);
    });
  })

module.exports=router;