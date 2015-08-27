
module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var tasksSchema = mongoose.Schema({
        summary: { type: String, default: '' },
        taskCount: { type: Number, default: 0 },
        project: { type: ObjectId, ref: 'Project', default: null },
        assignedTo: { type: ObjectId, ref: 'Employees', default: null },
        tags: [String],
        description: String,
        priority: { type: String, default: 'P3' },
        sequence: { type: Number, default: 0 },
        customer: { type: ObjectId, ref: 'Customers', default: null },
        StartDate: { type: Date, default: Date.now },
        EndDate: { type: Date, default: Date.now },
        duration: { type: Number, default: 0 },
        workflow: { type: ObjectId, ref: 'workflows', default: null },
        type: { type: String, default: '' },
        estimated: { type: Number, default: 0 },
        logged: { type: Number, default: 0 },
        remaining: { type: Number, default: 0 },
        progress: { type: Number, default: 0 },
        createdBy: {
            user: { type: ObjectId, ref: 'Users', default: null },
            date: { type: Date, default: Date.now }
        },
        notes: { type: Array, default: [] },
        attachments: { type: Array, default: [] },
        editedBy: {
            user: { type: ObjectId, ref: 'Users', default: null },
            date: { type: Date }
        }
    }, { collection: 'Tasks' });

    mongoose.model('Tasks', tasksSchema);

    if(!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['Task'] = tasksSchema;
})();