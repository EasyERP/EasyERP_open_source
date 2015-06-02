/**
 * Created by Roman on 27.05.2015.
 */
var sql = require('mssql');

module.exports = function (configOptions) {
    sql.connect(configOptions, function (err) {
        if (err) {
            console.log(configOptions);
            console.log(err);
        } else {
            console.log('Connected to DB');
        }
    });

    function importData(query, callback) {
        var transaction = new sql.Transaction();

        transaction.begin(function (err) {
            var request;

            if (err) {
                return callback(err);
            }

            request = new sql.Request(transaction);
            request.query(query, function (err, recordset) {
                if (err) {
                    return callback(err);
                }

                callback(null, recordset);
                transaction.commit(function () {
                    console.log("Transaction committed.");
                });
            });
        });

    }

    return {
        importData: importData
    }
};