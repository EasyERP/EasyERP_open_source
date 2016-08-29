/**
 * Created by liliy on 24.08.2016.
 */
var mongoose = require('mongoose');
require('../../models/index.js');
var moment = require('../../public/js/libs/moment/moment');

var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

// var dateConstant = new Date() - new Date("2016-05-25T07:52:37.476Z");
var dateConstant = moment(new Date()).subtract(1, 'months');

dateConstant = new Date(dateConstant);

//var dbObject = mongoose.createConnection('45.32.153.74', 'CRM');
var dbObject = mongoose.createConnection('localhost', 'CRM');

dbObject.on('error', console.error.bind(console, 'connection error:'));

dbObject.once('open', function callback() {
    var OpportunitieSchema = mongoose.Schemas.Opportunitie;
    var HistorySchema = mongoose.Schemas.History;

    var Opportunities = dbObject.model('Opportunities', OpportunitieSchema);
    var History = dbObject.model('History', HistorySchema);

    Opportunities.find({}, function (err, result) {
        if (err) {
            return console.log(err);
        }

        result.forEach(function (el) {
            var newDate = moment(new Date(el.creationDate)) + moment(new Date(dateConstant));
            var convertedDate;
            var query = {};

            newDate = new Date(newDate);

            if (el.convertedDate && el.convertedDate <= newDate) {
                convertedDate = moment(new Date(el.convertedDate)) + moment(new Date(dateConstant));
                convertedDate = new Date(convertedDate);
            }

            if (convertedDate > new Date()) {
                convertedDate = new Date();
            }

            if (newDate > new Date()) {
                newDate = new Date();
            }

            query.creationDate = newDate;
            query['createdBy.date'] = newDate;
            query['editedBy.date'] = newDate;

            if (convertedDate) {
                query.convertedDate = convertedDate;
            }

            Opportunities.findByIdAndUpdate(el._id, {$set: query}, function (err, result) {
                if (err) {
                    return console.log(err);
                }

                History.find({contentId: el._id}, function (err, result) {
                    if (err) {
                        return console.log(err);
                    }

                    result.forEach(function (elem) {
                        var date = moment(new Date(elem.date)) + moment(new Date(dateConstant));

                        date = new Date(date);

                        if (date > new Date()) {
                            date = new Date();
                        }

                        History.findByIdAndUpdate(elem._id, {$set: {date: date}}, function (err, result) {
                            if (err) {
                                return console.log(err);
                            }
                        });
                    });
                });
            });
        });

        console.log('good');
    });
});



