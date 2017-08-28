var GoodsOutNotes = function (models, event) {
    'use strict';

    var mongoose = require('mongoose');
    var objectId = mongoose.Types.ObjectId;

    var ProductSchema = mongoose.Schemas.Products;
    var GoodsOutSchema = mongoose.Schemas.GoodsOutNote;
    var OrgSettingsSchema = mongoose.Schemas.orgSettingsSchema;
    var Mailer = require('../helpers/mailer');
    var mailer = new Mailer();
    var OrderRowsSchema = mongoose.Schemas.OrderRow;
    var OrderSchema = mongoose.Schemas.Order;
    var JournalEntryHandler = require('./journalEntry');
    var journalEntry = new JournalEntryHandler(models);
    var AvailabilityService = require('../services/productAvailability')(models);
    var JournalEntryService = require('../services/journalEntry')(models);
    var organizationSettingService = require('../services/organizationSetting')(models);
    var CONSTANTS = require('../constants/mainConstants');
    var orderService = require('../services/order')(models);
    var channelLinksService = require('../services/channelLinks')(models);
    var integrationService = require('../services/integration')(models);
    var goodsOutNotesService = require('../services/goodsOutNotes')(models);
    var warehouseService = require('../services/warehouse')(models);
    var GoodsInNotesHandler = require('../handlers/goodsInNote');
    var goodsInNotesHandler = new GoodsInNotesHandler(models, event);
    var orderRowService = require('../services/orderRows')(models);

    var async = require('async');
    var _ = require('lodash');
    var fs = require('fs');
    var pageHelper = require('../helpers/pageHelper');
    var FilterMapper = require('../helpers/filterMapper');
    var RESPONSES = require('../constants/responses');

    var path = require('path');
    var Uploader = require('../services/fileStorage/index');
    var uploader = new Uploader();
    var AvailabilityHelper = require('../helpers/availability')(models);

    var _getHelper = require('../helpers/integrationHelperRetriever')(models, event);
    var getHelper = _getHelper.getHelper;

    function updateOnlySelectedFields(req, res, next) {
        var GoodsOutNote = models.get(req.session.lastDb, 'GoodsOutNote', GoodsOutSchema);

        var data = req.body;
        var id = req.params.id;
        var dbName = req.session.lastDb;
        var uId = req.session.uId;
        var body;

        var keys = Object.keys(data);

        keys.forEach(function (el) {
            if (el.split('.')[0] === 'status' && data[el]) {
                data[el + 'On'] = data.date ? new Date(data.date) : new Date();
                data[el + 'ById'] = req.session.uId;
            } else if (!data[el]) {
                data[el + 'On'] = null;
                data[el + 'ById'] = null;
            }
        });

        GoodsOutNote
            .findByIdAndUpdate(id, data, {new: true})
            .populate('order', 'shippingExpenses paymentMethod warehouse')
            .populate('warehouse', 'account')
            .populate('manufacturingOrder', '_id name quantity product')
            .exec(function (err, goodsOutNote) {
                if (err) {
                    return next(err);
                }

                if (data['status.shipped'] && goodsOutNote.order && goodsOutNote.order._id) {
                    AvailabilityHelper.deliverProducts({
                        dbName      : dbName,
                        uId         : uId,
                        goodsOutNote: goodsOutNote.toJSON()
                    }, function (err) {
                        if (err) {
                            return next(err);
                        }

                        event.emit('recalculateStatus', req, goodsOutNote.order._id, next);

                        res.status(200).send({status: goodsOutNote.status});
                    });
                } else if (data['status.shipped'] && goodsOutNote.manufacturingOrder && goodsOutNote.manufacturingOrder._id) {
                    AvailabilityHelper.deliverProducts({
                        dbName      : dbName,
                        uId         : uId,
                        goodsOutNote: goodsOutNote.toJSON()
                    }, function (err) {
                        var orderRow;
                        var newRows;

                        if (err) {
                            return next(err);
                        }

                        newRows = [{
                            product          : goodsOutNote.manufacturingOrder.product,
                            quantity         : goodsOutNote.manufacturingOrder.quantity,
                            cost             : 0,
                            orderRowId       : null,
                            locationsReceived: [{
                                location: goodsOutNote.orderRows[0].locationsDeliver[0],
                                quantity: goodsOutNote.manufacturingOrder.quantity,
                                _id     : objectId()
                            }]
                        }];

                        goodsOutNote.orderRows.forEach(function (el) {
                            newRows[0].cost += el.cost;
                        });

                        orderRow = {
                            dbName                       : dbName,
                            description                  : '',
                            channel                      : null,
                            creditAccount                : null,
                            debitAccount                 : null,
                            creationDate                 : new Date(),
                            nominalCode                  : 0,
                            subTotal                     : newRows[0].cost,
                            costPrice                    : 0,
                            unitPrice                    : newRows[0].cost,
                            taxes                        : [],
                            quantity                     : goodsOutNote.manufacturingOrder.quantity,
                            warehouse                    : goodsOutNote.warehouse._id,
                            order                        : goodsOutNote.manufacturingOrder._id,
                            product                      : goodsOutNote.manufacturingOrder.product,
                            isFromManufacturingForReceive: true
                        };

                        orderRowService.create(orderRow, function (err, orderRow) {
                            if (err) {
                                return next(err);
                            }

                            newRows[0].orderRowId = orderRow._id;
                            var name = goodsOutNote.manufacturingOrder.name.split('_');

                            body = {
                                status: {
                                    received: true
                                },

                                orderRows         : newRows,
                                manufacturingOrder: goodsOutNote.manufacturingOrder._id,
                                warehouse         : goodsOutNote.warehouse._id,
                                name              : name[0] + 'I_' + name[1]
                            };

                            goodsInNotesHandler.createHelper(body, {dbName: dbName, uId: uId}, function (err, result) {
                                if (err) {
                                    return next(err);
                                }

                                event.emit('recalculateStatus', req, result.manufacturingOrder, next);

                                res.status(200).send({status: goodsOutNote.status});
                            });
                        });

                    });
                } else {
                    res.status(200).send({status: goodsOutNote.status});
                }
            });

    }

    function remove(req, res, next, id) {
        var Products = models.get(req.session.lastDb, 'Products', ProductSchema);
        var GoodsOutNote = models.get(req.session.lastDb, 'GoodsOutNote', GoodsOutSchema);

        GoodsOutNote.findOneAndRemove({_id: id}, function (err, goodsOutNote) {
            /* var categoryId = product.accounting.category._id;*/

            if (err) {
                return next(err);
            }

            /* Products.update({_id: categoryId}, {$inc: {productsCount: -1}}, function () {
             if (err) {
             return next(err);
             }*/

            res.status(200).send({success: product});
            /*});*/
        });
    }

    this.sendEmail = function (req, res, next) {
        var data = req.body;
        var attachments = [];
        var mailOptions;

        if (data.attachment) {
            attachments.push(data.attachment);
        }

        mailOptions = {
            to         : data.To,
            cc         : data.Cc,
            subject    : 'Goods Note ' + data.name,
            attachments: attachments,
            req        : req
        };

        getFromMail(mailOptions, function (err, result) {
            var path = data.attachment ? data.attachment.path : '';

            if (err) {
                return next(err);
            }

            if (path) {
                fs.unlink(path, function (err) {
                    console.log(err);
                });
            }
            res.status(200).send({});
        });
    };

    function getFromMail(mailOptions, cb) {

        var OrgSettings;
        if (mailOptions.req) {
            OrgSettings = models.get(mailOptions.req.session.lastDb, 'orgSettings', OrgSettingsSchema);
            OrgSettings.findOne()
                .populate('contact', 'email')
                .exec(function (err, settings) {
                    if (err) {
                        return console.log(err);
                    }

                    if (settings && !settings.defaultEmail && settings.contact) {
                        mailOptions.from = settings.contact.email;
                    }

                    mailer.sendGoodsNote(mailOptions, cb);
                });
        } else {
            mailer.sendGoodsNote(mailOptions, cb);
        }
    }

    function getAll(req, res, next) {
        var Product = models.get(req.session.lastDb, 'Product', ProductSchema);
        var queryObject = {};
        var query = req.query;
        var projection = query.projection || {};

        if (query && query.canBeSold === 'true') {
            queryObject.canBeSold = true;

            // todo change it for category
            /* if (query.service === 'true') {
             key = 'info.productType';
             queryObject[key] = 'Service';
             }*/
        } else {
            queryObject.canBePurchased = true;
        }

        Product.find(queryObject, projection, function (err, products) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: products});
        });
    }

    function getGoodsNotesFilter(req, res, next) {
        var mid = req.query.contentType === 'salesProduct' ? 65 : 58;

        var query = req.query;
        var quickSearch = query.quickSearch;
        var matchObject = {};
        var regExp;
        var optionsObject = {$and: []};
        var sort = {};
        var paginationObject = pageHelper(query);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var filterMapper = new FilterMapper();
        var key;

        var GoodsOutNote = models.get(req.session.lastDb, 'GoodsOutNote', GoodsOutSchema);

        optionsObject.$and.push({
            $or: [
                {_type: 'GoodsInNote'},
                {_type: 'GoodsOutNote'}]
        });

        if (query && query.sort) {
            key = Object.keys(query.sort)[0].toString();
            query.sort[key] = parseInt(query.sort[key], 10);
            sort = query.sort;
        } else {
            sort = {'createdBy.date': -1};
        }

        if (query.filter && typeof query.filter === 'object') {
            optionsObject.$and.push(filterMapper.mapFilter(query.filter, {contentType: 'GoodsOutNote'})); // caseFilter(query.filter);
        }

        if (quickSearch) {
            regExp = new RegExp(quickSearch, 'ig');
            matchObject['customer.name'] = {$regex: regExp};
        }

        GoodsOutNote.aggregate([{
            $match: {
                archived: {$ne: true}
            }
        }, {
            $lookup: {
                from        : 'Order',
                localField  : 'order',
                foreignField: '_id',
                as          : 'order'
            }
        }, {
            $lookup: {
                from        : 'warehouse',
                localField  : 'warehouse',
                foreignField: '_id',
                as          : 'warehouse'
            }
        }, {
            $project: {
                name     : 1,
                warehouse: {$arrayElemAt: ['$warehouse', 0]},
                order    : {$arrayElemAt: ['$order', 0]},
                status   : 1,
                createdBy: 1,
                date     : 1,
                _type    : 1
            }

        }, {
            $lookup: {
                from        : 'Customers',
                localField  : 'order.supplier',
                foreignField: '_id',
                as          : 'customer'
            }
        }, {
            $lookup: {
                from        : 'workflows',
                localField  : 'order.workflow',
                foreignField: '_id',
                as          : 'workflow'
            }
        }, {
            $project: {
                name            : 1,
                order           : 1,
                status          : 1,
                'warehouse._id' : '$warehouse._id',
                'warehouse.name': '$warehouse.name',
                workflow        : {$arrayElemAt: ['$workflow', 0]},
                customer        : {$arrayElemAt: ['$customer', 0]},
                _type           : 1,
                date            : 1,
                createdBy       : 1
            }
        }, {
            $project: {
                name             : 1,
                'order._id'      : 1,
                'order.name'     : 1,
                'order.project'  : 1,
                status           : 1,
                warehouse        : 1,
                date             : 1,
                'workflow._id'   : 1,
                'workflow.name'  : 1,
                'workflow.status': 1,
                'customer._id'   : 1,
                'customer.name'  : {$concat: ['$customer.name.first', ' ', '$customer.name.last']},
                _type            : 1,
                createdBy        : 1
            }
        }, {
            $match: optionsObject
        }, {
            $match: matchObject
        }, {
            $group: {
                _id  : null,
                total: {$sum: 1},
                root : {$push: '$$ROOT'}
            }
        }, {
            $unwind: '$root'
        }, {
            $project: {
                _id      : '$root._id',
                name     : '$root.name',
                order    : '$root.order',
                status   : '$root.status',
                warehouse: '$root.warehouse',
                workflow : '$root.workflow',
                customer : '$root.customer',
                createdBy: '$root.createdBy',
                date     : '$root.date',
                total    : 1,
                shipped  : '$root.status.shipped',
                printed  : '$root.status.printed',
                picked   : '$root.status.picked',
                packed   : '$root.status.packed'
            }
        }, {
            $sort: sort
        }, {
            $skip: skip
        }, {
            $limit: limit
        }])
            .exec(function (err, result) {
                var count;
                var firstElement;
                var response = {};

                if (err) {
                    return next(err);
                }

                firstElement = result[0];
                count = firstElement && firstElement.total ? firstElement.total : 0;
                response.total = count;
                response.data = result;

                res.status(200).send(response);
            });
    }

    function getGoodsNoteById(req, res, next) {
        var id = req.query.id || req.params.id;
        var GoodsOutNote = models.get(req.session.lastDb, 'GoodsOutNote', GoodsOutSchema);
        var OrderRows = models.get(req.session.lastDb, 'orderRows', OrderRowsSchema);
        var Order = models.get(req.session.lastDb, 'Order', OrderSchema);
        var query;

        if (id.length < 24) {
            return res.status(400).send();
        }

        query = GoodsOutNote.findById(id);

        query
            .populate('createdBy.user')
            .populate('editedBy.user')
            .populate('shippingMethod')
            .populate('manufacturingOrder', '_id')
            .exec(function (err, result) {

                if (err) {
                    return next(err);
                }

                result = result.toJSON();

                OrderRows.find({$and: [{order: result.order}, {product: {$ne: null}}]})
                    .populate('product')
                    .exec(function (err, orderRows) {
                        var orderRowsIds;

                        if (err) {
                            return next(err);
                        }

                        orderRowsIds = orderRows.map(function (element) {
                            return element._id;
                        });

                        GoodsOutNote.find({
                            'orderRows.orderRowId': {$in: orderRowsIds}
                        }, {
                            'orderRows': 1,
                            status     : 1
                        })
                            .populate('orderRows.locationsDeliver')
                            .exec(function (err, docs) {
                                if (err) {
                                    return next(err);
                                }

                                orderRows = orderRows.map(function (element) {
                                    return element.toJSON();
                                });

                                orderRows.forEach(function (el) {
                                    el.shipped = 0;
                                    el.selectedQuantity = 0;

                                    docs.forEach(function (element) {
                                        var elementOrderRow = _.find(element.orderRows, {orderRowId: el._id});
                                        var quantity = 0;

                                        if (elementOrderRow) {
                                            quantity = elementOrderRow.quantity;
                                            if (element._id.toString() === result._id.toString()) {
                                                el.selectedQuantity = quantity;
                                                el.locationsDeliver = elementOrderRow.locationsDeliver;
                                            }

                                            if (element.status.shipped) {
                                                el.shipped += quantity;
                                                el.selectedQuantity = 0;
                                            }
                                        }
                                    });
                                    el.quantity -= (el.shipped + el.selectedQuantity);
                                });

                                result.orderRows = orderRows;

                                Order.findById(result.order)
                                    .populate('supplier')
                                    .exec(function (err, doc) {
                                        if (err) {
                                            return next(err);
                                        }

                                        result.order = doc;

                                        res.status(200).send(result);
                                    });

                            });
                    });

            });
    }

    this.create = function (req, res, next) {
        var dbName = req.session.lastDb;
        var GoodsOutNote = models.get(dbName, 'GoodsOutNote', GoodsOutSchema);
        var body = req.body;
        var isManufacturing = body.isManufacturing || false;
        var user = req.session.uId;
        var date = new Date();
        var isShipped = body['status.shipped'];
        var orderId = body.order || body.manufacturingOrder;
        var resultGoodsOutNote;
        var mainResultObj;
        var goodsOutNote;
        var integrationOrderId;
        var channel;
        var nativeGoodsOutNote;

        if (isShipped) {
            body.status = {
                shipped    : true,
                picked     : true,
                packed     : true,
                printed    : true,
                shippedOn  : date,
                pickedOn   : date,
                packedOn   : date,
                printedOn  : date,
                pickedById : user,
                packedById : user,
                shippedById: user,
                printedById: user
            };
        }

        body.createdBy = {
            user: user
        };

        body.dbName = dbName;

        console.log('goodsOut', body);

        async.waterfall([
            function (wCb) {
                goodsOutNotesService.create(body, function (err, resultGoods) {
                    if (err) {
                        return wCb(err);
                    }

                    nativeGoodsOutNote = resultGoods;

                    wCb(null, resultGoods);
                });
            },

            function (result, wCb) {
                var error;

                if (!wCb && typeof result === 'function') {
                    wCb = result;
                    error = new Error('Result not found');
                    error.status = 404;

                    return wCb(error);
                }

                AvailabilityHelper.updateAvailableProducts({
                    dbName: dbName,
                    doc   : result.toJSON()
                }, function (err, rows) {
                    if (err) {
                        return wCb(err);
                    }

                    wCb(null, result, rows);
                });
            },

            function (result, rows, wCb) {
                var error;

                if (!wCb && typeof rows === 'function') {
                    wCb = rows;
                    error = new Error('Rows not found');
                    error.status = 404;

                    return wCb(error);
                }

                goodsOutNotesService.findByIdAndUpdate({orderRows: rows}, {
                    dbName: dbName,
                    id    : result._id,
                    new   : true
                }, function (err, result) {
                    if (err) {
                        return wCb(err);
                    }

                    resultGoodsOutNote = result;

                    wCb(null, result);
                }, 'order warehouse manufacturingOrder');
            },

            function (result, wCb) {
                var error;

                if (!wCb && typeof result === 'function') {
                    wCb = result;
                    error = new Error('Result not found');
                    error.status = 404;

                    return wCb(error);
                }

                req.isManufacturing = isManufacturing;

                if (!isShipped) {
                    event.emit('recalculateStatus', req, result.order ? result.order : result.manufacturingOrder, next);
                    mainResultObj = {
                        success: result
                    };

                    return wCb();
                }

                if (!isManufacturing) {
                    AvailabilityHelper.deliverProducts({
                        dbName      : dbName,
                        uId         : user,
                        goodsOutNote: result.toJSON()
                    }, function (err) {
                        if (err) {
                            return wCb(err);
                        }

                        event.emit('recalculateStatus', req, nativeGoodsOutNote.order || nativeGoodsOutNote.manufacturingOrder, next);
                        mainResultObj = {
                            status: nativeGoodsOutNote.status
                        };

                        wCb();
                    });
                } else {
                    AvailabilityHelper.deliverProducts({
                        dbName      : dbName,
                        uId         : user,
                        goodsOutNote: result.toJSON()
                    }, function (err) {
                        var orderRow;
                        var newRows;

                        if (err) {
                            return next(err);
                        }

                        newRows = [{
                            product          : result.manufacturingOrder.product,
                            quantity         : result.manufacturingOrder.quantity,
                            cost             : 0,
                            orderRowId       : null,
                            locationsReceived: [{
                                location: null,
                                quantity: result.manufacturingOrder.quantity,
                                _id     : objectId()
                            }]
                        }];

                        result.orderRows.forEach(function (el) {
                            newRows[0].cost += el.cost;
                        });

                        orderRow = {
                            dbName                       : dbName,
                            description                  : '',
                            channel                      : null,
                            creditAccount                : null,
                            debitAccount                 : null,
                            creationDate                 : new Date(),
                            nominalCode                  : 0,
                            subTotal                     : newRows[0].cost,
                            costPrice                    : 0,
                            unitPrice                    : newRows[0].cost,
                            taxes                        : [],
                            quantity                     : result.manufacturingOrder.quantity,
                            warehouse                    : result.manufacturingOrder.warehouseTo,
                            order                        : result.manufacturingOrder._id,
                            product                      : result.manufacturingOrder.product,
                            isFromManufacturingForReceive: true
                        };

                        warehouseService.findOne({_id: result.manufacturingOrder.warehouseTo}, {dbName: dbName}, function (err, wh) {
                            if (err) {
                                return next(err);
                            }

                            orderRow.debitAccount = wh.account;

                            organizationSettingService.getWorkInProgress({dbName: dbName}, function (err, workInProgress) {
                                if (err) {
                                    return next(err);
                                }

                                orderRow.creditAccount = workInProgress;

                                orderRowService.create(orderRow, function (err, orderRow) {
                                    if (err) {
                                        return next(err);
                                    }

                                    newRows[0].orderRowId = orderRow._id;

                                    warehouseService.findLocation({warehouse: orderRow.warehouse}, {dbName: dbName}, function (err, location) {
                                        var name;
                                        if (err) {
                                            return next(err);
                                        }

                                        newRows[0].locationsReceived[0].location = location;
                                        name = result.manufacturingOrder.name.split('_');

                                        body = {
                                            status: {
                                                received: true
                                            },

                                            orderRows         : newRows,
                                            manufacturingOrder: result.manufacturingOrder._id,
                                            warehouse         : result.manufacturingOrder.warehouseTo,
                                            name              : name[0] + 'I_' + name[1]
                                        };

                                        goodsInNotesHandler.createHelper(body, {
                                            dbName: dbName,
                                            uId   : user
                                        }, function (err, result) {
                                            if (err) {
                                                return next(err);
                                            }

                                            event.emit('recalculateStatus', req, result.manufacturingOrder, next);

                                            mainResultObj = {
                                                status: nativeGoodsOutNote.status
                                            };

                                            wCb();
                                        });
                                    });

                                });
                            });
                        });

                    });
                }

            },

            function (wCb) {
                var fulfillmentObj;
                var date;

                orderService.findById(orderId, {
                    dbName            : dbName,
                    manufacturingOrder: isManufacturing
                }, function (err, resultOrder) {
                    if (err) {
                        return wCb(err);
                    }

                    if (!resultOrder.channel || !resultOrder.integrationId) {
                        return wCb();
                    }

                    channel = resultOrder.channel;
                    integrationOrderId = resultOrder.integrationId;

                    date = new Date();

                    fulfillmentObj = {
                        status    : 'success',
                        created_at: date,
                        updated_at: date
                    };

                    wCb(null, fulfillmentObj);
                });
            },

            function (fulfillment, wCb) {
                var fulfillLineItems = [];
                var productIds;
                var orderRows;

                if (!wCb && typeof fulfillment === 'function') {
                    wCb = fulfillment;

                    return wCb();
                }

                if (!resultGoodsOutNote) {
                    return wCb();
                }

                orderRows = resultGoodsOutNote.orderRows;
                productIds = _.pluck(orderRows, 'product');

                channelLinksService.find({product: {$in: productIds}}, {dbName: dbName})
                    .lean()
                    .exec(function (err, resultChannelLink) {
                        var error;

                        if (err) {
                            return wCb(err);
                        }

                        if (!resultChannelLink || !resultChannelLink.length) {
                            error = new Error('Listed products not found');
                            error.status = 404;

                            return wCb(error);
                        }

                        resultChannelLink.forEach(function (channelLinks) {
                            var productId = parseInt(channelLinks.linkId.split('|')[0], 10);
                            var variantId = parseInt(channelLinks.linkId.split('|')[1], 10);
                            var quantity = (_.findWhere(orderRows, {product: channelLinks.product})).quantity;

                            fulfillLineItems.push({
                                quantity : quantity,
                                productId: productId,
                                variantId: variantId
                            });
                        });

                        fulfillment.line_items = fulfillLineItems;

                        wCb(null, fulfillment);
                    });
            },

            function (fulfillment, wCb) {
                if (typeof fulfillment === 'function') {
                    wCb = fulfillment;

                    return wCb();
                }

                orderRowService.findOne({
                    order  : orderId,
                    product: null,
                    dbName : dbName
                }, function (err, resultShipmentRow) {
                    if (err) {
                        return wCb(err);
                    }

                    wCb(null, fulfillment, resultShipmentRow);
                });
            },

            function (fulfillment, resultShipmentRow, wCb) {
                var integrationHelper;
                var integrationType;
                var error;

                if (typeof fulfillment === 'function') {
                    wCb = fulfillment;

                    return wCb();
                }

                integrationService.findOne({_id: channel}, {dbName: dbName})
                    .lean()
                    .exec(function (err, resultChannel) {
                        if (err) {
                            return wCb(err);
                        }

                        if (!resultChannel) {
                            error = new Error('Provided channel not found');
                            error.status = 404;

                            return wCb(error);
                        }

                        integrationType = resultChannel.type;
                        integrationHelper = getHelper(integrationType);

                        resultChannel.fulfillment = fulfillment;
                        resultChannel.orderId = integrationOrderId;
                        resultChannel.shipmentInfo = resultShipmentRow;

                        integrationHelper.publishFulfillments(resultChannel, function (err, createdExtrernalFulfillmentId) {
                            if (err) {
                                return wCb(err);
                            }

                            wCb(null, createdExtrernalFulfillmentId);
                        });
                    });
            },

            function (externalFulfillmentId, wCb) {
                if (!wCb && typeof externalFulfillmentId === 'function') {
                    wCb = externalFulfillmentId;

                    return wCb();
                }

                goodsOutNotesService.findByIdAndUpdate({
                    $set: {
                        channel      : channel,
                        integrationId: externalFulfillmentId
                    }
                }, {
                    dbName: dbName,
                    new   : true,
                    id    : nativeGoodsOutNote._id
                }, wCb);
            }
        ], function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send(mainResultObj);
        });
    };

    function bulkRemove(options, res, next) {
        var GoodsOutNote = models.get(options.dbName, 'GoodsOutNote', GoodsOutSchema);
        var ids = options.ids || [];
        var req = options.req;
        var isMO = options.isManufacturing || false;
        var orderType = 'order';

        if (isMO) {
            orderType = 'manufacturingOrder';
        }

        async.each(ids, function (id, cb) {
            GoodsOutNote.findById(id).populate(orderType).exec(function (err, goodsNote) {
                var options;

                if (err) {
                    return cb(err);
                }

                if (goodsNote && goodsNote[orderType]) {
                    async.each(goodsNote.orderRows, function (goodsOrderRow, callback) {

                        var query = goodsNote[orderType].project ? {
                            product  : goodsOrderRow.product,
                            warehouse: goodsNote.warehouse
                        } : {
                            'goodsOutNotes.goodsNoteId': goodsNote._id,
                            product                    : goodsOrderRow.product,
                            warehouse                  : goodsNote.warehouse
                        };

                        AvailabilityService.updateByQuery({
                            dbName: req.session.lastDb,
                            query : query,

                            body: {
                                $inc: {
                                    onHand: goodsOrderRow.quantity
                                },

                                $pull: {
                                    goodsOutNotes: {goodsNoteId: goodsNote._id}
                                }
                            }
                        }, function (err) {
                            if (err) {
                                return callback(err);
                            }

                            options = {
                                dbName: req.session.lastDb,
                                query : {
                                    'sourceDocument.model': 'goodsOutNote',
                                    'sourceDocument._id'  : id
                                }
                            };

                            JournalEntryService.remove(options);

                            callback();
                        });
                    }, function (err) {
                        if (err) {
                            return cb(err);
                        }

                        req.isManufacturing = isMO;

                        event && event.emit('recalculateStatus', req, goodsNote[orderType]._id, next);

                        cb();
                    });

                } else {
                    cb();
                }
            });
        }, function (err) {
            if (err) {
                return next(err);
            }

            GoodsOutNote.remove({_id: {$in: ids}}, function (err, result) {
                if (err) {
                    return next(err);
                }

                if (typeof  res.status === 'function') {
                    return res.status(200).send({success: 'Removed success'});
                }

                res();
            });
        });
    }

    this.removeByOrder = function (options, cb) {
        bulkRemove(options, cb, cb);
    };

    this.bulkRemove = function (req, res, next) {
        var options = {
            dbName: req.session.lastDb,
            ids   : req.body.ids,
            req   : req
        };
        bulkRemove(options, res, next);
    };

    this.getAll = function (req, res, next) {
        getAll(req, res, next);
    };

    this.updateOnlySelectedFields = function (req, res, next) {
        updateOnlySelectedFields(req, res, next);
    };

    this.getForView = function (req, res, next) {
        var viewType = req.query.viewType;
        var id = req.query.id || req.params.id;

        if (id && id.length >= 24) {
            return getGoodsNoteById(req, res, next);
        } else if (id && id.length < 24) {
            return res.status(400).send();
        }

        switch (viewType) {
            case 'list':
            case 'thumbnails':
                getGoodsNotesFilter(req, res, next);
                break;
            case 'form':
                getGoodsNoteById(req, res, next);
                break;
            default:
                getAll(req, res, next);
                break;
        }
    };

    this.uploadFile = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Product', ProductSchema);
        var headers = req.headers;
        var id = headers.modelid || 'empty';
        var contentType = headers.modelname || 'products';
        var files = req.files && req.files.attachfile ? req.files.attachfile : null;
        var dir;
        var err;

        contentType = contentType.toLowerCase();
        dir = path.join(contentType, id);

        if (!files) {
            err = new Error(RESPONSES.BAD_REQUEST);
            err.status = 400;

            return next(err);
        }

        uploader.postFile(dir, files, {userId: req.session.uName}, function (err, file) {
            if (err) {
                return next(err);
            }

            Model.findByIdAndUpdate(id, {$push: {attachments: {$each: file}}}, {new: true}, function (err, response) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({success: 'Product updated success', data: response});
            });
        });
    };

};

module.exports = GoodsOutNotes;
