var Opportunities = function (models, event) {
    var mongoose = require('mongoose');
    var logWriter = require('../helpers/logWriter.js');
    var objectId = mongoose.Types.ObjectId;
    var opportunitiesSchema = mongoose.Schemas['Opportunitie'];
    var departmentSchema = mongoose.Schemas['Department'];
    var customerSchema = mongoose.Schemas['Customer'];
    var workflowSchema = mongoose.Schemas['workflow'];
    var fs = require('fs');

    function getTotalCount (req, response) {
        var res = {};
        var data = req.query;
        var filterObj = {};
        var or;
        var filter = data.filter ? data.filter : {};

        var contentType = req.params.contentType;
        var optionsObject = {};

        if (filter && typeof filter === 'object') {
            optionsObject['$and'] = [];
            filterObj['$or'] = [];
            or = filterObj['$or'];

            caseFilterOpp(filter, or);
        }

        if (data.filter && data.filter.workflow) {
            data.filter.workflow = data.filter.workflow.map(function (item) {
                return item === "null" ? null : item;
            });

            optionsObject['workflow'] = {$in: data.filter.workflow.objectID()};
        } else if (data && !data.newCollection) {
            optionsObject['workflow'] = {$in: []};
        }
        switch (contentType) {
            case ('Opportunities'):
                optionsObject['$and'].push({'isOpportunitie': true});

                if (data && data.filter) {
                    optionsObject['$and'].push(filterObj);
                }
                break;
            case ('Leads'):
                optionsObject['$and'].push({'isOpportunitie': false});

                if (data.filter.isConverted) {
                    optionsObject['isConverted'] = true;
                    optionsObject['isOpportunitie'] = true;
                }
                if (data && data.filter) {
                    optionsObject['$and'].push(filterObj);
                }
                break;
        }


        models.get(req.session.lastDb, "Department", departmentSchema).aggregate(
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
                    models.get(req.session.lastDb, "Opportunities", opportunitiesSchema).aggregate(
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
                                console.log(err);
                                response.send(500, {error: 'Server Eroor'});
                            }
                        }
                    );

                } else {
                    console.log(err);
                    response.send(500, {error: 'Server Eroor'});
                }
            });
    };

    function create (req, data, res) {
        try {
            if (!data) {
                logWriter.log('Opprtunities.create Incorrect Incoming Data');
                res.send(400, {error: 'Opprtunities.create Incorrect Incoming Data'});
                return;
            } else {
                savetoDb(data);
            }

            function savetoDb (data) {
                try {
                    var _opportunitie = new models.get(req.session.lastDb, "Opportunities", opportunitiesSchema)();
                    _opportunitie.isOpportunitie = (data.isOpportunitie) ? data.isOpportunitie : false;
                    if (data.name) {
                        _opportunitie.name = data.name;
                    }
                    if (data.jobkey) {
                        _opportunitie.jobkey = data.jobkey;
                    }
                    if (data.color) {
                        _opportunitie.color = data.color;
                    }
                    if (data.expectedRevenue) {
                        if (data.expectedRevenue.value) {
                            _opportunitie.expectedRevenue.value = data.expectedRevenue.value;
                        }
                        if (data.expectedRevenue.progress) {
                            _opportunitie.expectedRevenue.progress = data.expectedRevenue.progress;
                        }
                        if (data.expectedRevenue.currency) {
                            _opportunitie.expectedRevenue.currency = data.expectedRevenue.currency;
                        }
                    }
                    if (data.creationDate) {
                        _opportunitie.creationDate = data.creationDate;
                    }
                    if (data.company) {
                        if (data.company.id) {
                            _opportunitie.company = data.company.id;
                        } else if (data.company.name) {
                            _opportunitie.tempCompanyField = data.company.name;
                        }
                    }
                    if (data.customer) {
                        _opportunitie.customer = data.customer;
                    }
                    if (data.address) {
                        if (data.address.street) {
                            _opportunitie.address.street = data.address.street;
                        }
                        if (data.address.city) {
                            _opportunitie.address.city = data.address.city;
                        }
                        if (data.address.state) {
                            _opportunitie.address.state = data.address.state;
                        }
                        if (data.address.zip) {
                            _opportunitie.address.zip = data.address.zip;
                        }
                        if (data.address.country) {
                            _opportunitie.address.country = data.address.country;
                        }
                    }
                    if (data.contactName) {
                        if (data.contactName.first) {
                            _opportunitie.contactName.first = data.contactName.first;
                        }
                        if (data.contactName.last) {
                            _opportunitie.contactName.last = data.contactName.last;
                        }
                    }
                    if (data.email) {
                        _opportunitie.email = data.email;
                    }
                    if (data.phones) {
                        if (data.phones.phone) {
                            _opportunitie.phones.phone = data.phones.phone;
                        }
                        if (data.phones.mobile) {
                            _opportunitie.phones.mobile = data.phones.mobile;
                        }
                        if (data.fax) {
                            _opportunitie.phones.fax = data.phones.fax;
                        }
                    }
                    if (data.func) {
                        _opportunitie.func = data.func;
                    }
                    if (data.salesPerson) {
                        _opportunitie.salesPerson = data.salesPerson;
                    }
                    if (data.salesTeam) {
                        _opportunitie.salesTeam = data.salesTeam;
                    }
                    if (data.internalNotes) {
                        _opportunitie.internalNotes = data.internalNotes;
                    }
                    if (data.nextAction) {
                        if (data.nextAction.desc) {
                            _opportunitie.nextAction.desc = data.nextAction.desc;
                        }
                        if (data.nextAction.date) {
                            _opportunitie.nextAction.date = new Date(data.nextAction.date);
                        }
                    }
                    if (data.expectedClosing) {
                        _opportunitie.expectedClosing = new Date(data.expectedClosing);
                    }
                    if (data.priority) {
                        if (data.priority) {
                            _opportunitie.priority = data.priority;
                        }
                    }
                    if (data.categories) {
                        if (data.categories._id) {
                            _opportunitie.categories.id = data.categories._id;
                        }
                        if (data.categories.name) {
                            _opportunitie.categories.name = data.categories.name;
                        }
                    }
                    if (data.groups) {
                        _opportunitie.groups = data.groups;
                    }
                    if (data.whoCanRW) {
                        _opportunitie.whoCanRW = data.whoCanRW;
                    }
                    if (data.info) {
                        if (data.StartDate) {
                            _opportunitie.StartDate = data.StartDate;
                        }
                        if (data.EndDate) {
                            _opportunitie.EndDate = data.EndDate;
                        }
                        if (data.sequence) {
                            _opportunitie.sequence = data.sequence;
                        }
                        if (data.parent) {
                            _opportunitie.parent = data.parent;
                        }

                    }
                    if (data.workflow) {
                        _opportunitie.workflow = data.workflow;
                    }
                    if (data.active) {
                        _opportunitie.active = data.active;
                    }
                    if (data.optout) {
                        _opportunitie.optout = data.optout;
                    }
                    if (data.reffered) {
                        _opportunitie.reffered = data.reffered;
                    }
                    if (data.uId) {
                        _opportunitie.createdBy.user = data.uId;
                        //uId for edited by field on creation
                        _opportunitie.editedBy.user = data.uId;
                    }
                    if (data.campaign) {
                        _opportunitie.campaign = data.campaign;
                    }
                    if (data.source) {
                        _opportunitie.source = data.source;
                    }
                    event.emit('updateSequence', models.get(req.session.lastDb, "Opportunities", opportunitiesSchema), "sequence", 0, 0, _opportunitie.workflow, _opportunitie.workflow, true, false, function (sequence) {
                        _opportunitie.sequence = sequence;
                        _opportunitie.save(function (err, result) {
                            if (err) {
                                console.log("Opportunities.js create savetoDB _opportunitie.save " + err);
                                res.send(500, {error: 'Opportunities.save BD error'});
                            } else {
                                res.send(201, {
                                    success: {
                                        massage: 'A new Opportunities create success',
                                        id: result._id
                                    }
                                });
                            }
                        });
                    });
                } catch (error) {
                    console.log(error);
                    logWriter.log("Opportunities.js create savetoDB " + error);
                    res.send(500, {error: 'Opportunities.save  error'});
                }
            }

        } catch (exception) {
            console.log(exception);
            logWriter.log("Opportunities.js  " + exception);
            res.send(500, {error: 'opportunitie.save  error'});
        }
    };

    function getLeadsForChart (req, response, data) {
        var res = {};
        if (!data.dataRange) data.dataRange = 365;
        if (!data.dataItem) data.dataItem = "M";
        switch (data.dataItem) {
            case "M":
                data.dataItem = "$month";
                break;
            case "W":
                data.dataItem = "$week";
                break;
            case "D":
                data.dataItem = "$dayOfYear";
                break;
            case "DW":
                data.dataItem = "$dayOfWeek";
                break;
            case "DM":
                data.dataItem = "$dayOfMonth";
                break;

        }
        if (data.source) {

            var c = new Date() - data.dataRange * 24 * 60 * 60 * 1000;
            var a = new Date(c);
            models.get(req.session.lastDb, "Opportunities", opportunitiesSchema).aggregate({
                $match: {
                    $and: [{
                        createdBy: {$ne: null},
                        source: {$ne: ""},
                        $or: [{isConverted: true}, {isOpportunitie: false}]
                    }, {'createdBy.date': {$gte: a}}]
                }
            }, {
                $group: {
                    _id: {source: "$source", isOpportunitie: "$isOpportunitie"},
                    count: {$sum: 1}
                }
            }, {
                $project: {
                    "source": "$_id.source",
                    count: 1,
                    "isOpp": "$_id.isOpportunitie",
                    _id: 0
                }
            }).exec(function (err, result) {
                if (err) {
                    console.log(err);
                    logWriter.log('Opportunities.js chart' + err);
                    response.send(500, {error: "Can't get chart"});
                } else {
                    res['data'] = result;
                    response.send(res);
                }

            });
        } else {
            var item = data.dataItem;
            var myItem = {};
            myItem["$project"] = {isOpportunitie: 1, convertedDate: 1};
            myItem["$project"]["dateBy"] = {};
            myItem["$project"]["dateBy"][data.dataItem] = "$convertedDate";
            if (data.dataItem == "$dayOfYear") {
                myItem["$project"]["year"] = {};
                myItem["$project"]["year"]["$year"] = "$convertedDate";
            }
            var c = new Date() - data.dataRange * 24 * 60 * 60 * 1000;
            var a = new Date(c);
            models.get(req.session.lastDb, "Opportunities", opportunitiesSchema).aggregate(
                {
                    $match: {
                        $and: [{
                            createdBy: {$ne: null},
                            $or: [{isConverted: true}, {isOpportunitie: false}]
                        },
                            {
                                'createdBy.date': {$gte: a}
                            }]
                    }
                },
                myItem,
                {
                    $group: {
                        _id: {dateBy: "$dateBy", isOpportunitie: "$isOpportunitie", year: "$year"},
                        count: {$sum: 1},
                        date: {$push: "$convertedDate"}
                    }
                },
                {
                    $project: {
                        "source": "$_id.dateBy",
                        count: 1,
                        date: 1,
                        year: "$_id.year",
                        "isOpp": "$_id.isOpportunitie",
                        _id: 0
                    }
                },
                {
                    $sort: {year: 1, source: 1}
                }
            ).exec(function (err, result) {
                    if (err) {
                        console.log(err);
                        logWriter.log('Opportunities.js chart' + err);
                        response.send(500, {error: "Can't get chart"});
                    } else {
                        res['data'] = result;
                        response.send(res);
                    }

                });
        }
    }

    function get (req, response) {
        var res = {};
        res['data'] = [];
        var query = models.get(req.session.lastDb, "Opportunities", opportunitiesSchema).find({isOpportunitie: true});
        query.sort({name: 1});
        query.populate('company customer salesPerson salesTeam workflow').
            populate('createdBy.user').
            populate('editedBy.user');

        query.exec(function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log('Opportunities.js get job.find' + err);
                response.send(500, {error: "Can't find Opportunities"});
            } else {
                res['data'] = result;
                response.send(res);
            }
        });
    };

    function getById (req, id, response) {
        var query = models.get(req.session.lastDb, "Opportunities", opportunitiesSchema).findById(id);
        query.populate('company customer salesPerson salesTeam workflow').
            populate('groups.users').
            populate('groups.group').
            populate('createdBy.user').
            populate('editedBy.user').
            populate('groups.owner', '_id login');


        query.exec(function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log('Opportunities.js get job.find' + err);
                response.send(500, {error: "Can't find Opportunities"});
            } else {
                response.send(result);
            }
        });
    };

    function ConvertType(array, type) {
        if (type === 'integer') {
            for (var i = array.length - 1; i >= 0; i--) {
                array[i] = parseInt(array[i]);
            }
        }
    };

    function caseFilterOpp(filter, content) {
        var condition;

        for (var key in filter) {
            condition = filter[key];

            switch (key) {
                case 'Name':
                    content.push({'name': {$in: condition}});
                    break;
                case 'workflow':
                    content.push({ 'workflow': {$in: condition.objectID()}});
                    break;
                case 'Creation date':
                    content.push({
                        'creationDate': {
                            $gte: new Date(condition[0].start),
                            $lte: new Date(condition[0].end)
                        }
                    });
                    break;
                case 'Next action':
                    if (!condition.length) condition = [''];
                    content.push({'nextAction.desc': {$in: condition}});
                    break;
                case 'Expected revenue':
                    ConvertType(condition, 'integer');
                    content.push({'expectedRevenue.value': {$in: condition}});
                    break;
            }
        }
    };

    function getFilter (req, response) {
        var res = {};
        var or;
        var filterObj;
        var optionsObject = {};

        res['data'] = [];
        var data = {};
        for (var i in req.query) {
            data[i] = req.query[i];
        }

        switch (data.contentType) {
            case ('Opportunities'):
            {
                optionsObject['$and'] = [];
                optionsObject['$and'].push({'isOpportunitie': true});

                if (data && data.filter) {
                    filterObj = {};
                    optionsObject['$and'].push(filterObj);
                    filterObj['$or'] = [];
                    or = filterObj['$or'];

                    caseFilterOpp(data.filter, or);

                    /*for (var key in data.filter) {
                        condition = data.filter[key];

                        switch (key) {
                            case 'Name':
                                or.push({ 'name': {$in: condition}});
                                break;
                            case 'Creation date':
                                or.push({ 'creationDate': {$gte: new Date(condition[0].start), $lte: new Date(condition[0].end)}});
                                break;
                            case 'Next action':
                                if (!condition.length) condition = [''];
                                or.push({ 'nextAction.desc': {$in: condition}});
                                break;
                            case 'Expected revenue':
                                ConvertType(condition, 'integer');
                                or.push({ 'expectedRevenue.value': {$in: condition}});
                                break;
                        }
                    }*/
                    if (!or.length) {
                        delete filterObj['$or']
                    }
                }
            }
                break;
            case ('Leads'):
            {
                optionsObject['$and'] = [];
                optionsObject['$and'].push({'isOpportunitie': false});
                if (data.filter.isConverted) {
                    optionsObject['isConverted'] = true;
                    optionsObject['isOpportunitie'] = true;
                }
                if (data && data.filter) {
                    filterObj = {};
                    optionsObject['$and'].push(filterObj);
                    filterObj['$or'] = [];
                    or = filterObj['$or'];

                    caseFilterOpp(data.filter, or);

                    /*for (var key in data.filter) {
                        condition = data.filter[key];

                        switch (key) {
                            case 'name':
                                or.push({ 'name': {$in: condition}});
                                break;
                            case 'creationDate':
                                or.push({ 'creationDate': {$gte: new Date(condition[0].start), $lte: new Date(condition[0].end)}});
                                break;
                            case 'nextAction':
                                if (!condition.length) condition = [''];
                                or.push({ 'nextAction.desc': {$in: condition}});
                                break;
                            case 'expectedRevenue':
                                ConvertType(condition, 'integer');
                                or.push({ 'expectedRevenue.value': {$in: condition}});
                                break;

                        }
                    }*/
                    if (!or.length) {
                        delete filterObj['$or']
                    }
                }
            }
                break;
        }

        models.get(req.session.lastDb, "Department", departmentSchema).aggregate(
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

                    models.get(req.session.lastDb, "Opportunities", opportunitiesSchema).aggregate(
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
                                var query = models.get(req.session.lastDb, "Opportunities", opportunitiesSchema).find().where('_id').in(result);
                                if (data.sort) {
                                    query.sort(data.sort);
                                } else {
                                    query.sort({"editedBy.date": -1});
                                }
                                if (data && data.filter && data.filter.workflow) {
                                    data.filter.workflow = data.filter.workflow.map(function (item) {
                                        return item === "null" ? null : item;
                                    });
                                }
                                switch (data.contentType) {

                                    case ('Opportunities'):
                                    {
                                        if (data && data.filter && data.filter.workflow) {
                                            query.where('workflow').in(data.filter.workflow);
                                        } else if (data && (!data.newCollection || data.newCollection === 'false')) {
                                            query.where('workflow').in([]);
                                        }
                                        query.populate('customer', 'name').
                                            populate('workflow', '_id name status').
                                            populate('salesPerson', 'name').
                                            populate('createdBy.user', 'login').
                                            populate('editedBy.user', 'login');
                                    }
                                        break;
                                    case ('Leads'):
                                    {
                                        if (data && data.filter && data.filter.workflow) {
                                            query.where('workflow').in(data.filter.workflow);
                                        } else if (data && (!data.newCollection || data.newCollection === 'false')) {
                                            query.where('workflow').in([]);
                                        }

                                        query.select("_id createdBy editedBy name workflow contactName phones campaign source email contactName").
                                            populate('company', 'name').
                                            populate('workflow', "name status").
                                            populate('createdBy.user', 'login').
                                            populate('editedBy.user', 'login');
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
                                            console.log(error);
                                        }
                                    });
                            } else {
                                console.log(err);
                            }
                        }
                    );
                } else {
                    console.log(err);
                }
            });
    };

    function update (req, _id, data, res) {
        if (data.company && data.company._id) {
            data.company = data.company._id;
        } else if (data.company) {
            data.tempCompanyField = data.company;
            delete data.company;
        } else {
            delete data.company;
        }
        if (data.customer && data.customer._id) {
            data.customer = data.customer._id;
        }
        if (data.salesPerson && data.salesPerson._id) {
            data.salesPerson = data.salesPerson._id;
        }
        if (data.salesTeam && data.salesTeam._id) {
            data.salesTeam = data.salesTeam._id;
        }
        if (data.workflow && data.workflow._id) {
            data.workflow = data.workflow._id;
        }
        if (data.groups && data.groups.group) {
            data.groups.group.forEach(function (group, index) {
                if (group._id) data.groups.group[index] = objectId(group._id.toString());
            });
        }
        if (data.groups && data.groups.users) {
            data.groups.users.forEach(function (user, index) {
                if (user._id) data.groups.users[index] = objectId(user._id.toString());
            });
        }

        if (data.workflowForList || data.workflowForKanban) {
            data = {
                $set: {
                    workflow: data.workflow
                }
            };
        }
        event.emit('updateSequence', models.get(req.session.lastDb, "Opportunities", opportunitiesSchema), "sequence", 0, 0, data.workflow, data.workflow, true, false, function (sequence) {
            if (!data.info) data.info = {};
            data.sequence = sequence;
            models.get(req.session.lastDb, "Opportunities", opportunitiesSchema).findByIdAndUpdate(_id, data, function (err, result) {

                if (err) {
                    console.log(err);
                    logWriter.log("Opportunities.js update opportunitie.update " + err);
                    res.send(500, {error: "Can't update Opportunities"});
                } else {
                    res.send(200, {success: 'Opportunities updated success', result: result});
                }
            });
        });
    }// end update

    function updateLead (req, _id, data, res) {

        function updateOpp () {
            var createPersonCustomer = function (company) {
                if (data.contactName && (data.contactName.first || data.contactName.last)) {
                    var _person = {
                        name: data.contactName,
                        email: data.email,
                        phones: data.phones,
                        company: company._id,
                        salesPurchases: {
                            isCustomer: true,
                            salesPerson: data.salesPerson
                        },
                        type: 'Person',
                        createdBy: {user: req.session.uId}
                    };
                    models.get(req.session.lastDb, "Customers", customerSchema).find({$and: [{'name.first': data.contactName.first}, {'name.last': data.contactName.last}]}, function (err, _persons) {
                        if (err) {
                            console.log(err);
                            logWriter.log("Opportunities.js update opportunitie.update " + err);
                        } else if (_persons.length > 0) {
                            if (_persons[0].salesPurchases && !_persons[0].salesPurchases.isCustomer) {
                                models.get(req.session.lastDb, "Customers", customerSchema).update({_id: _persons[0]._id}, {$set: {'salesPurchases.isCustomer': true}}, function (err, success) {
                                    if (err) {
                                        console.log(err);
                                        logWriter.log("Opportunities.js update opportunitie.update " + err);
                                    }
                                });
                            }
                        } else {
                            var _Person = new models.get(req.session.lastDb, "Customers", customerSchema)(_person);
                            _Person.save(function (err, _res) {
                                if (err) {
                                    console.log(err);
                                    logWriter.log("Opportunities.js update opportunitie.update " + err);
                                }
                            });
                        }
                    });
                }
            };

            if (data.company && data.company._id) {
                data.company = data.company._id;
            } else if (data.company) {
                data.tempCompanyField = data.company;
                delete data.company;
            } else {
                delete data.company;
            }
            if (data.groups && data.groups.group) {
                data.groups.group.forEach(function (group, index) {
                    if (group._id) data.groups.group[index] = objectId(group._id.toString());
                });
            }
            if (data.groups && data.groups.users) {
                data.groups.users.forEach(function (user, index) {
                    if (user._id) data.groups.users[index] = objectId(user._id.toString());
                });
            }

            event.emit('updateSequence', models.get(req.session.lastDb, "Opportunities", opportunitiesSchema), "sequence", 0, 0, data.workflow, data.workflow, true, false, function (sequence) {
                data.sequence = sequence;
                models.get(req.session.lastDb, "Opportunities", opportunitiesSchema).findByIdAndUpdate(_id, {$set: data}, function (err, result) {
                    if (err) {
                        console.log(err);
                        logWriter.log("Opportunities.js update opportunitie.update " + err);
                        res.send(500, {error: "Can't update Opportunities"});
                    } else {

                        if (data.createCustomer) {
                            if (data.tempCompanyField) {
                                var _company = {
                                    name: {
                                        first: data.tempCompanyField,
                                        last: ''
                                    },
                                    address: data.address,
                                    salesPurchases: {
                                        isCustomer: true,
                                        salesPerson: data.salesPerson
                                    },
                                    type: 'Company',
                                    createdBy: {user: req.session.uId}
                                };
                                models.get(req.session.lastDb, 'Customers', customerSchema).find({'name.first': data.tempCompanyField}, function (err, companies) {
                                    if (err) {
                                        console.log(err);
                                        logWriter.log("Opportunities.js update opportunitie.update " + err);
                                    } else if (companies.length > 0) {
                                        if (companies[0].salesPurchases && !companies[0].salesPurchases.isCustomer) {
                                            models.get(req.session.lastDb, 'Customers', customerSchema).update({_id: companies[0]._id}, {$set: {'salesPurchases.isCustomer': true}}, function (err, success) {
                                                if (success) {
                                                    createPersonCustomer(companies[0]);
                                                }
                                            });
                                        }
                                    } else {
                                        var _Company = new models.get(req.session.lastDb, 'Customers', customerSchema)(_company);
                                        _Company.save(function (err, _res) {
                                            if (err) {
                                                console.log(err);
                                                logWriter.log("Opportunities.js update opportunitie.update " + err);
                                            } else {
                                                models.get(req.session.lastDb, "Opportunities", opportunitiesSchema).update({_id: _id}, {
                                                    $set: {
                                                        company: _res._id,
                                                        customer: _res._id
                                                    }
                                                }, function (err, result) {
                                                    if (err) {
                                                        console.log(err);
                                                    }
                                                });
                                                createPersonCustomer(_res);
                                            }
                                        });
                                    }
                                });

                            } else {                                              //кінець кастомер Компанія
                                createPersonCustomer({});
                            }
                        }
                        res.send(200, {success: 'Opportunities updated success', result: result});
                    }
                });
            });
        };

        try {
            delete data._id;
            delete data.createdBy;
            if (data.isOpportunitie && data.isConverted) {
                models.get(req.session.lastDb, 'workflows', workflowSchema).find({wId: 'Opportunities'}).sort({sequence: 1}).exec(function (err, _workflow) {
                    if (_workflow.length !== 0) {
                        data.workflow = _workflow[_workflow.length - 1]._id;
                    }
                    updateOpp();
                });
            } else {
                updateOpp();
            }

        }
        catch (exception) {
            console.log(exception);
            logWriter.log("Opportunities.js update " + exception);
            res.send(500, {error: 'Opportunities updated error'});
        }
    }

    function updateOnlySelectedFields (req, _id, data, res) {
        var fileName = data.fileName;
        delete data.fileName;
        if (data.workflow && data.sequenceStart && data.workflowStart) {
            if (data.sequence == -1) {
                event.emit('updateSequence', models.get(req.session.lastDb, "Opportunities", opportunitiesSchema), "sequence", data.sequenceStart, data.sequence, data.workflowStart, data.workflowStart, false, true, function (sequence) {
                    event.emit('updateSequence', models.get(req.session.lastDb, "Opportunities", opportunitiesSchema), "sequence", data.sequenceStart, data.sequence, data.workflow, data.workflow, true, false, function (sequence) {
                        data.sequence = sequence;
                        if (data.workflow == data.workflowStart)
                            data.sequence -= 1;
                        models.get(req.session.lastDb, "Opportunities", opportunitiesSchema).findByIdAndUpdate(_id, {$set: data}, function (err, result) {
                            if (!err) {
                                res.send(200, {success: 'Opportunities updated', sequence: result.sequence});
                            } else {
                                res.send(500, {error: "Can't update Opportunitie"});
                            }

                        });

                    });
                });
            } else {
                event.emit('updateSequence', models.get(req.session.lastDb, "Opportunities", opportunitiesSchema), "sequence", data.sequenceStart, data.sequence, data.workflowStart, data.workflow, false, false, function (sequence) {
                    delete data.sequenceStart;
                    delete data.workflowStart;
                    data.info = {};
                    data.sequence = sequence;
                    models.get(req.session.lastDb, "Opportunities", opportunitiesSchema).findByIdAndUpdate(_id, {$set: data}, function (err, result) {
                        if (!err) {
                            res.send(200, {success: 'Opportunities updated'});
                        } else {
                            res.send(500, {error: "Can't update Opportunitie"});
                        }

                    });
                });
            }
        } else {
            var query = (data.jobkey) ? {$and: [{name: data.name}, {jobkey: data.jobkey}]} : {name: data.name};
            models.get(req.session.lastDb, "Opportunities", opportunitiesSchema).find(query, function (error, doc) {
                if (error) {
                    console.log(error);
                    logWriter.log('Opprtunities.js. create opportunitie.find' + error);
                    res.send(500, {error: 'Opprtunities.create find error'});
                }
                if (data.notes && data.notes.length != 0) {
                    var obj = data.notes[data.notes.length - 1];
                    if (!obj._id)
                        obj._id = mongoose.Types.ObjectId();
                    obj.date = new Date();
                    if (!obj.author)
                        obj.author = req.session.uName;
                    data.notes[data.notes.length - 1] = obj;
                }

                models.get(req.session.lastDb, "Opportunities", opportunitiesSchema).findByIdAndUpdate(_id, {$set: data}, function (err, result) {
                    if (!err) {
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
                                console.log(err);
                                fs.readdir(dir, function (err, files) {
                                    if (files.length === 0) {
                                        fs.rmdir(dir, function () {
                                        });
                                    }
                                });
                            });

                        }
                        res.send(200, {
                            success: 'Opportunities updated',
                            notes: result.notes,
                            sequence: result.sequence
                        });
                    } else {
                        res.send(500, {error: "Can't update Opportunitie"});
                    }

                });
            });

        }

    }

    function getFilterOpportunitiesForMiniView (req, data, response) {
        var res = {};
        res['data'] = [];
        models.get(req.session.lastDb, "Department", departmentSchema).aggregate(
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
                    var arrOr = [];
                    if (data.person) {
                        arrOr.push({"customer": objectId(data.person)});
                    }
                    if (data.company) {
                        arrOr.push({"customer": objectId(data.company)});
                        arrOr.push({"company": objectId(data.company)});
                    }

                    models.get(req.session.lastDb, "Opportunities", opportunitiesSchema).aggregate(
                        {
                            $match: {
                                $and: [
                                    {
                                        isOpportunitie: true
                                    },
                                    {
                                        $or: arrOr
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
                                var query = models.get(req.session.lastDb, "Opportunities", opportunitiesSchema).find().where('_id').in(result);
                                if (data.onlyCount.toString().toLowerCase() == "true") {

                                    query.count(function (error, _res) {
                                        if (!error) {
                                            res['listLength'] = _res;
                                            response.send(res);
                                        } else {
                                            console.log(error);
                                        }
                                    });
                                } else {

                                    if (data && data.status && data.status.length > 0)
                                        query.where('workflow').in(data.status);
                                    query.select("_id name expectedRevenue.currency expectedRevenue.value nextAction.date workflow");

                                    query.populate('workflow', 'name').
                                        skip((data.page - 1) * data.count).
                                        limit(data.count);

                                    query.exec(function (error, _res) {
                                        if (!error) {
                                            res['data'] = _res;
                                            res['listLength'] = _res.length;
                                            response.send(res);
                                        } else {
                                            console.log(error);
                                        }
                                    });

                                }


                            } else {
                                console.log(err);
                            }
                        }
                    );
                } else {
                    console.log(err);
                }
            });
    }

    function getFilterOpportunitiesForKanban (req, data, response) {
        var res = {};
        var condition;
        var or;
        var filterObj;
        var optionsObject = {};
        function ConvertType(array, type) {
            if (type === 'integer') {
                for (var i = array.length - 1; i >= 0; i--) {
                    array[i] = parseInt(array[i]);
                }
            }
        };

        res['data'] = [];
        res['workflowId'] = data.workflowId;
        models.get(req.session.lastDb, "Department", departmentSchema).aggregate(
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

                    if (data && data.filter) {
                        optionsObject['$or'] = [];
                        or = optionsObject['$or'];

                        for (var key in data.filter) {
                            condition = data.filter[key];

                            switch (key) {
                                case 'Name':
                                    or.push({ 'name': {$in: condition}});
                                    break;
                                case 'CreationDate':
                                    or.push({ 'creationDate': {$gte: new Date(condition[0].start), $lte: new Date(condition[0].end)}});
                                    break;
                                case 'NextAction':
                                    if (!condition.length) condition = [''];
                                    or.push({ 'nextAction.desc': {$in: condition}});
                                    break;
                                case 'ExpectedRevenue':
                                    ConvertType(condition, 'integer');
                                    or.push({ 'expectedRevenue.value': {$in: condition}});
                                    break;

                            }
                        }
                        if (!or.length) {
                            delete filterObj['$or']
                        }
                    }

                    models.get(req.session.lastDb, "Opportunities", opportunitiesSchema).aggregate(
                        {
                            $match: {
                                $and: [
                                    {$and: [
                                        {
                                            isOpportunitie: true
                                        },
                                        optionsObject
                                    ]},
                                    {
                                        workflow: objectId(data.workflowId)
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
                        function (err, responseOpportunities) {
                            if (!err) {
                                var query = models.get(req.session.lastDb, "Opportunities", opportunitiesSchema).
                                    where('_id').in(responseOpportunities).
                                    select("_id customer salesPerson workflow editedBy.date name nextAction expectedRevenue sequence").
                                    populate('customer', 'name').
                                    populate('salesPerson', 'name').
                                    populate('workflow', '_id').
                                    sort({'sequence': -1}).
                                    limit(req.session.kanbanSettings.opportunities.countPerPage).
                                    exec(function (err, result) {
                                        if (!err) {
                                            res['data'] = result;
                                            res['workflowId'] = data.workflowId;
                                            res['fold'] = (req.session.kanbanSettings.opportunities.foldWorkflows && req.session.kanbanSettings.opportunities.foldWorkflows.indexOf(data.workflowId.toString()) !== -1);
                                            response.send(res);
                                        } else {
                                            logWriter.log("Opportunitie.js getFilterOpportunitiesForKanban opportunitie.find" + err);
                                            response.send(500, {error: "Can't find Opportunitie"});
                                        }
                                    });
                            } else {
                                logWriter.log("Opportunitie.js getFilterOpportunitiesForKanban task.find " + err);
                                response.send(500, {error: "Can't group Opportunitie"});
                            }
                        });
                } else {
                    console.log(err);
                }
            });
    };

    function getCollectionLengthByWorkflows (req, res) {
        var data = {};
        data['showMore'] = false;
        models.get(req.session.lastDb, "Department", departmentSchema).aggregate(
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

                    models.get(req.session.lastDb, "Opportunities", opportunitiesSchema).aggregate(
                        {
                            $match: {
                                $and: [
                                    {
                                        isOpportunitie: true
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
                                _id: 1,
                                workflow: 1
                            }
                        },
                        {
                            $group: {
                                _id: "$workflow",
                                count: {$sum: 1}
                            }
                        },
                        function (err, responseOpportunities) {
                            if (!err) {
                                responseOpportunities.forEach(function (object) {
                                    if (object.count > req.session.kanbanSettings.opportunities.countPerPage) data['showMore'] = true;
                                });
                                data['arrayOfObjects'] = responseOpportunities;
                                res.send(data);
                            } else {
                                console.log(err);
                            }
                        });
                } else {
                    console.log(err);
                }
            });
    }

    function remove (req, _id, res) {
        models.get(req.session.lastDb, "Opportunities", opportunitiesSchema).findByIdAndRemove(_id, function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log("Opportunities.js remove opportunitie.remove " + err);
                res.send(500, {error: "Can't remove Opportunities"});
            } else {
                if (result && result.isOpportunitie) {
                    event.emit('updateSequence', models.get(req.session.lastDb, "Opportunities", opportunitiesSchema), "sequence", result.sequence, 0, result.workflow, result.workflow, false, true);
                }
                res.send(200, {success: 'Opportunities removed'});
            }
        });
    }



    return {
        getTotalCount: getTotalCount,
        create: create,
        get: get,
        getCollectionLengthByWorkflows: getCollectionLengthByWorkflows,
        getById: getById,
        getFilterOpportunitiesForKanban: getFilterOpportunitiesForKanban,
        getFilterOpportunitiesForMiniView: getFilterOpportunitiesForMiniView,
        getFilter: getFilter,
        getLeadsForChart: getLeadsForChart,
        update: update,
        updateLead: updateLead,
        updateOnlySelectedFields: updateOnlySelectedFields,
        remove: remove
    }
};
module.exports = Opportunities;
