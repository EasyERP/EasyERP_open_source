/**
 * Created by liliy on 17.02.2016.
 */
var mongoose = require('mongoose');
require('../../models/index.js');
var _ = require('../../node_modules/underscore/underscore');
var async = require('async');
var journalEntrySchema = mongoose.Schemas['journalEntry'];
var ObjectId = mongoose.Types.ObjectId;

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");

    var journalEntry = dbObject.model("journalEntry", journalEntrySchema);

    journalEntry.update({"currency.rate": null}, {$set: {currency: {rate: 1, _id: ObjectId("565eab29aeb95fa9c0f9df2d")}}}, {multi: true}, function (err, resilt) {
        console.log(resilt);
    });

});