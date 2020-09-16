const express = require("express");
const router = express.Router();

const xlsxFile = require('read-excel-file/node');
const { ValidationHalt } = require("express-validator/src/base");
var crop_type_list = ["wheat", "barley", "canola", "sorghum", "cotton", "rice"];
var states = ["NSW", "VIC", "QLD", "SA", "WA", "TAS"];

const getAdjustedYieldData = (yields_obj, land_area) => {
    var adjustedYieldData = {};
    adjustedYieldData["Year"] = yields_obj["Year"]

    states.forEach((state) => {
        if(yields_obj[`${state}_prod`] != 0) {
            adjustedYieldData[state] = (yields_obj[`${state}_prod`] / yields_obj[`${state}_area`]) * land_area;
        } else {
            adjustedYieldData[state] = 0;
        }
    });

    return adjustedYieldData;
};

async function getCropYieldData(crop_type, land_area){
    var keys = [];
    var yields_data = [];
    await xlsxFile(`./data/${crop_type}_historic_yield.xlsx`).then((rows) => {
        var row_index = 0;
        rows.forEach((col) => {
            if(row_index === 0) {
                keys = col;
            } else {
                var col_index = 0;
                var row_obj = {};
                col.forEach((element) => {
                    row_obj[keys[col_index]] = element;
                    col_index = col_index + 1;
                });
                yields_data.push(getAdjustedYieldData(row_obj, land_area));
            }
            row_index = row_index + 1;
        });
    });
    
    return yields_data;
};

const getValuesInList = (yields_data, crop_type, key) => {
    var val = [];

    yields_data[crop_type].forEach((crop_data) => {
        val.push(crop_data[key]);
    });

    return val;
};

const getFormattedHighchartsData = (yields_data) => {
    var highcharts_data = {};

    states.forEach((state) => {
        var state_obj = {};
        var series_data = [];

        crop_type_list.forEach((crop_type) => {  
            var series_obj = {};
            series_obj["name"] = crop_type;
            series_obj["data"] = getValuesInList(yields_data, crop_type, state);
            
            series_data.push(series_obj);
        });

        state_obj["x_axis"] = getValuesInList(yields_data, "rice", "Year");
        state_obj["series"] = series_data;

        highcharts_data[state] = state_obj;
    });

    return highcharts_data;
};

router.get("/", (req, res) => {
    var crop_yields_data = {};
    const land_area = req.query.area;

    crop_type_list.forEach((crop_type) => {
        getCropYieldData(crop_type, land_area).then(data => {
            crop_yields_data[crop_type] = data

            if(crop_type === crop_type_list[crop_type_list.length - 1]){
                res.send(getFormattedHighchartsData(crop_yields_data));
            }
        });
    });

});

module.exports = router;