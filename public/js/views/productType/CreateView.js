define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/productType/CreateTemplate.html',
    'views/dialogViewBase',
    'models/ProductTypeModel',
    'common',
    'custom',
    'populate',
    'constants'
], function (Backbone, $, _, CreateTemplate, dialogViewBase, Model, common, Custom, populate, CONSTANTS) {

    var CreateView = dialogViewBase.extend({
        el         : '#content-holder',
        contentType: CONSTANTS.PRODUCTTYPE,
        template   : _.template(CreateTemplate),
        events     : {},

        initialize: function (options) {
            _.bindAll(this, 'saveItem', 'render');
            this.model = new Model();
            this.responseObj = {};
            this.render();
        },

        saveItem: function () {
            var thisEl = this.$el;
            var self = this;
            var mid = 39;
            var pTypeName = $.trim(thisEl.find('#productTypeName').val());
            var url;

            this.model.save({
                name: pTypeName
            }, {
                headers: {
                    mid: mid
                },
                wait   : true,
                success: function (model) {
                    url = window.location.hash;

                    Backbone.history.fragment = '';
                    Backbone.history.navigate(url, {trigger: true});
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        hideDialog: function () {
            $('.create-dialog').remove();
        },

        hideNewSelect: function (e) {
            $('.newSelectList').hide();
        },

        showNewSelect: function (e, prev, next) {
            populate.showSelect(e, prev, next, this);
            return false;
        },

        chooseOption: function (e) {
            var $target = $(e.target);

            $target.parents('dd').find('.current-selected').text($target.text()).attr('data-id', $target.attr('id')).attr('data-level', $target.data('level')).attr('data-fullname', $target.data('fullname'));
        },

        render: function () {
            var self = this;
            var formString = this.template({});

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'create-dialog',
                width      : '600px',
                buttons    : [{
                    text : 'Create',
                    class: 'btn blue',
                    click: function () {
                        self.saveItem();
                    }
                }, {
                    text : 'Cancel',
                    class: 'btn',
                    click: function () {
                        self.hideDialog();
                    }
                }]

            });

            this.delegateEvents(this.events);

            return this;
        }
    });

    return CreateView;
});
