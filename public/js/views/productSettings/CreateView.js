define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/productSettings/CreateTemplate.html',
    'models/OptionsModel',
    'views/dialogViewBase',
    'common',
    'custom',
    'populate',
    'constants'
], function (Backbone, $, _, CreateTemplate, Model, dialogViewBase, common, Custom, populate, CONSTANTS) {

    var CreateView = dialogViewBase.extend({
        el         : '#content-holder',
        contentType: CONSTANTS.PRODUCTS_SETTINGS,
        template   : _.template(CreateTemplate),
        events     : {},

        initialize: function () {
            _.bindAll(this, 'saveItem', 'render');
            this.model = new Model();
            this.responseObj = {};
            this.render();
        },

        saveItem: function (e) {
            var thisEl = this.$el;
            var self = this;
            var mid = 39;
            var optionName = $.trim(thisEl.find('#optionName').val());
            var url;

            this.model.save(
                {
                    name: optionName
                }, {
                    headers: {
                        mid: mid
                    },
                    wait   : true,
                    success: function () {
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
                buttons    : [
                    {
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
