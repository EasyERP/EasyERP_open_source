define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/selectView/selectView',
    'text!templates/taxSettings/TaxCreate.html',
    'models/taxModel',
    'populate',
    'helpers/keyValidator'
], function (Backbone, $, _, SelectView, template, Model, populate, keyValidator) {
    'use strict';

    var EditView = Backbone.View.extend({
        template: _.template(template),

        initialize: function (options) {

            _.bindAll(this, 'render', 'saveItem');

            this.currentModel = new Model();
            this.collection = options.collection;

            this.responseObj = {};

            this.render(options);
        },

        events: {
            'click .current-selected'                          : 'showNewSelect',
            click                                              : 'hideNewSelect',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption',
            'keypress .forNum'                                 : 'keypressHandler'
        },

        keypressHandler: function (e) {
            return keyValidator(e, true);
        },

        saveItem: function () {
            var self = this;
            var thisEl = this.$el;
            var fullName;
            var name = $.trim(thisEl.find('#name').val());
            var code = $.trim(thisEl.find('#code').val());
            var rate = $.trim(thisEl.find('#rate').val());
            var country = $.trim(thisEl.find('#country').attr('data-id'));
            var data;
            var parsedRate = parseFloat(rate);
            var isDefault = thisEl.find('#default').prop('checked');

            if (isNaN(parsedRate)) {
                return App.render({
                    type   : 'error',
                    message: 'Please enter correct Rate'
                });
            }

            if (parsedRate > 100 || parsedRate < 0.01) {
                return App.render({
                    type   : 'error',
                    message: 'Please enter Rate in range from 0.01% up to 100%'
                });
            }

            fullName = code + ' ' + name + ' ' + rate + '%';

            data = {
                name     : name,
                code     : code,
                country  : country,
                fullName : fullName,
                isDefault: isDefault,
                rate     : parsedRate / 100
            };

            if (!code) {
                return App.render({
                    type   : 'error',
                    message: 'Please add Code'
                });
            }

            this.currentModel.save(data, {
                wait   : true,
                success: function (model) {
                    var url = window.location.hash;

                    self.hideDialog();
                    Backbone.history.fragment = '';
                    Backbone.history.navigate(url, {trigger: true});
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
        },

        showNewSelect: function (e) {
            var $target = $(e.target);
            e.stopPropagation();

            if ($target.attr('id') === 'selectInput') {
                return false;
            }

            if (this.selectView) {
                this.selectView.remove();
            }

            this.selectView = new SelectView({
                e          : e,
                responseObj: this.responseObj
            });

            $target.append(this.selectView.render().el);

            return false;
        },

        hideNewSelect: function () {
            $('.newSelectList').hide();

            if (this.selectView) {
                this.selectView.remove();
            }
        },

        chooseOption: function (e) {
            $(e.target).closest('.current-selected').text($(e.target).attr('id')).attr('data-id', $(e.target).attr('id'));

            this.hideNewSelect();
        },

        render: function () {
            var self = this;
            var formString = this.template({
                model: this.currentModel.toJSON()
            });

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                width      : '500px',
                buttons    : [{
                    text : 'Save',
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

            populate.get('#country', '/countries/getForDD', {}, 'name', this, false);

            return this;
        }
    });

    return EditView;
});

