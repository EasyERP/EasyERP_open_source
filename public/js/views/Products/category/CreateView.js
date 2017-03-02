define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/ProductCategory/CreateTemplate.html',
    'models/Category',
    'common',
    'custom',
    'populate',
    'dataService'
], function (Backbone, $, _, ParentView, CreateTemplate, Model, common, Custom, populate, dataService) {

    var CreateView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'Departments',
        template   : _.template(CreateTemplate),

        initialize: function (options) {
            _.bindAll(this, 'saveItem', 'render');

            this.parentId = options._id || null;
            this.model = new Model();
            this.responseObj = {};
            this.render();
        },

        chooseOption: function (e) {
            var $target = $(e.target);

            $target.closest('a').text($target.text()).attr('data-id', $target.attr('id'));
        },

        close: function () {
            this._modelBinder.unbind();
        },

        saveItem: function () {
            var thisEl = this.$el;
            var self = this;
            var categoryName = $.trim(thisEl.find('#categoryName').val());
            var parentCategory = thisEl.find('#parentCategory').data('id') || null;
            var nestingLevel = thisEl.find('#parentCategory').data('level') || null;
            var fullName = thisEl.find('#parentCategory').data('fullname');
            var res = _.filter(this.responseObj['#parentCategory'], function (item) {
                return item.parentCategory === parentCategory;
            });
            var otherIncome = thisEl.find('#otherIncome').attr('data-id') || null;
            var otherLoss = thisEl.find('#otherLoss').attr('data-id') || null;
            var bankExpensesAccount = thisEl.find('#bankExpensesAccount').attr('data-id') || null;
            var taxesAccount = thisEl.find('#taxesAccount').attr('data-id') || null;
            var creditAccount = thisEl.find('#creditAccount').attr('data-id') || null;
            var debitAccount = thisEl.find('#debitAccount').attr('data-id') || null;
            var data;

            if (fullName) {
                fullName += ' / ' + categoryName;
            } else {
                fullName = categoryName;
            }

            data = {
                name               : categoryName,
                parent             : parentCategory,
                nestingLevel       : ++nestingLevel,
                sequence           : res.length,
                fullName           : fullName,
                debitAccount       : debitAccount,
                creditAccount      : creditAccount,
                taxesAccount       : taxesAccount,
                bankExpensesAccount: bankExpensesAccount,
                otherIncome        : otherIncome,
                otherLoss          : otherLoss
            };

            this.model.save(data, {
                success: function () {
                    Backbone.history.fragment = '';
                    Backbone.history.navigate(window.location.hash, {trigger: true});
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        render: function () {
            var categoryUrl = '/category/'/* + this.parentId*/;
            var self = this;
            var formString = this.template({});

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'create-dialog',
                width      : '450px',
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

            populate.get('#parentCategory', categoryUrl, {}, 'name', this, true);

            dataService.getData('/chartOfAccount/getForDd', {}, function (resp) {
                self.responseObj['#debitAccount'] = resp.data;
                self.responseObj['#creditAccount'] = resp.data;
                self.responseObj['#taxesAccount'] = resp.data;
                self.responseObj['#bankExpensesAccount'] = resp.data;
                self.responseObj['#otherIncome'] = resp.data;
                self.responseObj['#otherLoss'] = resp.data;
            });

            this.delegateEvents(this.events);

            return this;
        }
    });

    return CreateView;
});
