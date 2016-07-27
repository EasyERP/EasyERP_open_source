/**
 * Created by liliy on 13.06.2016.
 */
var mongoose = require('mongoose');
require('../../models/index.js');
var ModuleSchema = mongoose.Schemas.modules;

var connectOptions = {
    user: 'easyErp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

// var dbObject = mongoose.createConnection('144.76.56.111', 'pavlodb', 28017, connectOptions);
var dbObject = mongoose.createConnection('erp.thinkmobiles.com', 'production', 27017, connectOptions);

var Module = dbObject.model("modules", ModuleSchema);

Module.update({href: 'Sales'}, {mname: "CRM"}, function (err) {
    if (err) {
        console.log(err);
    }
    console.log('Good');
});

