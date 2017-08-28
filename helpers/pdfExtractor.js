'use strict';

var fs = require('fs');
var htmltopdf = require('html-pdf');

function post(req, res, next) {
    var body = req.body;
    var name = body.name;

    var htmlTemplate = '<!DOCTYPE html><html><head>' +
        "<link href='https://fonts.googleapis.com/css?family=Open+Sans:400,600,700' rel='stylesheet' type='text/css'>" +
        '<link rel=""stylesheet" href="' + process.env.HOST + 'css/jquery.Jcrop.css" type="text/css"/>' +
        '<link rel="stylesheet" href="' + process.env.HOST + 'css/font-awesome.min.css" type="text/css"/>' +
        '<link rel="stylesheet" href="' + process.env.HOST + 'css/main.css" type="text/css"/>' +
        '<link rel="stylesheet" href="' + process.env.HOST + 'css/style.css" type="text/css"/></head><body >' +
        body.file +
        '</body></html>';
    var options = {
        format     : 'A4',
        orientation: 'landscape'
    };


    htmltopdf.create(htmlTemplate, options).toFile(name + '.pdf', function (err, file) {

        if (err) {
            return next(err);
        }

        res.send(200, {name: name, path: file ? file.filename : ''});
    });
};

function get(req, res, next) {
    var name = req.query.name;

    res.download(name + '.pdf', name + '.pdf', function (err) {
        if (err) {
            return next(err);
        }

        fs.unlink(name + '.pdf', function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('done');
            }
        });
    });

};

module.exports = {
    post: post,
    get : get
};