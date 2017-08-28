define([
    'Underscore',
    'jQuery',
    'tracker'
], function (_, $, tracker) {
    'use strict';

    return {
        subscribeCollectionEvents: function (collection, contentView) {
            collection.bind('showmore', contentView.showMoreContent, contentView);
            collection.bind('showmoreAlphabet', contentView.showMoreAlphabet, contentView);
            collection.bind('fetchFinished', contentView.setPagination, contentView);
            collection.bind('errorPagination', function (err) {
                App.render({
                    type   : 'error',
                    message: err.statusText || 'Some Error.'
                });
            });

            $(document).on('click', function (e) {
                if (contentView && typeof (contentView.hide) === 'function') {
                    contentView.hide(e);
                }
            });
        },

        subscribeTopBarEvents: function (topBarView, contentView) {
            topBarView.unbind();
            topBarView.bind('createEvent', contentView.createItem, contentView);
            topBarView.bind('editEvent', contentView.editItem, contentView);
            topBarView.bind('deleteEvent', contentView.deleteItems, contentView);
            topBarView.bind('saveEvent', contentView.saveItem, contentView);
            topBarView.bind('exportToCsv', contentView.exportToCsv, contentView);
            topBarView.bind('exportToXlsx', contentView.exportToXlsx, contentView);
            topBarView.bind('exportToPdf', contentView.exportToPdf, contentView);
            topBarView.bind('importEvent', contentView.importFiles, contentView);
            topBarView.bind('copyEvent', contentView.copy, contentView);
            topBarView.bind('generateEvent', contentView.generate, contentView);
            topBarView.bind('generateInvoice', contentView.generateInvoice, contentView);
            topBarView.bind('copyRow', contentView.copyRow, contentView);
            topBarView.bind('pay', contentView.newPayment, contentView);
            topBarView.bind('changeDateRange', contentView.changeDateRange, contentView);
            topBarView.bind('recountAllEvent', contentView.recountAll, contentView);
            topBarView.bind('moveToEdit', contentView.moveToEdit, contentView);
            topBarView.bind('saveAllEvent', contentView.saveDashboard, contentView);
            topBarView.bind('removeAllEvent', contentView.removeAllCharts, contentView);
            topBarView.bind('importFromMagento', contentView.importFromMagento, contentView);
            topBarView.bind('exportToMagento', contentView.exportToMagento, contentView);
            topBarView.bind('configureChannel', contentView.configureChannel, contentView);
            topBarView.bind('publish', contentView.publish, contentView);
            topBarView.bind('unpublish', contentView.unpublish, contentView);
            topBarView.bind('unlink', contentView.unlink, contentView);
            topBarView.bind('goBack', contentView.goBack, contentView);
            topBarView.bind('cancelChanges', contentView.cancelChanges, contentView);
        },

        subscribeCustomChartEvents: function (chartView, gridView) {
            chartView.bind('actionWithChart', gridView.markEngagedCells, gridView);
            chartView.bind('changeDateRange', chartView.changeDateRange, chartView);

        },

        subscribeWindow: function () {
            $(window).on('beforeunload', function (e) {
                var currentUser = App.currentUser || {};

                tracker.track({
                    date   : new Date(),
                    name   : 'sessionEnd',
                    message: 'sessionEnd',
                    email  : currentUser.email,
                    login  : currentUser.login,
                  mobilePhone:currentUser.mobilePhone
                });
                tracker.track({
                    date     : new Date(),
                    eventType: 'userFlow',
                    name     : 'close',
                    message  : 'close',
                    email    : currentUser.email,
                    login    : currentUser.login,
                  mobilePhone:currentUser.mobilePhone
                });

                App.Tracker.send.call(App.Tracker);
            });
        }
    };
});
