/**
 * Created by Roman on 02.04.2015.
 */
var logWriter = (function () {
    var fs = require('fs');

    function erfunc(destination, errorString) {
        var _dest = 'log.txt';
        var _error = errorString;
        fs.open(_dest, "a", 0644, function (err, file_handle) {
            if (!err) {
                var date = new Date();
                var res = "------------------------------" + destination + "-------------------------------------------------------\r\n"
                    + date + "\r\n" + _error + "\r\n"
                    + "---------------------------------------------------------------------------------------------------------\r\n";

                fs.write(file_handle, res, null, 'utf8', function (err, written) {
                    if (!err) {
                        fs.close(file_handle);
                    } else {
                        console.log(err);
                    }
                });
            } else {
                console.log(err);
            }
        });
    }
    return {
        log: erfunc
    }
})();
module.exports = logWriter;