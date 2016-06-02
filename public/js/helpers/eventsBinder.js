define([], function () {
    return {
        subscribeCollectionEvents: function (collection, contentView) {
            collection.bind('showmore', contentView.showMoreContent, contentView);
            /* collection.bind('add', contentView.addItem, contentView);
             collection.bind('remove', contentView.removeRow, contentView); */
            collection.bind('showmoreAlphabet', contentView.showMoreAlphabet, contentView);
            collection.bind('fetchFinished', contentView.setPagination, contentView);
        },
        subscribeTopBarEvents    : function (topBarView, contentView) {
            topBarView.bind('createEvent', contentView.createItem, contentView);
            topBarView.bind('editEvent', contentView.editItem, contentView);
            topBarView.bind('deleteEvent', contentView.deleteItems, contentView);
            topBarView.bind('exportToCsv', contentView.exportToCsv, contentView);
            topBarView.bind('exportToXlsx', contentView.exportToXlsx, contentView);
            topBarView.bind('importEvent', contentView.importFiles, contentView);

            // topBarView.bind('showFilteredContent', contentView.showFilteredContent, contentView);
        }
    };
});
