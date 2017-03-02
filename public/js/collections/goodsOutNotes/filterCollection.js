define([
    'Backbone',
    'collections/parent',
    'models/goodsOutNotesModel',
    'constants'
], function (Backbone, Parent, GoodsOutModel, CONSTANTS) {
    var GoodsOutCollection = Parent.extend({
        model   : GoodsOutModel,
        url     : '/goodsOutNotes/',
        pageSize: CONSTANTS.DEFAULT_ELEMENTS_PER_PAGE,

        initialize: function (options) {
            var page;

            function _errHandler(models, xhr) {
                if (xhr.status === 401) {
                    Backbone.history.navigate('#login', {trigger: true});
                }
            }

            options = options || {};
            options.error = options.error || _errHandler;
            page = options.page;

            this.startTime = new Date();

            if (page) {
                return this.getPage(page, options);
            }

            this.getFirstPage(options);
        }
    });
    return GoodsOutCollection;
});
