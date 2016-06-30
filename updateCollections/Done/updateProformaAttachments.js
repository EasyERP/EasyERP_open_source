
var mongoose = require('mongoose');
require('../../models/index.js');
var ProformaSchema = mongoose.Schemas['Proforma'];
var async = require('async');

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
});

var Proforma = dbObject.model('Proforma', ProformaSchema);

var query = Proforma.find({_type: 'Proforma'}).lean();

query.exec(function (error, _res) {
    if (error) {
        return console.dir(error);
    }

    async.each(_res, function (project, callback) {
        var attachments = project.attachments || [];
        var newAttachments = [];

        attachments.forEach(function(_attach){
            var url = 'uploads/proforma/' + project._id + '/' + _attach.name;

            url = encodeURIComponent(url);

            _attach.shortPas = url;
            newAttachments.push(_attach);
        });
        Proforma.update({_id: project._id}, {$set: {attachments: newAttachments}}, callback);

    }, function (err) {
        if (err) {
            return console.dir(err);
        }

        return console.dir('Good');
    });
});