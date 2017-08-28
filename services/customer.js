'use strict';

var mongoose = require('mongoose');
var CustomerSchema = mongoose.Schemas.Customer;
var ObjectId = mongoose.Types.ObjectId;
var validator = require('validator');
var _ = require('lodash');

module.exports = function (models) {
    return new function () {
        this.create = function (options, callback) {
            var dbName;
            var CustomerModel;
            var customer;
            var err;

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

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            CustomerModel = models.get(dbName, 'Customers', CustomerSchema);
            customer = new CustomerModel(options);
            customer.save(function (err, customer) {
                if (err) {
                    return callback(err);
                }

                callback(null, customer);
            });
        };

        this.createDefaults = function (options, callback) {
            var dbName;
            var CustomerModel;
            var customer;
            var err;
            var magentoCustomer = {
                "_id"            : ObjectId("5947958e9ac4e97f9876741f"),
                "channel"        : null,
                "integrationId"  : "",
                "companyInfo"    : {
                    "industry": null
                },
                "editedBy"       : {
                    "date": "2017-06-19T14:52:52.352Z",
                    "user": null
                },
                "createdBy"      : {
                    "date": "2017-06-19T14:52:52.352Z",
                    "user": null
                },
                "history"        : [],
                "attachments"    : [],
                "notes"          : [],
                "groups"         : {
                    "group": [],
                    "users": [],
                    "owner": null
                },
                "whoCanRW"       : "everyOne",
                "social"         : {
                    "LI": "",
                    "FB": ""
                },
                "color"          : "#4d5a75",
                "relatedUser"    : null,
                "salesPurchases" : {
                    "receiveMessages": 0,
                    "language"       : "English",
                    "reference"      : "",
                    "active"         : true,
                    "implementedBy"  : null,
                    "salesTeam"      : null,
                    "salesPerson"    : null,
                    "isSupplier"     : false,
                    "isCustomer"     : true
                },
                "title"          : "",
                "internalNotes"  : "",
                "contacts"       : [],
                "phones"         : {
                    "fax"   : "",
                    "mobile": "",
                    "phone" : ""
                },
                "skype"          : "",
                "jobPosition"    : "",
                "website"        : "",
                "shippingAddress": {
                    "name"   : "",
                    "country": "",
                    "zip"    : "",
                    "state"  : "",
                    "city"   : "",
                    "street" : ""
                },
                "address"        : {
                    "country": "",
                    "zip"    : "",
                    "state"  : "",
                    "city"   : "",
                    "street" : ""
                },
                "timezone"       : "UTC",
                "department"     : null,
                "company"        : null,
                "email"          : "",
                "imageSrc"       : "data:image/jpeg;base64,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",
                "name"           : {
                    "last" : "",
                    "first": "Default Magento Customer"
                },
                "isHidden"       : false,
                "isOwn"          : false,
                "type"           : "Company",
                "__v"            : 0
            };

            var shopifyCustomer = {
                "_id"            : ObjectId("594796a19ac4e97f98767420"),
                "channel"        : null,
                "integrationId"  : "",
                "companyInfo"    : {
                    "industry": null
                },
                "editedBy"       : {
                    "date": "2017-06-19T14:52:52.402Z",
                    "user": null
                },
                "createdBy"      : {
                    "date": "2017-06-19T14:52:52.402Z",
                    "user": null
                },
                "history"        : [],
                "attachments"    : [],
                "notes"          : [],
                "groups"         : {
                    "group": [],
                    "users": [],
                    "owner": null
                },
                "whoCanRW"       : "everyOne",
                "social"         : {
                    "LI": "",
                    "FB": ""
                },
                "color"          : "#4d5a75",
                "relatedUser"    : null,
                "salesPurchases" : {
                    "receiveMessages": 0,
                    "language"       : "English",
                    "reference"      : "",
                    "active"         : true,
                    "implementedBy"  : null,
                    "salesTeam"      : null,
                    "salesPerson"    : null,
                    "isSupplier"     : false,
                    "isCustomer"     : true
                },
                "title"          : "",
                "internalNotes"  : "",
                "contacts"       : [],
                "phones"         : {
                    "fax"   : "",
                    "mobile": "",
                    "phone" : ""
                },
                "skype"          : "",
                "jobPosition"    : "",
                "website"        : "",
                "shippingAddress": {
                    "name"   : "",
                    "country": "",
                    "zip"    : "",
                    "state"  : "",
                    "city"   : "",
                    "street" : ""
                },
                "address"        : {
                    "country": "",
                    "zip"    : "",
                    "state"  : "",
                    "city"   : "",
                    "street" : ""
                },
                "timezone"       : "UTC",
                "department"     : null,
                "company"        : null,
                "email"          : "",
                "imageSrc"       : "data:image/png;base64,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",
                "name"           : {
                    "last" : "",
                    "first": "Default Shopify Customer"
                },
                "isHidden"       : false,
                "isOwn"          : false,
                "type"           : "Company",
                "__v"            : 0
            };

            var wooCustomer = {
                "_id"            : ObjectId("5948c7fc08a35a053cbc36d8"),
                "channel"        : null,
                "integrationId"  : "",
                "companyInfo"    : {
                    "industry": null
                },
                "editedBy"       : {
                    "date": "2017-06-19T14:52:52.402Z",
                    "user": null
                },
                "createdBy"      : {
                    "date": "2017-06-19T14:52:52.402Z",
                    "user": null
                },
                "history"        : [],
                "attachments"    : [],
                "notes"          : [],
                "groups"         : {
                    "group": [],
                    "users": [],
                    "owner": null
                },
                "whoCanRW"       : "everyOne",
                "social"         : {
                    "LI": "",
                    "FB": ""
                },
                "color"          : "#4d5a75",
                "relatedUser"    : null,
                "salesPurchases" : {
                    "receiveMessages": 0,
                    "language"       : "English",
                    "reference"      : "",
                    "active"         : true,
                    "implementedBy"  : null,
                    "salesTeam"      : null,
                    "salesPerson"    : null,
                    "isSupplier"     : false,
                    "isCustomer"     : true
                },
                "title"          : "",
                "internalNotes"  : "",
                "contacts"       : [],
                "phones"         : {
                    "fax"   : "",
                    "mobile": "",
                    "phone" : ""
                },
                "skype"          : "",
                "jobPosition"    : "",
                "website"        : "",
                "shippingAddress": {
                    "name"   : "",
                    "country": "",
                    "zip"    : "",
                    "state"  : "",
                    "city"   : "",
                    "street" : ""
                },
                "address"        : {
                    "country": "",
                    "zip"    : "",
                    "state"  : "",
                    "city"   : "",
                    "street" : ""
                },
                "timezone"       : "UTC",
                "department"     : null,
                "company"        : null,
                "email"          : "",
                "imageSrc"       : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABPMAAATzCAYAAAAXYHeuAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjM5NThDQ0RBMzI3MTFFNEI4MTA4OUQwQ0U1N0Y1MjIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjM5NThDQ0VBMzI3MTFFNEI4MTA4OUQwQ0U1N0Y1MjIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2Mzk1OENDQkEzMjcxMUU0QjgxMDg5RDBDRTU3RjUyMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2Mzk1OENDQ0EzMjcxMUU0QjgxMDg5RDBDRTU3RjUyMiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnqqBDMAAMHeSURBVHja7N0HcN3XfSf6AwJgAQiAAFEIgr33XkRSonqxZFmyLMuxHTvJJtnkpa3fOm+Sl83ObrbM5s3bTJLdzG4muzsv7yXZTJKN48SO4yJX2VbvEtXFTkoUe+9491zKjmRLFknglt+9n8/MGdmygXtw/ueW//eec34Ng4ODCQAAAACofiMMAQAAAADEIMwDAAAAgCCEeQAAAAAQhDAPAAAAAIIQ5gEAAABAEMI8AAAAAAhCmAcAAAAAQQjzAAAAACAIYR4AAAAABCHMAwAAAIAghHkAAAAAEIQwDwAAAACCEOYBAAAAQBDCPAAAAAAIQpgHAAAAAEEI8wAAAAAgCGEeAAAAAAQhzAMAAACAIIR5AAAAABCEMA8AAAAAghDmAQAAAEAQwjwAAAAACEKYBwAAAABBCPMAAAAAIAhhHgAAAAAEIcwDAAAAgCCEeQAAAAAQhDAPAAAAAIIQ5gEAAABAEMI8AAAAAAhCmAcAAAAAQQjzAAAAACAIYR4AAAAABCHMAwAAAIAghHkAAAAAEIQwDwAAAACCEOYBAAAAQBDCPAAAAAAIQpgHAAAAAEEI8wAAAAAgCGEeAAAAAAQhzAMAAACAIIR5AAAAABCEMA8AAAAAghDmAQAAAEAQwjwAAAAACEKYBwAAAABBCPMAAAAAIAhhHgAAAAAEIcwDAAAAgCCEeQAAAAAQhDAPAAAAAIIQ5gEAAABAEMI8AAAAAAhCmAcAAAAAQQjzAAAAACAIYR4AAAAABCHMAwAAAIAghHkAAAAAEIQwDwAAAACCEOYBAAAAQBDCPAAAAAAIQpgHAAAAAEEI8wAAAAAgCGEeAAAAAAQhzAMAAACAIIR5AAAAABCEMA8AAAAAghDmAQAAAEAQwjwAAAAACEKYBwAAAABBCPMAAAAAIAhhHgAAAAAEIcwDAAAAgCCEeQAAAAAQhDAPAAAAAIIQ5gEAAABAEMI8AAAAAAhCmAcAAAAAQQjzAAAAACAIYR4AAAAABCHMAwAAAIAghHkAAAAAEIQwDwAAAACCEOYBAAAAQBDCPAAAAAAIQpgHAAAAAEEI8wAAAAAgCGEeAAAAAAQhzAMAAACAIIR5AAAAABCEMA8AAAAAghDmAQAAAEAQwjwAAAAACEKYBwAAAABBCPMAAAAAIAhhHgAAAAAEIcwDAAAAgCCEeQAAAAAQhDAPAAAAAIIQ5gEAAABAEMI8AAAAAAhCmAcAAAAAQQjzAAAAACAIYR4AAAAABCHMAwAAAIAghHkAAAAAEIQwDwAAAACCEOYBAAAAQBDCPAAAAAAIQpgHAAAAAEEI8wAAAAAgCGEeAAAAAAQhzAMAAACAIIR5AAAAABCEMA8AAAAAghDmAQAAAEAQwjwAAAAACEKYBwAAAABBCPMAAAAAIAhhHgAAAAAEIcwDAAAAgCCEeQAAAAAQhDAPAAAAAIIQ5gEAAABAEMI8AAAAAAhCmAcAAAAAQQjzAAAAACAIYR4AAAAABCHMAwAAAIAghHkAAAAAEIQwDwAAAACCEOYBAAAAQBDCPAAAAAAIQpgHAAAAAEEI8wAAAAAgCGEeAAAAAAQhzAMAAACAIIR5AAAAABCEMA8AAAAAghDmAQAAAEAQwjwAAAAACEKYBwAAAABBCPMAAAAAIAhhHgAAAAAEIcwDAAAAgCCEeQAAAAAQhDAPAAAAAIIQ5gEAAABAEMI8AAAAAAhCmAcAAAAAQQjzAAAAACAIYR4AAAAABCHMAwAAAIAghHkAAAAAEIQwDwAAAACCEOYBAAAAQBDCPAAAAAAIQpgHAAAAAEEI8wAAAAAgCGEeAAAAAAQhzAMAAACAIIR5AAAAABCEMA8AAAAAghDmAQAAAEAQwjwAAAAACEKYBwAAAABBCPMAAAAAIAhhHgAAAAAEIcwDAAAAgCCEeQAAAAAQhDAPAAAAAIIQ5gEAAABAEMI8AAAAAAhCmAcAAAAAQQjzAAAAACAIYR4AAAAABCHMAwAAAIAghHkAAAAAEIQwDwAAAACCEOYBAAAAQBDCPAAAAAAIQpgHAAAAAEEI8wAAAAAgCGEeAAAAAAQhzAMAAACAIIR5AAAAABCEMA8AAAAAghDmAQAAAEAQwjwAAAAACEKYBwAAAABBCPMAAAAAIAhhHgAAAAAEIcwDAAAAgCCEeQAAAAAQhDAPAAAAAIIQ5gEAAABAEMI8AAAAAAhCmAcAAAAAQQjzAAAAACAIYR4AAAAABCHMAwAAAIAghHkAAAAAEIQwDwAAAACCEOYBAAAAQBDCPAAAAAAIQpgHAAAAAEEI8wAAAAAgCGEeAAAAAAQhzAMAAACAIIR5AAAAABCEMA8AAAAAghDmAQAAAEAQwjwAAAAACEKYBwAAAABBCPMAAAAAIAhhHgAAAAAEIcwDAAAAgCCEeQAAAAAQhDAPAAAAAIIQ5gEAAABAEMI8AAAAAAhCmAcAAAAAQQjzAAAAACAIYR4AAAAABCHMAwAAAIAghHkAAAAAEIQwDwAAAACCEOYBAAAAQBDCPAAAAAAIQpgHAAAAAEEI8wAAAAAgCGEeAAAAAAQhzAMAAACAIIR5AAAAABCEMA8AAAAAghDmAQAAAEAQwjwAAAAACEKYBwAAAABBCPMAAAAAIAhhHgAAAAAEIcwDAAAAgCCEeQAAAAAQhDAPAAAAAIIQ5gEAAABAEMI8AAAAAAhCmAcAAAAAQQjzAAAAACAIYR4AAAAABCHMAwAAAIAghHkAAAAAEIQwDwAAAACCEOYBAAAAQBDCPAAAAAAIQpgHAAAAAEEI8wAAAAAgCGEeAAAAAAQhzAMAAACAIIR5AAAAABCEMA8AAAAAghDmAQAAAEAQwjwAAAAACEKYBwAAAABBCPMAAAAAIAhhHgAAAAAEIcwDAAAAgCCEeQAAAAAQhDAPAAAAAIIQ5gEAAABAEMI8AAAAAAhCmAcAAAAAQQjzAAAAACAIYR4AAAAABCHMAwAAAIAghHkAAAAAEIQwDwAAAACCEOYBAAAAQBDCPAAAAAAIQpgHAAAAAEEI8wAAAAAgCGEeAAAAAAQhzAMAAACAIIR5AAAAABCEMA8AAAAAghDmAQAAAEAQwjwAAAAACEKYBwAAAABBCPMAAAAAIAhhHgAAAAAEIcwDAAAAgCCEeQAAAAAQhDAPAAAAAIIQ5gEAAABAEMI8AAAAAAhCmAcAAAAAQQjzAAAAACAIYR4AAAAABCHMAwAAAIAghHkAAAAAEIQwDwAAAACCEOYBAAAAQBDCPAAAAAAIQpgHAAAAAEEI8wAAAAAgCGEeAAAAAAQhzAMAAACAIIR5AAAAABCEMA8AAAAAghDmAQAAAEAQwjwAAAAACEKYBwAAAABBCPMAAAAAIAhhHgAAAAAEIcwDAAAAgCCEeQAAAAAQhDAPAAAAAIIQ5gEAAABAEMI8AAAAAAhCmAcAAAAAQQjzAAAAACAIYR4AAAAABCHMAwAAAIAghHkAAAAAEIQwDwAAAACCEOYBAAAAQBDCPAAAAAAIQpgHAAAAAEEI8wAAAAAgCGEeAAAAAAQhzAMAAACAIIR5AAAAABCEMA8AAAAAghDmAQAAAEAQwjwAAAAACEKYBwAAAABBCPMAAAAAIAhhHgAAAAAEIcwDAAAAgCCE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MA8AAAAAkhDmAQAAAEASwjwAAAAASEKYBwAAAABJCPMAAAAAIAlhHgAAAAAkIcwDAAAAgCSEeQAAAACQhDAPAAAAAJIQ5gEAAABAEsI8AAAAAEhCmAcAAAAASQjzAAAAACAJYR4AAAAAJCHMAwAAAIAkhHkAAAAAkIQwDwAAAACSEOYBAAAAQBLCPAAAAABIQpgHAAAAAEkI8wAAAAAgCWEeAAAAACQhzAMAAACAJIR5AAAAAJCEMA8AAAAAkhDmAQAAAEASwjwAAAAASEKYBwAAAABJCPMAAAAAIAlhHgAAAAAkIcwDAAAAgCSEeQAAAACQhDAPAAAAAJIQ5gEAAABAEsI8AAAAAEhCmAcAAAAASQjzAAAAACAJYR4AAAAAJCHMAwAAAIAkhHkAAAAAkIQwDwAAAACSEOYBAAAAQBLCPAAAAABIQpgHAAAAAEkI8wAAAAAgCWEeAAAAACQhzAMAAACAJIR5AAAAAJCEMA8AAAAAkhDmAQAAAEASwjwAAAAASEKYBwAAAABJCPMAAAAAIAlhHgAAAAAkIcwDAAAAgCSEeQAAAACQhDAPAAAAAJIQ5gEAAABAEsI8AAAAAEhCmAcAAAAASQjzAAAAACAJYR4AAAAAJCHMAwAAAIAkhHkAAAAAkIQwDwAAAACSEOYBAAAAQBLCPAAAAABIQpgHAAAAAEkI8wAAAAAgCWEeAAAAACQhzAMAAACAJIR5AAAAAJCEMA8AAAAAkhDmAQAAAEASwjwAAAAASEKYBwAAAABJCPMAAAAAIAlhHgAAAAAkIcwDAAAAgCSEeQAAAACQhDAPAAAAAJIQ5gEAAABAEsI8AAAAAEhCmAcAAAAASQjzAAAAACAJYR4AAAAAJCHMAwAAAIAkhHkAAAAAkIQwDwAAAACSEOYBAAAAQBLCPAAAAABIQpgHAAAAAEkI8wAAAAAgCWEeAAAAACQhzAMAAACAJIR5AAAAAJCEMA8AAAAAkhDmAQAAAEASwjwAAAAASEKYBwAAAABJCPMAAAAAIAlhHgAAAAAkIcwDAAAAgCSEeQAAAACQhDAPAAAAAJIQ5gEAAABAEsI8AAAAAEhCmAcAAAAASQjzAAAAACAJYR4AAAAAJCHMAwAAAIAkhHkAAAAAkIQwDwAAAACSEOYBAAAAQBLCPAAAAABIQpgHAAAAAEkI8wAAAAAgCWEeAAAAACQhzAMAAACAJIR5AAAAAJCEMA8AAAAAkhDmAQAAAEASwjwAAAAASEKYBwAAAABJCPMAAAAAIAlhHgAAAAAkIcwDAAAAgCSEeQAAAACQhDAPAAAAAJIQ5gEAAABAEsI8AAAAAEhCmAcAAAAASQjzAAAAACAJYR4AAAAAJCHMAwAAAIAkhHkAAAAAkIQwDwAAAACSEOYBAAAAQBLCPAAAAABIQpgHAAAAAEkI8wAAAAAgCWEeAAAAACQhzAMAAACAJIR5AAAAAJCEMA8AAAAAkhDmAQAAAEASwjwAAAAASEKYBwAAAABJCPMAAAAAIAlhHgAAAAAkIcwDAAAAgCSEeQAAAACQhDAPAAAAAJIQ5gEAAABAEsI8AAAAAEhCmAcAAAAASQjzAAAAACAJYR4AAAAAJCHMAwAAAIAkhHkAAAAAkIQwDwAAAACSEOYBAAAAQBLCPAAAAABIQpgHAAAAAEkI8wAAAAAgCWEeAAAAACQhzAMAAACAJIR5AAAAAJCEMA8AAAAAkhDmAQAAAEASwjwAAAAASEKYBwAAAABJCPMAAAAAIAlhHgAAAAAkIcwDAAAAgCSEeQAAAACQhDAPAAAAAJIQ5gEAAABAEsI8AAAAAEhCmAcAAAAASQjzAAAAACAJYR4AAAAAJCHMAwAAAIAkhHkAAAAAkIQwDwAAAACSEOYBAAAAQBLCPAAAAABIQpgHAAAAAEkI8wAAAAAgCWEeAAAAACQhzAMAAACAJIR5AAAAAJCEMA8AAAAAkhDmAQAAAEASwjwAAAAASEKYBwAAAABJCPMAAAAAIAlhHgAAAAAkIcwDAAAAgCSEeQAAAACQhDAPAAAAAJIQ5gEAAABAEsI8AAAAAEhCmAcAAAAASQjzAAAAACAJYR4AAAAAJCHMAwAAAIAkhHkAAAAAkIQwDwAAAACSEOYBAAAAQBLCPAAAAABIQpgHAAAAAEkI8wAAAAAgCWEeAAAAACQhzAMAAACAJIR5AAAAAJCEMA8AAAAAkhDmAQAAAEASwjwAAAAASEKYBwAAAABJCPMAAAAAIAlhHgAAAAAkIcwDAAAAgCSEeQAAAACQhDAPAAAAAJIQ5gEAAABAEsI8AAAAAEhCmAcAAAAASQjzAAAAACAJYR4AAAAAJCHMAwAAAIAkhHkAAAAAkIQwDwAAAACSEOYBAAAAQBLCPAAAAABIQpgHAAAAAEkI8wAAAAAgCWEeAAAAACQhzAMAAACAJIR5AAAAAJCEMA8AAAAAkhDmAQAAAEASwjwAAAAASEKYBwAAAABJCPMAAAAAIAlhHgAAAAAkIcwDAAAAgCSEeQAAAACQhDAPAAAAAJIQ5gEAAABAEsI8AAAAAEji/wswAFO/pJQOdq+CAAAAAElFTkSuQmCC",
                "name"           : {
                    "last" : "",
                    "first": "Default Woo Customer"
                },
                "isHidden"       : false,
                "isOwn"          : false,
                "type"           : "Company",
                "__v"            : 0
            };

            var customersArray = [magentoCustomer, shopifyCustomer, wooCustomer];

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

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            CustomerModel = models.get(dbName, 'Customers', CustomerSchema);
            CustomerModel.collection.insertMany(customersArray, function (err, customer) {
                if (err) {
                    return callback(err);
                }

                callback(null, customer);
            });
        };

        this.findByIdAndUpdate = function (_id, updateObject, options, callback) {
            var _options = {new: true};
            var CustomerModel;
            var dbName;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (!callback || typeof callback !== 'function') {
                callback = function () {
                };
            }

            if (!_id || !updateObject || typeof updateObject !== 'object') {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            if (options) {
                _options = _.assign(_options, options);
            }

            dbName = _options.dbName;
            delete _options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            CustomerModel = models.get(dbName, 'Customers', CustomerSchema);
            CustomerModel.findByIdAndUpdate(_id, updateObject, _options, function (err, customer) {
                if (err) {
                    return callback(err);
                }

                callback(null, customer);
            });
        };

        this.findAndUpdate = function (query, updateObject, options, callback) {
            var _options = {};
            var CustomerModel;
            var dbName;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (!callback || typeof callback !== 'function') {
                callback = function () {
                };
            }

            if (!query || !updateObject || typeof updateObject !== 'object') {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            if (options) {
                _options = _.assign(_options, options);
            }

            dbName = _options.dbName;
            delete _options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            CustomerModel = models.get(dbName, 'Customers', CustomerSchema);
            CustomerModel.update(query, updateObject, _options, function (err, updated) {
                if (err) {
                    return callback(err);
                }

                callback(null, updated);
            });
        };

        this.findById = function (_id, options, callback) {
            var CustomerModel;
            var dbName;
            var query;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            dbName = options.dbName;

            if (!dbName || !validator.isMongoId(_id)) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            CustomerModel = models.get(dbName, 'Customers', CustomerSchema);
            query = CustomerModel.findById(_id);

            if (typeof callback !== 'function') {
                return query;
            }

            query.exec(function (err, customer) {
                if (err) {
                    return callback(err);
                }

                callback(null, customer);
            });
        };

        this.findByIdAndRemove = function (_id, options, callback) {
            var CustomerModel;
            var dbName;
            var err;

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

            if (!dbName || !_id) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            CustomerModel = models.get(dbName, 'Customers', CustomerSchema);
            CustomerModel.findByIdAndRemove(_id, function (err, customer) {
                if (err) {
                    return callback(err);
                }

                callback(null, customer);
            });
        };

        this.findOne = function (query, options, callback) {
            var CustomerModel;
            var dbName;
            var err;

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

            if (!dbName || !query) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            CustomerModel = models.get(dbName, 'Customers', CustomerSchema);
            CustomerModel.findOne(query, options, function (err, customer) {
                if (err) {
                    return callback(err);
                }

                callback(null, customer);
            });
        };

        this.find = function (query, options, callback) {
            var CustomerModel;
            var dbName;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                };
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName || !query) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            CustomerModel = models.get(dbName, 'Customers', CustomerSchema);
            CustomerModel.find(query, options, function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.sortByFiled = function (options, callback) {
            var CustomerModel;
            var dbName;
            var err;
            var sort;
            var aggregate;
            var query;
            var type;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            dbName = options.dbName;
            sort = options.sort;
            type = options.type;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            CustomerModel = models.get(dbName, 'Customers', CustomerSchema);

            aggregate = [{
                $lookup: {
                    from        : 'Invoice',
                    localField  : '_id',
                    foreignField: 'supplier',
                    as          : 'invoice'
                }
            }, {
                $lookup: {
                    from        : 'Payment',
                    localField  : '_id',
                    foreignField: 'supplier',
                    as          : 'payment'
                }
            }, {
                $lookup: {
                    from        : 'Order',
                    localField  : '_id',
                    foreignField: 'supplier',
                    as          : 'orders'
                }
            }, {
                $unwind: {
                    path                      : '$invoice',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $project: {
                    name                : 1,
                    imageSrc            : 1,
                    email               : 1,
                    address             : 1,
                    shippingAddress     : 1,
                    website             : 1,
                    phones              : 1,
                    salesPurchases      : 1,
                    social              : 1,
                    ordersCount         : {$size: "$orders"},
                    invoiceCount        : {$size: "$payment"},
                    revenueSold         : {
                        $divide: ['$invoice.paymentInfo.total', '$invoice.currency.rate']
                    },
                    revenuePaidArray    : {
                        $filter: {
                            input: "$payment",
                            as   : 'revenuePaidArray',
                            cond : {

                                $and: [{$ne: ['$$revenuePaidArray.invoice', null]}, {$ne: ['$$revenuePaidArray._type', 'expensesInvoicePayment']}]

                            }
                        }
                    },
                    revenuePrepaidArray : {
                        $filter: {
                            input: "$payment",
                            as   : 'revenuePrepaidArray',
                            cond : {

                                $and: [{$ne: ['$$revenuePrepaidArray.order', null]}, {$ne: ['$$revenuePrepaidArray._type', 'expensesInvoicePayment']}]

                            }
                        }
                    },
                    revenueExpensesArray: {
                        $filter: {
                            input: "$payment",
                            as   : 'revenueExpensesArray',
                            cond : {

                                $ne: ['revenueExpensesArray._type', null]

                            }
                        }
                    }
                }
            },
                {
                    $group: {
                        _id            : '$_id',
                        name           : {$first: '$name'},
                        imageSrc       : {$first: '$imageSrc'},
                        email          : {$first: '$email'},
                        address        : {$first: '$address'},
                        shippingAddress: {$first: '$shippingAddress'},
                        website        : {$first: '$website'},
                        phones         : {$first: '$phones'},
                        salesPurchases : {$first: '$salesPurchases'},
                        social         : {$first: '$social'},
                        ordersCount    : {$first: "$ordersCount"},
                        invoiceCount   : {$first: "$invoiceCount"},
                        revenueSold    : {$sum: '$revenueSold'},
                        revenuePaid    : {$first: '$revenuePaidArray'},
                        revenuePrepaid : {$first: '$revenuePrepaidArray'},
                        revenueExpenses: {$first: '$revenueExpensesArray'}
                    }
                },
                {
                    $unwind: {
                        path                      : '$revenuePaid',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        name           : 1,
                        imageSrc       : 1,
                        email          : 1,
                        address        : 1,
                        shippingAddress: 1,
                        website        : 1,
                        phones         : 1,
                        salesPurchases : 1,
                        social         : 1,
                        ordersCount    : 1,
                        invoiceCount   : 1,
                        revenueSold    : 1,
                        revenuePaid    : {
                            $divide: ['$revenuePaid.paidAmount', '$revenuePaid.currency.rate']
                        },
                        revenuePrepaid : 1,
                        revenueExpenses: 1
                    }
                },
                {
                    $group: {
                        _id            : '$_id',
                        name           : {$first: '$name'},
                        imageSrc       : {$first: '$imageSrc'},
                        email          : {$first: '$email'},
                        address        : {$first: '$address'},
                        shippingAddress: {$first: '$shippingAddress'},
                        website        : {$first: '$website'},
                        phones         : {$first: '$phones'},
                        salesPurchases : {$first: '$salesPurchases'},
                        social         : {$first: '$social'},
                        ordersCount    : {$first: "$ordersCount"},
                        invoiceCount   : {$first: "$invoiceCount"},
                        revenueSold    : {$first: '$revenueSold'},
                        revenuePaid    : {$sum: '$revenuePaid'},
                        revenuePrepaid : {$first: '$revenuePrepaid'},
                        revenueExpenses: {$first: '$revenueExpenses'}
                    }
                },
                {
                    $unwind: {
                        path                      : '$revenuePrepaid',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        name           : 1,
                        imageSrc       : 1,
                        email          : 1,
                        address        : 1,
                        shippingAddress: 1,
                        website        : 1,
                        phones         : 1,
                        salesPurchases : 1,
                        social         : 1,
                        ordersCount    : 1,
                        invoiceCount   : 1,
                        revenueSold    : 1,
                        revenuePaid    : 1,
                        revenuePrepaid : {
                            $divide: ['$revenuePrepaid.paidAmount', '$revenuePrepaid.currency.rate']
                        },
                        revenueExpenses: 1
                    }
                },
                {
                    $group: {
                        _id            : '$_id',
                        name           : {$first: '$name'},
                        imageSrc       : {$first: '$imageSrc'},
                        email          : {$first: '$email'},
                        address        : {$first: '$address'},
                        shippingAddress: {$first: '$shippingAddress'},
                        website        : {$first: '$website'},
                        phones         : {$first: '$phones'},
                        salesPurchases : {$first: '$salesPurchases'},
                        social         : {$first: '$social'},
                        ordersCount    : {$first: "$ordersCount"},
                        invoiceCount   : {$first: "$invoiceCount"},
                        revenueSold    : {$first: '$revenueSold'},
                        revenuePaid    : {$first: '$revenuePaid'},
                        revenuePrepaid : {$sum: '$revenuePrepaid'},
                        revenueExpenses: {$first: '$revenueExpenses'}
                    }
                },
                {
                    $unwind: {
                        path                      : '$revenueExpenses',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        name           : 1,
                        imageSrc       : 1,
                        email          : 1,
                        address        : 1,
                        shippingAddress: 1,
                        website        : 1,
                        phones         : 1,
                        salesPurchases : 1,
                        social         : 1,
                        ordersCount    : 1,
                        invoiceCount   : 1,
                        revenueSold    : 1,
                        revenuePaid    : 1,
                        revenuePrepaid : 1,
                        revenueExpenses: {
                            $divide: ['$revenueExpenses.paidAmount', '$revenueExpenses.currency.rate']
                        }
                    }
                },
                {
                    $group: {
                        _id            : '$_id',
                        name           : {$first: '$name'},
                        imageSrc       : {$first: '$imageSrc'},
                        email          : {$first: '$email'},
                        address        : {$first: '$address'},
                        shippingAddress: {$first: '$shippingAddress'},
                        website        : {$first: '$website'},
                        phones         : {$first: '$phones'},
                        salesPurchases : {$first: '$salesPurchases'},
                        social         : {$first: '$social'},
                        ordersCount    : {$first: "$ordersCount"},
                        invoiceCount   : {$first: "$invoiceCount"},
                        revenueSold    : {$first: '$revenueSold'},
                        revenuePaid    : {$first: '$revenuePaid'},
                        revenuePrepaid : {$first: '$revenuePrepaid'},
                        revenueExpenses: {$sum: '$revenueExpenses'}
                    }
                },
                {
                    $project: {
                        _id            : 0,
                        name           : 1,
                        imageSrc       : 1,
                        email          : 1,
                        address        : 1,
                        country        : '$address.country',
                        shippingAddress: 1,
                        website        : 1,
                        phone          : '$phones.phone',
                        mobile         : '$phones.mobile',
                        fax            : '$phones.fax',
                        salesTeam      : '$salesPurchases.salesTeam',
                        FB             : '$social.FB',
                        LI             : '$social.LI',
                        ordersCount    : 1,
                        invoiceCount   : 1,
                        revenueSold    : 1,
                        revenuePaid    : 1,
                        revenuePrepaid : 1,
                        revenueExpenses: 1
                    }
                }
            ];

            if (type) {
                aggregate.unshift(type);
            }

            if (sort) {
                aggregate.push(sort);
            }

            query = CustomerModel.aggregate(aggregate);

            if (typeof callback !== 'function') {
                return query;
            }

            query.exec(function (err, person) {
                if (err) {
                    return callback(err);
                }

                callback(null, person);
            });
        }
    };
};
