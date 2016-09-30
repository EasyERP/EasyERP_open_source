module.exports = function (models) {
    return new function () {
        this.setSettings = function (options, callback) {
            var connection;
            var dbName;
            var err;
            var db;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (!callback || typeof callback !== 'function') {
                callback = function () {
                };
            }

            dbName = options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            connection = models.connection(dbName);
            db = connection.db;

            db.collection('settings').findOneAndUpdate({
                dbName: dbName,
                name  : 'employeeSettings'
            }, {
                $set: {defaultProfile: parseInt(options.profileId, 10)}
            }, {
                returnOriginal: false,
                upsert        : true
            }, function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.getSettings = function (options, callback) {
            var connection;
            var dbName;
            var err;
            var db;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (!callback || typeof callback !== 'function') {
                callback = function () {
                };
            }

            dbName = options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            connection = models.connection(dbName);
            db = connection.db;

            db.collection('settings').aggregate([{
                $match: {
                    dbName: dbName,
                    name  : 'employeeSettings'
                }
            }, {
                $lookup: {
                    from        : 'Profile',
                    localField  : 'defaultProfile',
                    foreignField: '_id',
                    as          : 'profile'
                }
            }, {
                $project: {
                    profile: {$arrayElemAt: ['$profile', 0]}
                }
            }, {
                $project: {
                    _id        : '$profile._id',
                    profileName: '$profile.profileName'
                }
            }], function (err, result) {
                if (err) {
                    return callback(err);
                }

                result = result && result[0] || {};
                callback(null, result);
            });
        };
    };
};
