var logger = require('../helpers/logger');
var mongoose = require('mongoose');
var orgSettingsSchema = mongoose.Schemas.orgSettingsSchema;
var crypto = require('crypto');
var geoip = require('geoip-lite');
var async = require('async');
var constants = require('../constants/responses');
var tracker = require('../helpers/tracker.js');
var namesRetriever = require('../helpers/namesRetriever');



var _Saas = function (mainDb, models) {
    var dbsObject = mainDb.dbsObject;
    var ProductCategoryService = require('../services/productCategory')(models);
    var productTypeService = require('../services/productType')(models);
    var WarehouseService = require('../services/warehouse')(models);
    var PriceListService = require('../services/priceList')(models);
    var IntegrationService = require('../services/integration')(models);
    var CustomersService = require('../services/customer')(models);

    this.clearData = function (req, res, next) {
        var dbName = req.session.lastDb;
        var connection = dbsObject[dbName];
        var OrgSettings = models.get(req.session.lastDb, 'orgSettings', orgSettingsSchema);
        var collections = ['warehouse', 'matchMagento', 'PriceLists', 'locations', 'Employees', 'Customers', 'Opportunities', 'birthdays', 'bonusType', 'cashTransfer', 'channelLinks', 'DealTasks', 'Department', 'followers', 'GoodsNote', 'History', 'Holiday', 'Invoice', 'JobPosition', 'jobs', 'journalentries', 'MonthHours', 'Order', 'orderRows', 'Payment', 'PaymentMethod', 'PayRoll', 'Products', 'productsAvailability', 'ProductCategories', 'ProductPrices', 'ProductOptions', 'ProductOptionsValues', 'productTypes', 'Project', 'projectMembers', 'tags', 'Tasks', 'transfers', 'Vacation', 'wTrack'];

        function dropCollections(connection, callback) {
            async.each(collections, function (collection, cb) {
                connection.db.dropCollection(collection, function (err) {
                    if (err && err.message !== 'ns not found') {
                        return cb(err);
                    } else if (err) {
                        return cb();
                    }

                    cb();
                });
            }, function (err) {
                if (err) {
                    return callback(err);
                }

                callback();
            });
        }

        function updateOrgProfile(cb) {
            var data = {
                address: {
                    street : '',
                    city   : '',
                    state  : '',
                    zip    : '',
                    fax    : '',
                    country: ''
                },

                imageSrc   : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC',
                phone      : '',
                website    : '',
                contact    : null,
                language   : null,
                user       : null,
                contactName: ''
            };

            OrgSettings.findOneAndUpdate({}, {$set: data, $unset: {startDate: ''}}, function (err) {
                if (err) {
                    return cb(err);
                }

                cb();
            })
        }

        function createProductType(cb) {
            productTypeService.create({dbName: dbName}, cb)
        }

        function deleteChannels(model, cb) {
            if (typeof model === 'function') {
                cb = model;
            }

            IntegrationService.find({}, {dbName: dbName}, function (err, result) {
                if (err) {
                    return cb(err);
                }

                async.each(result, function (el, callback) {
                    IntegrationService.findByIdAndRemove({dbName: dbName, id: el._id}, callback)
                }, cb)

            });
        }

        function createCustomers(model, cb) {
            if (typeof model === 'function') {
                cb = model;
            }

            CustomersService.createDefaults({dbName: dbName}, cb)
        }

        function createProductCategory(model, cb) {
            if (typeof model === 'function') {
                cb = model;
            }

            ProductCategoryService.create({dbName: dbName}, cb)
        }

        function createWarehouse(model, cb) {
            if (typeof model === 'function') {
                cb = model;
            }

            WarehouseService.create({dbName: dbName}, cb)
        }

        function createLocation(model, cb) {
            if (typeof model === 'function') {
                cb = model;
            }

            WarehouseService.createLocation({dbName: dbName}, cb)
        }

        function createPriceList(model, cb) {
            if (typeof model === 'function') {
                cb = model;
            }

            PriceListService.create({dbName: dbName}, function (err) {
                if (err) {
                    return cb(err);
                }

                PriceListService.create({dbName: dbName, cost: true}, cb)
            })
        }

        function parallelCreate() {
            var waterfallTasks;

            waterfallTasks = [updateOrgProfile, createProductType, deleteChannels, createCustomers, createProductCategory, createWarehouse, createLocation, createPriceList];
            async.waterfall(waterfallTasks, function (err) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({success: true});
            })
        }

        if (!connection) {
            connection = mongoose.createConnection(process.env.MAIN_DB_HOST, dbName, process.env.DB_PORT, process.env.connectOptions);

            connection.on('error', function (err) {
                console.error(err);
                next(err);
            });

            connection.once('open', function () {
                dropCollections(connection, function (err) {
                    if (err) {
                        return next(err);
                    }
                    parallelCreate();
                });
            });
        } else {
            dropCollections(connection, function (err, result) {
                if (err) {
                    return next(err);
                }
                parallelCreate();
            });
        }
    };

};

module.exports = _Saas;
