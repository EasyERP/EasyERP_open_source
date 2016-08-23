define([
    'dataService',
    'constants'
], function (dataService, CONSTANTS) {
    function track(data) {
        var url = CONSTANTS.TRACKER_URL + '/events';

        dataService.postData(url, data, function () {

        });
    }

    return {
        track: track
    };
});
