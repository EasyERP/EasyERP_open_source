define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Degrees/list/ListTemplate.html',
    'text!templates/Degrees/form/FormTemplate.html',
    'custom'
], function (Backbone, $, _, ListTemplate, FormTemplate, Custom) {
    'use strict';
    var ContentView = Backbone.View.extend({
        el        : '#content-holder',
        initialize: function (options) {
            console.log('Init Degrees View');
            this.collection = options.collection;
            this.collection.bind('reset', _.bind(this.render, this));
            this.render();
        },

        events: {
            'click .checkbox'                               : 'checked',
            "click td:not(:has('input[type = 'checkbox']'))": 'gotoForm'
        },

        gotoForm: function (e) {
            var itemIndex;

            App.ownContentType = true;
            itemIndex = $(e.target).closest('tr').data('index') + 1;
            window.location.hash = '#home/content-Degrees/form/' + itemIndex;
        },

        render: function () {
            var viewType;
            var itemIndex;
            var currentModel;

            Custom.setCurrentCL(this.collection.models.length);
            viewType = Custom.getCurrentVT();

            switch (viewType) {
                case 'list':
                    this.$el.html(_.template(ListTemplate, {degreesCollection: this.collection.toJSON()}));

                    $('#checkAll').click(function () {
                        var c = this.checked;
                        $(':checkbox').prop('checked', c);
                    });
                    break;
                case 'form':
                    itemIndex = Custom.getCurrentII() - 1;
                    if (itemIndex > this.collection.models.length - 1) {
                        itemIndex = this.collection.models.length - 1;
                        Custom.setCurrentII(this.collection.models.length);
                    }

                    if (itemIndex === -1) {
                        this.$el.html();
                    } else {
                        currentModel = this.collection.models[itemIndex];
                        this.$el.html(_.template(FormTemplate, currentModel.toJSON()));
                    }

                    break;
            }
            return this;
        },

        checked: function () {
            if (this.collection.length > 0) {
                if ($('input:checked').length > 0) {
                    $('#top-bar-deleteBtn').show();
                } else {
                    $('#top-bar-deleteBtn').hide();
                }
            }
        },

        deleteItems: function () {
            var self = this;
            var mid = 39;
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
                    model = this.collection.get($('#wrap').data('id'));
                    model.on('change', this.render, this);
                    model.destroy({
                        headers: {
                            mid: mid
                        },
                        success: function () {
                            Backbone.history.navigate('#home/content-Degrees', {trigger: true});
                        }
                    });
                    break;
            }
        }
    });

    return ContentView;
});
