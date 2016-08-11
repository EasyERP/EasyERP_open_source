/**
 * Created by liliy on 13.06.2016.
 */
var mongoose = require('mongoose');
require('../../models/index.js');
var ModuleSchema = mongoose.Schemas.Priority;
var opportunitySchema = mongoose.Schemas.Opportunitie;

var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

 var dbObject = mongoose.createConnection('144.76.56.111', 'sergey', 28017, connectOptions);
//var dbObject = mongoose.createConnection('erp.thinkmobiles.com', 'production', 27017, connectOptions);

var Module = dbObject.model("Priority", ModuleSchema);
var Opportunitie = dbObject.model('Opportunities', opportunitySchema);

var insertArray = [{
    _id : 'Hot',
    priority: 'Hot',
    type : 'Leads'
},{
    _id : 'Cold',
    priority: 'Cold',
    type : 'Leads'
},{
    _id : 'Medium',
    priority: 'Medium',
    type : 'Leads'
}]

Module.remove({type : 'Leads'}, function (err) {
    if (err) {
        console.log(err);
    }
    Module.collection.insert(insertArray, function (err) {
        if (err) {
            console.log(err);
        }
        Opportunitie.update({isOpportunitie : false}, {$set : {priority : 'Medium'}}, {multi: true}, function (err) {
            if (err) {
                console.log(err);
            }
            console.log('Good');
        })

    });

});


