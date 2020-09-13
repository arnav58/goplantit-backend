const express = require("express");
const router = express.Router();

const axios = require("axios");
const { response } = require("express");

const helper_functions = require("./helper_functions");

const getweatherDataURL = (lat, long) => {
    return `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${helper_functions.getAPIKey()}&units=metric`;
}

const checkWindSpeedRules = (wind_speed) => {
    if(wind_speed <= 9) {
        return {
            wind_speed_threat: "green",
            wind_speed_threat_desc: "No threat of lodging because of wind speed."
        }
    } else if(9 < wind_speed <= 11) {
        return {
            wind_speed_threat: "yellow",
            wind_speed_threat_desc: "Lodging severity Level 2 threat."
        }
    } else if(11 < wind_speed <= 15) {
        return {
            wind_speed_threat: "orange",
            wind_speed_threat_desc: "Lodging severity Level 3 threat."
        }
    } else if(15 < wind_speed <= 21) {
        return {
            wind_speed_threat: "red",
            wind_speed_threat_desc: "Lodging severity Level 4 threat."
        }
    } else if(21 < wind_speed) {
        return {
            wind_speed_threat: "maroon",
            wind_speed_threat_desc: "Lodging severity Level 5 threat."
        }
    }
}

const checkRainRules = (rain) => {
    if(rain <= 7) {
        return {
            rain_threat: "green",
            rain_threat_desc: "No threat of lodging because of wind speed."
        }
    } else if(7 < rain <= 21) {
        return {
            rain_threat: "yellow",
            rain_threat_desc: "Lodging severity Level 2 threat."
        }
    } else if(21 < rain <= 59) {
        return {
            rain_threat: "orange",
            rain_threat_desc: "Lodging severity Level 3 threat."
        }
    } else if(59 < rain <= 120) {
        return {
            rain_threat: "red",
            rain_threat_desc: "Lodging severity Level 4 threat."
        }
    } else if(120 < rain) {
        return {
            rain_threat: "maroon",
            rain_threat_desc: "Lodging severity Level 5 threat."
        }
    }
}

