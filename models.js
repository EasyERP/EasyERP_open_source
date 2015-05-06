var models = function (dbsObject) {
    function get(id, collection, schema) {
        return dbsObject[id].model(collection, schema);
    }
    return {
        get: get
    }
};

module.exports = models;