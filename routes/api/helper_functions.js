const months = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December",
  };

module.exports = {
    getFormattedDate: function(dateObj) {
        return dateObj.getDate() +
            " " +
            months[dateObj.getMonth()] +
            ", " +
            dateObj.getFullYear()
    },
    getDateObjFromUnixDate: function(unixTimestamp) {
        return new Date(unixTimestamp * 1000);
    },
    getAPIKey: function() {
        return "0f379efddde487e3633387be1074cc2b";
    }
}