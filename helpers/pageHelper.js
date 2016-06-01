var CONSTANTS = require('../constants/mainConstants.js');
var Module = function (data) {
    "use strict";
    var count = data.count;
    var page = data.page || 1;
    var skip;

    count = parseInt(count, 10);
    count = !isNaN(count) ? count : CONSTANTS.COUNT_PER_PAGE;
    page = parseInt(page, 10);
    page = !isNaN(page) && page ? page : 1;
    skip = (page - 1) * count;

    return {
        skip : skip,
        limit: count
    };
};

module.exports = Module;
