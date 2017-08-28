define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/settingsOverview/Accounting/expensesCategories/EditTemplate.html',
    'populate',
    'services/select'
], function (Backbone, $, _, Parent, EditTemplate, populate, selectService) {
    'use strict';

    var EditView = Parent.extend({
        template: _.template(EditTemplate),

        events: {
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption',
            'click .current-selected'                          : 'showNewSelect',
            'click .categoryListItem'                          : 'changeIcon',
            'click #showMore'                                  : 'showIcons',
            'click :not(#showMore, .current-selected)'         : 'hideIcons'
        },

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

        showIcons: function (e) {
            var $thisEl = this.$el;
            var $expCategoryWrap = $thisEl.find('#categoryListBlock');

            e.stopPropagation();

            $expCategoryWrap.toggleClass('active');
        },

        changeIcon: function (e) {
            var $thisEl = this.$el;
            var $target = $thisEl.find(e.target);
            var expCategoryClass = $target.attr('data-class');
            var $expCategoryIcon = $thisEl.find('#categoryIcon');

            $expCategoryIcon.removeClass().addClass(expCategoryClass);
        },

        hideIcons: function () {
            var $thisEl = this.$el;
            var $expCategoryList = $thisEl.find('#categoryListBlock');

            $expCategoryList.removeClass('active');

            selectService.hideNewSelect.call(this);
        },

        saveItem: function () {
            var thisEl = this.$el;
            var self = this;
            var categoryName = $.trim(thisEl.find('#name').val());
            var parentCategory = thisEl.find('#categories').data('id') || null;
            var nestingLevel = thisEl.find('#categories').data('level') || null;
            var fullName = thisEl.find('#categories').data('fullname');
            var account = thisEl.find('#account').attr('data-id');
            var expCategoryIcon = thisEl.find('#categoryIcon').attr('class');
            var res = _.filter(this.responseObj['#parentCategory'], function (item) {
                return item.parentCategory === parentCategory;
            });

            if (fullName) {
                fullName += ' / ' + categoryName;
            } else {
                fullName = categoryName;
            }

            if (!fullName) {
                return App.render({
                    type   : 'error',
                    message: 'Please, enter name!'
                });
            }

            this.model.save({
                name        : categoryName,
                parent      : parentCategory,
                nestingLevel: ++nestingLevel,
                account     : account,
                isAllUpdate : true,
                // sequence    : res.length,
                fullName    : fullName,
                classIcon   : expCategoryIcon
            }, {
                patch  : true,
                wait   : true,
                success: function (model) {
                    self.hideDialog();

                    self.collection.set(model, {remove: false});
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        chooseOption: function (e) {
            $(e.target).closest('.current-selected').text($(e.target).text()).attr('data-id', $(e.target).attr('id')).attr('data-level', $(e.target).attr('data-level')).attr('data-fullname', $(e.target).attr('data-fullname'));

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
                }
                ]

            });

            populate.get('#account', '/chartOfAccount/getForDd', {category: 'ACCOUNTS_EXPENSES'}, 'name', this, true, false, this.model.get('account'), null, this.$el);
            populate.getParrentCategory('#categories', '/expensesCategories/getAll', {}, this, true, true, this.model.get('parent') ? this.model.get('parent')._id : null);

            return this;
        }
    });

    return EditView;
});
