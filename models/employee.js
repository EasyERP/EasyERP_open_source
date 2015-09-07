
module.exports = (function () {

    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var employeeSchema = new mongoose.Schema({

        /**
         * Application is same as Employee, but `isEmployee` is false. That means that employee is not hired.
         * @module Employee
         *
         * @class Employee
         * @property {Boolean} isEmployee - If property _isEmployee_ is _true_ than Employee is hired
         *
         * @property {String} imageSrc - `base64` representation of avatar
         *
         * @property {Object} name
         * @property {String} name.first -First `name` of _Employee_
         * @property {String} name.last -Last `name` of _Employee_
         *
         * @property {Object} workAddress - `Address` of _Employee_
         * @property {String} workAddress.street - Address `street` of _Employee_
         * @property {String} workAddress.city - Address `city` of _Employee_
         * @property {String} workAddress.state - Address `state` of _Employee_
         * @property {String} workAddress.zip - Address `zip` of _Employee_
         * @property {String} workAddress.country - Address `country` of _Employee_
         *
         * @property {String} workEmail - Email
         *
         * @property {String} personalEmail - Personal email
         *
         * @property {Object} workPhones - `workPhones` of _Employee_
         * @property {String} workPhones.mobile - `mobile` of _Employee_
         * @property {String} workPhones.phone - `phone` of _Employee_
         *
         * @property {String} skype - Skype login
         *
         * @property {Object} department - `department` of _Employee_
         * @property {String} department._id - Department `_id` of _Employee_
         * @property {String} department.name - Department `name` of _Employee_
         *
         * @property {Object} jobPosition - `jobPosition` of _Employee_
         * @property {String} jobPosition._id - Job Position `_id` of _Employee_
         * @property {String} jobPosition.name - Job Position `name` of _Employee_
         *
         * @property {Object} manager - `Manager` of _Employee_
         * @property {String} manager._id - Manager `_id` of _Employee_
         * @property {String} manager.name - Manager `name` of _Employee_
         *
         * @property {Date} dateBirth - Date of Birth, expect ISO string, example `'1998-07-28 17:12:26'`
         *
         * @property {Number} age - Age of _Employee_
         *
         * @property {String} workflow
         *
         * @property {Object} groups - `Groups` of _Employee_
         * @property {String} groups.users
         * @property {String} groups.group
         *
         * @property {String} otherInfo - Some info about _Employee_
         *
         * @property {Date} creationDate - Creation Date of _Employee_
         *
         * @property {Object} createdBy
         * @property {String} createdBy.users - Created by user
         * @property {Date} createdBy.date - Creation date
         *
         * @property {Object} editedBy
         * @property {String} editedBy.users - Edited by user
         * @property {Date} editedBy.date - Edited on date
         *
         * @property {Array} attachments - Some files
         *
         * @property {Object} contractEnd
         * @property {String} contractEnd.reason - Reason of the end of contract
         * @property {Date} contractEnd.date - Date of the end of contract
         *
         * @property {String} marital - Marital can be `married` or `unmarried`
         *
         * @property {String} gender - Gender can be `male` or `female`
         *
         * @property {String} jobType - Job type can be `Contract`, `Full-time`, `Internship`, `Part-time`, `Remote` or `Temporary`
         *
         * @property {Object} social - Social lincs of  _Employee_
         * @property {String} social.FB
         * @property {String} social.LI
         * @property {String} social.GP
         *
         * @property {Array} hire - `Hire` dates of _Employee_
         *
         * @property {Array} fire - `Fire` dates of _Employee_
         *
         * @property {Number} lastFire - `lastFire` dates of _Employee_
         */


        isEmployee: { type: Boolean, default: false },
        imageSrc: { type: String, default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC' },
        subject: { type: String, default: '' },
        name: {
            first: { type: String, default: '' },
            last: { type: String, default: '' }
        },
        tags: { type: Array, default: [] },
        workAddress: {
            street: { type: String, default: '' },
            city: { type: String, default: '' },
            state: { type: String, default: '' },
            zip: { type: String, default: '' },
            country: { type: String, default: '' }
        },
        workEmail: { type: String, default: '' },
        personalEmail: { type: String, default: '' },
        workPhones: {
            mobile: { type: String, default: '' },
            phone: { type: String, default: '' }
        },
        skype: { type: String, default: '' },
        officeLocation: { type: String, default: '' },
        relatedUser: { type: ObjectId, ref: 'Users', default: null },
        visibility: { type: String, default: 'Public' },
        department: {
            _id: {type: ObjectId, ref: 'Department', default: null},
            name: { type:String, default: '' }
        },
        jobPosition: {
            _id: {type: ObjectId, ref: 'JobPosition', default: null},
            name: { type:String, default: '' }
        },
        manager: {
            _id: {type: ObjectId, ref: 'Employees', default: null},
            name: { type:String, default: '' }
        },
        coach: { type: ObjectId, ref: 'Employees', default: null },
        nationality: { type: String, default: '' },
        identNo: String,
        passportNo: String,
        bankAccountNo: { type: String, default: '' },
        otherId: { type: String, default: '' },
        homeAddress: {
            street: { type: String, default: '' },
            city: { type: String, default: '' },
            state: { type: String, default: '' },
            zip: { type: String, default: '' },
            country: { type: String, default: '' }
        },
        dateBirth: Date,
        age: { type: Number, default: 0 },
        daysForBirth: Number,
        nextAction: Date,
        source: { type: String, default: '' },
        referredBy: { type: String, default: '' },
        active: { type: Boolean, default: true },
        workflow: { type: ObjectId, ref: 'workflows', default: null },
        whoCanRW: { type: String, enum: ['owner', 'group', 'everyOne'], default: 'everyOne' },
        groups: {
            owner: { type: ObjectId, ref: 'Users', default: null },
            users: [{ type: ObjectId, ref: 'Users', default: null }],
            group: [{ type: ObjectId, ref: 'Department', default: null }]
        },
        otherInfo: { type: String, default: '' },
        expectedSalary: Number,
        proposedSalary: Number,
        color: { type: String, default: '#4d5a75' },
        creationDate: { type: Date, default: Date.now },
        createdBy: {
            user: { type: ObjectId, ref: 'Users', default: null },
            date: { type: Date, default: Date.now }
        },
        editedBy: {
            user: { type: ObjectId, ref: 'Users', default: null },
            date: { type: Date, default: Date.now }
        },
        attachments: { type: Array, default: [] },
        contractEnd: {
            reason: { type: String, default: '' },
            date: { type: Date, default: Date.now }
        },
        marital: { type: String, enum: ['married', 'unmarried'], default: 'unmarried' },
        gender: { type: String, enum: ['male', 'female'], default: 'male' },
        jobType: { type: String, default: '' },
        sequence: { type: Number, default: 0 },
        isLead: Number,
        ID: Number,
        social: {
            FB: { type: String, default: '' },
            LI: { type: String, default: '' },
            GP: { type: String, default: '' }
        },
        hire: {type: Array, default: []},
        fire: {type: Array, default: []},
        lastFire: {type: Number, default: null}
    }, { collection: 'Employees' });

    employeeSchema.virtual('fullName').get(function(){
        return this.name.first + ' ' + this.name.last;
    });

    employeeSchema.set('toJSON', { virtuals: true });

    mongoose.model('Employees', employeeSchema);

    if(!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['Employee'] = employeeSchema;
})();