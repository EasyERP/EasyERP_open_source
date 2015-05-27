/**
 * Created by Roman on 27.05.2015.
 */

function connectorLoader(configOptions) {
    var csv = configOptions.csv;
    var msSql = configOptions.msSql;
    var sql = configOptions.sql;
    var reqestedUrl;
    var type = csv ? 'csvParser' : msSql ? 'msSql' : 'sql';

    if (!type) {
        console.error('Config Options must be provided for importer.js');
        process.exit(1);
    }

    reqestedUrl = './' + type + '/';

    return require(reqestedUrl);
};

module.exports = function (configOptions) {
    var Connector;

    if (!configOptions) {
        console.error('Config Options must be provided for importer.js');
        process.exit(1);
    }

    Connector = connectorLoader(configOptions);


};