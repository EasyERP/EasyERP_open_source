var oxr = require('open-exchange-rates');
var moment = require('../public/js/libs/moment/moment');

var Module = function (date, cb) {
    "use strict";
    var now = moment();

    //ToDo set it to process.env
    oxr.set({app_id: 'b81387a200c2463e9ae3d31cc60eda62'});

    if(typeof date === 'function'){
        cb = date;
        date = moment();
    }

    date = moment(date) || now;
    date = date.format('YYYY-MM-DD');

    oxr.historical(date, function () {
        if(oxr.error){
            return oxr.latest(function() {
                cb(null, oxr);
            });
        }
        cb(null, oxr);
    });
};

module.exports = Module;
