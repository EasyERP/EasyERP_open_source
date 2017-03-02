define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/invoice/form/ContentView'
], function (Backbone, $, _, ParentView) {

    var EditView = ParentView.extend({
        contentType: 'invoice',
        imageSrc   : '',
        dialog     : true,

        initialize: function (options) {
            this.eventChannel = options.eventChannel;

            this.isWtrack = !!options.isWtrack;
            this.filter = options.filter;

            this.currentModel = (options.model) ? options.model : options.collection.getElement();
            this.currentModel.urlRoot = '/invoice';
            this.responseObj = {};

            this.redirect = options.redirect;
            this.collection = options.collection;

            this.notCreate = options.notCreate ? false : true;

            options.dialog = true;

            this.editItem(null, options);
        }
    });

    return EditView;
});
