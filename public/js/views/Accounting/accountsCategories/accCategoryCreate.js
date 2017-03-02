define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/selectView/selectView',
    'text!templates/Accounting/accountsCategories/CreateTemplate.html',
    'text!templates/Accounting/accountsCategories/elementTemplate.html',
    'models/accountsCategory',
    'populate'
], function (Backbone, $, _, SelectView, template, tableEL, Model, populate) {
    'use strict';

    var EditView = Backbone.View.extend({
        template: _.template(template),

        events: {
            'click .current-selected'                          : 'showNewSelect',
            click                                              : 'hideNewSelect',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption'
        },

        initialize: function (options) {
            _.bindAll(this, 'saveItem', 'render');

            this.collection = options.collection;
            this.model = new Model();
            this.responseObj = {};

            this.render();
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

        saveItem: function () {
            var thisEl = this.$el;
            var self = this;
            var categoryName = $.trim(thisEl.find('#name').val());
            var parentCategory = thisEl.find('#categories').data('id') || null;
            var nestingLevel = thisEl.find('#categories').data('level') || null;
            var fullName = thisEl.find('#categories').data('fullname');
            var res = _.filter(this.responseObj['#categories'], function (item) {
                return item._id === parentCategory;
            });

            if (res && res.length) {
                fullName = res[0].fullName + ' / ' + categoryName;
            } else {
                fullName = categoryName;
            }

            this.model.save({
                name        : categoryName,
                parent      : parentCategory,
                nestingLevel: ++nestingLevel,
                sequence    : res.length,
                fullName    : fullName
            }, {
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

        chooseOption: function (e) {
            $(e.target).closest('.current-selected').text($(e.target).text()).attr('data-id', $(e.target).attr('id')).attr('data-level', $(e.target).attr('data-level')).attr('data-fullname', $(e.target).attr('data-fullname'));

            this.hideNewSelect();
        },

        hideDialog: function () {
            $('.create-dialog').remove();

            this.undelegateEvents();
        },

        hideNewSelect: function () {
            $('.newSelectList').hide();

            if (this.selectView) {
                this.selectView.remove();
            }
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

            populate.getParrentCategory('#categories', '/accountsCategories/getAll', {}, this, true, true);

            this.delegateEvents(this.events);

            return this;
        }
    });

    return EditView;
});
