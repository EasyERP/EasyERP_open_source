define([
    'jQuery',
    'Underscore',
    'views/topBarViewBase',
    'text!templates/Dashboard/TopBarTemplate.html'
], function ($, _, BaseView, TopBarTemplate) {
    var TopBarView = BaseView.extend({
        el           : '#top-bar',
        contentType  : 'Dashboard',
        contentHeader: 'Reports',
        actionType   : null, // Content, Edit, Create
        template     : _.template(TopBarTemplate),

        getIdFromHash: function (hash) {
            var hashItems = hash.split('/');
            return hashItems[hashItems.length - 1];
        }
    });

    return TopBarView;
});
