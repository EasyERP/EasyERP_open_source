var models = function (dbsObject) {
    function get(id, collection, schema) {
        if(!id){
            throw new Error('Please Authorize before');
        }
        return dbsObject[id].model(collection, schema);
    };
    function connection(id) {
        return dbsObject[id];
    };

    return {
        get: get,
        connection: connection
    };
};

module.exports = models;