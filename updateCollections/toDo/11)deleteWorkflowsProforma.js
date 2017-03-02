var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

require('../../models/index.js');

var workflowsSchema = mongoose.Schemas.workflow;

var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

var dbObject = mongoose.createConnection('localhost', 'CRM');

dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log('Connection to production is success');
});

var Workflow = dbObject.model('workflows', workflowsSchema);

Workflow.remove({wId: 'Proforma'}, function (err, success) {
    if (err) {
        return console.log(err);
    }


    if (success && success.result) {
        success = success.result;

        return console.log('success! ', success);
    }

    console.log('success! data is not found');
});
