
module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var opportunitiesSchema = mongoose.Schema({
        /**
         * @module Lead
         * @class Lead
         * @property {Boolean} isOpportunitie - Is Opportunity, proper values are: _'true'_, _'false'_
         *
         * @property {String} jobkey
         *
         * @property {Array} attachments - Some files
         *
         * @property {String} notes - Some notes
         *
         * @property {Date} convertedDate - Date, when Lead was converted into Opportunity
         *
         * @property {Boolean} isConverted
         *
         * @property {String} source - Where _Lead_ was found
         *
         * @property {String} campaign
         *
         * @property {Object} createdBy
         * @property {String} createdBy.users - Created by user
         * @property {Date} createdBy.date - Creation date
         *
         * @property {Object} editedBy
         * @property {String} editedBy.users - Edited by user
         * @property {Date} editedBy.date - Edited on date
         *
         * @property {Number} sequence
         *
         * @property {Object} groups - `Groups` of _Lead_
         * @property {String} groups.users
         * @property {String} groups.group
         *
         * @property {String} whoCanRW
         *
         *
         * @property {String} workflow
         *
         * @property {String} reffered
         *
         * @property {Boolean} optout
         *
         * @property {Boolean} active
         *
         * @property {Object} categories - Information about categories
         * @property {String} categories.name
         * @property {String} categories.id
         *
         * @property {String} priority - default 'Trivial'
         *
         * @property {Date} expectedClosing
         *
         * @property {Object} nextAction - Information about next action
         * @property {String} nextAction.desc
         * @property {Date} nextAction.date
         *
         * @property {String} internalNotes - Some notes
         *
         * @property {String} salesPerson - Sales person
         *
         * @property {Object} phones - `Phones` of _Lead_
         * @property {String} phones.mobile - `mobile` of _Lead_
         * @property {String} phones.phone - `phone` of _Lead_
         * @property {String} phones.fax - `fax` of _Lead_
         *
         * @property {String} email - Email
         *
         * @property {Object} contactName - Name of contact person
         * @property {String} contactName.last
         * @property {String} contactName.first
         *
         * @property {Object} address - `Address` of _Lead_
         * @property {String} address.street - Address `street` of _Lead_
         * @property {String} address.city - Address `city` of _Lead_
         * @property {String} address.state - Address `state` of _Lead_
         * @property {String} address.zip - Address `zip` of _Lead_
         * @property {String} address.country - Address `country` of _Lead_
         *
         * @property {String} customer
         *
         * @property {String} company - Company of _Lead_
         *
         * @property {String} tempCompanyField
         *
         * @property {Date} creationDate - DAte when _Lead_ was created
         *
         * @property {Object} expectedRevenue - Expected revenue
         * @property {String} expectedRevenue.currency
         * @property {Number} expectedRevenue.progress
         * @property {Number} expectedRevenue.value
         *
         * @property {String} name
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