define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Accounting/accountsCategories/EditTemplate.html',
    'views/selectView/selectView',
    'populate',
    'constants',
    'helpers/keyValidator'
], function (Backbone, $, _, EditTemplate, SelectView, populate, CONSTANTS, keyValidator) {
    'use strict';

    var EditView = Backbone.View.extend({
        template: _.template(EditTemplate),

        events: {
            'click .current-selected'                          : 'showNewSelect',
            click                                              : 'hideNewSelect',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption'
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

        saveItem: function () {
            var thisEl = this.$el;
            var self = this;
            var categoryName = $.trim(thisEl.find('#name').val());
            var parentCategory = thisEl.find('#categories').data('id') || null;
            var nestingLevel = thisEl.find('#categories').data('level') || null;
            var fullName = thisEl.find('#categories').data('fullname');
            var res = _.filter(this.responseObj['#parentCategory'], function (item) {
                return item.parentCategory === parentCategory;
            });

            if (fullName) {
                fullName += ' / ' + categoryName;
            } else {
                fullName = categoryName;
            }

            this.model.save({
                name        : categoryName,
                parent      : parentCategory,
                nestingLevel: ++nestingLevel,
                isAllUpdate : nestingLevel !== this.currentModel.toJSON().nestingLevel,
                // sequence    : res.length,
                fullName    : fullName
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

        hideNewSelect: function () {
            $('.newSelectList').hide();

            if (this.selectView) {
                this.selectView.remove();
            }
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

        hideDialog: function () {
            $('.edit-dialog').remove();
            this.undelegateEvents();
        },

        keypressHandler: function (e) {
            return keyValidator(e);
        },

        render: function () {
            var self = this;
            var formString = this.template({
                model: this.currentModel.toJSON()
            });

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                width      : '600px',
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

            populate.getParrentCategory('#categories', '/accountsCategories/getAll', {}, this, true, true, this.model.get('parent') ? this.model.get('parent')._id : null);

            return this;
        }
    });

    return EditView;
});
