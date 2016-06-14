define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Departments/list/ListTemplate.html',
    'text!templates/Departments/form/FormTemplate.html',
    'custom',
    'views/Departments/EditView',
    'views/Departments/CreateView'
], function (Backbone, $, _, ListTemplate, FormTemplate, Custom, EditView, CreateView) {
    'use strict';

    var ContentView = Backbone.View.extend({
        el        : '#content-holder',
        initialize: function (options) {
            this.collection = options.collection;
            this.collection.bind('reset', _.bind(this.render, this));
            this.render();
        },

        gotoForm: function (e) {
            var id;

            App.ownContentType = true;
            id = $(e.target).parent('tr').data('id');
            window.location.hash = '#home/content-Departments/form/' + id;
        },

        events: {
            'click .checkbox'                             : 'checked',
            'click td:not(:has(input[type = "checkbox"]))': 'gotoForm'
        },

        render: function () {
            var viewType = Custom.getCurrentVT();
            var currentModel;

            Custom.setCurrentCL(this.collection.models.length);

            switch (viewType) {
                case 'list':
                    this.$el.html(_.template(ListTemplate, {departmentsCollection: this.collection.toJSON()}));

                    $('#checkAll').click(function () {
                        var c = this.checked;
                        $(':checkbox').prop('checked', c);
                    });
                    break;
                case 'form':
                    currentModel = this.collection.getElement();
                    if (currentModel) {
                        this.$el.html(_.template(FormTemplate, currentModel.toJSON()));
                    } else {
                        this.$el.html('<h2>No departments found</h2>');
                    }
                    break;
                // skip default;
            }
            return this;
        },

        createItem: function () {
            return new CreateView({collection: this.collection});
        },

        checked: function () {
            if ($('input:checked').length > 0) {
                $('#top-bar-deleteBtn').show();
            } else {
                $('#top-bar-deleteBtn').hide();
            }
        },

        editItem: function () {
            return new EditView({collection: this.collection});
        },

        deleteItems: function () {
            var self = this;
            var model;
            var viewType = Custom.getCurrentVT();

            switch (viewType) {
                case 'list':
                    $.each($('tbody input:checked'), function (index, checkbox) {
                        model = self.collection.get(checkbox.value);
                        model.destroy({
                            headers: {
                                mid: mid
                            }
                        });
                    });

                    this.collection.trigger('reset');
                    break;
                case 'form':
                    model = this.collection.get($('.form-holder form').data('id'));
                    model.on('change', this.render, this);
                    model.destroy({
                        headers: {
                            mid: mid
                        },
                        success: function () {
                            Backbone.history.navigate('#home/content-Departments', {trigger: true});
                        }
                    });
                    break;
                // skip default;
            }
        }
    });
    return ContentView;
});
