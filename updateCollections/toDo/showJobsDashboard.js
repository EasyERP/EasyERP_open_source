var mongoose = require('mongoose');
require('../../models/index.js');
var async = require('async');

var ModuleSchema = mongoose.Schemas.modules;

var connectOptions = {
    user: 'easyErp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

//var dbObject = mongoose.createConnection('144.76.56.111', 'pavlodb', 28017, connectOptions);

var dbObject = mongoose.createConnection('localhost', 'production');

var Module = dbObject.model("modules", ModuleSchema);

Module.update({_id: 80}, {visible : true}, function(err){
    if (err) {
        console.log(err);
    }
    console.log('Good');
});
