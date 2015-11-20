module.exports = function(models){
    var mongoose = require('mongoose');

    return function composeExpensesAndCache(req, callback) {
        var PayRollSchema = mongoose.Schemas['PayRoll'];
        var PayRoll = models.get(req.session.lastDb, 'PayRoll', PayRollSchema);
        var query = req.query;
        var filter = query.filter || '';
        var queryObject = {};
        var key = 'payrollExpenses' + filter;
        var redisStore = require('../helpers/redisClient');

        var async = require('async');
        var _ = require('lodash');

        var waterfallTasks = [checkFilter, getResult, calcTotal];

        function checkFilter(callback) {
            callback(null, filter)
        }

        function getResult(filter, callback) {
            if (filter && typeof filter === 'object') {
                if (filter.condition && filter.condition === 'or') {
                    queryObject['$or'] = caseFilter(filter);
                } else {
                    queryObject['$and'] = caseFilter(filter);
                }
            }

            query = PayRoll.find(queryObject);

            query.exec(function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        function calcTotal(result, callback) {
            var total;

            function sum(numbers) {
                return _.reduce(numbers, function (result, current) {
                    return result + parseFloat(current ? current : 0);
                }, 0);
            }

            total = _.chain(result)
                .groupBy(function (model) {
                    return model.get('dataKey');
                })
                .map(function (value, key) {
                    var obj = {};

                    obj[key] = {
                        date: value.date,
                        status: value.status,
                        calc: {
                            onCash: sum(_.pluck(value, "calc"))
                        },
                        paid: {
                            onCash: sum(_.pluck(value, "paid"))
                        },
                        diff: {
                            onCash: sum(_.pluck(value, "diff"))
                        }
                    };

                    return obj;
                })
                .value();

            /*var newResult = _.groupBy(result, function (model) {
                return model.get('dataKey');
            });*/

            callback(null, {total: total/*, collection: newResult, allCollection: result*/});
        }

        async.waterfall(waterfallTasks, function (err, result) {
            redisStore.writeToStorage('payrollExpenses', key, JSON.stringify(result));

            if (callback && typeof callback === 'function') {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            }
        });
    }
};