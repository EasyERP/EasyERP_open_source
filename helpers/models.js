var models = function (dbsObject) {
    function get(id, collection, schema) {
        var model;

        if (!id) {
            throw new Error('Please Authorize before');
        }

        model = dbsObject[id].models[collection];

        return model || dbsObject[id].model(collection, schema);
    }

    function connection(id) {
        return dbsObject[id];
    }

    return {
        get       : get,
        connection: connection
    };
};

module.exports = models;
