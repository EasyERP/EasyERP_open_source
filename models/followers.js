module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var Schema = new mongoose.Schema({
        date          : {type: Date, default: Date.now},
        followerId    : {type: ObjectId, ref: 'Users', default: null},
        contentId     : {type: ObjectId, default: null},
        collectionName: {type: String, default: ''},

        createdBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },

        editedBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        }
    }, {collection: 'followers'});

    mongoose.model('followers', Schema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.followers = Schema;
})();
