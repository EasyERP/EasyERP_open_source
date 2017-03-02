define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/settingsOverview/Accounting/rates/EditTemplate.html',
    'moment',
    'populate',
    'helpers/keyValidator'
], function (Backbone, $, _, Parent, EditTemplate, moment, populate, keyValidator) {
    'use strict';

    var EditView = Parent.extend({
        template: _.template(EditTemplate),

        initialize: function (options) {

            _.bindAll(this, 'render', 'saveItem');

            if (options.model) {
                this.currentModel = options.model;
            } else {
                this.currentModel = options.collection.getElement();
            }

            this.collection = options.collection;

            this.responseObj = {};

            this.render(options);
        },

        events: {
            'click #createRate'    : 'createRate',
            'click td.editable'    : 'editRow',
            'keydown input.editing': 'keyDown',
            click                  : 'removeInputs',
            'click .goToRemove'    : 'removeRow'
        },

        removeRow: function (e) {
            $(e.target).closest('tr').remove();
        },

        removeInputs: function (e) {
            var $target = e ? $(e.target) : null;

            if ($target && $target.closest('td').hasClass('editable')) {
                return false;
            }

            this.$el.find('input.editing').each(function () {
                $(this).closest('td').text($(this).val());

                $(this).remove();
            });

            if (this.selectView) {
                this.selectView.remove();
            }
        },

        keyDown: function (e) {
            return keyValidator(e, true);
        },

        editRow: function (e) {
            var $target = $(e.target).closest('td');
            var tempContainer;
            var width;

            if ($(e.target).hasClass('editing')) {  // added in case of double click on el
                return false;
            }

            tempContainer = $target.text();
            width = $target.width() - 6;
            $target.html('<input class="editing" type="text" value="' + tempContainer + '"  maxLength="10" style="width:' + width + 'px">');
        },

        chooseOption: function (e) {
            var $target = $(e.target);

            $target.closest('a.current-selected').text($(e.target).attr('id')).attr('data-id', $(e.target).attr('id'));
        },

        createRate: function () {
            var thisEl = this.$el;
            var tbodyNew = thisEl.find('#create');

            var tr = '<tr><td><a class="from current-selected" data-content="currency" href="javascript:;">From</a></td><td><a data-content="currency" class="to current-selected" href="javascript:;">To</a></td><td class="rate editable" data-type="input">1</td><td><a href="javascript:;" class="icon-trash goToRemove _actionCircleBtn" aria-hidden="true"></a></td></tr>';

            tbodyNew.append(tr);
        },

        saveItem: function () {
            var self = this;
            var thisEl = this.$el;
            var rates = {};
            var date = moment(new Date($.trim(thisEl.find('#date').text()))).format('YYYY-MM-DD');
            var data;
            var tbody = thisEl.find('#currencyTable');
            var tbodyNew = thisEl.find('#create');

            this.removeInputs();

            tbody.find('tr').each(function () {
                var from = $.trim($(this).find('.from').text());
                var to = $.trim($(this).find('.to').text());
                var rate = $.trim($(this).find('.rate').text());

                if (!rates[from]) {
                    rates[from] = {};
                }

                rates[from][to] = rate;
            });

            tbodyNew.find('tr').each(function () {
                var from = $.trim($(this).find('.from').attr('data-id'));
                var to = $.trim($(this).find('.to').attr('data-id'));
                var rate = $.trim($(this).find('.rate').text());

                if (!rates[from]) {
                    rates[from] = {};
                }

                rates[from][to] = rate;
            });

            data = {
                _id  : date,
                date : date,
                rates: rates
            };

            this.currentModel.save(data, {
                wait   : true,
                patch  : true,
                success: function (model) {
                    self.hideDialog();

                    self.collection.set(model, {remove: false});
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
        },

        render: function () {
            var self = this;
            var formString = this.template({
                model: this.currentModel.toJSON()
            });

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Edit Rate',
                width      : '800px',
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

            populate.get('#currency', '/currency/getAll', {}, 'name', this, false);

            this.delegateEvents(this.events);

            return this;
        }
    });

    return EditView;
});

