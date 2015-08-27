/**
 * Created by Roman on 04.04.2015.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var customerSchema = mongoose.Schema({
        type: { type: String, default: '' },
        isOwn: { type: Boolean, default: false },
        name: {
            first: { type: String, default: 'demo' },
            last: { type: String, default: '' }
        },
        dateBirth: Date,
        imageSrc: { type: String, default: 'data:image/png;base64,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' },
        email: { type: String, default: '' },
        company: { type: ObjectId, ref: 'Customers', default: null },
        department: { type: ObjectId, ref: 'Department', default: null },
        timezone: { type: String, default: 'UTC' },
        address: {
            street: { type: String, default: '' },
            city: { type: String, default: '' },
            state: { type: String, default: '' },
            zip: { type: String, default: '' },
            country: { type: String, default: '' }
        },
        website: { type: String, default: '' },
        jobPosition: { type: String, default: '' },
        skype: { type: String, default: '' },
        phones: {
            phone: { type: String, default: '' },
            mobile: { type: String, default: '' },
            fax: { type: String, default: '' }
        },
        contacts: { type: Array, default: [] },
        internalNotes: { type: String, default: '' },
        title: { type: String, default: '' },
        salesPurchases: {
            isCustomer: { type: Boolean, default: true },
            isSupplier: { type: Boolean, default: false },
            salesPerson: { type: ObjectId, ref: 'Employees', default: null },
            salesTeam: { type: ObjectId, ref: 'Department', default: null },
            implementedBy: { type: ObjectId, ref: 'Customers', default: null },
            active: { type: Boolean, default: true },
            reference: { type: String, default: '' },
            language: { type: String, default: 'English' },
            receiveMessages: { type: Number, default: 0 }
        },
        relatedUser: { type: ObjectId, ref: 'Users', default: null },
        color: { type: String, default: '#4d5a75' },
        social: {
            FB: { type: String, default: '' },
            LI: { type: String, default: '' }
        },
        whoCanRW: { type: String, enum: ['owner', 'group', 'everyOne'], default: 'everyOne' },
        groups: {
            owner: { type: ObjectId, ref: 'Users', default: null },
            users: [{ type: ObjectId, ref: 'Users', default: null }],
            group: [{ type: ObjectId, ref: 'Department', default: null }]
        },
        notes: { type: Array, default: [] },
        attachments: { type: Array, default: [] },
        history: { type: Array, default: [] },
        createdBy: {
            user: { type: ObjectId, ref: 'Users', default: null },
            date: { type: Date, default: Date.now }
        },
        editedBy: {
            user: { type: ObjectId, ref: 'Users', default: null },
            date: { type: Date, default: Date.now }
        },
        companyInfo: {
            size: String,
            industry: {type: ObjectId, ref: 'Industries', default: null}
        },
        ID: Number
    }, { collection: 'Customers' });

    mongoose.model('Customers', customerSchema);

    customerSchema.virtual('fullName').get(function(){
        return this.name.first + ' ' + this.name.last;
    });

    customerSchema.set('toJSON', { virtuals: true });

    if(!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['Customer'] = customerSchema;
})();