define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/settingsOverview/productDetails/productTypes/EditTemplate.html',
    'populate',
    'constants',
    'helpers/keyValidator',
    'dataService'
], function (Backbone, $, _, Parent, EditTemplate, populate, CONSTANTS, keyValidator, dataService) {
    'use strict';

    var EditView = Parent.extend({
        template: _.template(EditTemplate),

        initialize: function (options) {
            var self = this;

            _.bindAll(this, 'render', 'saveItem');

            if (options.model) {
                this.currentModel = options.model;
            } else {
                this.currentModel = options.collection.getElement();
            }

            this.checkedOptions = [];

            this.collection = options.collection;

            this.responseObj = {};

            dataService.getData('/products/options', {ids: this.currentModel.get('options')}, function (resp) {
                self.options = resp ? resp.data : [];
                self.render(options);
            });
        },

        events: {
            'keypress #paymentTermCount': 'keypressHandler'
        },

        keyDownHandler: function (e) {
            switch (e.which) {
                case 13:
                    this.saveItem();
                    e.stopPropagation();
                    e.preventDefault();
                    break;
                default:
                    break;
            }
        },

        saveItem: function () {
            var self = this;
            var $thisEl = this.$el;
            var $productOptions = $thisEl.find('#productOptions');
            var checkedNow = $productOptions.find($('input:checked'));
            var name = $thisEl.find('#name').val();
            var data = {};
            var symmetricalDifference;

            checkedNow = _.map(checkedNow, function (item) {
                return $(item).data('id');
            });

            symmetricalDifference = (_.difference(this.checkedOptions, checkedNow)).concat(_.difference(checkedNow, this.checkedOptions));

            if (symmetricalDifference.length) {
                data.options = checkedNow;
            }

            data.name = name;

            this.currentModel.set(data);
            this.currentModel.save(this.currentModel.changed, {
                patch  : true,
                wait   : true,
                success: function (model) {
                    var opt;

                    self.hideDialog();

                    opt = model.get('opts');

                    model.set('options', opt);

                    self.collection.set(model, {remove: false});
                },

                error: function (model, response) {
                    App.render({
                        type   : 'error',
                        message: response.error
                    });
                }
            });
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
        },

        keypressHandler: function (e) {
            return keyValidator(e);
        },

        chooseOption: function (e) {
            var $target = $(e.target);

            $('.newSelectList').hide();

            $target.closest('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));
        },

        render: function () {
            var self = this;
            var $thisEl = this.$el;
            var model = this.currentModel.toJSON();
            var formString = this.template({
                model  : model,
                options: this.options
            });
            var checkedNow;
            var $productOptions;

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Edit Bank Account',
                width      : '500px',
                buttons    : [{
                    text : 'Save',
                    class: 'btn blue',
                    click: function () {
                        self.saveItem();
                        self.gaTrackingEditConfirm();
                    }
                }, {
                    text : 'Cancel',
                    class: 'btn',
                    click: function () {
                        self.hideDialog();
                    }
                }]

            });

            $productOptions = this.$el.find('#productOptions');
            checkedNow = $productOptions.find($('input:checked'));

            this.checkedOptions = _.map(checkedNow, function (item) {
                return $(item).data('id');
            });

            populate.get('#currencyDd', CONSTANTS.URLS.CURRENCY_FORDD, {}, 'name', this, true, false, null, null, this.$el);

            this.delegateEvents(this.events);

            return this;
        }
    });

    return EditView;
});
