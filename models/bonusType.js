/**
 * Created by Liliya_Pikiner on 7/1/2015.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var bonusTypeSchema;

    bonusTypeSchema = mongoose.Schema({
        name: {type: String},
        department: {
            _id: {type: ObjectId, ref: 'Department', default: null},
            departmentName: {type: String, default: ""}
        },
        value: {type: Number},
        isPercent: {type: Boolean}
    }, {collection: 'bonusType'});

    mongoose.model('bonusType', bonusTypeSchema);

    if(!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['bonusType'] = bonusTypeSchema;
})();
