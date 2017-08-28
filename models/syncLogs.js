module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var successSchema = new mongoose.Schema({
        _id              : false,
        entityId         : {type: String, default: ''},
        entityDescription: {type: String, default: ''},
        message          : {type: String, default: ''},
        type             : {type: String, enum: ['create', 'update'], default: 'create'},
        status           : {type: Number, min: 1, max: 3, default: 1} // 1 - success, 2 - unlink, 3 - conflict
    });

    var errorSchema = new mongoose.Schema({
        _id              : false,
        entityId         : {type: String, default: ''},
        entityDescription: {type: String, default: ''},
        message          : {type: String, default: ''},
        isCritical       : {type: Boolean, default: false}
    });

    var syncLogsSchema = new mongoose.Schema({
        channel            : {type: ObjectId, ref: 'integrations', default: null},
        user               : {type: ObjectId, ref: 'Users', default: null},
        date               : {type: Date, default: Date.now},
        status             : {type: Number, min: 1, max: 3, default: 1}, // 1 - success, 2 - warning, 3 - critical
        errorsCount        : {type: Number, default: 0},
        criticalErrorsCount: {type: Number, default: 0},
        exports            : {
            categories: {
                isComplete: {type: Boolean, default: true},
                data      : [successSchema],
                errors    : [errorSchema],
                succeed   : {type: Number, default: 0},
                unlinked  : {type: Number, default: 0},
                conflicted: {type: Number, default: 0}
            },

            products: {
                isComplete: {type: Boolean, default: true},
                data      : [successSchema],
                errors    : [errorSchema],
                succeed   : {type: Number, default: 0},
                unlinked  : {type: Number, default: 0},
                conflicted: {type: Number, default: 0}
            },

            inventory: {
                isComplete: {type: Boolean, default: true},
                data      : [successSchema],
                errors    : [errorSchema],
                succeed   : {type: Number, default: 0},
                unlinked  : {type: Number, default: 0},
                conflicted: {type: Number, default: 0}
            }
        },

        imports: {
            categories: {
                isComplete: {type: Boolean, default: true},
                data      : [successSchema],
                errors    : [errorSchema],
                succeed   : {type: Number, default: 0},
                unlinked  : {type: Number, default: 0},
                conflicted: {type: Number, default: 0}
            },

            products: {
                isComplete: {type: Boolean, default: true},
                data      : [successSchema],
                errors    : [errorSchema],
                succeed   : {type: Number, default: 0},
                unlinked  : {type: Number, default: 0},
                conflicted: {type: Number, default: 0}
            },

            customers: {
                isComplete: {type: Boolean, default: true},
                data      : [successSchema],
                errors    : [errorSchema],
                succeed   : {type: Number, default: 0},
                unlinked  : {type: Number, default: 0},
                conflicted: {type: Number, default: 0}
            },

            orders: {
                isComplete: {type: Boolean, default: true},
                data      : [successSchema],
                errors    : [errorSchema],
                succeed   : {type: Number, default: 0},
                unlinked  : {type: Number, default: 0},
                conflicted: {type: Number, default: 0}
            },

            invoice: {
                isComplete: {type: Boolean, default: true},
                data      : [successSchema],
                errors    : [errorSchema],
                succeed   : {type: Number, default: 0},
                unlinked  : {type: Number, default: 0},
                conflicted: {type: Number, default: 0}
            }
        }
    }, {collection: 'syncLogs'});

    mongoose.model('syncLogs', syncLogsSchema);
    mongoose.Schemas.syncLogs = syncLogsSchema;
})();

