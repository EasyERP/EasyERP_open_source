module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var DepartmentSchema = mongoose.Schema({
        departmentName: { type: String, default: 'emptyDepartment' },
        parentDepartment: { type: ObjectId, ref: 'Department', default: null },
        departmentManager: { type: ObjectId, ref: 'Employees', default: null },
        isDevelopment : Boolean,
        users: [{ type: ObjectId, ref: 'Users', default: null }],
        createdBy: {
            user: { type: ObjectId, ref: 'Users', default: null },
            date: { type: Date, default: Date.now }
        },
        editedBy: {
            user: { type: ObjectId, ref: 'Users', default: null },
            date: { type: Date }
        },
        nestingLevel: { type: Number, default: 0 },
        sequence: { type: Number, default: 0 },
        ID: Number
    }, { collection: 'Department' });

    mongoose.model('Department', DepartmentSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['Department'] = DepartmentSchema;
})();