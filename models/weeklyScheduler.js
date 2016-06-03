module.exports = (function () {
    var mongoose = require('mongoose');

    var weeklySchedulerSchema = mongoose.Schema({
        name      : {type: String, default: ''},
        1         : {type: Number, default: 0},
        2         : {type: Number, default: 0},
        3         : {type: Number, default: 0},
        4         : {type: Number, default: 0},
        5         : {type: Number, default: 0},
        6         : {type: Number, default: 0},
        7         : {type: Number, default: 0},
        totalHours: {type: Number, default: 0}
    }, {collection: 'weeklySchedulers'});

    mongoose.model('weeklyScheduler', weeklySchedulerSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.weeklyScheduler = weeklySchedulerSchema;
})();
