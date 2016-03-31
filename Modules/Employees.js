// JavaScript source code
var Employee = function (event, models) {
    var mongoose = require('mongoose');
    var logWriter = require('../helpers/logWriter.js');
    var department = mongoose.Schemas['Department'];
    var objectId = mongoose.Types.ObjectId;
    var employeeSchema = mongoose.Schemas['Employee'];
    var fs = require('fs');
    var moment = require('../public/js/libs/moment/moment');
    var _ = require('../node_modules/underscore');

    var CONSTANTS = require('../constants/mainConstants');
    var Payroll = require('../handlers/payroll');
    var payrollHandler = new Payroll(models);
    var ids = ['52203e707d4dba8813000003', '563f673270bbc2b740ce89ae', '55b8cb7d0ce4affc2a0015cb', '55ba2ef1d79a3a343900001c', '560255d1638625cf32000005'];

    function getTotalCount(req, response) {
        var res = {};
        var data = {};

        var condition;
        var resArray = [];
        var filtrElement = {};
        var key;
        var project;
        var projectSecond;
        var Employees = models.get(req.session.lastDb, "Employees", employeeSchema);

        for (var i in
            req.query) {
            data[i] = req.query[i];
        }
        res['showMore'] = false;

        var contentType = req.params.contentType;
        var optionsObject = {};
        if (data.filter && data.filter.letter) {
            optionsObject['name.last'] = new RegExp('^[' + data.filter.letter.toLowerCase() + data.filter.letter.toUpperCase() + '].*');
        }

        if (data.filter && data.filter.workflow) {
            data.filter.workflow = data.filter.workflow.map(function (item) {
                return item === "null" ? null : item;
            });
            optionsObject['workflow'] = {$in: data.filter.workflow.objectID()};
        } else if (data && !data.newCollection) {
            optionsObject['workflow'] = {$in: []};
        }

        project = {
            manager    : {$arrayElemAt: ["$manager", 0]},
            jobPosition: {$arrayElemAt: ["$jobPosition", 0]},
            department : {$arrayElemAt: ["$department", 0]},
            name       : 1,
            isEmployee : 1
        };

        projectSecond = {
            manager    : 1,
            jobPosition: 1,
            department : 1,
            name       : 1,
            isEmployee : 1
        };

        switch (contentType) {
            case ('Employees'):
            {

                for (var filterName in
                    data.filter) {
                    condition = data.filter[filterName]['value'];
                    key = data.filter[filterName]['key'];

                    switch (filterName) {
                        case 'name':
                            filtrElement[key] = {$in: condition.objectID()};
                            resArray.push(filtrElement);
                            break;
                        case 'letter':
                            filtrElement['name.last'] = new RegExp('^[' + data.filter.letter.toLowerCase() + data.filter.letter.toUpperCase() + '].*');
                            resArray.push(filtrElement);
                            break;
                        case 'department':
                            filtrElement[key] = {$in: condition.objectID()};
                            resArray.push(filtrElement);
                            break;
                        case 'manager':
                            filtrElement[key] = {$in: condition.objectID()};
                            resArray.push(filtrElement);
                            break;
                        case 'jobPosition':
                            filtrElement[key] = {$in: condition.objectID()};
                            resArray.push(filtrElement);
                            break;
                    }
                }
                ;

                resArray.push({'isEmployee': true});

                if (resArray.length) {

                    if (data && data.filter && data.filter.condition === 'or') {
                        optionsObject['$or'] = resArray;
                    } else {
                        optionsObject['$and'] = resArray;
                    }
                }
            }
                break;
            case ('Applications'):
            {
                for (var filterName in
                    data.filter) {
                    condition = data.filter[filterName]['value'];
                    key = data.filter[filterName]['key'];

                    switch (filterName) {
                        case 'name':
                            filtrElement[key] = {$in: condition.objectID()};
                            resArray.push(filtrElement);
                            break;
                        case 'letter':
                            filtrElement['name.last'] = new RegExp('^[' + data.filter.letter.toLowerCase() + data.filter.letter.toUpperCase() + '].*');
                            resArray.push(filtrElement);
                            break;
                        case 'department':
                            filtrElement[key] = {$in: condition.objectID()};
                            resArray.push(filtrElement);
                            break;
                        case 'manager':
                            filtrElement[key] = {$in: condition.objectID()};
                            resArray.push(filtrElement);
                            break;
                        case 'jobPosition':
                            filtrElement[key] = {$in: condition.objectID()};
                            resArray.push(filtrElement);
                            break;
                    }
                }
                ;

                resArray.push({'isEmployee': false});

                if (resArray.length) {

                    if (data && data.filter && data.filter.condition === 'or') {
                        optionsObject['$or'] = resArray;
                    } else {
                        optionsObject['$and'] = resArray;
                    }
                }
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
                    Employees.aggregate(
                        {
                            $match: {
                                $and: [
                                    //  optionsObject,
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
                        }
                        ,
                        function (err, result) {
                            if (!optionsObject['$and']) {
                                optionsObject['$and'] = [];
                            }

                            optionsObject['$and'].push({_id: {$in: _.pluck(result, '_id')}});

                            Employees.aggregate([{
                                $lookup: {
                                    from                   : "Employees",
                                    localField             : "manager",
                                    foreignField: "_id", as: "manager"
                                }
                            }, {
                                $lookup: {
                                    from                   : "JobPosition",
                                    localField             : "jobPosition",
                                    foreignField: "_id", as: "jobPosition"
                                }
                            }, {
                                $lookup: {
                                    from                   : "Department",
                                    localField             : "department",
                                    foreignField: "_id", as: "department"
                                }
                            }, {
                                $lookup: {
                                    from                   : "workflows",
                                    localField             : "workflow",
                                    foreignField: "_id", as: "workflow"
                                }
                            }, {
                                $project: project
                            }, {
                                $project: projectSecond
                            }, {
                                $match: optionsObject
                            }
                            ], function (err, result) {
                                if (!err) {
                                    if (data.currentNumber && data.currentNumber < result.length) {
                                        res['showMore'] = true;
                                    }
                                    res['count'] = result.length;
                                    response.send(res);
                                } else {
                                    console.log(err);
                                    logWriter.log("Employees.js getTotalCount " + err);
                                    response.send(500, {error: 'Server Eroor'});
                                }
                            });
                        }
                    );

                } else {
                    console.log(err);
                    logWriter.log("Employees.js getTotalCount " + err);
                    response.send(500, {error: 'Server Eroor'});
                }
            });
    };

    function getAge(birthday) {
        var today = new Date();
        var years;

        birthday = new Date(birthday);
        years = today.getFullYear() - birthday.getFullYear();

        birthday.setFullYear(today.getFullYear());

        if (today < birthday) {
            years--;
        }
        return (years < 0) ? 0 : years;
    };

    function getDate(date) {
        var _date = new Date(date);
        var currentTimeZoneOffsetInMiliseconds = -_date.getTimezoneOffset() * 60 * 1000;
        var valaueOf_date = _date.valueOf();
        valaueOf_date += currentTimeZoneOffsetInMiliseconds;
        return new Date(valaueOf_date);
    };

    function create(req, data, res) {
        try {
            if (!data) {
                logWriter.log('Employees.create Incorrect Incoming Data');
                res.send(400, {error: 'Employees.create Incorrect Incoming Data'});
                return;
            } else {
                savetoDb(data);
            }

            function savetoDb(data) {
                var _employee = new models.get(req.session.lastDb, "Employees", employeeSchema)();
                if (data.uId) {
                    _employee.createdBy.user = data.uId;
                    //uId for edited by field on creation
                    _employee.editedBy.user = data.uId;
                }
                if (data.isEmployee) {
                    _employee.isEmployee = data.isEmployee;
                }
                if (data.name) {
                    if (data.name.first) {
                        _employee.name.first = data.name.first;
                    }
                    if (data.name.last) {
                        _employee.name.last = data.name.last;
                    }
                }
                if (data.gender) {
                    _employee.gender = data.gender;
                }
                if (data.marital) {
                    _employee.marital = data.marital;
                }
                if (data.subject) {
                    _employee.subject = data.subject;
                }
                if (data.tags) {
                    _employee.tags = data.tags;
                }
                if (data.workAddress) {
                    if (data.workAddress.street) {
                        _employee.workAddress.street = data.workAddress.street;
                    }
                    if (data.workAddress.city) {
                        _employee.workAddress.city = data.workAddress.city;
                    }
                    if (data.workAddress.state) {
                        _employee.workAddress.state = data.workAddress.state;
                    }
                    if (data.workAddress.zip) {
                        _employee.workAddress.zip = data.workAddress.zip;
                    }
                    if (data.workAddress.country) {
                        _employee.workAddress.country = data.workAddress.country;
                    }
                }
                if (data.workEmail) {
                    _employee.workEmail = data.workEmail;
                }
                if (data.personalEmail) {
                    _employee.personalEmail = data.personalEmail;
                }
                if (data.skype) {
                    _employee.skype = data.skype;
                }
                if (data.workPhones) {
                    if (data.workPhones.phone) {
                        _employee.workPhones.phone = data.workPhones.phone;
                    }
                    if (data.workPhones.mobile) {
                        _employee.workPhones.mobile = data.workPhones.mobile;
                    }
                }
                if (data.social) {
                    if (data.social.LI) {
                        _employee.social.LI = data.social.LI;
                    }
                    if (data.social.FB) {
                        _employee.social.FB = data.social.FB;
                    }
                }
                if (data.officeLocation) {
                    _employee.officeLocation = data.officeLocation;
                }
                if (data.relatedUser) {
                    _employee.relatedUser = data.relatedUser;
                }
                if (data.visibility) {
                    _employee.visibility = data.visibility;
                }
                if (data.department) {
                    _employee.department = data.department;
                }
                if (data.groups) {
                    _employee.groups = data.groups;
                }
                if (data.whoCanRW) {
                    _employee.whoCanRW = data.whoCanRW;
                }
                if (data.jobPosition) {
                    _employee.jobPosition = data.jobPosition;
                }
                if (data.manager) {
                    _employee.manager = data.manager;
                }
                if (data.coach) {
                    _employee.coach = data.coach;
                }
                if (data.nationality) {
                    _employee.nationality = data.nationality;
                }
                if (data.identNo) {
                    _employee.identNo = data.identNo;
                }
                if (data.passportNo) {
                    _employee.passportNo = data.passportNo;
                }
                if (data.bankAccountNo) {
                    _employee.bankAccountNo = data.bankAccountNo;
                }
                if (data.otherId) {
                    _employee.otherId = data.otherId;
                }
                if (data.homeAddress) {
                    if (data.homeAddress.street) {
                        _employee.homeAddress.street = data.homeAddress.street;
                    }
                    if (data.homeAddress.city) {
                        _employee.homeAddress.city = data.homeAddress.city;
                    }
                    if (data.homeAddress.state) {
                        _employee.homeAddress.state = data.homeAddress.state;
                    }
                    if (data.homeAddress.zip) {
                        _employee.homeAddress.zip = data.homeAddress.zip;
                    }
                    if (data.homeAddress.country) {
                        _employee.homeAddress.country = data.homeAddress.country;
                    }
                }
                if (data.dateBirth) {
                    _employee.dateBirth = getDate(data.dateBirth);
                    _employee.age = getAge(data.dateBirth);
                }
                if (data.nextAction) {
                    _employee.nextAction = data.nextAction;
                }
                //new source (add Vasya)
                if (data.source) {
                    _employee.source = data.source;
                }
                if (data.referredBy) {
                    _employee.referredBy = data.referredBy;
                }
                if (data.active) {
                    _employee.active = data.active;
                }
                if (data.workflow) {
                    _employee.workflow = data.workflow;
                }
                if (data.otherInfo) {
                    _employee.otherInfo = data.otherInfo;
                }
                if (data.expectedSalary) {
                    _employee.expectedSalary = data.expectedSalary;
                }
                if (data.proposedSalary) {
                    _employee.proposedSalary = data.proposedSalary;
                }
                if (data.color) {
                    _employee.color = data.color;
                }
                if (data.imageSrc) {
                    _employee.imageSrc = data.imageSrc;
                }
                if (data.jobType) {
                    _employee.jobType = data.jobType;
                }
                if (data.nationality) {
                    _employee.nationality = data.nationality;
                }
                if (data.hire) {
                    _employee.hire = data.hire;
                }
                if (data.salary) {
                    _employee.salary = data.salary;
                }
                if (data.transfer) {
                    _employee.transfer = data.transfer;
                }


                ///////////////////////////////////////////////////
                event.emit('updateSequence', models.get(req.session.lastDb, "Employees", employeeSchema), "sequence", 0, 0, _employee.workflow, _employee.workflow, true, false, function (sequence) {
                    var DepartmentSchema = mongoose.Schemas.Department;
                    var Department = models.get(req.session.lastDb, 'Department', DepartmentSchema);

                    _employee.sequence = sequence;

                    Department.findById(_employee.department,
                        function (error, dep) {

                            if (dep.parentDepartment.toString() !== CONSTANTS.ADMIN_DEPARTMENTS) {
                                _employee.transfer[0].isDeveloper = true;
                            } else {
                                _employee.transfer[0].isDeveloper = false;
                            }

                            _employee.save(function (err, result) {
                                if (err) {
                                    console.log(err);
                                    logWriter.log("Employees.js create savetoBd _employee.save " + err);
                                    res.send(500, {error: 'Employees.save BD error'});
                                } else {
                                    res.send(201, {success: 'A new Employees create success', result: result, id: result._id});
                                    if (result.isEmployee) {
                                        event.emit('recalculate', req);
                                    }
                                }
                            });
                    });

                });
                event.emit('dropHoursCashes', req);
                event.emit('recollectVacationDash');
            }
        }
        catch (exception) {
            console.log(exception);
            logWriter.log("Employees.js  " + exception);
            res.send(500, {error: 'Employees.save  error'});
        }
    };//End create

    function get(req, response) {
        var res = {};
        res['data'] = [];
        var query = models.get(req.session.lastDb, "Employees", employeeSchema).find();
        query.where('isEmployee', true);
        query.select('_id name').
        sort({'name.first': 1});
        query.exec(function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log('Employees.js get Employee.find ' + err);
                response.send(500, {error: "Can't find JobPosition"});
            } else {
                res['data'] = result;
                response.send(res);
            }
        });
    };

    function getCollectionLengthByWorkflows(req, res) {
        data = {};
        data['showMore'] = false;
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

                    models.get(req.session.lastDb, "Employees", employeeSchema).aggregate(
                        {
                            $match: {
                                $and: [
                                    {
                                        isEmployee: false
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
                                _id     : 1,
                                workflow: 1
                            }
                        },
                        {
                            $group: {
                                _id  : "$workflow",
                                count: {$sum: 1}
                            }
                        },
                        function (err, responseOpportunities) {
                            if (!err) {
                                responseOpportunities.forEach(function (object) {
                                    if (object.count > req.session.kanbanSettings.applications.countPerPage) {
                                        data['showMore'] = true;
                                    }
                                });
                                data['arrayOfObjects'] = responseOpportunities;
                                res.send(data);
                            } else {
                                console.log(err);
                                logWriter.log("Employees.js getCollectionLengthByWorkflows " + err);
                            }
                        });
                } else {
                    console.log(err);
                    logWriter.log("Employees.js getCollectionLengthByWorkflows " + err);
                }
            });
    }

    function getEmployeesAlphabet(req, response) {
        var query = models.get(req.session.lastDb, "Employees", employeeSchema).aggregate([{$match: {isEmployee: true}}, {$project: {later: {$substr: ["$name.last", 0, 1]}}}, {$group: {_id: "$later"}}]);
        query.exec(function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log("employees.js get employees alphabet " + err);
                response.send(500, {error: "Can't find employees"});
            } else {
                var res = {};
                res['data'] = result;
                response.send(res);
            }
        });
    };

    function getFilter(req, response) {
        var data = {};
        var optionsObject = {};
        var Employees = models.get(req.session.lastDb, "Employees", employeeSchema);

        var viewType;
        var contentType;
        var res = {};

        var condition;
        var resArray = [];
        var filtrElement = {};
        var key;
        var sort;
        var keySort;
        var project;
        var projectSecond;

        for (var i in
            req.query) {
            data[i] = req.query[i];
        }

        var skip = ((parseInt(data.page ? data.page : 1) - 1) * parseInt(data.count));
        var limit = parseInt(data.count);

        viewType = data.viewType;
        contentType = data.contentType;

        res['data'] = [];

        switch (contentType) {
            case ('Employees'):
            {

                for (var filterName in
                    data.filter) {
                    condition = data.filter[filterName]['value'];
                    key = data.filter[filterName]['key'];

                    switch (filterName) {
                        case 'name':
                            filtrElement[key] = {$in: condition.objectID()};
                            resArray.push(filtrElement);
                            break;
                        case 'letter':
                            filtrElement['name.last'] = new RegExp('^[' + data.filter.letter.toLowerCase() + data.filter.letter.toUpperCase() + '].*');
                            resArray.push(filtrElement);
                            break;
                        case 'department':
                            filtrElement[key] = {$in: condition.objectID()};
                            resArray.push(filtrElement);
                            break;
                        case 'manager':
                            filtrElement[key] = {$in: condition.objectID()};
                            resArray.push(filtrElement);
                            break;
                        case 'jobPosition':
                            filtrElement[key] = {$in: condition.objectID()};
                            resArray.push(filtrElement);
                            break;
                    }
                }
                ;

                resArray.push({'isEmployee': true});

                if (resArray.length) {

                    if (data && data.filter && data.filter.condition === 'or') {
                        optionsObject['$or'] = resArray;
                    } else {
                        optionsObject['$and'] = resArray;
                    }
                }
            }
                break;
            case ('Applications'):
            {
                for (var filterName in
                    data.filter) {
                    condition = data.filter[filterName]['value'];
                    key = data.filter[filterName]['key'];

                    switch (filterName) {
                        case 'name':
                            filtrElement[key] = {$in: condition.objectID()};
                            resArray.push(filtrElement);
                            break;
                        case 'letter':
                            filtrElement['name.last'] = new RegExp('^[' + data.filter.letter.toLowerCase() + data.filter.letter.toUpperCase() + '].*');
                            resArray.push(filtrElement);
                            break;
                        case 'department':
                            filtrElement[key] = {$in: condition.objectID()};
                            resArray.push(filtrElement);
                            break;
                        case 'manager':
                            filtrElement[key] = {$in: condition.objectID()};
                            resArray.push(filtrElement);
                            break;
                        case 'jobPosition':
                            filtrElement[key] = {$in: condition.objectID()};
                            resArray.push(filtrElement);
                            break;
                    }
                }
                ;

                resArray.push({'isEmployee': false});

                if (resArray.length) {

                    if (data && data.filter && data.filter.condition === 'or') {
                        optionsObject['$or'] = resArray;
                    } else {
                        optionsObject['$and'] = resArray;
                    }
                }
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

                    models.get(req.session.lastDb, "Employees", employeeSchema).aggregate(
                        {
                            $match: {
                                $and: [
                                    // optionsObject,
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

                                if (!optionsObject['$and']) {
                                    optionsObject['$and'] = [];
                                }

                                optionsObject['$and'].push({_id: {$in: _.pluck(result, '_id')}});

                                switch (contentType) {
                                    case ('Employees'):
                                        switch (viewType) {
                                            case ('list'):
                                            {
                                                if (data.sort) {
                                                    keySort = Object.keys(data.sort)[0];
                                                    data.sort[keySort] = parseInt(data.sort[keySort]);
                                                    sort = data.sort;
                                                } else {
                                                    sort = {"editedBy.date": -1};
                                                }

                                                project = {
                                                    manager         : {$arrayElemAt: ["$manager", 0]},
                                                    jobPosition     : {$arrayElemAt: ["$jobPosition", 0]},
                                                    department      : {$arrayElemAt: ["$department", 0]},
                                                    'createdBy.user': {$arrayElemAt: ["$createdBy.user", 0]},
                                                    'editedBy.user' : {$arrayElemAt: ["$editedBy.user", 0]},
                                                    name            : 1,
                                                    'editedBy.date' : 1,
                                                    'createdBy.date': 1,
                                                    dateBirth       : 1,
                                                    skype           : 1,
                                                    workEmail       : 1,
                                                    workPhones      : 1,
                                                    jobType         : 1,
                                                    isEmployee      : 1
                                                };

                                                projectSecond = {
                                                    manager         : 1,
                                                    jobPosition     : 1,
                                                    department      : 1,
                                                    'createdBy.user': 1,
                                                    'editedBy.user' : 1,
                                                    'editedBy.date' : 1,
                                                    'createdBy.date': 1,
                                                    name            : 1,
                                                    dateBirth       : 1,
                                                    skype           : 1,
                                                    workEmail       : 1,
                                                    workPhones      : 1,
                                                    jobType         : 1,
                                                    isEmployee      : 1
                                                };
                                            }
                                                break;
                                            case ('thumbnails'):
                                            {
                                                project = {
                                                    jobPosition        : {$arrayElemAt: ["$jobPosition", 0]},
                                                    department         : {$arrayElemAt: ["$department", 0]},
                                                    manager            : {$arrayElemAt: ["$manager", 0]},
                                                    age                : 1,
                                                    relatedUser        : {$arrayElemAt: ["$relatedUser", 0]},
                                                    'workPhones.mobile': 1,
                                                    name               : 1,
                                                    dateBirth          : 1,
                                                    isEmployee         : 1
                                                };

                                                projectSecond = {
                                                    jobPosition        : 1,
                                                    department         : 1,
                                                    manager            : 1,
                                                    age                : 1,
                                                    'relatedUser.login': 1,
                                                    'workPhones.mobile': 1,
                                                    name               : 1,
                                                    dateBirth          : 1,
                                                    isEmployee         : 1
                                                };

                                                sort = {"_id": 1};
                                            }
                                                break;

                                        }
                                        break;
                                    case ('Applications'):
                                        switch (viewType) {
                                            case ('list'):
                                            {
                                                if (data && data.filter && data.filter.workflow) {
                                                    data.filter.workflow = data.filter.workflow.map(function (item) {
                                                        return item === "null" ? null : item;
                                                    });
                                                    // query.where('workflow').in(data.filter.workflow);
                                                } else if (data && (!data.newCollection || data.newCollection === 'false')) {
                                                    // query;//.where('workflow').in([]);
                                                }

                                                if (data.sort) {
                                                    keySort = Object.keys(data.sort)[0];
                                                    data.sort[keySort] = parseInt(data.sort[keySort]);
                                                    sort = data.sort;
                                                } else {
                                                    sort = {"editedBy.date": -1};
                                                }

                                                project = {
                                                    manager         : {$arrayElemAt: ["$manager", 0]},
                                                    jobPosition     : {$arrayElemAt: ["$jobPosition", 0]},
                                                    department      : {$arrayElemAt: ["$department", 0]},
                                                    'createdBy.user': {$arrayElemAt: ["$createdBy.user", 0]},
                                                    'editedBy.user' : {$arrayElemAt: ["$editedBy.user", 0]},
                                                    name            : 1,
                                                    'editedBy.date' : 1,
                                                    'createdBy.date': 1,
                                                    dateBirth       : 1,
                                                    skype           : 1,
                                                    workEmail       : 1,
                                                    workPhones      : 1,
                                                    jobType         : 1,
                                                    isEmployee      : 1,
                                                    creationDate    : 1,
                                                    workflow        : {$arrayElemAt: ["$workflow", 0]},
                                                    personalEmail   : 1,
                                                    sequence        : 1,
                                                    hire            : 1,
                                                    fire            : 1
                                                };

                                                projectSecond = {
                                                    manager         : 1,
                                                    jobPosition     : 1,
                                                    department      : 1,
                                                    'createdBy.user': 1,
                                                    'editedBy.user' : 1,
                                                    'editedBy.date' : 1,
                                                    'createdBy.date': 1,
                                                    name            : 1,
                                                    dateBirth       : 1,
                                                    skype           : 1,
                                                    workEmail       : 1,
                                                    workPhones      : 1,
                                                    jobType         : 1,
                                                    isEmployee      : 1,
                                                    creationDate    : 1,
                                                    workflow        : 1,
                                                    personalEmail   : 1,
                                                    sequence        : 1,
                                                    hire            : 1,
                                                    fire            : 1
                                                };

                                            }
                                                break;
                                        }
                                        break;
                                }

                                Employees.aggregate([{
                                    $lookup: {
                                        from                   : "Employees",
                                        localField             : "manager",
                                        foreignField: "_id", as: "manager"
                                    }
                                }, {
                                    $lookup: {
                                        from                   : "JobPosition",
                                        localField             : "jobPosition",
                                        foreignField: "_id", as: "jobPosition"
                                    }
                                }, {
                                    $lookup: {
                                        from                   : "Department",
                                        localField             : "department",
                                        foreignField: "_id", as: "department"
                                    }
                                }, {
                                    $lookup: {
                                        from                   : "Users",
                                        localField             : "relatedUser",
                                        foreignField: "_id", as: "relatedUser"
                                    }
                                }, {
                                    $lookup: {
                                        from                   : "Users",
                                        localField             : "createdBy.user",
                                        foreignField: "_id", as: "createdBy.user"
                                    }
                                }, {
                                    $lookup: {
                                        from                   : "Users",
                                        localField             : "editedBy.user",
                                        foreignField: "_id", as: "editedBy.user"
                                    }
                                }, {
                                    $lookup: {
                                        from                   : "workflows",
                                        localField             : "workflow",
                                        foreignField: "_id", as: "workflow"
                                    }
                                }, {
                                    $project: project
                                }, {
                                    $project: projectSecond
                                }, {
                                    $match: optionsObject
                                }, {
                                    $sort: sort
                                }, {
                                    $skip: skip
                                }, {
                                    $limit: limit
                                }
                                ], function (err, result) {
                                    if (err) {
                                        console.log(err);
                                        return logWriter.log("employees.js getFilter " + err);
                                    }

                                    res['data'] = result;
                                    response.send(res);
                                });
                            } else {
                                console.log(err);
                                logWriter.log("employees.js getFilter " + err);
                            }
                        }
                    );
                } else {
                    console.log(err);
                    logWriter.log("employees.js getFilter " + err);
                }
            });

    };

    function getForDd(req, response) {
        var res = {};
        res['data'] = [];
        var query = models.get(req.session.lastDb, 'Employees', employeeSchema).find();
        //query.where('isEmployee', true);
        query.select('_id name ');
        query.sort({'name.first': 1});
        query.exec(function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log('Employees.js get Employee.find' + err);
                response.send(500, {error: "Can't find Employee"});
            } else {
                res['data'] = result;
                response.send(res);
            }
        });
    };

    function getForDdByRelatedUser(req, uId, response) {
        var res = {};
        res['data'] = [];
        var query = models.get(req.session.lastDb, "Employees", employeeSchema).find({relatedUser: uId});
        query.where('isEmployee', true);
        query.select('_id name ');
        query.sort({'name.first': 1});
        query.exec(function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log('Employees.js get Employee.find' + err);
                response.send(500, {error: "Can't find Employee"});
            } else {
                res['data'] = result;
                response.send(res);
            }
        });
    };

    function getApplications(req, response) {
        var res = {};
        res['data'] = [];
        var query = models.get(req.session.lastDb, "Employees", employeeSchema).find();

        query.where('isEmployee', false);
        query.populate('relatedUser department jobPosition workflow').
        populate('createdBy.user').
        populate('editedBy.user');

        query.sort({'name.first': 1});
        query.exec(function (err, applications) {
            if (err) {
                console.log(err);
                logWriter.log('Employees.js get Application.find' + err);
                response.send(500, {error: "Can't find Application"});
            } else {
                res['data'] = applications;
                response.send(res);
            }
        });
    };

    function getApplicationsForKanban(req, data, response) {

        var res = {};
        var startTime = new Date();
        var filterObj = {};
        var condition;

        res['data'] = [];
        res['workflowId'] = data.workflowId;
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
                    filterObj['$and'] = [];
                    filterObj['$and'].push({isEmployee: false});
                    filterObj['$and'].push({workflow: objectId(data.workflowId)});
                    /*filterObj['$and'].push({$or: []});
                     or = filterObj['$and'][2]['$or'];*/

                    if (data && data.filter) {
                        if (data.filter.condition === 'or') {
                            filterObj['$and'].push({$or: []});
                            condition = filterObj['$and'][2]['$or'];
                        } else {
                            filterObj['$and'].push({$and: []});
                            condition = filterObj['$and'][2]['$and'];
                        }

                        if (data.filter && data.filter.Name) {
                            condition.push({'name.last': {$in: data.filter.Name}});
                        }
                        if (data.filter && data.filter.Email) {
                            condition.push({'workEmail': {$in: data.filter.Email}});
                        }
                        if (!condition.length) {
                            filterObj['$and'].pop();
                        }
                    }
                    models.get(req.session.lastDb, "Employees", employeeSchema).aggregate(
                        {
                            $match: {
                                $and: [
                                    filterObj,
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
                                models.get(req.session.lastDb, "Employees", employeeSchema)
                                    .where('_id').in(responseOpportunities)
                                    .select("_id name proposedSalary jobPosition nextAction workflow editedBy.date sequence fired")
                                    .populate('workflow', '_id')
                                    .populate('jobPosition', '_id name')
                                    .sort({lastFire: -1, 'sequence': -1})
                                    .limit(req.session.kanbanSettings.applications.countPerPage)
                                    .exec(function (err, result) {
                                        if (!err) {
                                            res['data'] = result;
                                            res['time'] = (new Date() - startTime);
                                            res['workflowId'] = data.workflowId;
                                            res['fold'] = (req.session.kanbanSettings.applications.foldWorkflows && req.session.kanbanSettings.applications.foldWorkflows.indexOf(data.workflowId.toString()) !== -1);

                                            response.send(res);
                                        } else {
                                            logWriter.log("Employees.js getApplicationsForKanban opportunitie.find" + err);
                                            response.send(500, {error: "Can't find Applications"});
                                        }
                                    });
                            } else {
                                logWriter.log("Employees.js getApplicationsForKanban task.find " + err);
                                response.send(500, {error: "Can't group Applications"});
                            }
                        });
                } else {
                    logWriter.log("Employees.js getApplicationsForKanban task.find " + err);
                    console.log(err);
                }
            });
    };

    function getById(req, response) {
        var data = {};
        var project = {};
        for (var i in
            req.query) {
            data[i] = req.query[i];
        }
        ;

        if (ids.indexOf(req.session.uId) === -1) {
            project = {'transfer.salary': 0};
        }

        var query = models.get(req.session.lastDb, "Employees", employeeSchema)
            .findById(data.id, project);

        query.populate('coach', 'name _id')
            .populate('relatedUser', 'login _id')
            .populate('workflow')
            .populate('createdBy.user')
            .populate('editedBy.user')
            .populate('groups.users')
            .populate('manager', '_id name')
            .populate('jobPosition', '_id name fullName')
            .populate('department', '_id departmentName')
            .populate('groups.group')
            .populate('transfer.department', '_id departmentName')
            .populate('transfer.jobPosition', '_id name')
            .populate('transfer.manager', '_id name')
            .populate('groups.owner', '_id login');

        query.exec(function (err, findedEmployee) {
            if (err) {
                logWriter.log("Employees.js getById employee.find " + err);
                response.send(500, {error: "Can't find Employee"});
            } else {


                response.send(findedEmployee);
            }
        });

    }

    function updateRefs(result, dbName, _id) {
        var EmployeeSchema;
        var EmployeeModel;
        var InvoiceSchema;
        var Invoice;
        var PaymentSchema;
        var Payment;
        var SalaryCashSchema;
        var SalaryCash;
        var SalarySchema;
        var Salary;
        var VacationSchema;
        var Vacation;

        var fullName;

        if ((dbName === CONSTANTS.WTRACK_DB_NAME) || (dbName === 'production') || ((dbName === 'development'))) {
            EmployeeSchema = mongoose.Schemas['Employee'];
            EmployeeModel = models.get(dbName, 'Employee', EmployeeSchema);

            InvoiceSchema = mongoose.Schemas['wTrackInvoice'];
            Invoice = models.get(dbName, 'wTrackInvoice', InvoiceSchema);

            PaymentSchema = mongoose.Schemas['Payment'];
            Payment = models.get(dbName, 'Payment', PaymentSchema);

            SalarySchema = mongoose.Schemas['Salary'];
            Salary = models.get(dbName, 'Salary', SalarySchema);

            SalaryCashSchema = mongoose.Schemas['SalaryCash'];
            SalaryCash = models.get(dbName, 'SalaryCash', SalaryCashSchema);

            VacationSchema = mongoose.Schemas['Vacation'];
            Vacation = models.get(dbName, 'Vacation', VacationSchema);

            fullName = result.name.last ? (result.name.first + ' ' + result.name.last) : result.name.first;

            event.emit('updateName', _id, EmployeeModel, 'manager._id', 'manager.name', fullName);
            event.emit('updateName', _id, Invoice, 'salesPerson._id', 'salesPerson.name', fullName);
            event.emit('updateName', _id, Payment, 'invoice.assigned._id', 'invoice.assigned.name', fullName);
            event.emit('updateName', _id, Salary, 'employee._id', 'employee.name', fullName);
            event.emit('updateName', _id, SalaryCash, 'employeesArray.employee._id', 'employeesArray.$.employee.name', fullName, true);
            event.emit('updateName', _id, Vacation, 'employee._id', 'employee.name', fullName);
        }
    };

    function updateOnlySelectedFields(req, _id, data, res) {
        var dbName = req.session.lastDb;
        var UsersSchema = mongoose.Schemas.User;
        var DepartmentSchema = mongoose.Schemas.Department;
        var UsersModel = models.get(dbName, 'Users', UsersSchema);
        var Department = models.get(dbName, 'Department', DepartmentSchema);
        var fileName = data.fileName;

        delete data.depForTransfer;
        delete data.fileName;

        if (data.workflow && data.sequenceStart && data.workflowStart) {
            if (data.sequence == -1) {
                event.emit('updateSequence', models.get(req.session.lastDb, 'Employees', employeeSchema), "sequence", data.sequenceStart, data.sequence, data.workflowStart, data.workflowStart, false, true, function (sequence) {
                    event.emit('updateSequence', models.get(req.session.lastDb, 'Employees', employeeSchema), "sequence", data.sequenceStart, data.sequence, data.workflow, data.workflow, true, false, function (sequence) {
                        data.sequence = sequence;
                        if (data.workflow == data.workflowStart) {
                            data.sequence -= 1;
                        }
                        models.get(req.session.lastDb, 'Employees', employeeSchema).findByIdAndUpdate(_id, data, {new: true}, function (err, result) {
                            if (!err) {
                                res.send(200, {success: 'Employees updated', sequence: result.sequence});

                            } else {
                                res.send(500, {error: "Can't update Employees"});
                            }

                        });
                    });
                });
            } else {
                event.emit('updateSequence', models.get(req.session.lastDb, 'Employees', employeeSchema), "sequence", data.sequenceStart, data.sequence, data.workflowStart, data.workflow, false, false, function (sequence) {
                    delete data.sequenceStart;
                    delete data.workflowStart;
                    data.sequence = sequence;
                    models.get(req.session.lastDb, 'Employees', employeeSchema).findByIdAndUpdate(_id, {$set: data}, {new: true}, function (err, result) {
                        if (!err) {
                            res.send(200, {success: 'Employees updated'});

                        } else {
                            res.send(500, {error: "Can't update Employees"});
                        }

                    });
                });
            }
        } else {
            if (data.dateBirth) {
                data['age'] = getAge(data.dateBirth);
            }

            if (data.relatedUser) {
                event.emit('updateName', data.relatedUser, UsersModel, '_id', 'RelatedEmployee', _id);
            }

            Department.aggregate([
                {
                    $match: {
                        parentDepartment: {$ne: null}
                    }
                },
                {
                    $group: {
                        _id: '$parentDepartment',
                        sublingDeps: {$push: '$_id'}
                    }
                }
            ], function (error, deps) {
                var adminDeps;

                if (error) {
                    return console.dir(error);
                }

                adminDeps = deps[0]._id.toString === objectId(CONSTANTS.ADMIN_DEPARTMENTS) ? deps[0].sublingDeps : deps[1].sublingDeps;
                adminDeps = adminDeps.map(function(depId) {
                    return depId.toString();
                });

                data.transfer = data.transfer.map(function(tr) {
                    if (adminDeps.indexOf(tr.department.toString()) !== -1 ) {
                        tr.isDeveloper = false;
                    } else {
                        tr.isDeveloper = true;
                    }

                    return tr;
                });

                models.get(req.session.lastDb, 'Employees', employeeSchema).findByIdAndUpdate(_id, data, {new: true}, function (err, result) {
                    if (!err) {
                        if (data.dateBirth || data.hired) {
                            event.emit('recalculate', req);
                        }
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
                                    if (files && files.length === 0) {
                                        fs.rmdir(dir, function () {
                                        });
                                    }
                                });
                            });

                        }
                        event.emit('dropHoursCashes', req);
                        event.emit('recollectVacationDash');

                        res.send(200, {success: 'Employees updated', result: result});

                        payrollHandler.composeSalaryReport(req);

                    } else {
                        res.send(500, {error: "Can't update Employees"});
                    }

                });

            });
        }
    }

    function addAtach(req, _id, files, res) {//to be deleted
        models.get(req.session.lastDb, "Employees", employeeSchema).findByIdAndUpdate(_id, {$push: {attachments: {$each: files}}}, {
            upsert: true,
            new   : true
        }, function (err, result) {
            try {
                if (err) {
                    console.log(err);
                    logWriter.log("Employees.js update employee.update " + err);
                    res.send(500, {error: "Can't update Employees"});
                } else {
                    res.send(200, {success: 'Employees updated success', data: result});
                    if (data.recalculate) {
                        event.emit('recalculate', req);
                    }
                }
            }
            catch (exception) {
                logWriter.log("Employees.js getEmployees employee.find " + exception);
            }
        });
    }// end update

    function remove(req, _id, res) {
        models.get(req.session.lastDb, "Employees", employeeSchema).findByIdAndRemove(_id, function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log("Employees.js remove employee.remove " + err);
                res.send(500, {error: "Can't remove Employees"});
            } else {
                if (result && !result.isEmployee) {
                    event.emit('updateSequence', models.get(req.session.lastDb, "Employees", employeeSchema), "sequence", result.sequence, 0, result.workflow, result.workflow, false, true, function () {
                        //res.send(200, { success: 'Employees removed' });
                    });
                }
                event.emit('recalculate', req);
                event.emit('dropHoursCashes', req);
                event.emit('recollectVacationDash', req);

                res.send(200, {success: 'Employees removed'});
            }
        });
    }// end remove

    function getEmployeesImages(req, data, res) {
        var query = models.get(req.session.lastDb, "Employees", employeeSchema).find({isEmployee: true});
        query.where('_id').in(data.ids).
        select('_id imageSrc name').
        exec(function (error, response) {
            if (error) {
                console.log(error);
                logWriter.log("Employees.js remove employee.remove " + error);
                res.send(500, {error: "Can't find Employees Imgs"});
            } else {
                res.send(200, {data: response});
            }
        });

    };

    return {
        getTotalCount                 : getTotalCount,
        create                        : create,
        get                           : get,
        getCollectionLengthByWorkflows: getCollectionLengthByWorkflows,
        getFilter                     : getFilter,
        getEmployeesAlphabet          : getEmployeesAlphabet,
        getForDd                      : getForDd,
        getForDdByRelatedUser         : getForDdByRelatedUser,
        addAtach                      : addAtach,
        updateOnlySelectedFields      : updateOnlySelectedFields,
        remove                        : remove,
        getApplications               : getApplications,
        getApplicationsForKanban      : getApplicationsForKanban,
        getEmployeesImages            : getEmployeesImages,
        getById                       : getById
    };
};

module.exports = Employee;
