var models = function (dbsObject) {
    function get(id, collection, schema) {
        var model;
        var error;

        if (!id) {

            error = new Error('Please Authorize before');

            error.status = 401;
            throw error;
        }

        model = dbsObject[id] && dbsObject[id].models[collection];

        return model || dbsObject[id] && dbsObject[id].model(collection, schema);
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
