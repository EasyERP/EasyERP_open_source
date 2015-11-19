var mongoose = require('mongoose');
var objectId = mongoose.Types.ObjectId;

var getEveryOneOption = function () {
    return {
        whoCanRW: "everyOne"
    };
};

var getOwnerOption = function (ownerId) {
    var owner = objectId(ownerId);

    return {
        $and: [
            {
                whoCanRW: 'owner'
            },
            {
                'groups.owner': owner
            }
        ]
    };
};

var getGroupOption = function (userId, groupsId) {
    var groups = groupsId.objectID();
    var user = objectId(userId);

    return {
        $or: [
            {
                $and: [
                    {whoCanRW: 'group'},
                    {'groups.users': user}
                ]
            },
            {
                $and: [
                    {whoCanRW: 'group'},
                    {'groups.group': {$in: groups}}
                ]
            }
        ]
    };
};

module.exports = {
    everyOne: getEveryOneOption,
    group   : getGroupOption,
    owner   : getOwnerOption
};

