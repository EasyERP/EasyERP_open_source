var mongoose = require('mongoose');
var Module = function (models) {
    'use strict';

    var type = 'Employees';

    var validationsRequired = {
        Persons: [
            'name.first',
            'name.last',
            'externalId'
        ],

        Companies: [
            'name.first',
            'externalId'
        ],

        Leads: [
            'name',
            'externalId'
        ],

        Opportunities: [
            'name',
            'externalId'
        ],

        Employees: [
            'jobType',
            'jobPosition',
            'department',
            'name.first',
            'name.last',
            'externalId'
        ],

        Invoice: [
            'externalId',
            'supplier',
            'products',
            'sourceDocument'
        ],

        Quotation: [
            'externalId',
            'supplier'
        ],

        PurchasePayments: [
            'externalId',
            'invoice',
            'supplier'
        ],

        InvoicePayments: [
            'externalId',
            'invoice',
            'supplier'
        ],

        Department: [
            'externalId'
        ],

        Products: [
            'name',
            'externalId'
        ],

        JobPosition: [
            'name',
            'department',
            'externalId'
        ],

        ProductCategory: [
            'name',
            'externalId'
        ],

        Workflow: [
            'wId',
            'name',
            'status',
            'sequence'
        ]
    };

    var validationsArray = {
        Persons: [
            'history',
            'attachments',
            'notes',
            'contacts',
            'groups.group',
            'groups.users'
        ],

        Companies: [
            'history',
            'attachments',
            'notes',
            'contacts',
            'groups.group',
            'groups.users'
        ],

        Leads: [
            'attachments',
            'notes',
            'groups.group',
            'groups.users'
        ],

        Opportunities: [
            'attachments',
            'notes',
            'groups.group',
            'groups.users'
        ],

        Employees: [
            'fire',
            'hire',
            'attachments',
            'groups.group',
            'groups.users',
            'tags'
        ],

        Invoice: [
            'products',
            'payments',
            'groups.group',
            'groups.users',
            'attachments'
        ],

        Quotation: [
            'groups.group',
            'groups.users',
            'products'
        ]
    };

    var ImportSchema = mongoose.Schemas.Imports;
    var UserSchema = mongoose.Schemas.User;
    var ImportHistorySchema = mongoose.Schemas.ImportHistories;
    var DepartmentSchema = mongoose.Schemas.Department;

    var schemaObj = {
        Persons         : mongoose.Schemas.Customer,
        Companies       : mongoose.Schemas.Customer,
        Opportunities   : mongoose.Schemas.Opportunitie,
        Leads           : mongoose.Schemas.Opportunitie,
        Employees       : mongoose.Schemas.Employee,
        Invoice         : mongoose.Schemas.Invoice,
        Quotation       : mongoose.Schemas.Quotation,
        PurchasePayments: mongoose.Schemas.purchasePayments,
        InvoicePayments : mongoose.Schemas.InvoicePayment,
        Department      : mongoose.Schemas.Department,
        Products        : mongoose.Schemas.Products,
        JobPosition     : mongoose.Schemas.JobPosition,
        ProductCategory : mongoose.Schemas.ProductCategory,
        Workflow        : mongoose.Schemas.workflow,
        Currency        : mongoose.Schemas.Currency
    };

    var exportMap = require('../helpers/csvMap');
    var exporter = require('../helpers/exporter/exportDecorator');
    var async = require('async');
    var mapObject = require('../public/js/constants/importMapping');
    var moment = require('../public/js/libs/moment/moment');
    var path = require('path');
    var _ = require('lodash');
    var arrayKeys = {
        'groups.users': true,
        'groups.group': true
    };
    var importedFileName;
    var importedFilePath;

    function toOneCase(item) {
        item = item ? item.toString().toLowerCase() : null;
        item = item ? item.toString().replace(/[-+=_() !@#$%^&*`{}\[\]:;.,|\\]/g, '') : null;

        return item;
    }

    function comparing(item1, item2) {
        var changedItem1 = toOneCase(item1);
        var changedItem2 = toOneCase(item2);

        if (!changedItem1 || !changedItem2) {
            return false;
        }

        if (changedItem1.indexOf(changedItem2) >= 0 || changedItem2.indexOf(changedItem1) >= 0 || changedItem1 === changedItem2) {
            return true;
        }

        return false;
    }

    function splitArray(field) {

        if (typeof (field) !== 'object' && typeof (field) !== 'number') {
            if (field && (field.match(/[[\]]/g)) && (field.match(/[[\]]/g).length === 2)) {
                field = field.slice(1, -1);
            }

            field = field.replace(/ *, */g, ',').split(',');
        }

        return field;
    }

    function splitFields(firstArr, secondArr) {
        var result = {};
        var isChanged;

        for (var i = 0; i < secondArr.length; i++) {
            isChanged = false;

            for (var j = 0; j < firstArr.length; j++) {

                if (firstArr[j] && (comparing(secondArr[i], firstArr[j]))) {
                    result[secondArr[i]] = firstArr[j];
                    firstArr[j] = null;

                    isChanged = !isChanged;
                    break;
                }
            }

            if (!isChanged) {
                result[secondArr[i]] = '';
            }
        }

        return {
            result  : result,
            unMapped: firstArr
        };
    }

    function createXlsxReport(res, next, resultArray, fileName) {
        var exportMapImport = mapObject[fileName];
        var options;

        options = {
            res         : res,
            next        : next,
            resultArray : resultArray,
            map         : exportMapImport,
            returnResult: true,
            fileName    : fileName || 'Customers'
        };

        return exporter.reportToXlsx(options);
    }

    function mapImportFileds(importObj, fieldsArray) {
        var mappedFields = {};

        for (var i in importObj) {
            if ((importObj[i] !== '') && fieldsArray) {
                mappedFields[importObj[i]] = fieldsArray.indexOf(i);
            }
        }

        return mappedFields;
    }

    function prepareSaveObject(mappedFields, saveItemArray, type) {
        var saveObj = {};
        var val;
        var arr;

        for (var i in mappedFields) {

            val = saveItemArray[mappedFields[i]];

            if (!val) {
                continue;
            }

            if (validationsArray[type] && validationsArray[type].length && (validationsArray[type].indexOf(i) >= 0)) {
                val = splitArray(val);
            }

            arr = [];

            if (val && arrayKeys && arrayKeys[mappedFields[i]] === true) {
                if (typeof +val === 'number') {
                    arr.push(val);
                    val = arr;
                } else {
                    val = val.split(',');
                }
            }

            if (val) {
                if (!isNaN(+val)) {
                    saveObj[i] = +val;
                } else if (val === 'false') {
                    saveObj[i] = false;
                } else if (val === 'true') {
                    saveObj[i] = true;
                } else {
                    saveObj[i] = val;
                }
            }

        }

        return saveObj;
    }

    function writeHistory(options, ImportHistoryModel, callback) {
        var importHistoryObj = {
            dateHistory   : options.dateHistory,
            fileName      : options.fileName,
            filePath      : options.filePath,
            user          : options.userId,
            type          : options.type,
            reportFile    : options.reportFile,
            reportFileName: options.reportFileName
        };

        var importHistory = new ImportHistoryModel(importHistoryObj);

        importHistory.save(function (err) {
            if (err) {
                return callback(err);
            }

            callback(null);
        });
    }

    function flattToNested(data) {
        var regex;
        var resultholder;
        var cur;
        var prop;
        var m;

        if (Object(data) !== data || Array.isArray(data)) {
            return data;
        }

        regex = /\.?([^.\[\]]+)|\[(\d+)\]/g;
        resultholder = {};

        for (var p in data) {
            cur = resultholder;
            prop = '';

            while (m = regex.exec(p)) {
                cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
                prop = m[2] || m[1];
            }
            cur[prop] = data[p];
        }

        return resultholder[''] || resultholder;
    }

    function nestedToFlat(into, target, currentKey) {
        var newKey;
        var newVal;

        if (!currentKey) {
            currentKey = '';
        }

        for (var i in into) {
            if (into.hasOwnProperty(i)) {

                if (!(into[i] instanceof Array)) {
                    newKey = i;
                    newVal = into[i];

                    if (currentKey.length > 0) {
                        newKey = currentKey + '.' + i;
                    }

                    if (typeof newVal === 'object') {
                        nestedToFlat(newVal, target, newKey);
                    } else {
                        target[newKey] = newVal;
                    }
                }
                else {
                    target[i] = into[i];
                }
            }
        }
    }

    function flatten(obj) {
        var newObj = {};
        nestedToFlat(obj, newObj);
        return newObj;
    }

    function deepMap(obj, mapper) {
        return mapper(_.mapValues(obj, function (v) {
            return _.isPlainObject(v) ? deepMap(v, mapper) : v;
        }));
    }

    function deepResult(inbound, compoundKey) {
        var arrayKeys = (compoundKey.trim()).split('.');
        var copyObj = inbound;

        for (var i = 0; i <= arrayKeys.length - 1; i++) {
            copyObj = copyObj[arrayKeys[i]];
        }

        return copyObj;
    }

    function setDefaultFields(entity, saveObj) {

        switch (entity) {
            case 'Persons':
                saveObj.type = 'Person';
                break;
            case 'Companies':
                saveObj.type = 'Company';
                break;
            case 'Quotation':
                saveObj.isOrder = false;
                saveObj.forSales = false;
                break;
            case 'Orders':
                saveObj.isOrder = true;
                saveObj.forSales = false;
                break;
            case 'Leads':
                saveObj.isOpportunitie = false;
                break;
            case 'Opportunities':
                saveObj.isOpportunitie = true;
                break;
            case 'PurchasePayments':
                saveObj.forSale = false;
                break;
            case 'InvoicePayments':
                saveObj.forSale = true;
                break;
            case 'Invoice':
                saveObj.forSales = false;
                break;
        }

        return saveObj;
    }

    function getCriteria(entity) {
        var criteria = {};

        switch (entity) {
            case 'Persons':
                criteria.type = 'Person';
                break;
            case 'Companies':
                criteria.type = 'Company';
                break;
            case 'Leads':
                criteria.isOpportunitie = false;
                break;
            case 'Opportunities':
                criteria.isOpportunitie = true;
                break;
            case 'PurchasePayments':
                criteria.forSale = false;
                break;
            case 'InvoicePayments':
                criteria.forSale = true;
                break;
            case 'Quotation':
                criteria.isOrder = false;
                criteria.forSales = false;
                break;
            case 'Orders':
                criteria.isOrder = true;
                criteria.forSales = false;
                break;
            case 'Invoice':
                criteria.forSales = false;
                break;
        }

        return criteria;
    }

    function compearingForMerge(savedItems, importedItems, compareFiled, callback) {
        var date = new Date();
        var itemsToSave = [];
        var conflictSavedItems = [];
        var conflictItemsIndex = [];
        var savedItemsByCriterion;
        var flattenObj = {};
        var criterion = {};
        var conflictedSavedValues = [];
        var savedItemValues;

        if (!compareFiled) {
            return callback(null, importedItems, []);
        }

        for (var i = 0; i <= importedItems.length - 1; i++) {
            for (var j = i + 1; j <= importedItems.length - 1; j++) {

                if (importedItems[i][compareFiled] && importedItems[j][compareFiled] && importedItems[i][compareFiled].trim() === importedItems[j][compareFiled].trim()) {
                    conflictItemsIndex.push(i);
                    conflictItemsIndex.push(j);
                }
            }
        }

        if (savedItems && savedItems.length) {
            savedItemValues = _.pluck(savedItems, compareFiled);

            for (var i = importedItems.length; i--;) {
                if (!importedItems[i][compareFiled] || savedItemValues.indexOf(importedItems[i][compareFiled]) === -1) {
                    continue;
                }

                if (compareFiled.indexOf('.') >= 0) {
                    flattenObj[compareFiled] = importedItems[i][compareFiled];
                    criterion = flattToNested(flattenObj);
                } else {
                    criterion[compareFiled] = importedItems[i][compareFiled];
                }

                savedItemsByCriterion = _.filter(savedItems, criterion);
                conflictSavedItems = conflictSavedItems.concat(_.pluck(savedItemsByCriterion, '_id'));
                conflictItemsIndex.push(i);
                conflictedSavedValues.push(importedItems[i][compareFiled]);
            }
        }

        for (var i = importedItems.length; i--;) {
            if (conflictItemsIndex.indexOf(i) === -1) {
                itemsToSave.push(importedItems[i]);
            }
        }

        callback(null, itemsToSave, conflictSavedItems);
    }

    function createCustomer(lastDb, item, type, stage, callback) {
        var companyExtId = item.company;
        var departmentExtId = item.department;
        var salesPersonExtId = item['salesPurchases.salesPerson'];
        var salesTeamExtId = item['salesPurchases.salesTeam'];
        var DepartmentModel = models.get(lastDb, 'Department', schemaObj.Department);
        var EmployeesModel = models.get(lastDb, 'Employees', schemaObj.Employees);
        var CustomerModel = models.get(lastDb, 'Customer', schemaObj[type]);
        var departmentCriteria = [];
        var skippedArray = [];
        var skippedIdsArray = [];
        var idsForRemove = [];
        var importedCount = 0;
        var customer;
        var reasons = {};

        async.parallel({
            getDepartment: function (parCb) {
                if (!departmentExtId && !salesTeamExtId) {
                    return parCb(null);
                }

                if (departmentExtId) {
                    departmentCriteria.push(departmentExtId.toString());
                }

                if (salesTeamExtId) {
                    departmentCriteria.push(salesTeamExtId.toString());
                }

                DepartmentModel.find({externalId: {$in: departmentCriteria}}, {_id: 1, externalId: 1})
                    .lean()
                    .exec(function (err, result) {
                        var departmentId;
                        var salesTeamId;

                        if (err) {
                            return parCb(err);
                        }

                        if (result.length) {
                            if (departmentExtId) {
                                departmentExtId = departmentExtId.toString();
                                departmentId = _.find(result, {externalId: departmentExtId});
                            }

                            if (salesTeamExtId) {
                                salesTeamExtId = salesTeamExtId.toString();
                                salesTeamId = _.find(result, {externalId: salesTeamExtId});
                            }
                        }

                        parCb(null, {
                            departmentId: departmentId,
                            salesTeamId : salesTeamId
                        });
                    });
            },

            getEmployee: function (parCb) {
                EmployeesModel.findOne({externalId: salesPersonExtId}, {_id: 1})
                    .exec(function (err, employeeModel) {
                        if (err) {
                            return parCb(err);
                        }

                        parCb(null, employeeModel);
                    });
            },

            getCompany: function (parCb) {

                if (type === 'Companies') {
                    return parCb(null, {});
                }

                CustomerModel.findOne({externalId: companyExtId, type: 'Company'}, {_id: 1})
                    .exec(function (err, companyModel) {
                        if (err) {
                            return parCb(err);
                        }

                        parCb(null, companyModel);
                    });
            }
        }, function (err, result) {
            var resultDep = result.getDepartment;

            if (err) {
                return callback(err);
            }

            if (resultDep) {
                if (resultDep.departmentId) {
                    item.department = resultDep.departmentId._id;
                } else {
                    item.department = null;
                }

                if (resultDep.salesTeamId) {
                    item['salesPurchases.salesTeam'] = resultDep.salesTeamId._id;
                } else {
                    item['salesPurchases.salesTeam'] = null;
                }
            }

            if (result.getEmployee) {
                item['salesPurchases.salesPerson'] = result.getEmployee._id;
            } else {
                item['salesPurchases.salesPerson'] = null;
            }

            if (type !== 'Companies' && result.getCompany) {
                item.company = result.getCompany._id;
            } else {
                item.company = null;
            }

            if (stage === 'import') {
                customer = new CustomerModel(item);
                customer.save(function (err) {
                    if (err) {
                        reasons[item.importId.toString()] = err.message;
                        skippedIdsArray.push(item.importId.toString());
                    } else {
                        importedCount = 1;
                        idsForRemove.push(item.importId);
                    }

                    return callback(null, {
                        skippedIdsArray: skippedIdsArray,
                        idsForRemove   : idsForRemove,
                        importedCount  : importedCount,
                        reasons        : reasons
                    });

                });
            } else {
                customer = new CustomerModel(item);
                customer.save(function (err) {
                    if (err) {
                        item.reason = err.message;
                        skippedArray.push(item);
                    } else {
                        importedCount = 1;
                    }

                    return callback(null, {
                        skippedArray : skippedArray,
                        importedCount: importedCount
                    });
                });
            }
        });
    }

    function createTransfer(infoObj, Model, options, callback) {
        var transferModel;
        var transferObj = {
            employee            : options.employeeId,
            payrollStructureType: '5784d6df2b247ee4133d739a',  //TODO hardcode ID
            sheduledPay         : '5784d6cf2b247ee4133d7399',    //TODO hardcode ID
            salary              : options.salary || 0,
            jobType             : options.jobTypeName,
            jobPosition         : options.jobPositionId,
            department          : options.departmentId,
            status              : 'updated',
            manager             : options.departmentManagerId
        };

        transferModel = new Model(transferObj);

        transferModel.save(function (err) {
            if (err) {
                return callback(err);
            }

            return callback(null, infoObj);
        });
    }

    function createEmployee(lastDb, item, stage, callback) {
        var departmentId = item.department;
        var coachId = item.coach;
        var managerId = item.manager;
        var jobTypeName = item.jobType;
        var salary = item.salary;
        var jobPositionExId = item.jobPosition;
        var DepartmentModel = models.get(lastDb, 'Department', schemaObj.Department);
        var EmployeesModel = models.get(lastDb, 'Employees', schemaObj.Employees);
        var JobPositionModel = models.get(lastDb, 'JobPosition', schemaObj.JobPosition);
        var TransferModel = models.get(lastDb, 'transfer', schemaObj.Transfer);
        var skippedIdsArray = [];
        var skippedArray = [];
        var idsForRemove = [];
        var importedCount = 0;
        var infoObj = {};
        var departmentManagerId;
        var employeeModel;
        var employeeId;
        var jobPositionId;
        var reasons = {};

        async.parallel({
            getManager    : function (pCb) {
                EmployeesModel.findOne({externalId: managerId}, {_id: 1}, function (err, managerModel) {
                    pCb(null, managerModel);
                });
            },
            getCoach      : function (pCb) {
                EmployeesModel.findOne({externalId: coachId}, {_id: 1}, function (err, coachModel) {
                    pCb(null, coachModel);
                });
            },
            getJobPosition: function (pCb) {
                JobPositionModel.findOne({externalId: jobPositionExId}, {
                    _id       : 1,
                    department: 1
                }, function (err, jobPositionModel) {
                    if (err) {
                        return pCb(err);
                    }

                    if (!jobPositionModel) {
                        err = new Error('jobPosition doesn`t exist');
                        err.status = 404;

                        return pCb(err);
                    }

                    DepartmentModel.findById(jobPositionModel.department, {departmentManager: 1}, function (err, departmentModel) {

                        if (departmentModel) {
                            departmentManagerId = departmentModel.departmentManager;
                        }

                        pCb(null, {
                            jobPositionModel: jobPositionModel,
                            departmentId    : departmentId
                        });
                    });
                });
            }
        }, function (err, result) {
            var jobPositionModel = result.getJobPosition && result.getJobPosition.jobPositionModel;
            var departmentId = result.getJobPosition && result.getJobPosition.departmentId;
            var coachModel = result.getCoach;
            var managerModel = result.getManager;
            var coachId;

            if (coachModel) {
                coachId = coachModel._id;
                item.coach = coachId;
            } else {
                item.coach = null;
            }

            if (managerModel) {
                managerId = managerModel._id;
                item.manager = managerId;
            } else {
                item.manager = null;
            }

            if (stage === 'import') {
                if (err || !departmentId || !jobPositionModel) {
                    reasons[item.importId.toString()] = 'Provided field doesn`t exist';
                    skippedIdsArray.push(item.importId.toString());

                    infoObj = {
                        skippedIdsArray: skippedIdsArray,
                        idsForRemove   : idsForRemove,
                        importedCount  : importedCount,
                        reasons        : reasons
                    };

                    return callback(null, infoObj);

                }

                item.department = departmentId;
                item.jobPosition = jobPositionModel && jobPositionModel._id;
                item.weeklySheduler = '57332c3b94ee1140b6bb49e2';

                employeeModel = new EmployeesModel(item);
                employeeModel.save(function (err) {
                    if (err) {
                        reasons[item.importId.toString()] = err.message;
                        skippedIdsArray.push(item.importId.toString());
                    } else {
                        importedCount = 1;
                        idsForRemove.push(item.importId);
                    }

                    infoObj = {
                        reasons        : reasons,
                        skippedIdsArray: skippedIdsArray,
                        idsForRemove   : idsForRemove,
                        importedCount  : importedCount
                    };


                    createTransfer(infoObj, TransferModel, {
                        employeeId         : employeeModel && employeeModel._id,
                        jobTypeName        : jobTypeName,
                        jobPositionId      : jobPositionId,
                        departmentId       : departmentId,
                        departmentManagerId: departmentManagerId,
                        salary             : salary
                    }, callback);
                });
            } else {
                if (err || !departmentId || !jobPositionModel) {
                    item.reason = 'Provided department doesn`t exist';
                    skippedArray.push(item);

                    infoObj = {
                        skippedArray : skippedArray,
                        importedCount: importedCount
                    };

                    return callback(null, infoObj);
                }

                item.department = departmentId;
                item.jobPosition = jobPositionModel && jobPositionModel._id;
                item.weeklySheduler = '57332c3b94ee1140b6bb49e2';

                employeeModel = new EmployeesModel(item);
                employeeModel.save(function (err) {
                    if (err) {
                        item.reason = err.message;
                        skippedArray.push(item);
                    } else {
                        importedCount = 1;
                    }

                    infoObj = {
                        skippedArray : skippedArray,
                        importedCount: importedCount
                    };

                    createTransfer(infoObj, TransferModel, {
                        employeeId         : employeeModel && employeeModel._id,
                        jobTypeName        : jobTypeName,
                        jobPositionId      : jobPositionId,
                        departmentId       : departmentId,
                        departmentManagerId: departmentManagerId,
                        salary             : salary
                    }, callback);

                });
            }
        });
    }

    function createJobPosition(lastDb, item, type, stage, callback) {
        var departmentId = item.department;
        var JobPositionModel = models.get(lastDb, type, schemaObj[type]);
        var DepartmentModel = models.get(lastDb, 'Department', schemaObj.Department);
        var skippedIdsArray = [];
        var skippedArray = [];
        var idsForRemove = [];
        var importedCount = 0;
        var model;
        var reasons = {};

        DepartmentModel.findOne({externalId: departmentId}, {externalId: 1, _id: 1}, function (err, result) {
            if (err) {
                return callback(err);
            }

            if (result) {
                item.department = result._id;
            }

            if (stage === 'import') {
                model = new JobPositionModel(item);
                model.save(function (err) {
                    if (err) {
                        reasons[item.importId.toString()] = err.message;
                        skippedIdsArray.push(item.importId.toString());
                    } else {
                        importedCount = 1;
                        idsForRemove.push(item.importId);
                    }

                    return callback(null, {
                        reasons        : reasons,
                        skippedIdsArray: skippedIdsArray,
                        idsForRemove   : idsForRemove,
                        importedCount  : importedCount
                    });

                });
            } else {
                model = new JobPositionModel(item);
                model.save(function (err) {
                    if (err) {
                        item.reason = err.message;
                        skippedArray.push(item);
                    } else {
                        importedCount = 1;
                    }

                    return callback(null, {
                        skippedArray : skippedArray,
                        importedCount: importedCount
                    });

                });
            }
        });
    }

    function createProduct(lastDb, item, type, stage, callback) {
        var pCategoryId = item['accounting.category._id'];
        var ProductModel = models.get(lastDb, type, schemaObj[type]);
        var ProductCategoryModel = models.get(lastDb, 'ProductCategory', schemaObj.ProductCategory);
        var skippedIdsArray = [];
        var skippedArray = [];
        var idsForRemove = [];
        var importedCount = 0;
        var model;
        var reasons = {};

        ProductCategoryModel.findOne({externalId: pCategoryId}, {externalId: 1, _id: 1}, function (err, result) {
            if (err) {
                return callback(err);
            }

            if (result) {
                item['accounting.category._id'] = result._id;
            } else {
                item['accounting.category._id'] = null;
            }

            if (stage === 'import') {
                model = new ProductModel(item);
                model.save(function (err) {
                    if (err) {
                        reasons[item.importId.toString()] = err.message;
                        skippedIdsArray.push(item.importId.toString());
                    } else {
                        importedCount = 1;
                        idsForRemove.push(item.importId);
                    }

                    return callback(null, {
                        reasons        : reasons,
                        skippedIdsArray: skippedIdsArray,
                        idsForRemove   : idsForRemove,
                        importedCount  : importedCount
                    });

                });
            } else {
                model = new ProductModel(item);
                model.save(function (err) {
                    if (err) {
                        item.reason = err.message;
                        skippedArray.push(item);
                    } else {
                        importedCount = 1;
                    }

                    return callback(null, {
                        skippedArray : skippedArray,
                        importedCount: importedCount
                    });

                });
            }
        });
    }

    function createProductCategory(lastDb, item, type, stage, callback) {
        var parentId = item.parent;
        var ProductCategoryModel = models.get(lastDb, type, schemaObj[type]);
        var skippedIdsArray = [];
        var skippedArray = [];
        var idsForRemove = [];
        var importedCount = 0;
        var model;
        var reasons = {};

        ProductCategoryModel.findOne({externalId: parentId}, {externalId: 1, _id: 1}, function (err, result) {
            if (err) {
                return callback(err);
            }

            if (result) {
                item.parent = result._id;
            } else {
                item.parent = null;
            }

            if (stage === 'import') {
                model = new ProductCategoryModel(item);
                model.save(function (err) {
                    if (err) {
                        reasons[item.importId.toString()] = err.message;
                        skippedIdsArray.push(item.importId.toString());
                    } else {
                        importedCount = 1;
                        idsForRemove.push(item.importId);
                    }

                    return callback(null, {
                        reasons        : reasons,
                        skippedIdsArray: skippedIdsArray,
                        idsForRemove   : idsForRemove,
                        importedCount  : importedCount
                    });

                });
            } else {
                model = new ProductCategoryModel(item);
                model.save(function (err) {
                    if (err) {
                        item.reason = err.message;
                        skippedArray.push(item);
                    } else {
                        importedCount = 1;
                    }

                    return callback(null, {
                        skippedArray : skippedArray,
                        importedCount: importedCount
                    });

                });
            }
        });
    }

    function createOpportunitiesOrLeads(lastDb, item, type, stage, callback) {
        var customerId = item.customer;
        var companyId = item.company;
        var workflowName = item.workflow;
        var CustomerModel = models.get(lastDb, 'Customers', schemaObj.Persons);
        var OpportunityModel = models.get(lastDb, type, schemaObj[type]);
        var WorkflowModel = models.get(lastDb, 'workflow', schemaObj.Workflow);
        var skippedIdsArray = [];
        var skippedArray = [];
        var idsForRemove = [];
        var importedCount = 0;
        var customer;
        var company;
        var model;
        var reasons = {};

        if (!customerId && !companyId && !workflowName) {

            item.workflow = null;

            if (stage === 'import') {
                model = new OpportunityModel(item);
                model.save(function (err) {
                    if (err) {
                        reasons[item.importId.toString()] = err.message;
                        skippedIdsArray.push(item.importId.toString());
                    } else {
                        importedCount = 1;
                        idsForRemove.push(item.importId);
                    }

                    return callback(null, {
                        reasons        : reasons,
                        skippedIdsArray: skippedIdsArray,
                        idsForRemove   : idsForRemove,
                        importedCount  : importedCount
                    });

                });
            } else {
                model = new OpportunityModel(item);
                model.save(function (err) {
                    if (err) {
                        item.reason = err.message;
                        skippedArray.push(item);
                    } else {
                        importedCount = 1;
                    }

                    return callback(null, {
                        skippedArray : skippedArray,
                        importedCount: importedCount
                    });

                });
            }
        } else {
            async.parallel({
                workflow : function (pCb) {
                    if (!workflowName) {
                        return pCb(null);
                    }

                    WorkflowModel.findOne({name: workflowName}, {externalId: 1, _id: 1})
                        .exec(function (err, workflow) {
                            if (err) {
                                return pCb(err);
                            }

                            pCb(null, workflow);
                        });
                },
                customers: function (pCb) {
                    if (!customerId && !companyId) {
                        return pCb(null);
                    }

                    CustomerModel.find({externalId: {$in: [customerId, companyId]}}, {externalId: 1, _id: 1})
                        .lean()
                        .exec(function (err, customer) {
                            if (err) {
                                return pCb(err);
                            }

                            pCb(null, customer);
                        });
                }
            }, function (err, result) {
                var customers = result.customers;
                var workflow = result.workflow;

                if (customers && customers.length) {
                    if (customerId) {
                        customerId = customerId.toString();
                        customer = _.find(customers, {externalId: customerId});
                        item.customer = customer && customer._id;
                    }

                    if (companyId) {
                        companyId = companyId.toString();
                        company = _.find(customers, {externalId: companyId});
                        item.company = company && company._id;
                    }
                }

                if (workflow) {
                    item.workflow = workflow && workflow._id;
                } else {
                    item.workflow = null;
                }

                if (stage === 'import') {
                    model = new OpportunityModel(item);
                    model.save(function (err) {
                        if (err) {
                            reasons[item.importId.toString()] = err.message;
                            skippedIdsArray.push(item.importId.toString());
                        } else {
                            importedCount = 1;
                            idsForRemove.push(item.importId);
                        }

                        return callback(null, {
                            reasons        : reasons,
                            skippedIdsArray: skippedIdsArray,
                            idsForRemove   : idsForRemove,
                            importedCount  : importedCount
                        });

                    });
                } else {
                    model = new OpportunityModel(item);
                    model.save(function (err) {
                        if (err) {
                            item.reason = err.message;
                            skippedArray.push(item);
                        } else {
                            importedCount = 1;
                        }

                        return callback(null, {
                            skippedArray : skippedArray,
                            importedCount: importedCount
                        });

                    });
                }
            });
        }
    }

    function createInvoice(lastDb, item, stage, callback) {
        var currencyName = item['currency._id'];
        var customerId = item.supplier;
        var quotationId = item.sourceDocument;
        var productsId = item.products;
        var workflowName = item.workflow;
        var CustomerModel = models.get(lastDb, 'Customers', schemaObj.Persons);
        var QuotationModel = models.get(lastDb, 'Quotation', schemaObj.Quotation);
        var InvoiceModel = models.get(lastDb, 'Invoice', schemaObj.Invoice);
        var ProductsModel = models.get(lastDb, 'Products', schemaObj.Products);
        var WorkflowModel = models.get(lastDb, 'workflow', schemaObj.Workflow);
        var CurrencyModel = models.get(lastDb, 'currency', schemaObj.Currency);
        var skippedIdsArray = [];
        var skippedArray = [];
        var idsForRemove = [];
        var importedCount = 0;
        var invoiceModel;
        var reasons = {};
        var workflowId;

        async.parallel({
            getWorkflow: function (pCb) {
                WorkflowModel.findOne({name: workflowName}, {externalId: 1, _id: 1})
                    .exec(function (err, workflowModel) {
                        if (err) {
                            return pCb(err);
                        }

                        pCb(null, workflowModel);
                    });
            },

            getCurrency: function (pCb) {
                CurrencyModel.find({name: currencyName}, {_id: 1}, function (err, currencyModel) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, currencyModel);
                });
            },

            getQuotation: function (pCb) {
                QuotationModel.findOne({externalId: quotationId}, {_id: 1}, function (err, quotationModel) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, quotationModel);
                });
            },

            getCustomer: function (pCb) {
                CustomerModel.findOne({externalId: customerId}, {_id: 1}, function (err, customerModel) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, customerModel);
                });
            },

            getProducts: function (pCb) {
                ProductsModel.findOne({externalId: productsId}, {_id: 1}, function (err, productsModel) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, productsModel);
                });
            }
        }, function (err, result) {
            var workflowModel = result.getWorkflow;
            var customerModel = result.getCustomer;
            var quotationModel = result.getQuotation;
            var productsModel = result.getProducts;
            var currencyModel = result.getCurrency;

            if (stage === 'import') {
                if (err || !customerModel || !quotationModel || !productsModel) {
                    reasons[item.importId.toString()] = 'Provided field doesn`t exist';
                    skippedIdsArray.push(item.importId.toString());

                    return callback(null, {
                        reasons        : reasons,
                        skippedIdsArray: skippedIdsArray,
                        idsForRemove   : idsForRemove,
                        importedCount  : importedCount
                    });
                }

                if (workflowModel) {
                    item.workflow = workflowModel._id;
                } else {
                    item.workflow = null;
                }

                item.supplier = currencyModel && customerModel._id;
                item.sourceDocument = quotationModel && quotationModel._id;
                item.products = [{
                    product: productsModel && productsModel._id
                }];

                //TODO hardcode journal ID
                item.journal = '57907bc6b4b1bb7e016dd684';

                invoiceModel = new InvoiceModel(item);

                invoiceModel.save(function (err) {
                    if (err) {
                        reasons[item.importId.toString()] = err.message;
                        skippedIdsArray.push(item.importId.toString());
                    } else {
                        importedCount++;
                        idsForRemove.push(item.importId);
                    }

                    callback(null, {
                        reasons        : reasons,
                        skippedIdsArray: skippedIdsArray,
                        idsForRemove   : idsForRemove,
                        importedCount  : importedCount
                    });
                });
            } else {
                if (err || !customerModel || !quotationModel || !productsModel) {
                    item.reason = 'Provided Customer or Quotation doesn`t exist';
                    skippedArray.push(item);
                    return callback(null, {
                        skippedArray : skippedArray,
                        importedCount: importedCount
                    });
                }

                if (workflowModel) {
                    item.workflow = workflowModel._id;
                } else {
                    item.workflow = null;
                }


                item.products = [{
                    product: productsModel && productsModel._id
                }];

                item.supplier = customerModel && customerModel._id;
                item.sourceDocument = quotationModel && quotationModel._id;

                invoiceModel = new InvoiceModel(item);

                invoiceModel.save(function (err) {
                    if (err) {
                        item.reason = 'Provided Customer or Quotation doesn`t exist';
                        skippedIdsArray.push(item.importId.toString());
                    } else {
                        importedCount++;
                        idsForRemove.push(item.importId);
                    }

                    callback(null, {
                        skippedIdsArray: skippedIdsArray,
                        idsForRemove   : idsForRemove,
                        importedCount  : importedCount
                    });
                });

            }
        });
    }

    function createQuotation(lastDb, item, stage, callback) {
        var customerId = item.supplier;
        var productsId = item.products;
        var workflowName = item.workflow;
        var currencyName = item['currency._id'];
        var CurrencyModel = models.get(lastDb, 'currency', schemaObj.Currency);
        var CustomerModel = models.get(lastDb, 'Customers', schemaObj.Persons);
        var QuotationModel = models.get(lastDb, 'Quotation', schemaObj.Quotation);
        var ProductsModel = models.get(lastDb, 'Products', schemaObj.Products);
        var WorkflowModel = models.get(lastDb, 'workflow', schemaObj.Workflow);
        var skippedIdsArray = [];
        var skippedArray = [];
        var idsForRemove = [];
        var importedCount = 0;
        var quotationModel;
        var reasons = {};

        async.parallel({
            getCurrency: function (pCb) {
                CurrencyModel.findOne({name: currencyName}, {externalId: 1, _id: 1})
                    .exec(function (err, currencyModel) {
                        if (err) {
                            return callback(err);
                        }

                        pCb(null, currencyModel);
                    });
            },

            getWorkflow: function (pCb) {
                WorkflowModel.findOne({name: workflowName}, {externalId: 1, _id: 1})
                    .exec(function (err, workflowModel) {
                        if (err) {
                            return callback(err);
                        }

                        pCb(null, workflowModel);
                    });
            },

            getCustomer: function (pCb) {
                CustomerModel.findOne({externalId: customerId}, {_id: 1}, function (err, customerModel) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, customerModel);
                });
            },

            getProducts: function (pCb) {
                ProductsModel.findOne({externalId: productsId}, {_id: 1}, function (err, productsModel) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, productsModel);
                });
            }

        }, function (err, result) {
            var workflowModel = result.getWorkflow;
            var customerModel = result.getCustomer;
            var productsModel = result.getProducts;
            var currencyModel = result.getCurrency;

            if (stage === 'import') {
                if (err || !customerModel || !currencyModel) {
                    reasons[item.importId.toString()] = 'Provided Customers or Products doesn`t exist';
                    skippedIdsArray.push(item.importId.toString());

                    return callback(null, {
                        reasons        : reasons,
                        skippedIdsArray: skippedIdsArray,
                        idsForRemove   : idsForRemove,
                        importedCount  : importedCount
                    });
                }
                if (workflowModel) {
                    item.workflow = workflowModel._id;
                } else {
                    item.workflow = null;
                }

                item['currency._id'] = currencyModel._id;
                item.supplier = customerModel && customerModel._id;
                item.products = [{
                    product: productsModel ? productsModel._id : null
                }];

                quotationModel = new QuotationModel(item);
                quotationModel.save(function (err) {
                    if (err) {
                        reasons[item.importId.toString()] = err.message;
                        skippedIdsArray.push(item.importId.toString());
                    } else {
                        importedCount++;
                        idsForRemove.push(item.importId);
                    }

                    callback(null, {
                        reasons        : reasons,
                        skippedIdsArray: skippedIdsArray,
                        idsForRemove   : idsForRemove,
                        importedCount  : importedCount
                    });
                });
            } else {
                if (err || !customerModel || !productsModel) {
                    item.reason = 'Provided Customer or Product doesn`t exist';
                    skippedArray.push(item);

                    return callback(null, {
                        skippedArray : skippedArray,
                        importedCount: importedCount
                    });
                }

                customerId = customerModel._id;
                productsId = productsModel._id;

                if (workflowModel) {
                    item.workflow = workflowModel._id;
                } else {
                    item.workflow = null;
                }

                item.supplier = customerModel && customerModel._id;
                item.products = [{
                    product: productsModel && productsModel._id
                }];

                quotationModel = new QuotationModel(item);
                quotationModel.save(function (err) {
                    if (err) {
                        item.reason = err.message;
                        skippedArray.push(item);
                    } else {
                        importedCount = 1;
                    }

                    callback(null, {
                        skippedArray : skippedArray,
                        importedCount: importedCount
                    });
                });
            }
        });
    }

    function createPayments(lastDb, item, type, stage, callback) {
        var supplierId = item.supplier;
        var invoiceId = item.invoice;
        var CustomerModel = models.get(lastDb, 'Customers', schemaObj.Persons);
        var InvoiceModel = models.get(lastDb, 'Invoice', schemaObj.Invoice);
        var PaymentModel = models.get(lastDb, type, 'Payment', schemaObj[type]);
        var skippedIdsArray = [];
        var skippedArray = [];
        var idsForRemove = [];
        var importedCount = 0;
        var paymentModel;
        var reasons = {};

        async.parallel({
            customer: function (parCb) {
                CustomerModel.findOne({externalId: supplierId}, {_id: 1})
                    .lean()
                    .exec(function (err, customerModel) {

                        if (err || !customerModel) {
                            return parCb(err);
                        }

                        parCb(null, customerModel);
                    });
            },

            invoice: function (parCb) {
                InvoiceModel.findOne({externalId: invoiceId}, {_id: 1})
                    .lean()
                    .exec(function (err, invoiceModel) {

                        if (err || !invoiceModel) {
                            return parCb(err);
                        }

                        parCb(null, invoiceModel);
                    });
            }
        }, function (err, result) {
            var customerModel = result.customer;
            var invoiceModel = result.invoice;

            if (stage === 'import') {
                if (err || !customerModel || !invoiceModel) {
                    skippedIdsArray.push(item.importId.toString());

                    return callback(null, {
                        skippedIdsArray: skippedIdsArray,
                        idsForRemove   : idsForRemove,
                        importedCount  : importedCount
                    });
                }

                item.supplier = customerModel._id;
                item.invoice = invoiceModel._id;

                //TODO hardcode journal ID
                item.journal = '57907bc6b4b1bb7e016dd684';

                paymentModel = new PaymentModel(item);

                paymentModel.save(function (err) {
                    if (err) {
                        reasons[item.importId.toString()] = err.message;
                        skippedIdsArray.push(item.importId.toString());
                    } else {
                        importedCount++;
                        idsForRemove.push(item.importId);
                    }

                    callback(null, {
                        reasons        : reasons,
                        skippedIdsArray: skippedIdsArray,
                        idsForRemove   : idsForRemove,
                        importedCount  : importedCount
                    });
                });
            } else {
                if (err || !customerModel || !invoiceModel) {
                    item.reason = 'Provided Customer or Invoice don`t exist';
                    skippedArray.push(item);

                    return callback(null, {
                        skippedArray : skippedArray,
                        importedCount: importedCount
                    });
                }

                item.supplier = customerModel._id;
                item.invoice = invoiceModel._id;

                paymentModel = new PaymentModel(item);

                paymentModel.save(function (err) {
                    if (err) {
                        item.reason = err.message;
                        skippedArray.push(item);
                    } else {
                        importedCount = 1;
                    }

                    callback(null, {
                        skippedArray : skippedArray,
                        importedCount: importedCount
                    });
                });
            }
        });
    }

    function updateInvoice(lastDb, existId, updateObj, importItem, callback) {
        var CustomerModel = models.get(lastDb, 'Customers', schemaObj.Persons);
        var QuotationModel = models.get(lastDb, 'Quotation', schemaObj.Quotation);
        var InvoiceModel = models.get(lastDb, 'Invoice', schemaObj.Invoice);
        var ProductsModel = models.get(lastDb, 'Products', schemaObj.Products);
        var WorkflowModel = models.get(lastDb, 'workflow', schemaObj.Workflow);
        var customerExternalId = updateObj.customer;
        var quotationExternalId = updateObj.sourceDocument;
        var productsExternalId = updateObj.products;
        var workflowName = updateObj.workflow;
        var workflow;
        var mergedCount = 0;

        if (!customerExternalId && !quotationExternalId && !productsExternalId && !workflowName) {
            InvoiceModel.update({_id: existId}, {$set: updateObj}, function (err) {
                if (err) {
                    importItem.reason = err.message;

                    return callback(null, {
                        skippedItem: importItem,
                        mergedCount: mergedCount
                    });

                }

                mergedCount++;

                callback(null, {
                    skippedItem: null,
                    mergedCount: mergedCount
                });
            });
        } else {
            async.parallel({
                workflow: function (parCb) {
                    if (!workflowName) {
                        return parCb(null);
                    }

                    WorkflowModel.findOne({name: workflowName}, {_id: 1})
                        .lean()
                        .exec(function (err, workflow) {

                            updateObj.workflow = workflow._id;

                            parCb(null);
                        });
                },

                customer: function (parCb) {
                    if (!customerExternalId) {
                        return parCb(null);
                    }

                    CustomerModel.findOne({externalId: customerExternalId}, {_id: 1})
                        .lean()
                        .exec(function (err, customer) {

                            updateObj.customer = customer._id;

                            parCb(null);
                        });
                },

                sourceDocument: function (parCb) {
                    if (!quotationExternalId) {
                        return parCb(null);
                    }

                    QuotationModel.findOne({externalId: quotationExternalId}, {_id: 1})
                        .lean()
                        .exec(function (err, sourceDocument) {

                            updateObj.sourceDocument = sourceDocument._id;

                            parCb(null);
                        });
                },

                products: function (parCb) {
                    if (!productsExternalId) {
                        return parCb(null);
                    }

                    ProductsModel.findOne({externalId: productsExternalId}, {_id: 1})
                        .lean()
                        .exec(function (err, products) {

                            updateObj.products = products._id;

                            parCb(null);
                        });
                }
            }, function () {

                InvoiceModel.update({_id: existId}, {$set: updateObj}, function (err) {
                    if (err) {
                        importItem.reason = err.message;

                        return callback(null, {
                            skippedObj : importItem,
                            mergedCount: mergedCount
                        });
                    }

                    callback(null, {
                        mergedCount: 1
                    });
                });
            });
        }
    }

    function updateQuotation(lastDb, existId, updateObj, importItem, callback) {
        var CustomerModel = models.get(lastDb, 'Customers', schemaObj.Persons);
        var QuotationModel = models.get(lastDb, 'Quotation', schemaObj.Quotation);
        var ProductsModel = models.get(lastDb, 'Products', schemaObj.Products);
        var WorkflowModel = models.get(lastDb, 'workflow', schemaObj.Workflow);
        var customerExternalId = updateObj.supplier;
        var productsExternalId = updateObj.products;
        var workflowName = updateObj.workflow;
        var mergedCount = 0;
        var workflow;

        if (!workflowName && !productsExternalId && !customerExternalId) {
            QuotationModel.update({_id: existId}, {$set: updateObj}, function (err) {
                if (err) {
                    importItem.reason = err.message;

                    return callback(null, {
                        skippedItem: importItem,
                        mergedCount: mergedCount
                    });

                }

                mergedCount++;

                callback(null, {
                    skippedItem: null,
                    mergedCount: mergedCount
                });
            });
        } else {
            async.parallel({
                workflow: function (parCb) {
                    if (!workflowName) {
                        return parCb(null);
                    }
                    WorkflowModel.findOne({name: workflowName}, {_id: 1})
                        .lean()
                        .exec(function (err, workflow) {
                            updateObj.workflow = workflow._id;

                            parCb(null);
                        });
                },

                supplier: function (parCb) {
                    if (!customerExternalId) {
                        return parCb(null);
                    }
                    CustomerModel.findOne({externalId: customerExternalId}, {_id: 1})
                        .lean()
                        .exec(function (err, supplier) {
                            updateObj.supplier = supplier._id;

                            parCb(null);
                        });
                },

                products: function (parCb) {
                    if (!productsExternalId) {
                        return parCb(null);
                    }
                    ProductsModel.findOne({externalId: productsExternalId}, {_id: 1})
                        .lean()
                        .exec(function (err, products) {
                            updateObj.products = products._id;

                            parCb(null);
                        });
                }
            }, function () {
                QuotationModel.update({_id: existId}, {$set: updateObj}, function (err) {
                    if (err) {
                        importItem.reason = err.message;

                        return callback(null, {
                            skippedObj : importItem,
                            mergedCount: mergedCount
                        });
                    }


                    callback(null, {
                        mergedCount: 1
                    });
                });
            });
        }
    }

    function updatePayments(lastDb, existId, updateObj, importItem, type, callback) {
        var CustomerModel = models.get(lastDb, 'Customers', schemaObj.Persons);
        var InvoiceModel = models.get(lastDb, 'Invoice', schemaObj.Invoice);
        var PaymentModel = models.get(lastDb, type, 'Payment', schemaObj[type]);
        var supplierExternalId = updateObj.supplier;
        var invoiceExternalId = updateObj.invoice;
        var mergedCount = 0;
        var supplier;
        var invoice;

        if (!supplierExternalId && !invoiceExternalId) {
            PaymentModel.update({_id: existId}, {$set: updateObj}, function (err) {
                if (err) {
                    importItem.reason = err.message;

                    return callback(null, {
                        skippedItem: importItem,
                        mergedCount: mergedCount
                    });

                }

                mergedCount++;

                callback(null, {
                    skippedItem: null,
                    mergedCount: mergedCount
                });
            });
        } else {
            async.parallel({
                customer: function (parCb) {
                    if (!supplierExternalId) {
                        return parCb(null);

                    }
                    CustomerModel.findOne({externalId: supplierExternalId}, {_id: 1})
                        .lean()
                        .exec(function (err, customer) {
                            updateObj.customer = customer._id;

                            parCb(null);
                        });
                },

                invoice: function (parCb) {
                    if (!invoiceExternalId) {
                        return parCb(null);

                    }
                    InvoiceModel.findOne({externalId: invoiceExternalId}, {_id: 1})
                        .lean()
                        .exec(function (err, invoice) {
                            updateObj.invoice = invoice._id;

                            parCb(null);
                        });
                }
            }, function () {
                PaymentModel.update({_id: existId}, {$set: updateObj}, function (err) {
                    if (err) {
                        importItem.reason = err.message;

                        return callback(null, {
                            skippedObj : importItem,
                            mergedCount: mergedCount
                        });
                    }

                    callback(null, {
                        mergedCount: 1
                    });
                });
            });
        }
    }

    function updateProductCategory(lastDb, existId, updateObj, importItem, callback) {
        var ProductCategoryModel = models.get(lastDb, type, schemaObj['ProductCategory']);
        var mergedCount = 0;
        var pCategoryExternalId = updateObj.parent;

        if (!pCategoryExternalId) {
            ProductCategoryModel.update({_id: existId}, {$set: updateObj}, function (err) {
                if (err) {
                    importItem.reason = err.message;

                    return callback(null, {
                        skippedItem: importItem,
                        mergedCount: mergedCount
                    });

                }

                mergedCount++;

                callback(null, {
                    skippedItem: null,
                    mergedCount: mergedCount
                });
            });
        } else {
            ProductCategoryModel.findOne({external: pCategoryExternalId}, {_id: 1})
                .lean()
                .exec(function (err, pCategory) {
                    if (err) {
                        return callback(err);
                    }

                    updateObj.parent = pCategory;

                    ProductCategoryModel.update({_id: existId}, {$set: updateObj}, function (err) {
                        if (err) {
                            importItem.reason = err.message;

                            return callback(null, {
                                skippedObj : importItem,
                                mergedCount: mergedCount
                            });
                        }

                        callback(null, {
                            mergedCount: 1
                        });
                    });
                });
        }
    }

    function updateJobPosition(lastDb, existId, updateObj, importItem, callback) {
        var JobPositionModel = models.get(lastDb, type, schemaObj['JobPosition']);
        var DepartmentModel = models.get(lastDb, 'Department', schemaObj.Department);
        var departmentExtId = updateObj.department;
        var mergedCount = 0;

        if (!departmentExtId) {
            JobPositionModel.update({_id: existId}, {$set: updateObj}, function (err) {
                if (err) {
                    importItem.reason = err.message;

                    return callback(null, {
                        skippedItem: importItem,
                        mergedCount: mergedCount
                    });

                }

                mergedCount++;

                callback(null, {
                    skippedItem: null,
                    mergedCount: mergedCount
                });
            });
        } else {
            DepartmentModel.findOne({externalId: departmentExtId}, {_id: 1})
                .lean()
                .exec(function (err, department) {
                    if (err) {
                        return callback(err);
                    }

                    updateObj.department = department._id;

                    JobPositionModel.update({_id: existId}, {$set: updateObj}, function (err) {
                        if (err) {
                            importItem.reason = err.message;

                            return callback(null, {
                                skippedObj : importItem,
                                mergedCount: mergedCount
                            });
                        }

                        callback(null, {
                            mergedCount: 1
                        });
                    });
                });
        }
    }

    function updateOpportunitiesOrLeads(lastDb, existId, updateObj, importItem, type, callback) {
        var findArray = [];
        var OpportunityModel = models.get(lastDb, type, schemaObj[type]);
        var CustomerModel = models.get(lastDb, 'Customers', schemaObj.Persons);
        var WorkflowModel = models.get(lastDb, 'workflow', schemaObj.Workflow);
        var workflowName = updateObj.workflow;
        var mergedCount = 0;
        var customerExtId;
        var companyExtId;
        var workflow;
        var customer;
        var company;

        if (updateObj.hasOwnProperty('customer')) {
            findArray.push(updateObj.customer.toString());
            customerExtId = updateObj.customer.toString();
        }

        if (updateObj.hasOwnProperty('company')) {
            findArray.push(updateObj.company.toString());
            companyExtId = updateObj.company.toString();
        }

        if (!findArray.length && !workflow) {
            OpportunityModel.update({_id: existId}, {$set: updateObj}, function (err) {
                if (err) {
                    importItem.reason = err.message;

                    return callback(null, {
                        skippedItem: importItem,
                        mergedCount: mergedCount
                    });
                }

                mergedCount++;

                callback(null, {
                    skippedItem: null,
                    mergedCount: mergedCount
                });
            });
        } else {
            async.parallel({
                customer: function (pCb) {
                    CustomerModel.findOne({externalId: {$in: findArray}}, {_id: 1})
                        .lean()
                        .exec(function (err, customerModel) {

                            if (err || !customerModel) {
                                return pCb(err);
                            }

                            if (customerModel.length) {
                                if (customerExtId) {
                                    customerExtId = customerExtId.toString();
                                    customer = _.find(customerModel, {externalId: customerExtId});
                                    updateObj.customer = customer && customer._id;
                                }

                                if (companyExtId) {
                                    companyExtId = companyExtId.toString();
                                    company = _.find(customerModel, {externalId: companyExtId});
                                    updateObj.company = company && company._id;
                                }
                            }

                            pCb(null, customerModel);
                        });
                },
                workflow: function (pCb) {
                    WorkflowModel.findOne({name: workflowName}, {_id: 1})
                        .lean()
                        .exec(function (err, workflow) {
                            if (err) {
                                return pCb(err);
                            }

                            updateObj.workflow = workflow._id;

                            pCb(null);
                        });
                }
            }, function () {
                OpportunityModel.update({_id: existId}, {$set: updateObj}, function (err) {
                    if (err) {
                        importItem.reason = err.message;

                        return callback(null, {
                            skippedObj : importItem,
                            mergedCount: mergedCount
                        });
                    }


                    callback(null, {
                        mergedCount: 1
                    });
                });
            });
        }
    }

    function updateCustomer(lastDb, existId, updateObj, importItem, type, callback) {
        var DepartmentModel = models.get(lastDb, 'Department', schemaObj.Department);
        var EmployeesModel = models.get(lastDb, 'Employees', schemaObj.Employees);
        var CustomerModel = models.get(lastDb, type, schemaObj[type]);
        var departmentArrayCriteria = [];
        var mergedCount = 0;
        var salesPersonExtId;
        var departmentExtId;
        var salesTeamExtId = updateObj['salesPurchases.salesPerson'];
        var companyExtId = updateObj.company;

        if (updateObj.hasOwnProperty('department')) {
            departmentArrayCriteria.push(updateObj.department.toString());
            departmentExtId = updateObj.department.toString();
        }

        if (updateObj.hasOwnProperty('salesPurchases.salesTeam')) {
            departmentArrayCriteria.push(updateObj['salesPurchases.salesTeam'].toString());
            salesTeamExtId = updateObj['salesPurchases.salesTeam'].toString();
        }

        async.parallel({
            getDepartment: function (parCb) {
                if (!departmentExtId && !salesTeamExtId) {
                    return parCb(null);
                }

                DepartmentModel.find({externalId: {$in: departmentArrayCriteria}}, {_id: 1, externalId: 1})
                    .lean()
                    .exec(function (err, result) {
                        var departmentId;
                        var salesTeamId;

                        if (err) {
                            return parCb(err);
                        }

                        if (result.length) {
                            if (departmentExtId) {
                                departmentExtId = departmentExtId.toString();
                                departmentId = _.find(result, {externalId: departmentExtId});
                            }

                            if (salesTeamExtId) {
                                salesTeamExtId = salesTeamExtId.toString();
                                salesTeamId = _.find(result, {externalId: salesTeamExtId});
                            }
                        }

                        parCb(null, {
                            departmentId: departmentId,
                            salesTeamId : salesTeamId
                        });
                    });
            },

            getEmployee: function (parCb) {
                EmployeesModel.findOne({externalId: salesPersonExtId}, {_id: 1})
                    .exec(function (err, employeeModel) {
                        if (err) {
                            return parCb(err);
                        }

                        parCb(null, employeeModel);
                    });
            },

            getCompany: function (parCb) {

                if (type === 'Companies') {
                    return parCb(null, {});
                }

                CustomerModel.findOne({externalId: companyExtId, type: 'Company'}, {_id: 1})
                    .exec(function (err, companyModel) {
                        if (err) {
                            return parCb(err);
                        }

                        parCb(null, companyModel);
                    });
            }
        }, function (err, result) {
            var resultDep = result.getDepartment;

            if (err) {
                return callback(err);
            }

            if (resultDep) {
                if (resultDep.departmentId) {
                    updateObj.department = resultDep.departmentId._id;
                } else {
                    updateObj.department = null;
                }

                if (resultDep.salesTeamId) {
                    updateObj['salesPurchases.salesTeam'] = resultDep.salesTeamId._id;
                } else {
                    updateObj['salesPurchases.salesTeam'] = null;
                }
            }

            if (result.getEmployee) {
                updateObj['salesPurchases.salesPerson'] = result.getEmployee._id;
            } else {
                updateObj['salesPurchases.salesPerson'] = null;
            }

            if (type !== 'Companies' && result.getCompany) {
                updateObj.company = result.getCompany._id;
            } else {
                updateObj.company = null;
            }

            CustomerModel.update({_id: existId}, {$set: updateObj}, function (err) {
                if (err) {
                    importItem.reason = err.message;

                    return callback(null, {
                        skippedObj : importItem,
                        mergedCount: mergedCount
                    });
                }

                callback(null, {
                    mergedCount: 1
                });
            });
        });
    }

    function updateEmployee(lastDb, existId, updateObj, importItem, callback) {
        var EmployeesModel = models.get(lastDb, 'Employees', schemaObj.Employees);
        var JobPositionModel = models.get(lastDb, 'JobPosition', schemaObj.JobPosition);
        var employeesArrayCriteria = [];
        var jobPositionExtId = updateObj.jobPosition;
        var mergedCount = 0;
        var managerExtId;
        var coachExtId;

        if (updateObj.hasOwnProperty('manager')) {
            employeesArrayCriteria.push(updateObj.manager.toString());
            managerExtId = updateObj.manager;
        }

        if (updateObj.hasOwnProperty('coach')) {
            employeesArrayCriteria.push(updateObj.coach.toString());
            coachExtId = updateObj.coach;
        }

        if (!updateObj.length && !jobPositionExtId) {
            EmployeesModel.update({_id: existId}, {$set: updateObj}, function (err) {
                if (err) {
                    importItem.reason = err.message;

                    return callback(null, {
                        skippedItem: importItem,
                        mergedCount: mergedCount
                    });

                }

                mergedCount++;

                callback(null, {
                    skippedItem: null,
                    mergedCount: mergedCount
                });
            });
        } else {
            async.parallel({
                getCoachAndManager: function (parCb) {
                    if (employeesArrayCriteria.length) {
                        return parCb(null);
                    }

                    EmployeesModel.find({externalId: {$in: employeesArrayCriteria}}, {_id: 1, externalId: 1})
                        .lean()
                        .exec(function (err, result) {
                            var manager;
                            var coach;

                            if (err) {
                                return parCb(err);
                            }

                            if (result.length) {
                                if (managerExtId) {
                                    managerExtId = managerExtId.toString();
                                    manager = _.find(result, {externalId: managerExtId});
                                    updateObj.manager = manager && manager._id;
                                } else {
                                    updateObj.manager = null;
                                }

                                if (coachExtId) {
                                    coachExtId = coachExtId.toString();
                                    coach = _.find(result, {externalId: coachExtId});
                                    updateObj.coach = coach && coach._id;
                                } else {
                                    updateObj.coach = null;
                                }
                            }

                            return parCb(null);
                        });
                },

                getJobPosition: function (parCb) {

                    if (!jobPositionExtId) {
                        return parCb(null);
                    }

                    JobPositionModel.findOne({externalId: jobPositionExtId}, {
                        _id       : 1,
                        department: 1
                    }, function (err, jobPosModel) {
                        if (err) {
                            return parCb(err);
                        }

                        if (!jobPosModel) {
                            err = new Error('Provided Job Position does`t exist');
                            err.status = 404;

                            return parCb(err);
                        }

                        updateObj.jobPosition = jobPosModel._id;
                        updateObj.department = jobPosModel.department || null;
                    });
                }
            }, function (err, result) {
                if (err) {
                    importItem.reason = err.message;

                    return callback(null, {
                        skippedObj : importItem,
                        mergedCount: mergedCount
                    });
                }

                EmployeesModel.update({_id: existId}, {$set: updateObj}, function (err) {
                    if (err) {
                        importItem.reason = err.message;

                        return callback(null, {
                            skippedObj : importItem,
                            mergedCount: mergedCount
                        });
                    }

                    mergedCount++;

                    callback(null, {
                        mergedCount: 1
                    });
                });
            });
        }
    }

    this.getImportMapObject = function (req, res, next) {
        var ImportModel = models.get(req.session.lastDb, 'Imports', ImportSchema);
        var DepartmentModel = models.get(req.session.lastDb, 'Department', DepartmentSchema);
        var userId = req.session.uId;
        var query = req.query;
        var type = query.type || 'Customers';
        var personKeysArray = mapObject[type].slice();
        var mappedObj;
        var unmappedResult = {};
        var mappedResult = {};
        var findObj = {
            user: userId
        };

        if ((type === 'Employees')) {
            DepartmentModel.count({}, function (err, count) {
                if (!count) {
                    res.status(400).send('Your departments is empty. Please loading companies.');
                } else {
                    mapping();
                }
            });
        } else {
            mapping();
        }

        function mapping() {
            if (query.timeStamp) {
                findObj.timeStamp = query.timeStamp;
            }

            ImportModel.findOne(findObj, function (err, importedData) {
                if (err) {
                    return next(err);
                }

                if (importedData) {
                    mappedObj = splitFields(personKeysArray, importedData.result);
                }

                importedFileName = importedData.fileName;
                importedFilePath = importedData.fileName;

                mappedObj.unMapped = _.compact(mappedObj.unMapped);
                unmappedResult[type] = mappedObj.unMapped;

                mappedResult[type] = mappedObj.result;

                res.status(200).send({
                    mappedObj     : mappedResult,
                    unmappedObj   : unmappedResult,
                    requiredFields: validationsRequired[type]
                });
            });
        }
    };

    this.getImportHistory = function (req, res, next) {
        var ImportHistoryModel = models.get(req.session.lastDb, 'ImportHistories', ImportHistorySchema);
        var query = req.query;
        var limit = parseInt(query.count);
        var page = parseInt(query.page);
        var skip = limit * (page - 1);

        ImportHistoryModel.aggregate([
            {
                $match: {}
            }, {
                $lookup: {
                    from        : 'Users',
                    localField  : 'user',
                    foreignField: '_id',
                    as          : 'user'
                }
            }, {
                $unwind: {
                    path: '$user'
                }
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
                    _id  : 0,
                    total: 1,
                    data : {
                        date          : '$root.date',
                        fileName      : '$root.fileName',
                        filePath      : '$root.filePath',
                        user          : '$root.user.login',
                        type          : '$root.type',
                        status        : '$root.status',
                        reportFileName: '$root.reportFile',
                        reportFile    : '$root.reportFileName'
                    }
                }
            }, {
                $sort: {
                    'data.date': -1
                }
            }, {
                $skip: skip
            }, {
                $limit: limit
            }, {
                $group: {
                    _id  : null,
                    total: {$first: '$total'},
                    data : {$push: '$data'}
                }
            }, {
                $project: {
                    _id  : 0,
                    total: '$total',
                    data : '$data'
                }
            }
        ], function (err, result) {
            var data = {};

            if (err) {
                return next(err);
            }

            if (result.length) {
                data = result[0];
            }

            res.status(200).send(data);
        });
    };

    this.getForPreview = function (req, res, next) {
        var query = req.query;
        var timeStamp = +query.timeStamp;
        var userId = req.session.uId;
        var ImportModel = models.get(req.session.lastDb, 'Imports', ImportSchema);
        var UserModel = models.get(req.session.lastDb, 'Users', UserSchema);
        var criteria = {user: userId};
        var titleArray;
        var titleWithArray;
        var mappedFields;
        var resultArray = [];
        var map;
        var type;
        var result;
        var newArrayObj = {};
        var saveObj = {};
        var firstSavingObj = 0;
        var typeFieldArray = 'fire';

        if (timeStamp) {
            criteria.timeStamp = timeStamp;
        }

        UserModel.findOne({_id: userId}, {imports: 1}, function (err, userModel) {
            if (err) {
                return next(err);
            }

            map = userModel.imports && userModel.imports.map;
            type = map.type;
            result = map.result;

            ImportModel
                .find({})
                .limit(20)
                .exec(function (err, importData) {
                    var array = [];

                    if (err) {
                        return next(err);
                    }

                    if (!importData.length) {
                        res.status(404).send({result: 'Imported data not found'});
                        return;
                    }

                    titleArray = importData.shift().result;
                    mappedFields = mapImportFileds(result, titleArray);

                    if (titleArray[0] === 'isArray') {
                        titleWithArray = importData.shift().result;
                        typeFieldArray = titleWithArray[1];

                        async.each(importData, function (importItem, cb) {
                            var importItemObj = importItem.toJSON().result;

                            if (importItemObj[0] === 1) {
                                if (Object.keys(saveObj).length) {
                                    saveObj[typeFieldArray] = array;
                                    resultArray.push(saveObj);
                                    saveObj = {};
                                    array = [];
                                }

                                saveObj = prepareSaveObject(mappedFields, importItemObj, type);

                            } else {
                                for (var i = 1; i < titleWithArray.length; i++) {
                                    if (titleWithArray.length > 2) {
                                        newArrayObj[titleWithArray[i]] = importItemObj[i];
                                    } else {
                                        array.push(importItemObj[1]);
                                        break;
                                    }
                                }
                                if (titleWithArray.length > 2) {
                                    array.push(newArrayObj);
                                }
                            }

                            firstSavingObj++;

                            if (importData.length === firstSavingObj) {
                                saveObj.fire = array;
                                resultArray.push(saveObj);
                                saveObj = {};
                                array = [];
                            }

                            cb();
                        }, function (err) {
                            if (err) {
                                return next(err);
                            }

                            res.status(200).send({
                                result: resultArray,
                                keys  : _.values(result),
                                type  : type
                            });
                        });
                    } else {
                        async.each(importData, function (importItem, cb) {
                            var importItemObj = importItem.toJSON().result;
                            saveObj = prepareSaveObject(mappedFields, importItemObj, type);

                            if (Object.keys(saveObj).length) {
                                resultArray.push(saveObj);
                                saveObj = {};
                            }
                            cb();

                        }, function (err) {
                            if (err) {
                                return next(err);
                            }

                            res.status(200).send({
                                result: resultArray.slice(0, 5),
                                keys  : _.values(result),
                                type  : type
                            });
                        });
                    }
                });
        });
    };

    this.getConflictedItems = function (req, res, next) {
        var query = req.query;
        var timeStamp = +query.timeStamp;
        var userId = req.session.uId;
        var ImportModel = models.get(req.session.lastDb, 'Imports', ImportSchema);
        var UserModel = models.get(req.session.lastDb, 'Users', UserSchema);
        var criteria = {$and: [{user: userId}]};
        var titleArray;
        var mappedFields;
        var resultArray = [];
        var map;
        var type;
        var result;
        var conflictedData;
        var skipped;
        var imported;
        var conflictedSaveItems;
        var userImports;
        var Model;
        var compearingField;
        var headerItemArray = [];
        var saveObj = {};
        var array = [];
        var newArrayObj = {};
        var firstSavingObj = 0;
        var typeArrayField = 'fire';

        if (timeStamp) {
            criteria.$and.push({timeStamp: timeStamp});
        }

        UserModel.findOne({_id: userId}, {imports: 1}, function (err, userModel) {
            if (err) {
                return next(err);
            }

            userImports = userModel.imports || {};

            map = userImports.map || {};
            type = userImports.type;
            result = map.result;
            skipped = userImports.skipped;
            imported = userImports.importedCount;
            conflictedSaveItems = userImports.conflictedItems;
            compearingField = userImports.comparingField;

            criteria.$and.push({_id: {$nin: skipped}});

            Model = models.get(req.session.lastDb, type, schemaObj[type]);

            async.parallel({
                conflictedUnsavedItems: function (parCb) {
                    ImportModel
                        .find(criteria)
                        .exec(function (err, importData) {
                            if (err) {
                                return parCb(err);
                            }

                            if (!importData.length) {
                                res.status(404).send({result: 'Imported data not found'});
                                return;
                            }

                            titleArray = importData.shift().result;

                            mappedFields = mapImportFileds(result, titleArray);

                            async.each(importData, function (importItem, cb) {
                                var importItemObj = importItem.toJSON().result;

                                if ((titleArray[0] === 'isArray') && mappedFields[typeArrayField]) {
                                    mappedFields[typeArrayField] = importItemObj.length - 1;
                                }

                                saveObj = prepareSaveObject(mappedFields, importItemObj, type);
                                saveObj.importId = importItem._id;

                                if (Object.keys(saveObj).length) {
                                    resultArray.push(saveObj);
                                    saveObj = {};
                                }

                                cb(null);
                            }, function (err) {
                                if (err) {
                                    return parCb(err);
                                }

                                parCb(null, resultArray);
                            });
                        });
                },

                conflictedSavedItems: function (parCb) {
                    Model.find({_id: {$in: conflictedSaveItems}}, function (err, resultItems) {
                        var conflictSavedItems;

                        if (err) {
                            return parCb(err);
                        }

                        conflictSavedItems = resultItems.map(function (item) {
                            var currentItem = item.toJSON();
                            currentItem._id = currentItem._id.toString();
                            currentItem.isExist = true;

                            return flatten(currentItem);
                        });

                        parCb(null, conflictSavedItems);

                    });
                },

                getHeaderId: function (parCb) {
                    ImportModel.findOne(function (err, result) {
                        if (err) {
                            return parCb(err);
                        }

                        parCb(null, result._id);
                    });
                }
            }, function (err, resultItems) {

                if (err) {
                    return next(err);
                }

                conflictedData = _.union(resultItems.conflictedSavedItems, resultItems.conflictedUnsavedItems);
                conflictedData = _.groupBy(conflictedData, compearingField);

                if (Object.keys(conflictedData)[0] === 'undefined') {
                    conflictedData = {};
                }

                res.status(200).send({
                    result  : conflictedData,
                    keys    : _.values(result),
                    type    : type,
                    headerId: resultItems.getHeaderId || null
                });
            });
        });
    };

    this.saveMergedData = function (req, res, next) {
        var body = req.body;
        var importIds = body.data;
        var userId = req.session.uId;
        var ids = _.pluck(importIds, 'id');
        var timeStamp = body.timeStamp;
        var criteria = {
            $and: [
                {user: userId}
            ]
        };
        var ImportModel = models.get(req.session.lastDb, 'Imports', ImportSchema);
        var UserModel = models.get(req.session.lastDb, 'Users', UserSchema);
        var ImportHistoryModel = models.get(req.session.lastDb, 'ImportHistories', ImportHistorySchema);
        var headerId = body.headerId;
        var headerItem;
        var titleArray;
        var mappedFields;
        var skippedArray = [];
        var skipped;
        var idsForRemove = [];
        var Model;
        var importedCount = 0;
        var mergedCount = 0;
        var type;
        var importFileName;
        var importFilePath;
        var reportFilePath;
        var reportFileName;

        if (timeStamp) {
            criteria.$and.push({timeStamp: timeStamp});
        }

        criteria.$and.push({
            $or: [
                {_id: {$in: ids}},
                {_id: headerId}
            ]
        });

        async.waterfall([
            function (wCb) {
                UserModel.findOne({_id: userId}, {imports: 1}, function (err, userModel) {
                    var userImports;

                    if (err) {
                        return wCb(err);
                    }

                    userImports = userModel.toJSON().imports || {};

                    skipped = userImports.skipped;
                    importedCount = userImports.importedCount;
                    type = userImports.type;

                    wCb(null, userImports);
                });
            },

            function (userImports, wCb) {
                ImportModel.find(criteria, function (err, importData) {
                    var type = userImports.type;
                    var mapResult;

                    importFileName = importData[0].fileName;
                    importFilePath = importData[0].filePath;

                    if (err) {
                        return wCb(err);
                    }

                    if (!importData.length) {
                        res.status(404).send({result: 'Imported data not found'});
                        return;
                    }

                    Model = models.get(req.session.lastDb, type, schemaObj[type]);

                    mapResult = userImports.map.result;

                    headerItem = _.filter(importData, function (item) {
                        return item.toJSON()._id.toString() === headerId.toString();
                    });

                    if (headerItem[0]) {
                        titleArray = headerItem[0].toJSON().result;
                    }

                    mapResult.reason = 'reason';
                    mappedFields = mapImportFileds(mapResult, titleArray);

                    wCb(null, mappedFields, importData);
                });
            },

            function (mappedFields, importData, wCb) {
                var skippedItem;

                if (!skipped.length) {
                    return wCb(null, mappedFields, importData);
                }

                ImportModel.find({_id: {$in: skipped}}, function (err, resultItems) {
                    if (err) {
                        return wCb(null);
                    }

                    resultItems.forEach(function (item) {
                        skippedItem = prepareSaveObject(mappedFields, item.result, type);

                        if ((type === 'Employees') && (Object.keys(skippedItem).indexOf('department') === -1)) {
                            skippedItem.reason = 'department is not';
                        }

                        skippedArray.push(skippedItem);
                    });

                    wCb(null, mappedFields, importData);
                });
            },

            function (mappedFields, importData, wCb) {
                var item;
                var importItem = {};
                var saveModel;
                var existId;
                var importItemObj = {};
                var typeArrayField = 'fire';
                var lastDb = req.session.lastDb;

                if (!importIds.length) {
                    return wCb(null);
                }

                idsForRemove.push(importItemObj._id);

                async.eachLimit(importIds, 1, function (id, eachCb) {
                    item = _.filter(importData, function (item) {
                        return item._id.toString() === id.id;
                    });

                    importItemObj = item[0].toJSON().result;

                    if ((titleArray[0] === 'isArray') && mappedFields[typeArrayField]) {
                        mappedFields[typeArrayField] = importItemObj.length - 1;
                    }

                    importItem = prepareSaveObject(mappedFields, importItemObj, type);

                    if (id.action === 'skip') {
                        importItem.reason = importItem.reason || 'Skipped by merge';
                        skippedArray.push(importItem);

                        eachCb(null);
                    } else if (id.action === 'import') {

                        importItem = setDefaultFields(type, importItem);

                        switch (type) {
                            case 'Products':
                                createProduct(lastDb, importItem, type, 'merge', function (err, result) {
                                    skippedArray = skippedArray.concat(result.skippedArray);
                                    importedCount += result.importedCount;

                                    eachCb(null);
                                });
                                break;
                            case 'ProductCategory':
                                createProductCategory(lastDb, importItem, type, 'merge', function (err, result) {
                                    skippedArray = skippedArray.concat(result.skippedArray);
                                    importedCount += result.importedCount;

                                    eachCb(null);
                                });
                                break;
                            case 'JobPosition':
                                createJobPosition(lastDb, importItem, type, 'merge', function (err, result) {
                                    skippedArray = skippedArray.concat(result.skippedArray);
                                    importedCount += result.importedCount;

                                    eachCb(null);
                                });
                                break;
                            case 'Employees':
                                createEmployee(lastDb, importItem, 'merge', function (err, result) {
                                    skippedArray = skippedArray.concat(result.skippedArray);
                                    importedCount += result.importedCount;

                                    eachCb(null);
                                });
                                break;
                            case 'Opportunities':
                            case 'Leads':
                                createOpportunitiesOrLeads(lastDb, importItem, type, 'merge', function (err, result) {
                                    skippedArray = skippedArray.concat(result.skippedArray);
                                    importedCount += result.importedCount;

                                    eachCb(null);
                                });
                                break;
                            case 'Invoice':
                                createInvoice(lastDb, importItem, 'merge', function (err, result) {
                                    skippedArray = skippedArray.concat(result.skippedArray);
                                    importedCount += result.importedCount;

                                    eachCb(null);
                                });
                                break;
                            case 'Orders':
                            case 'Quotation':
                                createQuotation(lastDb, importItem, 'merge', function (err, result) {
                                    skippedArray = skippedArray.concat(result.skippedArray);
                                    importedCount += result.importedCount;

                                    eachCb(null);
                                });
                                break;
                            case 'PurchasePayments':
                            case 'InvoicePayments':
                                createPayments(lastDb, importItem, type, 'merge', function (err, result) {
                                    skippedArray = skippedArray.concat(result.skippedArray);
                                    idsForRemove = idsForRemove.concat(result.idsForRemove);
                                    importedCount += result.importedCount;

                                    eachCb(null);
                                });
                                break;
                            case 'Persons':
                            case 'Companies':
                                createCustomer(lastDb, importItem, type, 'merge', function (err, result) {
                                    skippedArray = skippedArray.concat(result.skippedArray);
                                    idsForRemove = idsForRemove.concat(result.idsForRemove);
                                    importedCount += result.importedCount;

                                    eachCb(null);
                                });
                                break;
                            default:
                            {
                                saveModel = new Model(importItem);
                                saveModel.save(function (err) {
                                    if (err) {
                                        importItem.reason = err.message;
                                        skippedArray.push(importItem);

                                    } else {
                                        importedCount++;
                                    }

                                    eachCb(null);
                                });
                            }
                        }

                    } else {
                        existId = id.existId;

                        Model.findOne({_id: existId}, function (err, model) {
                            var modelJSON;
                            var flattenObj;
                            var updateObj = {};

                            if (err) {
                                importItem.reason = err.message;
                                skippedArray.push(importItem);
                            }

                            modelJSON = model.toJSON();
                            flattenObj = flatten(modelJSON);

                            for (var i in importItem) {
                                if (importItem.hasOwnProperty(i)) {
                                    if (flattenObj[i] !== importItem[i]) {
                                        if (validationsArray[type] && validationsArray[type].length && (validationsArray[type].indexOf(i) >= 0)) {
                                            updateObj[i] = flattenObj[i].concat(importItem[i]);
                                        } else {
                                            updateObj[i] = importItem[i];
                                        }
                                    }
                                }
                            }

                            switch (type) {
                                case 'Invoice':
                                    updateInvoice(lastDb, existId, updateObj, importItem, function (err, result) {
                                        if (err) {
                                            importItem.reason = err.message;
                                            skippedArray.push(importItem);

                                            return eachCb(null);
                                        }

                                        if (result && result.skippedObj) {
                                            skippedArray.push(result.skippedObj);
                                        }

                                        mergedCount += result.mergedCount;

                                        eachCb(null);
                                    });
                                    break;
                                case 'Orders':
                                case 'Quotation':
                                    updateQuotation(lastDb, existId, updateObj, importItem, function (err, result) {
                                        if (err) {
                                            importItem.reason = err.message;
                                            skippedArray.push(importItem);

                                            return eachCb(null);
                                        }

                                        if (result && result.skippedObj) {
                                            skippedArray.push(result.skippedObj);
                                        }

                                        mergedCount += result.mergedCount;

                                        eachCb(null);
                                    });
                                    break;
                                case 'PurchasePayments':
                                case 'InvoicePayments':
                                    updatePayments(lastDb, existId, updateObj, importItem, type, function (err, result) {
                                        if (err) {
                                            importItem.reason = err.message;
                                            skippedArray.push(importItem);

                                            return eachCb(null);
                                        }

                                        if (result && result.skippedObj) {
                                            skippedArray.push(result.skippedObj);
                                        }

                                        mergedCount += result.mergedCount;

                                        eachCb(null);
                                    });
                                    break;
                                case 'Opportunities':
                                case 'Leads':
                                    updateOpportunitiesOrLeads(lastDb, existId, updateObj, importItem, type, function (err, result) {
                                        if (err) {
                                            importItem.reason = err.message;
                                            skippedArray.push(importItem);

                                            return eachCb(null);
                                        }

                                        if (result && result.skippedObj) {
                                            skippedArray.push(result.skippedObj);
                                        }

                                        mergedCount += result.mergedCount;

                                        eachCb(null);
                                    });
                                    break;
                                case 'Persons':
                                case 'Companies':
                                    updateCustomer(lastDb, existId, updateObj, importItem, type, function (err, result) {
                                        if (err) {
                                            importItem.reason = err.message;
                                            skippedArray.push(importItem);

                                            return eachCb(null);
                                        }

                                        if (result && result.skippedObj) {
                                            skippedArray.push(result.skippedObj);
                                        }

                                        mergedCount += result.mergedCount;

                                        eachCb(null);
                                    });
                                    break;
                                case 'JobPosition':
                                    updateJobPosition(lastDb, existId, updateObj, importItem, function (err, result) {
                                        if (err) {
                                            importItem.reason = err.message;
                                            skippedArray.push(importItem);

                                            return eachCb(null);
                                        }

                                        if (result && result.skippedObj) {
                                            skippedArray.push(result.skippedObj);
                                        }

                                        mergedCount += result.mergedCount;

                                        eachCb(null);
                                    });
                                    break;
                                case 'ProductCategory':
                                    updateProductCategory(lastDb, existId, updateObj, importItem, function (err, result) {
                                        if (err) {
                                            importItem.reason = err.message;
                                            skippedArray.push(importItem);

                                            return eachCb(null);
                                        }

                                        if (result && result.skippedObj) {
                                            skippedArray.push(result.skippedObj);
                                        }

                                        mergedCount += result.mergedCount;

                                        eachCb(null);
                                    });
                                    break;
                                case 'Employee':
                                    updateEmployee(lastDb, existId, updateObj, importItem, function (err, result) {
                                        if (err) {
                                            importItem.reason = err.message;
                                            skippedArray.push(importItem);

                                            return eachCb(null);
                                        }

                                        if (result && result.skippedObj) {
                                            skippedArray.push(result.skippedObj);
                                        }

                                        mergedCount += result.mergedCount;

                                        eachCb(null);
                                    });
                                default :
                                    Model.update({_id: existId}, {$set: updateObj}, function (err) {
                                        if (err) {
                                            importItem.reason = err.message;
                                            skippedArray.push(importItem);

                                            return eachCb(null);
                                        }

                                        mergedCount++;

                                        eachCb(null);
                                    });

                            }


                        });
                    }

                }, function (err) {
                    if (err) {
                        return wCb(err);
                    }

                    wCb(null);
                });
            },

            function (wCb) {
                if (!skippedArray.length) {
                    return wCb(null, {});
                }

                createXlsxReport(res, wCb, skippedArray, type);
            },

            function (reportOptions, wCb) {
                var options;

                reportFilePath = reportOptions.pathName;
                reportFileName = reportOptions.fileName;
                importFilePath = path.join('download', encodeURIComponent(importFilePath));

                options = {
                    fileName      : importFileName,
                    filePath      : importFilePath,
                    userId        : userId,
                    type          : type,
                    reportFile    : reportFilePath,
                    reportFileName: reportFileName
                };

                writeHistory(options, ImportHistoryModel, wCb);
            },

            function (wCb) {
                ImportModel.remove({user: userId}, function () {
                });

                wCb(null);
            }, function (wCb) {
                UserModel.update({_id: userId}, {$set: {imports: {}}}, wCb);
            }
        ], function (err) {

            if (err) {
                return next(err);
            }

            res.status(200).send({
                imported      : importedCount,
                skipped       : skippedArray.length ? skippedArray.length - 1 : 0,
                merged        : mergedCount,
                reportFilePath: reportFilePath,
                reportFileName: reportFileName
            });
        });
    };

    this.saveImportedData = function (req, res, next) {
        var data = req.body;
        var userId = req.session.uId;
        var map = data.map || {};
        var type = map.type;
        var timeStamp = map.timeStamp;
        var mapResult = map.result || {};
        var ImportModel = models.get(req.session.lastDb, 'Imports', ImportSchema);
        var Model = models.get(req.session.lastDb, type, schemaObj[type]);
        var mappedFields;
        var skippedIdsArray = [];
        var importedCount = 0;
        var headerItem;
        var headerItemArray;
        var newArrayObj = {};
        var firstSavingObj = 0;
        var idHeader;
        var criteria = {
            user: userId
        };
        var importItems = [];
        var idsForRemove = [];
        var compearingFiled = data.comparingField;
        var array = [];
        var typeArrayField = 'fire';
        var lastDb = req.session.lastDb;
        var reasonObj = {};

        if (timeStamp) {
            criteria.timeStamp = timeStamp;
        }

        ImportModel.find(criteria, function (err, importData) {
            if (err) {
                return next(err);
            }

            if (!importData.length) {
                res.status(404).send({result: 'Imported data not found'});
                return;
            }

            idHeader = importData[0]._id;
            headerItem = importData.shift().result;
            mappedFields = mapImportFileds(mapResult, headerItem);

            async.waterfall([
                function (wCb) {
                    var saveObj = {};

                    if (headerItem[0] === 'isArray') {
                        if (importData[0] && importData[0]._id) {
                            idsForRemove.push(importData[0]._id);
                        }

                        headerItemArray = importData.shift().result;
                        typeArrayField = headerItemArray[1];

                        async.each(importData, function (importItem, cb) {
                            var importItemObj = importItem.toJSON().result;

                            if (importItemObj[0] === 1) {
                                if (Object.keys(saveObj).length) {
                                    saveObj[typeArrayField] = array;

                                    importItems.push(saveObj);
                                    importItemObj.push(array);
                                    ImportModel.findByIdAndUpdate(saveObj.importId, {$push: {result: array}}, function (err, result) {
                                    });
                                    saveObj = {};
                                    array = [];
                                }
                                saveObj = prepareSaveObject(mappedFields, importItemObj, type);

                                saveObj.importId = importItem._id;

                            } else {
                                for (var i = 1; i < headerItemArray.length; i++) {
                                    if (headerItemArray.length > 2) {
                                        newArrayObj[headerItemArray[i]] = importItemObj[i];
                                    } else {
                                        array.push(importItemObj[1]);
                                        break;
                                    }
                                }
                                if (headerItemArray.length > 2) {
                                    array.push(newArrayObj);
                                }
                                idsForRemove.push(importItem._id);
                            }

                            firstSavingObj++;

                            if (importData.length === firstSavingObj) {
                                saveObj[typeArrayField] = array;
                                importItems.push(saveObj);
                                importItemObj.push(array);
                                ImportModel.findByIdAndUpdate(saveObj.importId, {$push: {result: array}}, function (err, result) {
                                });
                                saveObj = {};
                                array = [];
                            }

                            cb(null);
                        }, function (err) {
                            if (err) {
                                return wCb(err);
                            }

                            wCb(null);
                        });

                    } else {
                        async.each(importData, function (importItem, cb) {
                            var importItemObj = importItem.toJSON().result;

                            saveObj = prepareSaveObject(mappedFields, importItemObj, type);
                            saveObj.importId = importItem._id;

                            if (Object.keys(saveObj).length) {
                                importItems.push(saveObj);
                                saveObj = {};
                            }

                            cb(null);
                        }, function (err) {
                            if (err) {
                                return wCb(err);
                            }

                            wCb(null);

                        });
                    }
                },

                function (wCb) {
                    var projectObj = {};
                    var criteria = getCriteria(type);

                    projectObj[compearingFiled] = 1;

                    Model.find(criteria, projectObj)
                        .lean()
                        .exec(function (err, result) {
                            if (err) {
                                return wCb(err);
                            }

                            wCb(null, result);
                        });
                },

                function (savedItems, wCb) {
                    compearingForMerge(savedItems, importItems, compearingFiled, wCb);
                },

                function (itemsToSave, conflictedItems, wCb) {
                    var saveModel;
                    var idReason;

                    async.eachLimit(itemsToSave, 10, function (item, eachCb) {

                        item = setDefaultFields(type, item);

                        switch (type) {
                            case 'Persons':
                            case 'Companies':
                                createCustomer(lastDb, item, type, 'import', function (err, result) {
                                    skippedIdsArray = skippedIdsArray.concat(result.skippedIdsArray);
                                    idsForRemove = idsForRemove.concat(result.idsForRemove);
                                    importedCount += result.importedCount;

                                    if (Object.keys(result.reasons)) {
                                        idReason = Object.keys(result.reasons)[0];
                                        reasonObj[idReason] = result.reasons[idReason];
                                    }

                                    eachCb(null);
                                });
                                break;
                            case 'ProductCategory':
                                createProductCategory(lastDb, item, type, 'import', function (err, result) {
                                    skippedIdsArray = skippedIdsArray.concat(result.skippedIdsArray);
                                    idsForRemove = idsForRemove.concat(result.idsForRemove);
                                    importedCount += result.importedCount;
                                    if (Object.keys(result.reasons)) {
                                        idReason = Object.keys(result.reasons)[0];
                                        reasonObj[idReason] = result.reasons[idReason];
                                    }

                                    eachCb(null);
                                });
                                break;
                            case 'Products':
                                createProduct(lastDb, item, type, 'import', function (err, result) {
                                    skippedIdsArray = skippedIdsArray.concat(result.skippedIdsArray);
                                    idsForRemove = idsForRemove.concat(result.idsForRemove);
                                    importedCount += result.importedCount;
                                    if (Object.keys(result.reasons)) {
                                        idReason = Object.keys(result.reasons)[0];
                                        reasonObj[idReason] = result.reasons[idReason];
                                    }

                                    eachCb(null);
                                });
                                break;
                            case 'JobPosition':
                                createJobPosition(lastDb, item, type, 'import', function (err, result) {
                                    skippedIdsArray = skippedIdsArray.concat(result.skippedIdsArray);
                                    idsForRemove = idsForRemove.concat(result.idsForRemove);
                                    importedCount += result.importedCount;
                                    if (Object.keys(result.reasons)) {
                                        idReason = Object.keys(result.reasons)[0];
                                        reasonObj[idReason] = result.reasons[idReason];
                                    }

                                    eachCb(null);
                                });
                                break;
                            case'Employees':
                                createEmployee(lastDb, item, 'import', function (err, result) {
                                    skippedIdsArray = skippedIdsArray.concat(result.skippedIdsArray);
                                    idsForRemove = idsForRemove.concat(result.idsForRemove);
                                    importedCount += result.importedCount;
                                    if (Object.keys(result.reasons)) {
                                        idReason = Object.keys(result.reasons)[0];
                                        reasonObj[idReason] = result.reasons[idReason];
                                    }

                                    eachCb(null);
                                });
                                break;
                            case 'Opportunities':
                            case 'Leads':
                                createOpportunitiesOrLeads(lastDb, item, type, 'import', function (err, result) {
                                    skippedIdsArray = skippedIdsArray.concat(result.skippedIdsArray);
                                    idsForRemove = idsForRemove.concat(result.idsForRemove);
                                    importedCount += result.importedCount;
                                    if (Object.keys(result.reasons)) {
                                        idReason = Object.keys(result.reasons)[0];
                                        reasonObj[idReason] = result.reasons[idReason];
                                    }

                                    eachCb(null);
                                });
                                break;
                            case 'Invoice':
                                createInvoice(lastDb, item, 'import', function (err, result) {
                                    skippedIdsArray = skippedIdsArray.concat(result.skippedIdsArray);
                                    idsForRemove = idsForRemove.concat(result.idsForRemove);
                                    importedCount += result.importedCount;
                                    if (Object.keys(result.reasons)) {
                                        idReason = Object.keys(result.reasons)[0];
                                        reasonObj[idReason] = result.reasons[idReason];
                                    }

                                    eachCb(null);
                                });
                                break;
                            case 'Orders':
                            case 'Quotation':
                                createQuotation(lastDb, item, 'import', function (err, result) {
                                    skippedIdsArray = skippedIdsArray.concat(result.skippedIdsArray);
                                    idsForRemove = idsForRemove.concat(result.idsForRemove);
                                    importedCount += result.importedCount;

                                    if (Object.keys(result.reasons)) {
                                        idReason = Object.keys(result.reasons)[0];
                                        reasonObj[idReason] = result.reasons[idReason];
                                    }

                                    eachCb(null);
                                });
                                break;
                            case 'PurchasePayments':
                            case 'InvoicePayments':
                                createPayments(lastDb, item, type, 'import', function (err, result) {
                                    skippedIdsArray = skippedIdsArray.concat(result.skippedIdsArray);
                                    idsForRemove = idsForRemove.concat(result.idsForRemove);
                                    importedCount += result.importedCount;
                                    if (Object.keys(result.reasons)) {
                                        idReason = Object.keys(result.reasons)[0];
                                        reasonObj[idReason] = result.reasons[idReason];
                                    }

                                    eachCb(null);
                                });
                                break;
                            default:
                            {
                                saveModel = new Model(item);
                                saveModel.save(function (err) {
                                    if (err) {
                                        reasonObj[item.importId.toString()] = err.message;
                                        skippedIdsArray.push(item.importId.toString());
                                    } else {
                                        importedCount++;
                                        idsForRemove.push(item.importId);
                                    }

                                    eachCb(null);
                                });
                            }
                        }
                    }, function (err) {
                        if (err) {
                            return wCb(err);
                        }

                        wCb(null, conflictedItems);
                    });
                },

                function (conflictedItems, wCb) {
                    var impModel;
                    var impObj;


                    if (Object.keys(reasonObj).length) {
                        ImportModel.findByIdAndUpdate(idHeader, {$push: {result: 'reason'}}, function (err, result) {
                        });
                    }

                    for (var key in reasonObj) {
                        ImportModel.findByIdAndUpdate(key, {$push: {result: reasonObj[key]}}, function (err, result) {
                        });
                    }

                    wCb(null, conflictedItems);
                },

                function (conflictedItems, wCb) {
                    ImportModel.remove({_id: {$in: idsForRemove}}, function () {
                    });
                    wCb(null, conflictedItems);
                }
            ], function (err, conflictedItems) {

                if (err) {
                    return next(err);
                }

                res.status(200).send({
                    imported       : importedCount,
                    skippedArray   : skippedIdsArray,
                    conflictedItems: conflictedItems
                });
            });
        });
    };
};

module.exports = Module;
