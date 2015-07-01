/**
 * Created by Roman on 27.05.2015.
 */

function connectorLoader(configOptions) {
    var csv = configOptions.csv;
    var msSql = configOptions.msSql;
    var sql = configOptions.sql;
    var reqestedUrl;
    var type = csv ? 'csv' : msSql ? 'msSql' : 'sql';
    var Connector;

    if (!type) {
        console.error('Config Options must be provided for importer.js');
        process.exit(1);
    }

    reqestedUrl = './' + type;
    Connector = require(reqestedUrl);

    return Connector.call(null, configOptions[type]);
};

module.exports = function (configOptions) {
    var Connector;

    if (!configOptions) {
        console.error('Config Options must be provided for importer.js');
        process.exit(1);
    }

    Connector = connectorLoader(configOptions);

    this.importData = Connector.importData
};