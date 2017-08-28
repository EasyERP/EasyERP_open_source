define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/settingsOverview/Accounting/expensesCategories/CategoriesList.html',
    'views/settingsOverview/Accounting/expensesCategories/expensesCategoryEdit',
    'views/settingsOverview/Accounting/expensesCategories/expensesCategoryCreate'
], function (Backbone, _, $, Template, EditView, CreateView) {
    'use strict';

    var ContentView = Backbone.View.extend({
        template: _.template(Template),
        el      : '#expensesCategoriesTab',

        initialize: function (options) {
            this.startTime = options.startTime;
            this.collection = options.collection;

            this.collection.bind('add change', this.render, this);

            this.render();
        },

        events: {
            'click .editCategoryItem'                         : 'goToEditDialog',
            'click  li:not(.disabled) span.deleteCategoryItem': 'deleteItem',
            'click #top-bar-createBtn'                        : 'create',
            'click .toggleList'                               : 'toggleList'
        },

        deleteItem: function (e) {
            var self = this;
            var tr = $(e.target).closest('li');
            var id = tr.attr('data-id');
            var model = this.collection.get(id);
            var answer = confirm('Really DELETE items ?!');

            e.preventDefault();
            e.stopPropagation();

            if (!model.get('removable')) {
                return App.render({
                    type   : 'error',
                    message: 'You do not have permission to remove this item'
                });
            }

            if (answer === true && model) {

                model.destroy({
                    success: function (model) {
                        self.collection.remove(model);
                        tr.remove();
                    },

                    error: function (model, err) {
                        if (err.status === 403) {
                            App.render({
                                type   : 'error',
                                message: 'You do not have permission to perform this action'
                            });
                        }

                        if (err.status === 400) {
                            self.collection.set(model, {remove: false});
                            App.render({
                                type   : 'error',
                                message: err.responseJSON.error
                            });
                        }
                    }
                });
            }
        },

        toggleList: function (e) {
            e.preventDefault();

            this.$el.find('.forToggle').toggle();
        },

        goToEditDialog: function (e) {
            var self = this;
            var tr = $(e.target).closest('li');
            var id = tr.attr('data-id');
            var model = this.collection.get(id);

            e.preventDefault();

            if (this.editView) {
                this.editView.undelegateEvents();
                this.editView.remove();

                delete this.editView;
            }

            if (model) {
                this.editView = new EditView({model: model, collection: self.collection});
            }
        },

        create: function (e) {
            e.preventDefault();

            if (this.createView) {
                this.createView.undelegateEvents();
                this.createView.remove();

                delete this.createView;
            }

            this.createView = new CreateView({collection: this.collection});
        },

        createItemListRow: function (item, index, className) {
            var disabled = !item.removable ? ' disabled' : '';
            var str = '<li class="' + className + disabled + '" data-id="' + item._id + '" data-level="' + item.nestingLevel + '" data-sequence="' + item.sequence + '"><span class="content"><span class="dotted-line"></span><span class="text">' + item.name + '<span title="Edit" class="editCategoryItem edit icon-pencil"></span>';

            if (item.removable) {
                str += '<span title="Delete" class="deleteCategoryItem trash icon-trash"></span></span></span></li>'
            } else {
                str += '</span></span></li>'
            }

            return (str);
        },

        groupMove: function () {
            $('.groupList li').each(function () {
                if ($(this).find('li').length > 0) {
                    $(this).attr('class', 'parent');
                } else {
                    $(this).attr('class', 'child');
                }
            });
        },

        render: function () {
            var self = this;
            var par;
            var model;
            var sequence;
            var nestingLevel;
            var fullName;

            this.$el.html(this.template());

            this.collection.toJSON().forEach(function (elm, i) {
                if (!elm.parent) {
                    self.$el.find('.groupList').append(self.createItemListRow(elm, i + 1, 'child'));

                } else {
                    par = self.$el.find("[data-id='" + elm.parent._id + "']").removeClass('child').addClass('parent');

                    if (par.find('ul').length === 0) {
                        par.append("<ul style='margin-left:20px'></ul>");
                    }

                    par.find('ul').append(self.createItemListRow(elm, i + 1, 'child'));
                }
            });

            this.$el.find('ul').sortable({
                connectWith: 'ul',
                containment: 'document',
                stop       : function (event, ui) {
                    self.groupMove();
                    model = self.collection.get(ui.item.attr('data-id'));
                    sequence = 0;
                    nestingLevel = 0;

                    if (ui.item.next().hasClass('parent') || ui.item.next().hasClass('child')) {
                        sequence = parseInt(ui.item.next().attr('data-sequence'), 10) + 1;
                    }

                    if (ui.item.parents('li').length > 0) {
                        nestingLevel = parseInt(ui.item.parents('li').attr('data-level'), 10) + 1;
                    }

                    model.set({
                        parentCategoryStart: model.toJSON().parent ? model.toJSON().parent._id : null,
                        sequenceStart      : parseInt(ui.item.attr('data-sequence'), 10),
                        parent             : ui.item.parents('li').attr('data-id') ? ui.item.parents('li').attr('data-id') : null,
                        nestingLevel       : nestingLevel,
                        sequence           : sequence,
                        isAllUpdate        : true
                    });
                    model.save(model.changed, {
                        patch  : true,
                        success: function (model) {
                            self.collection.set(model, {remove: false});
                        },

                        error: function () {
                            if (err.status === 403) {
                                App.render({
                                    type   : 'error',
                                    message: 'You do not have permission to perform this action'
                                });
                            }
                        }
                    });
                    ui.item.attr('data-sequence', sequence);
                }
            });
        }

    });

    return ContentView;
});
