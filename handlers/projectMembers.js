var mongoose = require('mongoose');
var async = require('async');

var ProjectMembers = function (models) {
    'use strict';

    var ProjectMembersSchema = mongoose.Schemas['ProjectMember'];
    var ProjectSchema = mongoose.Schemas['Project'];

    function changedSales(db, doc) {
        var ProjectMemberModel = models.get(db, 'ProjectMember', ProjectMembersSchema);
        var Project = models.get(db, 'Project', ProjectSchema);

        if (doc.projectPositionId.toString() === '570e9a75785753b3f1d9c86e') {
            ProjectMemberModel.find({projectId: doc.projectId, projectPositionId: doc.projectPositionId})
                .sort({startDate: -1})
                .lean()
                .exec(function (err, docs) {
                    var elem;
                    var employeeId;
                    if (err) {
                        console.log(err);
                        return;
                    }
                    elem = docs[0];
                    employeeId = elem ? elem.employeeId : null;
                    Project.findByIdAndUpdate(doc.projectId, {projectmanager: employeeId}, function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                });
        }
    }

    this.create = function (req, res, next) {
        var db = req.session.lastDb;
        var ProjectMemberModel = models.get(db, 'ProjectMember', ProjectMembersSchema);

        var body = req.body;
        var projectMember = new ProjectMemberModel(body);

        projectMember.save(function (err, doc) {
            if (err) {
                return next(err);
            }


            changedSales(db, doc);
            res.status(200).send(doc);
        });
    };

    this.patchM = function (req, res, next) {
        var body = req.body;
        var db = req.session.lastDb;
        var ProjectMemberModel = models.get(db, 'ProjectMember', ProjectMembersSchema);

        async.each(body, function (data, cb) {
            var id = data._id;
            delete data._id;

            ProjectMemberModel.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, doc) {
                if (err) {
                    return cb(err);
                }

                changedSales(db, doc);
                cb(null, doc);
            });

        }, function (err) {
            if (err) {
                return next(err);
            }

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
            .find({projectId: project})
            .populate('projectPositionId', '_id name')
            .populate('employeeId', '_id name')
            .populate('bonusId', '_id name value isPercent')
            .sort({
                projectPositionId: 1,
                startDate        : -1
            })
            .exec(function (err, data) {
                if (err) {
                    return next(err);
                }
                res.status(200).send(data);
            });
    };

    this.remove = function (req, res, next) {
        var id = req.params.id;
        var db = req.session.lastDb;
        var ProjectMemberModel = models.get(db, 'ProjectMember', ProjectMembersSchema);

        ProjectMemberModel.findByIdAndRemove(id, function (err, doc) {
            if (err) {
                return next(err);
            }

            changedSales(db, doc);
            res.status(200).send({success: doc});
        });
    };

};

module.exports = ProjectMembers;
