/**
 * Created by Roman on 09.04.2015.
 */
module.exports = function(arrayOfSessions, dbsObject){
    var lastDbsArray = [];
    var _ = require('underscore');

    arrayOfSessions.forEach(function (sessionObject) {
        var lastDb;
        var session;
        var now = new Date();
        var sessionDate;

        try {
            session = JSON.parse(sessionObject.session);
            sessionDate = new Date(sessionObject.expires);
            lastDb = session.lastDb;

            if (sessionDate > now) {
                if (lastDb && !dbsObject[lastDb]) {
                    lastDbsArray.push(lastDb);
                }
            }
        } catch (exc) {
            console.error(exc);
        }

    });

    lastDbsArray = _.unique(lastDbsArray);

    return lastDbsArray;

};