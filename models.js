var models = function (dbsObject) {
    function get(id, collection, schema) {
        return dbsObject[id].model(collection, schema);
    };
    function connection(id) {
        return dbsObject[id];
    }
    return {
        get: get,
        connection: connection
    }
};

module.exports = models;