const checkTempRules = (temp, crop_type) => {
    conditions_tag = "";
    conditions_color = "";
    conditions_ref_link = "";

    if(crop_type === "wheat" || crop_type === "canola"){
        if(20 < temp  && temp <= 25) {
            console.log(temp);
            conditions_tag = "ideal";
            conditions_color = "green";
        } else if((17 < temp  && temp <= 20) || (25 < temp  && temp <= 28)){
            conditions_tag = "slightly_unfavorable";
            conditions_color = "yellow";
        } else if((13 < temp  && temp <= 17) || (28 < temp  && temp <= 32)){
            conditions_tag = "concerning";
            conditions_color = "red";
        } else {
            conditions_tag = "severe";
            conditions_color = "maroon";
        }

        if(crop_type === "wheat"){
            conditions_ref_link = "http://www.croppro.com.au/cb_pages/Wheat_crop_phenology.php#:~:text=Germination%20and%20Emergence&text=Minimum%20temperatures%20for%20wheat%20germination,limit%20being%2035%C2%B0%20C.";
        } else if(crop_type === "canola") {
            conditions_ref_link = "http://www.croppro.com.au/cb_pages/canola_crop_phenology.php#:~:text=The%20lower%20limit%2C%20or%20base,20%C2%B0%20%2D25%C2%B0%20C.";
        }
    } else if(crop_type === "barley"){
        if(12 < temp  && temp <= 25) {
            conditions_tag = "ideal";
            conditions_color = "green";
        } else if((10 < temp  && temp <= 12) || (25 < temp  && temp <= 28)){
            conditions_tag = "slightly_unfavorable";
            conditions_color = "yellow";
        } else if((6 < temp  && temp <= 10) || (28 < temp  && temp <= 32)){
            conditions_tag = "concerning";
            conditions_color = "red";
        } else {
            conditions_tag = "severe";
            conditions_color = "maroon";
        }
        conditions_ref_link = "https://grdc.com.au/__data/assets/pdf_file/0020/370532/GrowNote-Barley-North-4-Physiology.pdf"
    } else if(crop_type === "sorghum"){
        if(12 < temp  && temp <= 34) {
            conditions_tag = "ideal";
            conditions_color = "green";
        } else if((10 < temp  && temp <= 12) || (34 < temp  && temp <= 36)){
            conditions_tag = "slightly_unfavorable";
            conditions_color = "yellow";
        } else if((6 < temp  && temp <= 10) || (36 < temp  && temp <= 40)){
            conditions_tag = "concerning";
            conditions_color = "red";
        } else {
            conditions_tag = "severe";
            conditions_color = "maroon";
        }
        conditions_ref_link = "https://grdc.com.au/__data/assets/pdf_file/0030/370596/GrowNote-Sorghum-North-04-Physiology.pdf";
    } else if(crop_type === "rice"){
        if(16 < temp  && temp <= 32) {
            conditions_tag = "ideal";
            conditions_color = "green";
        } else if((14 < temp  && temp <= 16) || (32 < temp  && temp <= 34)){
            conditions_tag = "slightly_unfavorable";
            conditions_color = "yellow";
        } else if((10 < temp  && temp <= 14) || (34 < temp  && temp <= 38)){
            conditions_tag = "concerning";
            conditions_color = "red";
        } else {
            conditions_tag = "severe";
            conditions_color = "maroon";
        }
        conditions_ref_link = "https://www.agrifutures.com.au/farm-diversity/rice/#:~:text=The%20crop%20grows%20from%20spring,negative%20impact%20on%20yield%20potential.";
    } else if(crop_type === "cotton"){
        if(27 < temp  && temp <= 32) {
            conditions_tag = "ideal";
            conditions_color = "green";
        } else if((25 < temp  && temp <= 27) || (32 < temp  && temp <= 34)){
            conditions_tag = "slightly_unfavorable";
            conditions_color = "yellow";
        } else if((21 < temp  && temp <= 25) || (34 < temp  && temp <= 36)){
            conditions_tag = "concerning";
            conditions_color = "red";
        } else {
            conditions_tag = "severe";
            conditions_color = "maroon";
        }
        conditions_ref_link = "https://irec.org.au/wp-content/uploads/Australian-Cotton-Production-Manual-2018.pdf";
    }

    return {
        conditions_tag: conditions_tag,
        conditions_color: conditions_color
    }
}

