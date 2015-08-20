/**
 * Created by Roman on 04.04.2015.
 */

/**
 * Customers Module, allow You create Person & Company
 * @module Customers
 * @namespace EasyERP
 * @class Customer
 * @constructor
 */

module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var customerSchema = mongoose.Schema({
        /**
         * Type of __Customer__, proper values are: _'Person'_, _'Company'_
         * @property type
         * @type String
         */
        /**
         * determine is a ___Person___ or ___Company___ our own. Actually now is not needed
         * @property isOwn
         * @type Boolean
         * @default false
         */
        /**
         * @property name
         * @type Object
         */
        /**
         * First `name` of _Customer_
         * @property name.first
         * @type String
         * @default demo
         */
        /**
         * Last `name` of Customer
         * @property name.last
         * @type String
         * @default ''
         */
        /**
         * Date of Birth, expect ISO string, example `'1998-07-28 17:12:26'`
         * @property dateBirth
         * @type String
         * @default ''
         */
        /**
         * `base64` representation of avatar
         * @property imageSrc
         * @type String
         */
        /**
         * @property email
         * @type String
         */
        /**
         * if type of _Customer_=__'Person'__ should determine __Company__ which from __Person__, can be empty
         * @property company
         * @type String
         * @default null
         */
        /**
         * @property address
         * @type Object
         * @default demo
         */
        /**
         * Address `street` of Customer
         * @property address.street
         * @type String
         * @default ''
         */

        type: {type: String, default: ''},
        isOwn: {type: Boolean, default: false},
        name: {
            first: {type: String, default: 'demo'},
            last: {type: String, default: ''}
        },
        dateBirth: Date,
        imageSrc: {
            type: String,
            default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC'
        },
        email: {type: String, default: ''},
        company: {type: ObjectId, ref: 'Customers', default: null},
        department: {type: ObjectId, ref: 'Department', default: null},
        timezone: {type: String, default: 'UTC'},
        address: {
            street: {type: String, default: ''},
            city: {type: String, default: ''},
            state: {type: String, default: ''},
            zip: {type: String, default: ''},
            country: {type: String, default: ''}
        },
        website: {type: String, default: ''},
        jobPosition: {type: String, default: ''},
        skype: {type: String, default: ''},
        phones: {
            phone: {type: String, default: ''},
            mobile: {type: String, default: ''},
            fax: {type: String, default: ''}
        },
        contacts: {type: Array, default: []},
        internalNotes: {type: String, default: ''},
        title: {type: String, default: ''},
        salesPurchases: {
            isCustomer: {type: Boolean, default: true},
            isSupplier: {type: Boolean, default: false},
            salesPerson: {type: ObjectId, ref: 'Employees', default: null},
            salesTeam: {type: ObjectId, ref: 'Department', default: null},
            implementedBy: {type: ObjectId, ref: 'Customers', default: null},
            active: {type: Boolean, default: true},
            reference: {type: String, default: ''},
            language: {type: String, default: 'English'},
            receiveMessages: {type: Number, default: 0}
        },
        relatedUser: {type: ObjectId, ref: 'Users', default: null},
        color: {type: String, default: '#4d5a75'},
        social: {
            FB: {type: String, default: ''},
            LI: {type: String, default: ''}
        },
        whoCanRW: {type: String, enum: ['owner', 'group', 'everyOne'], default: 'everyOne'},
        groups: {
            owner: {type: ObjectId, ref: 'Users', default: null},
            users: [{type: ObjectId, ref: 'Users', default: null}],
            group: [{type: ObjectId, ref: 'Department', default: null}]
        },
        notes: {type: Array, default: []},
        attachments: {type: Array, default: []},
        history: {type: Array, default: []},
        createdBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },
        editedBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },
        companyInfo: {
            size: String,
            industry: {type: ObjectId, ref: 'Industries', default: null}
        },
        ID: Number
    }, {collection: 'Customers'});

    mongoose.model('Customers', customerSchema);

    customerSchema.virtual('fullName').get(function () {
        return this.name.first + ' ' + this.name.last;
    });

    customerSchema.set('toJSON', {virtuals: true});

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['Customer'] = customerSchema;
})();