define([
    'Backbone',
    'Underscore',
    'jQuery',
    'views/dialogViewBase',
    'text!templates/settingsOverview/productDetails/productCategories/EditTemplate.html',
    'common',
    'custom',
    'populate',
    'dataService'
], function (Backbone, _, $, ParentView, EditTemplate, common, Custom, populate, dataService) {
    var EditView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'Products',
        template   : _.template(EditTemplate),

        initialize: function (options) {
            options = options || {};

            _.bindAll(this, 'render', 'saveItem');
            _.bindAll(this, 'render', 'deleteItem');

            if (options.myModel) {
                this.currentModel = options.myModel;
            } else {
                this.currentModel = options.model || options.collection.getElement();
            }

            this.collection = options.collection;
            this.currentModel.urlRoot = '/category';
            this.responseObj = {};
            this.render();
        },

        chooseOption: function (e) {
            var $target = $(e.target);

            $target.closest('a').text($target.text()).attr('data-id', $target.attr('id')).attr('data-level', $target.data('level'));
        },

        saveItem: function () {
            var self = this;
            var thisEl = this.$el;
            var categoryName = $.trim(thisEl.find('#categoryName').val());
            var parentCategory = thisEl.find('#parentCategory').attr('data-id') || null;
            var nestingLevel = thisEl.find('#parentCategory').attr('data-level');
            var fullName = thisEl.find('#parentCategory').attr('data-fullname') + ' / ' + categoryName;
            var res = _.filter(this.responseObj['#parentCategory'], function (item) {
                return (item.parent ? item.parent._id : null) === parentCategory;
            });
            /*var otherIncome = thisEl.find('#otherIncome').attr('data-id') || null;
            var otherLoss = thisEl.find('#otherLoss').attr('data-id') || null;
            var bankExpensesAccount = thisEl.find('#bankExpensesAccount').attr('data-id') || null;
            var taxesAccount = thisEl.find('#taxesAccount').attr('data-id') || null;
            var creditAccount = thisEl.find('#creditAccount').attr('data-id') || null;
            var debitAccount = thisEl.find('#debitAccount').attr('data-id') || null;*/
            var data;

            data = {
                name               : categoryName,
                parent             : null,
                nestingLevel       : 0,
                sequence           : 0,
                fullName           : fullName
                /*debitAccount       : debitAccount,
                creditAccount      : creditAccount,
                taxesAccount       : taxesAccount,
                bankExpensesAccount: bankExpensesAccount,
                otherIncome        : otherIncome,
                otherLoss          : otherLoss*/
            };

            if (parentCategory === this.currentModel.get('_id')) {
                this.currentModel.set(data);
            } else {
                data = {
                    name               : categoryName,
                    parent             : parentCategory,
                    nestingLevel       : ++nestingLevel,
                    sequence           : res.length,
                    fullName           : fullName,
                    isChangedLevel     : nestingLevel !== this.currentModel.toJSON().nestingLevel
                    /*debitAccount       : debitAccount,
                    creditAccount      : creditAccount,
                    taxesAccount       : taxesAccount,
                    bankExpensesAccount: bankExpensesAccount,
                    otherIncome        : otherIncome,
                    otherLoss          : otherLoss*/
                };

                this.currentModel.set(data);
            }

            this.currentModel.save({}, {
                wait   : true,
                success: function (model) {
                    self.collection.set(model, {remove: false});
                    self.remove();
                    /*Backbone.history.fragment = '';
                    Backbone.history.navigate('#easyErp/Products', {trigger: true});*/
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        render: function () {
            var formString = this.template({
                model: this.currentModel.toJSON()
            });
            var self = this;

            this.$el = $(formString).dialog({
                closeOnEscape: false,
                autoOpen     : true,
                dialogClass  : 'edit-dialog',
                width        : '450px',
                title        : 'Edit Category',
                buttons      : [{
                    text : 'Save',
                    class: 'btn blue',
                    click: function () {
                        self.saveItem();
                        self.gaTrackingEditConfirm();
                    }
                }, {
                    class: 'btn',
                    text : 'Cancel',
                    click: function () {
                        $(this).remove();
                    }
                }, {
                    class: 'btn',
                    text : 'Delete',
                    click: self.deleteItem
                }]
            });

            populate.getParrentCategory('#parentCategory', '/category', {}, this);

            /*dataService.getData('/chartOfAccount/getForDd', {}, function (resp) {
                self.responseObj['#debitAccount'] = resp.data;
                self.responseObj['#creditAccount'] = resp.data;
                self.responseObj['#taxesAccount'] = resp.data;
                self.responseObj['#bankExpensesAccount'] = resp.data;
                self.responseObj['#otherIncome'] = resp.data;
                self.responseObj['#otherLoss'] = resp.data;
            });*/

            return this;
        }
    });

    return EditView;
});
