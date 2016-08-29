define([
    'dataService',
    'constants'
], function (dataService, CONSTANTS) {
    function Tracker() {
        var untracktedEvents = [];
        var inProgress = false;

        this.track = function (data) {
            untracktedEvents.push(data);
        };

        this.send = function () {
            var url = CONSTANTS.TRACKER_URL;
            var data = untracktedEvents;

            if (!inProgress && data.length) {
                inProgress = true;

                untracktedEvents = [];

                dataService.postData(url, data, function (err) {
                    inProgress = !!err;
                });
            }
        };
    }

    function initialize() {
        if (App.Tracker) {
            return App.Tracker;
        }

        App.Tracker = new Tracker();

        setInterval(function () {
            App.Tracker.send.call(App.Tracker);
        }, 60000);

        return App.Tracker;
    }

    return initialize();
});
