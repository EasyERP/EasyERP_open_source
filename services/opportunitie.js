'use strict';

var mongoose = require('mongoose');
var opportunitieSchema = mongoose.Schemas.Opportunitie;
var _ = require('lodash');
// var populateWrapper = require('../helpers/callbackWrapper').populate;

module.exports = function (models) {
    return new function () {
        this.getByParam = function (options, callback) {
            var startDate = options.dateRange && options.dateRange.from;
            var endDate = options.dateRange && options.dateRange.to;
            var dbName = options.dbName;
            var rowsMapper = {
                name           : '$name',
                expectedRevenue: '$expectedRevenue.value',
                jobPosition    : '$jobPosition',
                creationDate   : '$creationDate',
                company        : '$company',
                customer       : '$customer',
                tags           : '$tags',
                dateBirth      : '$dateBirth',
                address        : '$address',
                contactName    : {$concat: ['$contactName.name.first', ' ', '$contactName.name.last']},
                salesPerson    : '$salesPerson',
                salesTeam      : '$salesTeam',
                expectedClosing: '$expectedClosing',
                priority       : '$priority',
                email          : '$email',
                phones         : '$phones',
                phone          : '$phones.phone',
                mobile         : '$phones.mobile',
                fax            : '$phones.fax',
                social         : '$social',
                FB             : '$social.FB',
                LI             : '$social.LI',
                skype          : '$skype',
                workflow       : '$workflow',
                source         : '$source',
                country        : '$address.country'
            };
            var projectRows = options.rows;
            var forExport = options.forExport;
            var isOpportunity = false;
            var matchQuery = {};
            var sort = {};
            var Opportunities;
            var aggregation;
            var pipeLine;
            var sortKey;
            var error;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (!callback || typeof callback !== 'function') {
                callback = function () {
                };
            }

            dbName = options.dbName;
            delete options.dbName;

            options.groupBy = options.groupBy || 'name';
            sort[options.groupBy] = 1;
            if (!dbName) {
                error = new Error('Invalid parameters');
                error.status = 400;

                return callback(error);
            }

            Opportunities = models.get(dbName, 'Opportunities', opportunitieSchema);

            if (options.reportCategory === 'opportunitiesReports') {
                isOpportunity = true;
                rowsMapper.convertedDate = '$convertedDate';
            }

            if (startDate && endDate) {
                matchQuery = {
                    isOpportunitie  : isOpportunity,
                    'createdBy.date': {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                };
            }

            if (options.sort) {
                options.sort = _.extend(sort, options.sort);
                sort = {};
                sortKey = Object.keys(options.sort);
                sortKey.forEach(function (key) {
                    sort[key] = parseInt(options.sort[key], 10);
                });
            }

            pipeLine = [{
                $match: matchQuery
            }, {
                $lookup: {
                    from        : 'Customers',
                    localField  : 'customer',
                    foreignField: '_id',
                    as          : 'customer'
                }
            }, {
                $lookup: {
                    from        : 'Customers',
                    localField  : 'company',
                    foreignField: '_id',
                    as          : 'company'
                }
            }, {
                $lookup: {
                    from        : 'tags',
                    localField  : 'tags',
                    foreignField: '_id',
                    as          : 'tags'
                }
            }, {
                $lookup: {
                    from        : 'Employees',
                    localField  : 'salesPerson',
                    foreignField: '_id',
                    as          : 'salesPerson'
                }
            }, {
                $lookup: {
                    from        : 'Department',
                    localField  : 'salesTeam',
                    foreignField: '_id',
                    as          : 'salesTeam'
                }
            }, {
                $lookup: {
                    from        : 'workflows',
                    localField  : 'workflow',
                    foreignField: '_id',
                    as          : 'workflow'
                }
            }, {
                $project: {
                    name           : 1,
                    jobPosition    : 1,
                    expectedRevenue: 1,
                    contactName    : 1,
                    creationDate   : 1,
                    convertedDate  : 1,
                    dateBirth      : 1,
                    address        : 1,
                    expectedClosing: 1,
                    priority       : 1,
                    email          : 1,
                    phones         : 1,
                    social         : 1,
                    skype          : 1,
                    source         : 1,
                    customer       : {$arrayElemAt: ['$customer', 0]},
                    tags           : {$arrayElemAt: ['$tags', 0]},
                    salesPerson    : {$arrayElemAt: ['$salesPerson', 0]},
                    salesTeam      : {$arrayElemAt: ['$salesTeam', 0]},
                    workflow       : {$arrayElemAt: ['$workflow', 0]},
                    company        : {$arrayElemAt: ['$company', 0]}
                }
            }, {
                $project: {
                    name           : 1,
                    expectedRevenue: 1,
                    contactName    : 1,
                    jobPosition    : 1,
                    creationDate   : 1,
                    convertedDate  : 1,
                    dateBirth      : 1,
                    address        : 1,
                    expectedClosing: 1,
                    priority       : 1,
                    email          : 1,
                    phones         : 1,
                    social         : 1,
                    skype          : 1,
                    source         : 1,
                    customer       : {$concat: ['$customer.name.first', ' ', '$customer.name.last']},
                    company        : {$concat: ['$company.name.first', ' ', '$company.name.last']},
                    salesPerson    : {$concat: ['$salesPerson.name.first', ' ', '$salesPerson.name.last']},
                    tags           : '$tags.name',
                    salesTeam      : '$salesTeam.name',
                    workflow       : '$workflow.name'
                }
            }];
            Object.keys(rowsMapper).forEach(function (rowName) {
                if (projectRows.indexOf(rowName) === -1) {
                    delete rowsMapper[rowName];
                }
            });

            if (forExport) {
                rowsMapper.address = {$concat: ['$address.street', ', ', '$address.city', ', ', '$address.state', ', ', '$address.zip', ', ', '$address.country']}
            }
            pipeLine.push({
                $project: rowsMapper
            }, {
                $sort: sort
            });

            if (!callback || typeof callback !== 'function') {
                return pipeLine;
            }

            aggregation = Opportunities.aggregate(pipeLine);

            aggregation.options = {
                allowDiskUse: true
            };
            aggregation.exec(function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, {
                    data: result
                });
            });
        };
    };
};
