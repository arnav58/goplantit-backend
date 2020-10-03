const express = require("express");
const router = express.Router();

const xlsxFile = require('read-excel-file/node');

async function getCropProfitsData(){
    var keys = [];
    var profits_data = {};
    await xlsxFile(`./data/profits_data.xlsx`).then((rows) => {
        var row_index = 0;
        rows.forEach((row) => {
            if(row_index === 0) {
                row.shift();
                keys = row;
            } else {
               crop_name = row.shift()

               profits_data[crop_name] = {"keys": keys, "values": row}
            }
            row_index = row_index + 1;
        });
    });
    
    return profits_data;
};

router.get("/", (req, res) => {
    getCropProfitsData().then(data => {
        res.send(data);
    });
});

module.exports = router;