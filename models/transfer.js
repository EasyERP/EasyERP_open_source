module.exports = (function () {
    'use strict';
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var transferSchema = new mongoose.Schema({

        date                : Date,
        status              : {type: String, enum: ['hired', 'fired', 'updated', 'transfer'], default: 'updated'},
        department          : {type: ObjectId, ref: 'Department', default: null},
        jobPosition         : {type: ObjectId, ref: 'JobPosition', default: null},
        manager             : {type: ObjectId, ref: 'Employees', default: null},
        weeklyScheduler     : {type: ObjectId, ref: 'weeklyScheduler', default: null},
        jobType             : {type: String, default: ''},
        salary              : {type: Number, default: 0},
        info                : {type: String, default: ''},
        employee            : {type: ObjectId, ref: 'Employees'},
        scheduledPay        : {type: ObjectId, ref: 'scheduledPays', default: null},
        payrollStructureType: {type: ObjectId, ref: 'payrollStructureTypes', default: null},
        transferKey         : {type: Number}

    }, {collection: 'transfers'});

    mongoose.model('transfer', transferSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.Transfer = transferSchema;
})();
