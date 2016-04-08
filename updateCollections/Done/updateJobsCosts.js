/**
 * Created by liliy on 19.02.2016.
 */
/**
 * Created by liliy on 08.02.2016.
 */
var mongoose = require('mongoose');
require('../../models/index.js');
var _ = require('../../node_modules/underscore/underscore');
var async = require('async');
var JobsSchema = mongoose.Schemas['jobs'];
var wTrackSchema = mongoose.Schemas['wTrack'];

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");

    var Job = dbObject.model("jobs", JobsSchema);
    var wTrackModel = dbObject.model("wTrack", wTrackSchema);

    Job.update({"budget.budgetTotal.costSum" : NaN}, {$set: {"budget.budgetTotal.costSum": 0, "budget.budgetTotal.profitSum": 0}}, {multi: true}, function(){

   });

    Job.find().populate('quotation').exec(function (err, result) {
        if (err){
            console.log(err);
        }

        async.each(result, function (job, cb) {
            var jobBudget = job.budget.budget;
            var quotation = result.quotation;

            var totalAmount = quotation ? quotation.paymentInfo.total : null;

            if (totalAmount){
                async.each(quotation.products, wTrackUpdater, function (err) {
                    if (err) {
                        logger.error(err);
                    }
                });

                function wTrackUpdater(product, cb) {
                    var waterfallTasks = [totalWorkedCalculator, wTrackUpdatertotalWorked];

                    function totalWorkedCalculator(waterfallCb) {
                        wTrackModel.aggregate([{
                            $match: {
                                jobs: product.jobs
                            }
                        }, {
                            $group: {
                                _id: null,
                                totalWorked: {$sum: '$worked'},
                                ids: {$addToSet: '$_id'}
                            }
                        }], function (err, wetracks) {
                            var totalWorked;
                            var ids = [];

                            if (err) {
                                return waterfallCb(err);
                            }

                            if (wetracks[0]) {
                                totalWorked = wetracks[0].totalWorked;
                                ids = wetracks[0].ids;
                            } else {
                                totalWorked = 0;
                            }

                            waterfallCb(null, totalWorked, ids);
                        });
                    };

                    function wTrackUpdatertotalWorked(totalWorked, ids, waterfallCb) {
                        wTrackModel.find({
                            _id: {$in: ids}
                        }, function (err, wTracks) {
                            if (err) {
                                return waterfallCb(err);
                            }

                            async.each(wTracks, function (wTrack, cb) {
                                var revenue = (wTrack.worked / totalWorked) * totalAmount * 100;

                                console.log(revenue, wTrack._id);
                                wTrackModel.findByIdAndUpdate(wTrack._id, {$set: {revenue: revenue}}, {new: true}, function (err, updated) {
                                    if (err) {
                                        return cb(err);
                                    }
                                    event.emit('updateProjectDetails', {
                                        req  : req,
                                        _id  : updated.project,
                                        jobId: updated.jobs
                                    });
                                    cb();
                                });
                            }, function (err) {
                                if (err) {
                                    return waterfallCb(err);
                                }

                                waterfallCb();
                            });
                        });
                    }

                    function waterfallMasterCb(err, response) {
                        if (err) {
                            return cb(err);
                        }
                        console.log(response);
                        cb();
                    }

                    async.waterfall(waterfallTasks, waterfallMasterCb);
                }
            }


                jobBudget.forEach(function (arrayEl) {
                if (isNaN(arrayEl.cost)){
                    arrayEl.cost = 0;
                    arrayEl.profit = 0;
                }
            });

            Job.update({_id: job._id}, {$set: {"budget.budget" : jobBudget }}, cb);
        });

    });


});