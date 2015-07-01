var Degrees = function (models) {
    var mongoose = require('mongoose');
    var degreesSchema = mongoose.Schemas['Degree'];
    var logWriter = require('../helpers/logWriter.js');

    function create (data, res) {
        try {
            if (!data.name) {
                logWriter.log('Degree.create Incorrect Incoming Data');
                res.send(400, {error: 'Degree.create Incorrect Incoming Data'});
                return;
            } else {
                models.get(req.session.lastDb, "Degrees", degreesSchema).findById(data.name, function (err, degrees) {
                    if (err) {
                        logWriter.log('Degrees.js create degree.find ' + err);
                    } else {
                        if (degrees) {
                            res.send(400, {error: 'An Degree with the same Name already exists'});
                        } else {
                            try {
                                _degree = new degree();
                                _degree._id = data.name;
                                _degree.name = data.name;
                                _degree.save(function (err, result) {
                                    if (err) {
                                        console.log(err);
                                        res.send(500, {error: 'Degree.save BD error'});
                                        logWriter.log('Degree.js create degree.find _degree.save ' + err);
                                    } else {
                                        res.send(201, {success: 'A new Degree create success'});
                                    }
                                });
                            }
                            catch (exception) {
                                console.log(exception);
                                logWriter.log("Degree.js  create " + exception);
                                res.send(500, {error: 'Degree.save  error'});
                            }
                        }
                    }
                });
            }
        }
        catch (exception) {
            console.log(exception);
            logWriter.log("Degree.js  create " + exception);
            res.send(500, {error: 'Degree.save  error'});
        }
    };

    function get (response) {
        var res = {};
        res['data'] = [];
        var query = models.get(req.session.lastDb, "Degrees", degreesSchema).find({});
        query.sort({name: 1});
        query.exec(function (err, degrees) {
            if (err) {
                console.log(err);
                logWriter.log("Degrees.js getDegrees degrees.find " + err);
                response.send(500, {error: "Can't find JobPosition"});
            } else {
                res['data'] = degrees;
                response.send(res);
            }
        });
    };

    function update (_id, data, res) {
        try {
            delete data._id;
            models.get(req.session.lastDb, "Degrees", degreesSchema).update({_id: _id}, data, function (err, degreess) {
                if (err) {
                    console.log(err);
                    logWriter.log("Degrees.js update degree.update" + err);
                    res.send(500, {error: "Can't update Degrees"});
                } else {
                    res.send(200, {success: 'Degree updated success'});
                }
            });
        }
        catch (Exception) {
            console.log(Exception);
            logWriter.log("Degree.js update " + Exception);
            res.send(500, {error: 'Degree updated error'});
        }
    };

    function remove (_id, res) {
        models.get(req.session.lastDb, "Degrees", degreesSchema).remove({_id: _id}, function (err, degreess) {
            if (err) {
                console.log(err);
                logWriter.log("Degree.js remove degree.remove " + err);
                res.send(500, {error: "Can't remove Degree"});
            } else {
                res.send(200, {success: 'Degree removed'});
            }
        });
    };


    return {

        get: get,
        create: create,
        update: update,
        remove: remove
    };
};
module.exports = Degrees;
