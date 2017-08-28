module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var tasksSchema = mongoose.Schema({
        taskCount  : {type: Number, default: 0},
        deal       : {type: ObjectId, ref: 'Opportunities', default: null},
        dealDate   : Date,
        assignedTo : {type: ObjectId, ref: 'Employees', default: null},
        category   : {type: ObjectId, ref: 'tags', default: null},
        description: String,
        sequence   : {type: Number, default: 0},
        company    : {type: ObjectId, ref: 'Customers', default: null},
        companyDate: Date,
        contact    : {type: ObjectId, ref: 'Customers', default: null},
        contactDate: Date,
        dueDate    : {type: Date, default: Date.now},
        workflow   : {type: ObjectId, ref: 'workflows', default: null},
        type       : {type: String, default: ''},
        notes      : {type: Array, default: []},
        attachments: {type: Array, default: []},
        editedBy   : {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },

        ID: Number
    }, {collection: 'DealTasks'});

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.model('DealTasks', tasksSchema);

    mongoose.Schemas.DealTasks = tasksSchema;
})();
