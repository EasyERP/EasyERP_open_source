/**
 * Created by roma on 27.04.16.
 */
var mongoose = require('mongoose');
require('../../models/index.js');
var _ = require('../../node_modules/underscore/underscore');
var CONSTANTS = require('../../constants/mainConstants');
var moment = require('../../public/js/libs/moment/moment');
var async = require('async');

var MonthHoursSchema = mongoose.Schemas.MonthHours;
var VacationSchema = mongoose.Schemas.Vacation;
var HolidaySchema = mongoose.Schemas.Holiday;

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");

    var monthHoursModel = dbObject.model('MonthHours', MonthHoursSchema);
    var Vacation = dbObject.model('Vacation', VacationSchema);
    var holedayModel = dbObject.model('Holiday', HolidaySchema);

    /*holedayModel.find({}, function (err, result) {
        if (err){
            return console.log(err);
        }

        result.forEach(function (el) {
            var date = el.date;
            var year = moment(date).year();
            var month = moment(date).month();
            var dateByMonth = year * 100 + month + 1;

            holedayModel.update({_id: el._id}, {$set: {dateByMonth: dateByMonth}}, function(){
                console.log(dateByMonth);
            });
        });
    });*/

    /* monthHoursModel.find({}, function (err, result) {
         if (err){
             return console.log(err);
         }

         result.forEach(function (el) {
             var dateByMonth = el.year * 100 + el.month;

             monthHoursModel.update({_id: el._id}, {$set: {dateByMonth: dateByMonth}}, function(){
                 console.log(dateByMonth)
             });
         });
     });*/
     Vacation.find({}, function (err, result) {
         if (err){
             return console.log(err);
         }

         result.forEach(function (el) {
             var dateByMonth = el.year * 100 + el.month;

             Vacation.update({_id: el._id}, {$set: {dateByMonth: dateByMonth}}, function(err, result){
                 console.log(dateByMonth)
             });
         });
     })

});