
var mongoose = require('mongoose');
var async = require('async');

var Employee = function (models) {
    /**
     * @module Employee
     */
    var access = require("../Modules/additions/access.js")(models);
    var EmployeeSchema = mongoose.Schemas['Employee'];
    var ProjectSchema = mongoose.Schemas['Project'];
    var _ = require('../node_modules/underscore');

    this.getForDD = function (req, res, next) {
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);

        Employee
            .find()
            .select('_id name department')
            //.populate('department._id', '_id departmentName')
            .sort({'name.first': 1})
            .lean()
            .exec(function (err, employees) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({data: employees})
            });
    };

    this.getBySales = function (req, res, next) {
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var Project = models.get(req.session.lastDb, 'Project', ProjectSchema);

        function assigneFinder(cb) {
            var match = {
                'projectmanager._id': {$ne: null}
            };

            Project.aggregate([{
                $match: match
            }, {
                $group: {
                    _id: "$projectmanager._id"
                }
            }], cb);
        };

        function employeeFinder(assignedArr, cb) {
            Employee
                .find({_id: {$in: assignedArr}})
                .select('_id name')
                .sort({'name.first': 1, 'name.last': 1})
                .lean()
                .exec(cb);
        }

        async.waterfall([assigneFinder, employeeFinder], function (err, employees) {
            if (err) {
                return next(err);
            }

            res.status(200).send(employees);
        });

    };

    this.byDepartment = function (req, res, next) {
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);

        Employee
            .aggregate([{
                $match: {isEmployee: true}
            }, {
                $group: {
                    _id: "$department._id",
                    employees: {$push: {
                        name: {$concat: ['$name.first', ' ', '$name.last']},
                        _id: '$_id'
                    }}
                }
            }, {
                $project: {
                    department: '$_id',
                    employees: 1,
                    _id: 0
                }
            }], function (err, employees) {
                if(err){
                    return next(err);
                }

                res.status(200).send(employees);
            });
    };

};
/**
 * __Type__ `GET`
 *
 * Base ___url___ for build __requests__ is `http:/192.168.88.133:8089/Employees/form/:id`
 *
 * This __method__ allows get all Employees for `form` viewType.
 * @method Employees
 * @param {String} form - View type
 * @param {String} id - Id of employee
 * @instance
 */
/**
 * __Type__ `GET`
 *
 * Base ___url___ for build __requests__ is `http:/192.168.88.133:8089/Birthdays`
 *
 * This __method__ allows get all birthdays of Employees for current week, next week and current month.
 * @example {
 *   "data": {
 *       "weekly": [
 *           {
 *               "daysForBirth": 3,
 *               "_id": "55b92ad221e4b7c40f000047",
 *               "dateBirth": "2015-08-30T00:00:00.000Z",
 *               "age": 26,
 *               "jobPosition": {
 *                   "_id": "55b92acf21e4b7c40f000027",
 *                   "name": "Senior iOS"
 *                   },
 *               "department": {
 *                   "_id": "55b92ace21e4b7c40f00000f",
 *                   "name": "iOS"
 *                   },
 *               "workPhones": {
 *                   "mobile": "+38 050 10 86 444"
 *                   },
 *               "name": {
 *                   "last": "Khymych",
 *                   "first": "Ilya"
 *                   }
 *            }
 *         ]
 *       }
 *   }
 *
 * @method Birthdays
 * @instance
 */
/**
 * __Type__ `GET`
 *
 * Base ___url___ for build __requests__ is `http:/192.168.88.133:8089/getForDdByRelatedUser`
 *
 * This __method__ allows get related Employees for current user.
 * @example {
 *   "data": [
 *       {
 *           "_id": "55b92ad221e4b7550f00004f",
 *           "name": {
 *               "last": "Alex",
 *               "first": "Alex"
 *           },
 *           "fullName": "Alex Alex",
 *           "id": "55b92ad221e4b7550f00004f"
 *        }
 *      ]
 *   }
 *
 * @method getForDdByRelatedUser
 * @instance
 */
/**
 * __Type__ `POST`
 *
 * Base ___url___ for build __requests__ is `http:/192.168.88.133:8089/Employees`
 *
 * This __method__ allows create new Employee.
 * @example {
 *   "success": "A new Employees create success",
 *   "result": {
 *         .......//model of Employee
 *         }
 *   }
 * @method Employees
 * @property {JSON} Object - Object with properties for new Employee
 * @instance
 */
/**
 * __Type__ `PATCH`
 *
 * Base ___url___ for build __requests__ is `http:/192.168.88.133:8089/Employees/:id`
 *
 * This __method__ allows to update only modified fields in Employee by id.
 * @example {
 *   "success": "Employees updated",
 *   "result": {
 *       "_id": "55deaef309b1c0e30a000006",
 *       .......//model of Employee
 *       }
 *   }
 *
 * @method Employees
 * @param {String} id - Id of Employee
 * @instance
 */
/**
 * __Type__ `DELETE`
 *
 * Base ___url___ for build __requests__ is `http:/192.168.88.133:8089/Employees/:id`
 *
 * This __method__ allows to delete Employee by id.
 * @example {
 *   "success": "Employees removed"
 *  }
 *
 * @method Employees
 * @param {String} id - Id of Employee
 * @instance
 */
/**
 * __Type__ `GET`
 *
 * Base ___url___ for build __requests__ is `http:/192.168.88.133:8089/getSalesPerson`
 *
 * This __method__ allows to get Employees that can be sales persons.
 * @example {
 *   "data": [
 *       {
 *           "_id": "55b92ad221e4b7c400000030",
 *           "name": {
 *               "first": "Alex",
 *               "last": "Alex"
 *           },
 *           "fullName": "Alex Alex",
 *           "id": "55b92ad221e4b7c400000030"
 *       },
 *       ...........
 *       ]
 *     }
 *
 * @method getSalesPerson
 * @instance
 */
