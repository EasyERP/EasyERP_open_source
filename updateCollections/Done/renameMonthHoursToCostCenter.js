var mongoose = require('mongoose');
require('../../models/index.js');
var async = require('async');

var ModuleSchema = mongoose.Schemas.modules;

var connectOptions = {
    user  : 'easyErp',
    pass  : '1q2w3e!@#',
    w     : 1,
    j     : true
};

//var dbObject = mongoose.createConnection('localhost', 'production', 27017, connectOptions);

var dbObject = mongoose.createConnection('localhost', 'production');

var module = dbObject.model("modules", ModuleSchema);

module.findByIdAndUpdate({_id : 68}, {parrent : 96, mname : 'Cost center'}, function (err) {
    if (err) {
        return console.dir(err);
    }

    console.dir('Good');
});

