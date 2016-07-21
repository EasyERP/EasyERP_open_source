define([
    'jQuery',
    'Underscore',
    'text!templates/Proforma/TopBarTemplate.html',
    'views/topBarViewBase',
    'custom',
    'common',
    'constants'
], function ($, _, ContentTopBarTemplate, BaseView, Custom, Common, CONSTANTS) {
    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.PROFORMA,
        template   : _.template(ContentTopBarTemplate),

        initialize: function (options) {
            if (options.collection) {
                this.collection = options.collection;
            }
            this.render();

            this.hideSaveCancelBtns();
        },

        hideSaveCancelBtns: function () {
            var createBtnEl = $('#top-bar-createBtn');
            var saveBtnEl = $('#top-bar-saveBtn');
            var cancelBtnEl = $('#top-bar-deleteBtn');

            createBtnEl.remove();
            saveBtnEl.hide();
            cancelBtnEl.hide();

            return false;
        }
    });

    return TopBarView;
});
