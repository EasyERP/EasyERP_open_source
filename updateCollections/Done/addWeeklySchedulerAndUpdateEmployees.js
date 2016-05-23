var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

require('../../models/index.js');

var weeklySchedulerSchema = mongoose.Schemas.weeklyScheduler;
var employeeSchema = mongoose.Schemas.Employee;

var connectOptions = {
    user: 'easyErp',
    pass: '1q2w3e!@#',
    w: 1,
    j: true
};

var dbObject = mongoose.createConnection('localhost', 'production', 27017, connectOptions);

dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
});

var WeeklyScheduler = dbObject.model("weeklyScheduler", weeklySchedulerSchema);
var Employee = dbObject.model("Employees", employeeSchema);

var newWeeklyScheduler = [
    {
        "_id" : ObjectId("57332c3b94ee1140b6bb49e2"),
        "name" : "UA-40",
        "1" : 8,
        "2" : 8,
        "3" : 8,
        "4" : 8,
        "5" : 8,
        "6" : 0,
        "7" : 0,
        "totalHours" : 40
    }
];

WeeklyScheduler.collection.insert(newWeeklyScheduler, function (err, success) {
    if (err) {
        console.error(err);
    }
    Employee.find({}, function(err, employees) {
        if (err) {
            console.error(err);
        }
        employees.forEach(function(emp) {
            emp.weeklyScheduler = ObjectId("57332c3b94ee1140b6bb49e2");

            emp.transfer.forEach(function(transf) {
                transf.weeklyScheduler = ObjectId("57332c3b94ee1140b6bb49e2");
            });

            emp.save();
        });

        console.log(success);
    });
});
