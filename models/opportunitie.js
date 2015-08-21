/**
 * Created by Roman on 04.04.2015.
 */

/**
 * Base Url
 * @module Leads
 * @namespace EasyERP
 * @class Leads
 * @constructor
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var opportunitiesSchema = mongoose.Schema({
        /**
         * Is Opportunity, proper values are: _'true'_, _'false'_
         * @property isOpportunitie
         * @type Boolean
         * @default false
         */
        /**
         * @property jobkey
         * @type String
         */
        /**
         * @property attachments
         * @type Array
         * @default []
         */
        /**
         * @property notes
         * @type Array
         * @default []
         */
        /**
         * @property convertedDate
         * @type Date
         * @default Date.now
         */
        /**
         * @property isConverted
         * @type Boolean
         * @default false
         */
        /**
         * @property source
         * @type String
         * @default ''
         */
        /**
         * @property campaign
         * @type String
         * @default ''
         */
        /**
         * @property createdBy
         * @type Object
         */
        /**
         * Created by `createdBy.user`
         * @property createdBy.user
         * @type String
         */
        /**
         * Created on `createdBy.date`
         * @property createdBy.date
         * @type Date
         * @default Date.now
         */
        /**
         * @property editedBy
         * @type Object
         */
        /**
         * Edited last time by `editedBy.user`
         * @property editedBy.user
         * @type String
         */
        /**
         * Edited last time on `editedBy.date`
         * @property editedBy.date
         * @type Date
         * @default Date.now
         */
        /**
         * @property sequence
         * @type Number
         * @default 0
         */
        /**
         * @property groups
         * @type Object
         */
        /**
         * Groups `users`
         * @property groups.users
         * @type Array
         */
        /**
         * Groups `group`
         * @property groups.group
         * @type Array
         */
        /**
         * @property whoCanRW
         * @type String
         * @default 'everyOne'
         */
        /**
         * @property workflow
         * @type String
         * @default null
         */
        /**
         * @property reffered
         * @type String
         * @default ''
         */
        /**
         * @property optout
         * @type Boolean
         * @default false
         */
        /**
         * @property active
         * @type Boolean
         * @default true
         */
        /**
         * @property categories
         * @type Object
         */
        /**
         *  `categories`
         * @property categories.name
         * @type String
         * @default ''
         */
        /**
         *  `categories`
         * @property categories.id
         * @type String
         * @default ''
         */
        /**
         * @property priority
         * @type String
         * @default 'Trivial'
         */
        /**
         * @property expectedClosing
         * @type Date
         * @default null
         */
        /**
         * @property nextAction
         * @type Object
         */
        /**
         *  `nextAction`
         * @property nextAction.desc
         * @type String
         * @default ''
         */
        /**
         *  `nextAction`
         * @property nextAction.date
         * @type Date
         * @default Date.now
         */
        /**
         * @property internalNotes
         * @type String
         * @default ''
         */
        /**
         * @property salesTeam
         * @type String
         * @default ''
         */
        /**
         * @property salesPerson
         * @type String
         * @default null
         */
        /**
         * @property func
         * @type String
         * @default ''
         */
        /**
         * @property phones
         * @type Object
         */
        /**
         * Contacts `phone`
         * @property phones.phone
         * @type String
         * @default ''
         */
        /**
         * Contacts `mobile`
         * @property phones.mobile
         * @type String
         * @default ''
         */
        /**
         * Contacts `fax`
         * @property phones.fax
         * @type String
         * @default ''
         */
        /**
         * @property email
         * @type String
         * @default ''
         */
        /**
         * @property contactName
         * @type Object
         */
        /**
         * @property contactName.last
         * @type String
         * @default ''
         */
        /**
         * @property contactName.first
         * @type String
         * @default ''
         */
        /**
         * @property address
         * @type Object
         * @default demo
         */
        /**
         * Address `street`
         * @property address.street
         * @type String
         * @default ''
         */
        /**
         * Address `city`
         * @property address.city
         * @type String
         * @default ''
         */
        /**
         * Address `state`
         * @property address.state
         * @type String
         * @default ''
         */
        /**
         * Address `zip`
         * @property address.zip
         * @type String
         * @default ''
         */
        /**
         * Address `country`
         * @property address.country
         * @type String
         * @default ''
         */
        /**
         * @property customer
         * @type String
         * @default null
         */
        /**
         * @property company
         * @type String
         * @default null
         */
        /**
         * @property tempCompanyField
         * @type String
         * @default null
         */
        /**
         * @property creationDate
         * @type Date
         * @default Date.now
         */
        /**
         * @property expectedRevenue
         * @type Object
         * @default demo
         */
        /**
         * Address `currency`
         * @property expectedRevenue.currency
         * @type String
         * @default ''
         */
        /**
         * Address `city`
         * @property expectedRevenue.progress
         * @type Number
         * @default 0
         */
        /**
         * Address `state`
         * @property expectedRevenue.value
         * @type Number
         * @default 0
         */
        /**
         * @property name
         * @type String
         * @default ''
         */
        isOpportunitie: {type: Boolean, default: false, index: true},
        jobkey: {type: String},
        name: {type: String, default: ''},
        expectedRevenue: {
            value: {type: Number, default: 0},
            progress: {type: Number, default: 0},
            currency: {type: String, default: ''}
        },
        creationDate: {type: Date, default: Date.now},
        tempCompanyField: {type: String, default: ''},
        company: {type: ObjectId, ref: 'Customers', default: null},
        customer: {type: ObjectId, ref: 'Customers', default: null},
        address: {
            street: {type: String, default: ''},
            city: {type: String, default: ''},
            state: {type: String, default: ''},
            zip: {type: String, default: ''},
            country: {type: String, default: ''}
        },
        contactName: {
            first: {type: String, default: ''},
            last: {type: String, default: ''}
        },
        email: {type: String, default: ''},
        phones: {
            mobile: {type: String, default: ''},
            phone: {type: String, default: ''},
            fax: {type: String, default: ''}
        },
        func: {type: String, default: ''},
        salesPerson: {type: ObjectId, ref: 'Employees', default: null},
        salesTeam: {type: ObjectId, ref: 'Department', default: null},
        internalNotes: {type: String, default: ''},
        nextAction: {
            desc: {type: String, default: ''},
            date: {type: Date, default: Date.now}
        },
        expectedClosing: {type: Date, default: null},
        priority: {type: String, default: 'Trivial'},
        categories: {
            id: {type: String, default: ''},
            name: {type: String, default: ''}
        },
        color: {type: String, default: '#4d5a75'},
        active: {type: Boolean, default: true},
        optout: {type: Boolean, default: false},
        reffered: {type: String, default: ''},
        workflow: {type: ObjectId, ref: 'workflows', default: null},
        whoCanRW: {type: String, enum: ['owner', 'group', 'everyOne'], default: 'everyOne'},
        groups: {
            owner: {type: ObjectId, ref: 'Users', default: null},
            users: [{type: ObjectId, ref: 'Users', default: null}],
            group: [{type: ObjectId, ref: 'Department', default: null}]
        },
        sequence: {type: Number, default: 0},
        createdBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },
        editedBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },
        campaign: {type: String, default: ''},
        source: {type: String, default: ''},
        isConverted: {type: Boolean, default: false},
        convertedDate: {type: Date, default: Date.now},
        notes: {type: Array, default: []},
        attachments: {type: Array, default: []}

    }, {collection: 'Opportunities'});

    mongoose.model('Opportunities', opportunitiesSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['Opportunitie'] = opportunitiesSchema;
})();