/**
 * __Type__ `GET`
 *
 * Base ___url___ for build __requests__ is `http:/192.168.88.133:8089/Employees/kanban`
 *
 * This __method__ allows get all Employees for `kanban` viewType.
 * @method Employees
 * @param {String} kanban - View type
 * @instance
 */
/**
 * __Type__ `GET`
 *
 * Base ___url___ for build __requests__ is `http:/192.168.88.133:8089/Employees/list`
 *
 * This __method__ allows get all Employees for `list` viewType.33
 *
 * @example
 *        {"data": [{
     *        "_id": "55b92ad221e4b7c40f000030",
     *        "dateBirth": "1981-12-31T00:00:00.000Z",
     *        "ID": 1,
     *        "isLead": 2,
     *        "__v": 0,
     *        "lastFire": null,
     *        "fire": [],
     *        "hire": [
     *            "2011-10-11T00:00:00.000Z"
     *            ],
     *        "social": {
     *            "GP": "",
     *            "LI": "",
     *            "FB": ""
     *            },
     *        "sequence": 0,
     *        "jobType": null,
     *        "gender": "male",
     *        "marital": "unmarried",
     *        "contractEnd": {
     *            "date": "2015-07-29T19:34:42.405Z",
     *            "reason": ""
     *            },
     *        "attachments": [],
     *        "editedBy": {
     *            "date": "2015-08-18T05:55:15.458Z",
     *            "user": "52203e707d4dba8813000003"
     *            },
     *        "createdBy": {
     *            "date": "2015-07-29T19:34:42.404Z",
     *            "user": "52203e707d4dba8813000003"
     *            },
     *        "creationDate": "2015-07-29T19:34:42.404Z",
     *        "color": "#4d5a75",
     *        "otherInfo": "",
     *        "groups": {
     *            "group": [],
     *            "users": [],
     *            "owner": "55ba28c8d79a3a3439000016"
     *            },
     *        "whoCanRW": "everyOne",
     *        "workflow": null,
     *        "active": false,
     *        "referredBy": "",
     *        "source": "",
     *        "age": 33,
     *        "homeAddress": {
     *            "country": "",
     *            "zip": "",
     *            "state": "",
     *            "city": "",
     *            "street": ""
     *            },
     *        "otherId": "",
     *        "bankAccountNo": "",
     *        "nationality": "",
     *        "coach": null,
     *        "manager": {
     *            "name": "Select",
     *            "_id": null
     *            },
     *        "jobPosition": {
     *            "name": "Senior iOS",
     *            "_id": "55b92acf21e4b7c40f000027"
     *        },
     *        "department": {
     *            "name": "PM",
     *            "_id": "55bb1f40cb76ca630b000007"
     *            },
     *        "visibility": "Public",
     *        "relatedUser": null,
     *        "officeLocation": "",
     *        "skype": "alexsvt",
     *        "workPhones": {
     *            "phone": "",
     *            "mobile": "+380509365593"
     *            },
     *        "personalEmail": "",
     *        "workEmail": "alex@thinkmobiles.com",
     *        "workAddress": {
     *            "country": "",
     *            "zip": "",
     *            "state": "",
     *            "city": "",
     *            "street": ""
     *            },
     *        "tags": [
     *            ""
     *            ],
     *        "name": {
     *            "last": "Svatuk",
     *            "first": "Alex"
     *            },
     *        "subject": "",
     *        "imageSrc": "data:image/jpeg;base64,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",
     *        "isEmployee": true,
     *        "fullName": "Alex Ssss",
     *        "id": "55b92ad221e4b7c40f000030"
     *        }]}
 * @method Employees
 * @param {String} list - View type
 * @instance
 */
/**
 * __Type__ `GET`
 *
 * Base ___url___ for build __requests__ is `http://192.168.88.122:8089/totalCollectionLength/Employees`
 * This __method__ allows get count of Employees.
 * @example {
                 *         "showMore": false,
                 *         "count": 135
                 *     }
 * @method totalCollectionLength
 * @param {String} Employees - Content type
 * @instance
 */

/**
 * @module Application
 */
/**
 * __Type__ `GET`
 *
 * Base ___url___ for build __requests__ is `http://192.168.88.122:8089/totalCollectionLength/Applications`
 * This __method__ allows get count of Employees that are not hired.
 * @example {
     *         "showmore": false,
     *         "count": 42
     *     }
 *
 * @method totalCollectionLength
 * @param {String} Applications - Content type
 * @instance
 */
/**
 * __Type__ `GET`
 *
 * Base ___url___ for build __requests__ is `http:/192.168.88.122:8089/Applications/form/:id`
 *
 * This __method__ allows get all Employees that are not hired for `form` viewType.
 * @method Applications
 * @param {String} form  - View type
 * @param {String} id - Id of employee
 * @instance
 */
/**
 * __Type__ `GET`
 *
 * Base ___url___ for build __requests__ is `http:/192.168.88.122:8089/Applications/kanban`
 *
 * This __method__ allows get all Employees that are not hired for `kanban` viewType.
 * @method Applications
 * @param {String} kanban  - View type
 * @instance
 */
/**
 * __Type__ `GET`
 *
 * Base ___url___ for build __requests__ is `http:/192.168.88.122:8089/Applications/list`
 *
 * This __method__ allows get all Employees that are not hired for `list` viewType.
 * @method Applications
 * @param {String} list  - View type
 * @instance
 */
module.exports = Employee;