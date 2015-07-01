/**
 * Created by Roman on 04.04.2015.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var opportunitiesSchema = mongoose.Schema({
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