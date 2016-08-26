var mongoose = require('mongoose');

var Module = function (models) {
    var followersSchema = mongoose.Schemas.followers;

    this.create = function (req, res, next) {
        var FollowersModel = models.get(req.session.lastDb, 'followers', followersSchema);
        var body = req.body;
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
