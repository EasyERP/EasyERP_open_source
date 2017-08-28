module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var stepsSchema = new mongoose.Schema({
        operation  : {type: String},
        workCentre : {type: ObjectId, ref: 'workCentres'},
        description: {type: String},
        duration   : {type: Number}
    });

    var routingSchema = new mongoose.Schema({
        name : {type: String},
        steps: [stepsSchema],

        createdBy: {
            date: {type: Date, default: Date.now},
            user: {type: ObjectId, ref: 'Users', default: null}
        },

        editedBy: {
            date: {type: Date, default: Date.now},
            user: {type: ObjectId, ref: 'Users', default: null}
        }
    }, {collection: 'routing'});

    mongoose.model('routing', routingSchema);
    mongoose.Schemas.routing = routingSchema;
})();

