var mongoose = require('mongoose');
var async = require('async');

var ProjectMembers = function (models, events) {
    'use strict';

    var ProjectMembersSchema = mongoose.Schemas['ProjectMembers'];

    this.create = function (req, res, next) {
        var ProjectMemberModel = models.get(req.session.lastDb, 'ProjectMember', ProjectMembersSchema);
        var body = req.body;
        var projectMember = new ProjectMemberModel(body);

        projectMember.save(function (err, doc) {
            if (err) {
                return next(err);
            }

           /* event.emit('dropHoursCashes', req);
            var params = {
                req               : req,
                year              : monthHours.year,
                month             : monthHours.month,
                fixedExpense      : monthHours.fixedExpense,
                expenseCoefficient: monthHours.expenseCoefficient,
                hours             : monthHours.hours
            };
            event.emit('updateCost', params);*/
            res.status(200).send(doc);
        });
    };

    this.patchM = function (req, res, next) {
        var body = req.body;
        var ProjectMemberModel = models.get(req.session.lastDb, 'ProjectMember', ProjectMembersSchema);

        async.each(body, function (data, cb) {
            var id = data._id;
            delete data._id;

            ProjectMemberModel.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, result) {
                if (err) {
                    return cb(err);
                }
               /* var params = {
                    req               : req,
                    year              : result.year,
                    month             : result.month,
                    fixedExpense      : result.fixedExpense,
                    expenseCoefficient: result.expenseCoefficient,
                    hours             : result.hours
                };
                event.emit('updateCost', params);*/
                cb(null, result);
            });

        }, function (err) {
            if (err) {
                return next(err);
            }

            /*event.emit('dropHoursCashes', req);*/
            res.status(200).send({success: 'updated'});
        });
    };

    this.getList = function (req, res, next) {
        var ProjectMemberModel = models.get(req.session.lastDb, 'ProjectMember', ProjectMembersSchema);
        var query = req.query;
        var project;

        if (query.project) {
            project = query.project;
        }

        ProjectMemberModel
            .find({projectId : project})
            .populate('projectPositionId', '_id name')
            .populate('employeeId', '_id name')
            .populate('bonusId', '_id name value isPercent')
            .exec(function (err, data) {
                if (err) {
                    return next(err);
                } else {
                    res.status(200).send(data);
                }
            });
    };

    this.remove = function (req, res, next) {
        var id = req.params.id;

        var ProjectMemberModel = models.get(req.session.lastDb, 'ProjectMember', ProjectMembersSchema);

        ProjectMemberModel.findByIdAndRemove(id, function (err, result) {
            if (err) {
                return next(err);
            }

            /*event.emit('dropHoursCashes', req);*/
            res.status(200).send({success: result});

        });
    };

};

module.exports = ProjectMembers;