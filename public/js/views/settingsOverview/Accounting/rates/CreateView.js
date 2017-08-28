define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'models/ratesModel',
    'text!templates/settingsOverview/Accounting/rates/CreateTemplate.html',
    'moment',
    'populate',
    'helpers/keyValidator'
], function (Backbone, $, _, Parent, RatesModel, EditTemplate, moment, populate, keyValidator) {
    'use strict';

    var EditView = Parent.extend({
        template   : _.template(EditTemplate),
        contentType: 'rates',

        initialize: function (options) {

            _.bindAll(this, 'render', 'saveItem');

            this.collection = options.collection;

            this.responseObj = {};

            this.render(options);
        },

        events: {
            'click #add'           : 'createRate',
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
            var tbodyNew = thisEl.find('#currencyTable');

            var tr = '<tr><td><a class="from current-selected" data-content="currency" href="javascript:;">From</a></td><td><a data-content="currency" class="to current-selected" href="javascript:;">To</a></td><td class="rate editable" data-type="input">1</td><td><a href="javascript:;" class="icon-trash goToRemove _actionCircleBtn" aria-hidden="true"></a></td></tr>';

            tbodyNew.append(tr);
        },

        saveItem: function () {
            var self = this;
            var thisEl = this.$el;
            var rates = {};
            var date = moment(new Date($.trim(thisEl.find('#date').val()))).format('YYYY-MM-DD');
            var data;
            var tbody = thisEl.find('#currencyTable');

            this.removeInputs();

            tbody.find('tr').each(function () {
                var from = $.trim($(this).find('.from').attr('data-id'));
                var to = $.trim($(this).find('.to').attr('data-id'));
                var rate = $.trim($(this).find('.rate').text()) || 1;

                if (!from || !to) {
                    return App.render({
                        type   : 'error',
                        message: "Currencies can't be empty."
                    });
                }

                if (!rates[from]) {
                    rates[from] = {};
                }

                rates[from][to] = rate;
            });

            data = {
                date : date,
                rates: rates
            };

            this.currentModel = new RatesModel();

            this.currentModel.save(data, {
                wait   : true,
                success: function (model) {
                    var dateModel = moment(new Date(model.get('date'))).format('DD MMM, YYYY');

                    self.hideDialog();

                    model.set('date', dateModel);

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
            var formString = this.template({});

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

            this.$el.find('#date').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                maxDate    : new Date()
            }).datepicker('setDate', new Date());

            return this;
        }
    });

    return EditView;
});

