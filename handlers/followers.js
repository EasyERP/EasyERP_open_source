var mongoose = require('mongoose');
var Mailer = require('../helpers/mailer');
var mailer = new Mailer();

var Module = function (models) {
    var followersSchema = mongoose.Schemas.followers;
    var EmployeeSchema = mongoose.Schemas.Employee;

    function sendEmailToFollower(req, empId, contentName, collectionName) {
        var mailOptions;
        var Employee;

        Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);

        Employee.findById(empId, {}, function (err, modelEmployee) {
            var workEmail;
            var employee;

            if (err) {
                return console.log('email send to follower error');
            }

            workEmail = modelEmployee.get('workEmail');
            employee = modelEmployee.get('name');

            if (workEmail) {
                mailOptions = {
                    to            : workEmail,
                    employee      : employee,
                    contentName   : contentName || '',
                    collectionName: collectionName
                };

                mailer.sendAddedFollower(mailOptions, function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    console.log('email was send to ' + workEmail);
                });
            } else {
                console.log('employee have not work email');
            }
        });
    }

    this.create = function (req, res, next) {
        var FollowersModel = models.get(req.session.lastDb, 'followers', followersSchema);
        var body = req.body;
        var contentName = body.contentName;
        var newModel;

        body.createdBy = {
            date: new Date(),
            user: req.session.uId
        };

        newModel = new FollowersModel(body);

        FollowersModel.find({contentId: body.contentId, followerId: body.followerId}, function (err, result) {
            if (err) {
                return next(err);
            }

            if (!result.length) {
                newModel.save(function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    sendEmailToFollower(req, result.followerId, contentName, result.collectionName);

                    FollowersModel.find({contentId: body.contentId})
                        .populate('followerId', 'name fullName')
                        .exec(function (err, result) {
                            if (err) {
                                return next(err);
                            }

                            result = result.map(function (elem) {
                                return {
                                    name      : elem.followerId.fullName,
                                    followerId: elem.followerId._id,
                                    _id       : elem._id
                                };
                            });

                            res.status(200).send({data: result});

                        });
                });
            } else {
                res.status(200).send({error: 'Dublicate'});
            }

        });

    };

    this.remove = function (req, res, next) {
        var FollowersModel = models.get(req.session.lastDb, 'followers', followersSchema);
        var id = req.params.id || req.body._id;

        FollowersModel.findByIdAndRemove(id, function (err, result) {
            if (err) {
                return next(err);
            }

            FollowersModel.find({contentId: result.contentId})
                .populate('followerId', 'name fullName')
                .exec(function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    result = result.map(function (elem) {
                        return {
                            name      : elem.followerId.fullName,
                            followerId: elem.followerId._id,
                            _id       : elem._id
                        };
                    });

                    res.status(200).send({data: result});
                });
        });

    };
};

module.exports = Module;
