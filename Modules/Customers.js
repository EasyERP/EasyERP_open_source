var Customers = function (event, models) {
    var mongoose = require('mongoose');
    var logWriter = require('../helpers/logWriter.js');
    var objectId = mongoose.Types.ObjectId;
    var customerSchema = mongoose.Schemas['Customer'];
    var department = mongoose.Schemas['Department'];
    var fs = require('fs');

    var CONSTANTS = require('../constants/mainConstants');

    return {

        getTotalCount: function (req, response) {
            var res = {};
            var data = {};
            for (var i in req.query) {
                data[i] = req.query[i];
            }
            res['showMore'] = false;

            var contentType = req.params.contentType;
            var optionsObject = {};

            this.caseFilter(contentType, optionsObject, data);

            models.get(req.session.lastDb, "Department", department).aggregate(
                {
                    $match: {
                        users: objectId(req.session.uId)
                    }
                }, {
                    $project: {
                        _id: 1
                    }
                },
                function (err, deps) {
                    if (!err) {
                        var arrOfObjectId = deps.objectID();
                        models.get(req.session.lastDb, "Customers", customerSchema).aggregate(
                            {
                                $match: {
                                    $and: [
                                        optionsObject,
                                        {
                                            $or: [
                                                {
                                                    $or: [
                                                        {
                                                            $and: [
                                                                {whoCanRW: 'group'},
                                                                {'groups.users': objectId(req.session.uId)}
                                                            ]
                                                        },
                                                        {
                                                            $and: [
                                                                {whoCanRW: 'group'},
                                                                {'groups.group': {$in: arrOfObjectId}}
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    $and: [
                                                        {whoCanRW: 'owner'},
                                                        {'groups.owner': objectId(req.session.uId)}
                                                    ]
                                                },
                                                {whoCanRW: "everyOne"}
                                            ]
                                        }
                                    ]
                                }
                            },
                            {
                                $project: {
                                    _id: 1
                                }
                            },
                            function (err, result) {
                                if (!err) {
                                    if (data.currentNumber && data.currentNumber < result.length) {
                                        res['showMore'] = true;
                                    }
                                    res['count'] = result.length;
                                    response.send(res);
                                } else {
                                    logWriter.log("Customers.js getTotalCount " + err);
                                    response.send(500, {error: 'Server Eroor'});
                                }
                            }
                        );

                    } else {
                        logWriter.log("Customers.js getTotalCount " + err);
                        response.send(500, {error: 'Server Eroor'});
                    }
                });
        },

        create: function (req, data, res) {
            try {
                if (!data) {
                    logWriter.log('Person.create Incorrect Incoming Data');
                    res.send(400, {error: 'Person.create Incorrect Incoming Data'});
                    return;
                } else {
                    savetoBd(data);
                }
                function savetoBd(data) {
                    try {
                        _customer = new models.get(req.session.lastDb, "Customers", customerSchema)();
                        if (data.uId) {
                            _customer.createdBy.user = data.uId;
                            //on creation addded uId to editBy field user value
                            _customer.editedBy.user = data.uId;
                        }
                        if (data.groups) {
                            _customer.groups = data.groups;
                        }
                        if (data.whoCanRW) {
                            _customer.whoCanRW = data.whoCanRW;
                        }
                        if (data.type) {
                            _customer.type = data.type;
                        }
                        if (data.isOwn) {
                            _customer.isOwn = data.isOwn;
                        }
                        if (data.imageSrc) {
                            _customer.imageSrc = data.imageSrc;
                        }
                        if (data.email) {
                            _customer.email = data.email;
                        }
                        if (data.dateBirth) {
                            _customer.dateBirth = new Date(data.dateBirth);
                        }
                        if (data.name) {
                            if (data.name.first) {
                                _customer.name.first = data.name.first;
                            }
                            if (data.name.last) {
                                _customer.name.last = data.name.last;
                            }
                        }
                        if (data.company) {
                            _customer.company = data.company;
                        }
                        if (data.department) {
                            _customer.department = data.department;
                        }
                        if (data.timezone) {
                            _customer.timezone = data.timezone;
                        }
                        if (data.address) {
                            if (data.address.street) {
                                _customer.address.street = data.address.street;
                            }
                            if (data.address.city) {
                                _customer.address.city = data.address.city;
                            }
                            if (data.address.state) {
                                _customer.address.state = data.address.state;
                            }
                            if (data.address.zip) {
                                _customer.address.zip = data.address.zip;
                            }
                            if (data.address.country) {
                                _customer.address.country = data.address.country;
                            }
                        }
                        if (data.website) {
                            _customer.website = data.website;
                        }
                        if (data.jobPosition) {
                            _customer.jobPosition = data.jobPosition;
                        }
                        if (data.skype) {
                            _customer.skype = data.skype;
                        }
                        if (data.phones) {
                            if (data.phones.phone) {
                                _customer.phones.phone = data.phones.phone;
                            }
                            if (data.phones.mobile) {
                                _customer.phones.mobile = data.phones.mobile;
                            }
                            if (data.phones.fax) {
                                _customer.phones.fax = data.phones.fax;
                            }
                        }
                        if (data.social) {
                            if (data.social.LI) {
                                _customer.social.LI = data.social.LI;
                            }
                            if (data.social.FB) {
                                _customer.social.FB = data.social.FB;
                            }
                        }
                        if (data.contacts) {
                            _customer.contacts = data.contacts;
                        }
                        if (data.internalNotes) {
                            _customer.internalNotes = data.internalNotes;
                        }
                        if (data.title) {
                            _customer.title = data.title;
                        }
                        if (data.salesPurchases) {
                            _customer.salesPurchases.active = !!data.salesPurchases.active;

                            if (data.salesPurchases.language !== '') {
                                _customer.salesPurchases.language = data.salesPurchases.language;
                            }

                            _customer.salesPurchases.isCustomer = !!data.salesPurchases.isCustomer;
                            _customer.salesPurchases.isSupplier = !!data.salesPurchases.isSupplier;

                            if (data.salesPurchases.salesPerson !== '') {
                                _customer.salesPurchases.salesPerson = data.salesPurchases.salesPerson;
                            }
                            if (data.salesPurchases.salesTeam !== '') {
                                _customer.salesPurchases.salesTeam = data.salesPurchases.salesTeam;
                            }
                            if (data.salesPurchases.implementedBy !== '') {
                                _customer.salesPurchases.implementedBy = data.salesPurchases.implementedBy;
                            }
                            if (data.salesPurchases.reference !== '') {
                                _customer.salesPurchases.reference = data.salesPurchases.reference;
                            }
                            if (data.salesPurchases.receiveMessages) {
                                _customer.salesPurchases.receiveMessages = data.salesPurchases.receiveMessages;
                            }

                            if (data.imageSrc) {
                                _customer.imageSrc = data.imageSrc;
                            }
                        }
                        if (data.relatedUser !== '') {
                            _customer.relatedUser = data.relatedUser;
                        }
                        if (data.history) {
                            _customer.history = data.history;
                        }
                        if (data.notes) {
                            _customer.notes = data.notes;
                        }
                        if (data.attachments) {
                            _customer.attachments = data.attachments;
                        }
                        _customer.save(function (err, result) {
                            if (err) {
                                logWriter.log("Person.js create savetoBd _customer.save " + err);
                                res.send(500, {error: 'Person.save BD error'});
                            } else {

                                res.send(201, {success: 'A new Person crate success', id: result._id});
                            }
                        });

                    }
                    catch (error) {
                        logWriter.log("Person.js create savetoBd" + error);
                        res.send(500, {error: 'Person.save  error'});
                    }
                }
            }
            catch (Exception) {
                logWriter.log("Person.js  " + Exception);
                res.send(500, {error: 'Person.save  error'});
            }
        },

        getForDd: function (req, response) {
            var res = {};
            res['data'] = [];
            var query = models.get(req.session.lastDb, "Customers", customerSchema).find({'relatedUser.id': {$ne: ''}}, {
                _id: 1,
                name: 1
            });
            query.sort({name: 1});
            query.exec(function (err, customers) {
                if (err) {
                    response.send(500, {error: "Can't find customer"});
                    logWriter.log("customer.js geForDd customer.find " + err);
                } else {
                    res['data'] = customers;
                    response.send(res);
                }
            });
        },

        getFilterPersonsForMiniView: function (req, response, data) {
            var res = {};
            var optionsObject = {};
            res['data'] = [];
            if (data.letter) {
                optionsObject['type'] = 'Person';
                optionsObject['name.last'] = new RegExp('^[' + data.letter.toLowerCase() + data.letter.toUpperCase() + '].*');
            } else {
                optionsObject['type'] = 'Person';
            }
            models.get(req.session.lastDb, "Department", department).aggregate(
                {
                    $match: {
                        users: objectId(req.session.uId)
                    }
                }, {
                    $project: {
                        _id: 1
                    }
                },
                function (err, deps) {
                    if (!err) {
                        var arrOfObjectId = deps.objectID();
                        models.get(req.session.lastDb, "Customers", customerSchema).aggregate(
                            {
                                $match: {
                                    $and: [
                                        optionsObject,
                                        {
                                            company: objectId(data.companyId)
                                        },
                                        {
                                            $or: [
                                                {
                                                    $or: [
                                                        {
                                                            $and: [
                                                                {whoCanRW: 'group'},
                                                                {'groups.users': objectId(req.session.uId)}
                                                            ]
                                                        },
                                                        {
                                                            $and: [
                                                                {whoCanRW: 'group'},
                                                                {'groups.group': {$in: arrOfObjectId}}
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    $and: [
                                                        {whoCanRW: 'owner'},
                                                        {'groups.owner': objectId(req.session.uId)}
                                                    ]
                                                },
                                                {whoCanRW: "everyOne"}
                                            ]
                                        }
                                    ]
                                }
                            },
                            {
                                $project: {
                                    _id: 1
                                }
                            },
                            function (err, result) {
                                if (!err) {
                                    var query = models.get(req.session.lastDb, "Customers", customerSchema).find().where('_id').in(result);

                                    if (data.onlyCount.toString().toLowerCase() == "true") {

                                        query.count(function (error, _res) {
                                            if (!error) {
                                                res['listLength'] = _res;
                                                response.send(res);
                                            } else {
                                                logWriter.log("Customers.js getFilterPersonsForMiniView " + error);
                                            }
                                        })
                                    } else {

                                        if (data && data.status && data.status.length > 0)
                                            query.where('workflow').in(data.status);
                                        query.select("_id name email phones.mobile").
                                            skip((data.page - 1) * data.count).
                                            limit(data.count).
                                            sort({"name.first": 1}).
                                            exec(function (error, _res) {
                                                if (!error) {
                                                    res['data'] = _res;
                                                    response.send(res);
                                                } else {
                                                    logWriter.log("Customers.js getFilterPersonsForMiniView " + error);
                                                }
                                            });
                                    }
                                } else {
                                    logWriter.log("Customers.js getFilterPersonsForMiniView " + err);
                                }
                            }
                        );

                    } else {
                        logWriter.log("Customers.js getFilterPersonsForMiniView " + err);
                    }
                });
        },

        getPersonById: function (req, id, response) {
            var query = models.get(req.session.lastDb, "Customers", customerSchema).findById(id);
            query.populate('company', '_id name').
                populate('salesPurchases.salesPerson', '_id name fullName').
                populate('salesPurchases.salesTeam', '_id departmentName').
                populate('salesPurchases.implementedBy', '_id name fullName').
                populate('department', '_id departmentName').
                populate('createdBy.user').
                populate('editedBy.user').
                populate('groups.users').
                populate('groups.group').
                populate('groups.owner', '_id login');

            query.exec(function (err, result) {
                if (err) {
                    logWriter.log("customer.js get customer.find " + err);
                    response.send(500, {error: "Can't find customer"});
                } else {
                    response.send(result);
                }
            });
        },

        getCompanyById: function (req, id, response) {
            var query = models.get(req.session.lastDb, "Customers", customerSchema).findById(id);
            query.populate('department', '_id departmentName').
                populate('salesPurchases.salesPerson', '_id name fullName').
                populate('salesPurchases.salesTeam', '_id departmentName').
                populate('salesPurchases.implementedBy', '_id name fullName').
                populate('createdBy.user').
                populate('editedBy.user').
                populate('groups.users').
                populate('groups.group').
                populate('groups.owner', '_id login');

            query.exec(function (err, result) {
                if (err) {
                    logWriter.log("customer.js get customer.find " + err);
                    response.send(500, {error: "Can't find customer"});
                } else {
                    response.send(result);
                }
            });
        },

        getCompaniesForDd: function (req, response) {
            var res = {};
            res['data'] = [];
            var query = models.get(req.session.lastDb, "Customers", customerSchema).find({type: 'Company'});
            /*            query.populate('salesPurchases.salesPerson', '_id name').
             populate('salesPurchases.salesTeam', '_id departmentName').
             populate('createdBy.user').
             populate('editedBy.user').
             populate('groups.users').
             populate('groups.group');
             */
            query.select("_id name.first");
            query.sort({"name.first": 1});
            query.exec(function (err, result) {
                if (err) {
                    logWriter.log("customer.js get customer.find " + err);
                    response.send(500, {error: "Can't find customer"});
                } else {
                    res['data'] = result;
                    response.send(res);
                }
            });
        },

        getCustomersAlphabet: function (req, response) {
            var data = {};
            for (var i in req.query) {
                data[i] = req.query[i];
            }

            var contentType = data.contentType;

            var searchName;
            var res = {};
            var optionsObject = {};
            switch (contentType) {
                case ('Persons'):
                {
                    optionsObject['type'] = 'Person';
                    searchName = "$name.last";
                }
                    break;
                case ('Companies'):
                {
                    optionsObject['type'] = 'Company';
                    searchName = "$name.first";
                }
                    break;
                case ('ownCompanies'):
                {
                    optionsObject['type'] = 'Company';
                    optionsObject['isOwn'] = true;
                    searchName = "$name.first";
                }
                    break;
            }
            models.get(req.session.lastDb, "Department", department).aggregate(
                {
                    $match: {
                        users: objectId(req.session.uId)
                    }
                }, {
                    $project: {
                        _id: 1
                    }
                },
                function (err, deps) {
                    if (!err) {
                        var arrOfObjectId = deps.objectID();

                        models.get(req.session.lastDb, "Customers", customerSchema).aggregate(
                            {
                                $match: {
                                    $and: [
                                        optionsObject,
                                        {
                                            $or: [
                                                {
                                                    $or: [
                                                        {
                                                            $and: [
                                                                {whoCanRW: 'group'},
                                                                {'groups.users': objectId(req.session.uId)}
                                                            ]
                                                        },
                                                        {
                                                            $and: [
                                                                {whoCanRW: 'group'},
                                                                {'groups.group': {$in: arrOfObjectId}}
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    $and: [
                                                        {whoCanRW: 'owner'},
                                                        {'groups.owner': objectId(req.session.uId)}
                                                    ]
                                                },
                                                {whoCanRW: "everyOne"}
                                            ]
                                        }
                                    ]
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    later: {$substr: [searchName, 0, 1]}
                                }
                            },
                            {
                                $group: {_id: "$later"}
                            },
                            function (err, result) {
                                if (err) {
                                    logWriter.log("customer.js get person alphabet " + err);
                                    response.send(500, {error: "Can't find customer"});
                                } else {
                                    res['data'] = result;
                                    response.send(res);
                                }
                            }
                        );
                    }
                })
        },

        getCustomersImages: function (req, res) {
            var data = {};
            for (var i in req.query) {
                data[i] = req.query[i];
            }
            var optionsObject = {};

            var contentType = data.contentType;
            switch (contentType) {
                case ('Persons'):
                {
                    optionsObject['type'] = 'Person';
                }
                    break;
                case ('Companies'):
                {
                    optionsObject['type'] = 'Company';
                }
                    break;
                case ('ownCompanies'):
                {
                    optionsObject['type'] = 'Company';
                    optionsObject['isOwn'] = true;
                }
                    break;
            }

            var query = models.get(req.session.lastDb, "Customers", customerSchema).find(optionsObject);
            query.where('_id').in(data.ids).
                select('_id imageSrc').
                exec(function (error, response) {
                    res.send(200, {data: response});
                });

        },

        caseFilter: function (contentType, optionsObject, data) {
            var condition;
            var resArray = [];
            var filtrElement = {};
            var key;

            switch (contentType) {
                case ('Persons'):
                {
                    for (var filterName in data.filter) {
                        condition = data.filter[filterName]['value'];
                        key = data.filter[filterName]['key'];

                        switch (filterName) {
                            case 'country':
                                filtrElement[key] = {$in: condition};
                                resArray.push(filtrElement);
                                break;
                            case 'name':
                                filtrElement[key] = {$in: condition.objectID()};
                                resArray.push(filtrElement);
                                break;
                            case 'letter':
                                filtrElement['name.last'] = new RegExp('^[' + data.filter.letter.toLowerCase() + data.filter.letter.toUpperCase() + '].*');
                                resArray.push(filtrElement);
                                break;
                            case 'services':
                                if (condition.indexOf('isCustomer') !== -1) {
                                    filtrElement['salesPurchases.isCustomer'] = true;
                                    resArray.push(filtrElement);
                                }
                                if (condition.indexOf('isSupplier') !== -1) {
                                    filtrElement['salesPurchases.isSupplier'] = true;
                                    resArray.push(filtrElement);
                                }
                                break;
                        }
                    };

                    resArray.push({'type': 'Person'});

                    if (resArray.length) {

                        if (data && data.filter && data.filter.condition === 'or') {
                            optionsObject['$or'] = resArray;
                        } else {
                            optionsObject['$and'] = resArray;
                        }
                    }
                }
                    break;
                case ('Companies'):
                {

                    for (var filterName in data.filter) {
                        condition = data.filter[filterName]['value'];
                        key = data.filter[filterName]['key'];

                        switch (filterName) {
                            case 'country':
                                filtrElement[key] = {$in: condition};
                                resArray.push(filtrElement);
                                break;
                            case 'name':
                                filtrElement[key] = {$in: condition.objectID()};
                                resArray.push(filtrElement);
                                break;
                            case 'letter':
                                filtrElement['name.first'] = new RegExp('^[' + data.filter.letter.toLowerCase() + data.filter.letter.toUpperCase() + '].*');
                                resArray.push(filtrElement);
                                break;
                            case 'services':
                                if (condition.indexOf('isCustomer') !== -1) {
                                    filtrElement['salesPurchases.isCustomer'] = true;
                                    resArray.push(filtrElement);
                                }
                                if (condition.indexOf('isSupplier') !== -1) {
                                    filtrElement['salesPurchases.isSupplier'] = true;
                                    resArray.push(filtrElement);
                                }
                                break;
                        }
                    };

                    resArray.push({'type': 'Company'});

                    if (resArray.length) {

                        if (data && data.filter && data.filter.condition === 'or') {
                            optionsObject['$or'] = resArray;
                        } else {
                            optionsObject['$and'] = resArray;
                        }
                    }
                }
                    break;
                case ('ownCompanies'):
                {
                    optionsObject['type'] = 'Company';
                    optionsObject['isOwn'] = true;
                    if (data.letter)
                        optionsObject['name.first'] = new RegExp('^[' + data.letter.toLowerCase() + data.letter.toUpperCase() + '].*');
                }
                    break;
            }
        },

        getFilterCustomers: function (req, response) {


            var data = req.query;
            var viewType = data.viewType;
            var contentType = data.contentType;
            var res = {
                data: []
            };
            var optionsObject = {};


            this.caseFilter(contentType, optionsObject, data);

            models.get(req.session.lastDb, "Department", department).aggregate(
                {
                    $match: {
                        users: objectId(req.session.uId)
                    }
                }, {
                    $project: {
                        _id: 1
                    }
                },
                function (err, deps) {
                    if (!err) {
                        var arrOfObjectId = deps.objectID();
                        var queryObject = {
                            $or: [
                                {
                                    $or: [
                                        {
                                            $and: [
                                                {whoCanRW: 'group'},
                                                {'groups.users': objectId(req.session.uId)}
                                            ]
                                        },
                                        {
                                            $and: [
                                                {whoCanRW: 'group'},
                                                {'groups.group': {$in: arrOfObjectId}}
                                            ]
                                        }
                                    ]
                                },
                                {
                                    $and: [
                                        {whoCanRW: 'owner'},
                                        {'groups.owner': objectId(req.session.uId)}
                                    ]
                                },
                                {whoCanRW: "everyOne"}
                            ]
                        };

                        models.get(req.session.lastDb, "Customers", customerSchema).aggregate(
                            {
                                $match: {
                                    $and: [
                                        optionsObject,
                                        queryObject
                                    ]
                                }
                            },
                            {
                                $project: {
                                    _id: 1
                                }
                            },
                            function (err, result) {
                                if (!err) {
                                    var query = models.get(req.session.lastDb, "Customers", customerSchema).find().where('_id').in(result);
                                    if (data.status && data.status.length > 0)
                                        query.where('workflow').in(data.status);

                                    switch (contentType) {
                                        case ('Persons'):
                                            switch (viewType) {
                                                case ('list'):
                                                {
                                                    if (data.sort) {
                                                        query.sort(data.sort);
                                                    } else {
                                                        query.sort({"editedBy.date": -1});
                                                    }
                                                    query.select("_id createdBy editedBy address.country email name phones.phone").
                                                        populate('createdBy.user', 'login').
                                                        populate('editedBy.user', 'login');
                                                }
                                                    break;
                                                case ('thumbnails'):
                                                {
                                                    query.select("_id name email company").
                                                        populate('company', '_id name').
                                                        populate('department', '_id departmentName').
                                                        populate('createdBy.user').
                                                        populate('editedBy.user');
                                                }
                                                    break;

                                            }
                                            break;
                                        case ('Companies'):
                                            switch (viewType) {
                                                case ('list'):
                                                {
                                                    if (data.sort) {
                                                        query.sort(data.sort);
                                                    } else {
                                                        query.sort({"editedBy.date": -1});
                                                    }
                                                    query.select("_id editedBy createdBy salesPurchases name email phones.phone address.country").
                                                        populate('salesPurchases.salesPerson', '_id name').
                                                        populate('salesPurchases.salesTeam', '_id departmentName').
                                                        populate('createdBy.user', 'login').
                                                        populate('editedBy.user', 'login');
                                                }
                                                    break;
                                                case ('thumbnails'):
                                                {
                                                    query.select("_id name address").
                                                        populate('createdBy.user').
                                                        populate('editedBy.user');
                                                }
                                                    break;

                                            }
                                            break;
                                        case ('ownCompanies'):
                                            switch (viewType) {
                                                case ('list'):
                                                {
                                                    query.populate('salesPurchases.salesPerson', '_id name').
                                                        populate('salesPurchases.salesTeam', '_id departmentName').
                                                        populate('createdBy.user').
                                                        populate('editedBy.user');
                                                }
                                                    break;
                                                case ('thumbnails'):
                                                {
                                                    query.select("_id name").
                                                        populate('company', '_id name address').
                                                        populate('createdBy.user').
                                                        populate('editedBy.user');
                                                }
                                                    break;
                                            }
                                            break;
                                    }

                                    query.skip((data.page - 1) * data.count).
                                        limit(data.count).
                                        exec(function (error, _res) {
                                            if (!error) {
                                                res['data'] = _res;
                                                response.send(res);
                                            } else {
                                                logWriter.log("Customers.js getFilterCustomers " + error);
                                            }
                                        });
                                } else {
                                    logWriter.log("Customers.js getFilterCustomers " + err);
                                }
                            }
                        );
                    } else {
                        logWriter.log("Customers.js getFilterCustomers " + err);
                    }
                });

        },

        getCustomers: function (req, response, data) {
            var res = {};
            res['data'] = [];
            var query = models.get(req.session.lastDb, "Customers", customerSchema).find();
            if (data && data.id)
                query.where({_id: objectId(data.id)});
            query.sort({"name.first": 1});
            query.exec(function (err, customers) {
                if (err) {
                    logWriter.log("customer.js getCustomersForDd customer.find " + err);
                    response.send(500, {error: "Can't find Customer"});
                } else {
                    res['data'] = customers;
                    response.send(res);
                }
            });
        },

        updateRefs: function (result, dbName, _id) {
            var InvoiceSchema;
            var Invoice;
            var PaymentSchema;
            var Payment;

            var fullName;

            if (dbName === CONSTANTS.WTRACK_DB_NAME) {

                InvoiceSchema = mongoose.Schemas['wTrackInvoice'];
                Invoice = models.get(dbName, 'wTrackInvoice', InvoiceSchema);

                PaymentSchema = mongoose.Schemas['wTrackPayment'];
                Payment = models.get(dbName, 'wTrackPayment', PaymentSchema);

                fullName = result.name.last ? (result.name.first + ' ' + result.name.last) : result.name.first;

                event.emit('updateName', _id, Invoice, 'supplier._id', 'supplier.name', fullName);
                event.emit('updateName', _id, Payment, 'supplier._id', 'supplier.fullName', fullName);

            }
        },

        update: function (req, _id, remove, data, res) {
            var dbName = req.session.lastDb;
            var self = this;

            try {
                delete data._id;
                delete data.createdBy;
                if (data.notes && data.notes.length != 0 && !remove) {
                    var obj = data.notes[data.notes.length - 1];
                    obj._id = mongoose.Types.ObjectId();
                    obj.date = new Date();
                    data.notes[data.notes.length - 1] = obj;
                }
                if (data.company && data.company._id) {
                    data.company = data.company._id;
                }
                if (data.department && data.department._id) {
                    data.department = data.department._id;
                }
                if (data.salesPurchases && data.salesPurchases.salesPerson && data.salesPurchases.salesPerson._id) {
                    data.salesPurchases.salesPerson = data.salesPurchases.salesPerson._id;
                }
                if (data.salesPurchases && data.salesPurchases.salesTeam && data.salesPurchases.salesTeam._id) {
                    data.salesPurchases.salesTeam = data.salesPurchases.salesTeam._id;
                }
                models.get(req.session.lastDb, "Customers", customerSchema).findByIdAndUpdate({_id: _id}, data, function (err, customers) {
                    if (err) {
                        logWriter.log("Customer.js update customer.update " + err);
                        res.send(500, {error: "Can't update customer"});
                    } else {
                        res.send(200, customers);

                        self.updateRefs(customers, dbName, _id);
                    }
                });
            }
            catch (Exception) {
                logWriter.log("Customer.js update " + Exception);
                res.send(500, {error: 'customer updated error'});
            }
        },

        updateOnlySelectedFields: function (req, _id, data, res) {
            var dbName = req.session.lastDb;
            var self = this;

            delete data._id;
            var fileName = data.fileName;
            delete data.fileName;
            if (data.notes && data.notes.length != 0) {
                var obj = data.notes[data.notes.length - 1];
                if (!obj._id)
                    obj._id = mongoose.Types.ObjectId();
                obj.date = new Date();
                if (!obj.author)
                    obj.author = req.session.uName;
                data.notes[data.notes.length - 1] = obj;
            }

            models.get(req.session.lastDb, 'Customers', customerSchema).findByIdAndUpdate({_id: _id}, {$set: data}, function (err, result) {
                if (err) {
                    logWriter.log("Customer.js update customer.update " + err);
                    res.send(500, {error: "Can't update Customer"});
                } else {
                    if (fileName) {
                        var os = require("os");
                        var osType = (os.type().split('_')[0]);
                        var path;
                        var dir;
                        switch (osType) {
                            case "Windows":
                            {
                                var newDirname = __dirname.replace("\\Modules", "");
                                while (newDirname.indexOf("\\") !== -1) {
                                    newDirname = newDirname.replace("\\", "\/");
                                }
                                path = newDirname + "\/uploads\/" + _id + "\/" + fileName;
                                dir = newDirname + "\/uploads\/" + _id;
                            }
                                break;
                            case "Linux":
                            {
                                var newDirname = __dirname.replace("/Modules", "");
                                while (newDirname.indexOf("\\") !== -1) {
                                    newDirname = newDirname.replace("\\", "\/");
                                }
                                path = newDirname + "\/uploads\/" + _id + "\/" + fileName;
                                dir = newDirname + "\/uploads\/" + _id;
                            }
                        }

                        fs.unlink(path, function (err) {
                            fs.readdir(dir, function (err, files) {
                                if (files && files.length === 0) {
                                    fs.rmdir(dir, function () {
                                    });
                                }
                            });
                        });

                    }
                    res.send(200, {success: 'Customer update', notes: result.notes});

                    self.updateRefs(result, dbName, _id);
                }
            });
        },

        remove: function (req, _id, res) {
            models.get(req.session.lastDb, "Customers", customerSchema).remove({_id: _id}, function (err, customer) {
                if (err) {
                    logWriter.log("Project.js remove project.remove " + err);
                    res.send(500, {error: "Can't remove customer"});
                } else {
                    res.send(200, {success: 'customer removed'});
                }
            });
        }
    }
};

module.exports = Customers;
