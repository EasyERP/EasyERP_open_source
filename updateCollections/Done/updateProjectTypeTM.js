var mongoose = require('mongoose');
var async = require('async');
var isoWeekYearComposer = require('../../helpers/isoWeekYearComposer');
require('../../models/index.js');
var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

var dbObject = mongoose.createConnection('144.76.56.111', 'sergey', 28017, connectOptions);
//var dbObject = mongoose.createConnection('erp.thinkmobiles.com', 'production'/*, 27017, connectOptions*/);

dbObject.on('error', console.error.bind(console, 'connection error:'));

dbObject.once('open', function callback() {
    var pTypeSchema;
    var pType;

    var ProjectSchema = mongoose.Schemas['Project'];
    var Project = dbObject.model("Project", ProjectSchema);

    pTypeSchema = mongoose.Schemas.projectType;

    pType = dbObject.model('projectType', pTypeSchema);

    pType.collection.insert({
        _id : 'T&M',
        name: 'T&M'
    }, function (error, res) {
        if (error) {
            return console.dir(error);
        }
        pType.findByIdAndRemove('time & material'
        ,  function(error){
                if (error) {
                    return console.dir(error);
                }
                Project.update({projecttype: {$in : ['time & material', 'Time & Material']}}, {projecttype: 'T&M'}, {multi : true}, function(){
                    if (error) {
                        return console.dir(error);
                    }
                    console.log('Good');
                });
            })


    });
});