const getWeatherDataForDay = (dailyObj) => {
    var weather_data = {};

    // Adding formatted date time
    dateObj = helper_functions.getDateObjFromUnixDate(dailyObj["dt"]); 
    formattedDate = helper_functions.getFormattedDate(dateObj);
    weather_data["formatted_date"] = formattedDate;

    // Adding temperature
    const day_temp = typeof dailyObj["temp"] !== 'number' ? dailyObj["temp"]["day"]  : dailyObj["temp"];
    weather_data["temp"] = day_temp;

    weather_data["wheat_temp_status_tag"] = checkTempRules(day_temp, "wheat").conditions_tag;
    weather_data["wheat_temp_status_color"] = checkTempRules(day_temp, "wheat").conditions_color;
    weather_data["wheat_temp_ref_link"] = checkTempRules(day_temp, "wheat").conditions_ref_link;

    weather_data["barley_temp_status_tag"] = checkTempRules(day_temp, "barley").conditions_tag;
    weather_data["barley_temp_status_color"] = checkTempRules(day_temp, "barley").conditions_color;
    weather_data["barley_temp_ref_link"] = checkTempRules(day_temp, "barley").conditions_ref_link;

    weather_data["canola_temp_status_tag"] = checkTempRules(day_temp, "canola").conditions_tag;
    weather_data["canola_temp_status_color"] = checkTempRules(day_temp, "canola").conditions_color;
    weather_data["canola_temp_ref_link"] = checkTempRules(day_temp, "canola").conditions_ref_link;

    weather_data["sorghum_temp_status_tag"] = checkTempRules(day_temp, "sorghum").conditions_tag;
    weather_data["sorghum_temp_status_color"] = checkTempRules(day_temp, "sorghum").conditions_color;
    weather_data["sorghum_temp_ref_link"] = checkTempRules(day_temp, "sorghum").conditions_ref_link;

    weather_data["rice_temp_status_tag"] = checkTempRules(day_temp, "rice").conditions_tag;
    weather_data["rice_temp_status_color"] = checkTempRules(day_temp, "rice").conditions_color;
    weather_data["rice_temp_ref_link"] = checkTempRules(day_temp, "rice").conditions_ref_link;

    weather_data["cotton_temp_status_tag"] = checkTempRules(day_temp, "cotton").conditions_tag;
    weather_data["cotton_temp_status_color"] = checkTempRules(day_temp, "cotton").conditions_color;
    weather_data["cotton_temp_ref_link"] = checkTempRules(day_temp, "cotton").conditions_ref_link;

    // Adding feels_like
    weather_data["feels_like"] = dailyObj["feels_like"];

    // Adding pressure
    weather_data["pressure"] = dailyObj["pressure"];

    // Adding humidity
    weather_data["humidity"] = dailyObj["humidity"];

    // Adding dew_point
    weather_data["dew_point"] = dailyObj["dew_point"];

    // Adding uvi
    weather_data["uvi"] = dailyObj["uvi"];

    // Adding clouds
    weather_data["clouds"] = dailyObj["clouds"];

    // Adding wind_speed
    weather_data["wind_speed"] = dailyObj["wind_speed"];

    // Adding wind_speed_threat
    weather_data["wind_speed_threat_type"] = checkWindSpeedRules(dailyObj["wind_speed"]).wind_speed_threat;

    // Adding wind_speed_threat_desc
    weather_data["wind_speed_threat_desc"] = checkWindSpeedRules(dailyObj["wind_speed"]).wind_speed_threat_desc;

    // Adding wind_deg
    weather_data["wind_deg"] = dailyObj["wind_deg"];

    // Adding wind_gust
    weather_data["wind_gust"] = dailyObj["wind_gust"];

    // Adding uvi
    weather_data["weather"] = dailyObj["weather"];

    // Adding rain
    if("rain" in dailyObj){
        const rain_val = typeof dailyObj["rain"] !== 'number' ? dailyObj["rain"]["1h"]  : dailyObj["rain"];

        // Adding rain val
        weather_data["rain"] = rain_val;
        
        // Adding rain_threat
        weather_data["rain_threat_type"] = checkRainRules(rain_val).rain_threat;

        // Adding rain_threat_desc
        weather_data["rain_threat_desc"] = checkRainRules(rain_val).rain_threat_desc;
    }

    return weather_data
}

router.get("/", (req, res) => {
    // Fetching the state selected
    const lat = req.query.lat;
    const long = req.query.long;
    const weatherDataURL = getweatherDataURL(lat, long);

    axios.get(weatherDataURL).then(response => {
        var weather_data_response = {};

        // Adding lat long
        weather_data_response["lat"] =  response.data["lat"];
        weather_data_response["lon"] = response.data["lon"];

        // Adding current day
        weather_data_response["current_day"] = getWeatherDataForDay(response.data["current"]);

        // Adding daily 7 day forecast
        weather_data_response["daily"] = [];
        response.data["daily"].forEach(function (day, index) {
            weather_data_response["daily"].push(getWeatherDataForDay(day));        
        });

        res.send(weather_data_response);
    }).catch(error => {
        console.error(error);
        res.send("No data Available")
    });
});

module.exports = router;