define([
        "jquery",
        "underscore",
        "backbone",
        "collections/Persons/PersonsCollection",
        "collections/Companies/CompaniesCollection",
        'text!templates/Customers/list/ListTemplate.html',
        'views/Persons/list/ListItemView',
        'views/Companies/list/ListItemView',
        'custom',
        'constants'
    ],
    function ($, _, Backbone, PersonsCollection, CompaniesCollection, ListTemplate, PersonsItemView, CompaniesItemView, Custom, CONSTANTS) {
        'use strict';
        var ContentView = Backbone.View.extend({
            el        : '#content-holder',
            contentType: 'Companies',

            initialize: function () {
                this.mId = CONSTANTS.MID[this.contentType];
                this.personCollection = new PersonsCollection();
                this.personCollection.bind('reset', _.bind(this.render, this));
                this.companiesCollection = new CompaniesCollection();
                this.companiesCollection.bind('reset', _.bind(this.render, this));

                this.render();
            },

            events: {
                "click .checkbox": "checked"
            },

            render: function () {
                Custom.setCurrentCL(this.personCollection.length);
                var viewType = Custom.getCurrentVT();
                switch (viewType) {
                    case "list":
                    {
                        this.$el.html(_.template(ListTemplate));
                        var table = this.$el.find('table > tbody');
                        this.companiesCollection.each(function (model) {
                            table.append(new CompaniesItemView({model: model}).render().el);
                        });
                        this.personCollection.each(function (model) {
                            table.append(new PersonsItemView({model: model}).render().el);
                        });
                        break;
                    }
                    case "thumbnails":
                    {
                        this.$el.html("Customers Thumbnail View");
                        break;
                    }
                    case "form":
                    {
                        this.$el.html("Customers Form View");
                        break;
                    }
                }
                return this;

            },

            checked: function () {
                if ($("input:checked").length > 0) {
                    $("#top-bar-deleteBtn").show();
                } else {
                    $("#top-bar-deleteBtn").hide();
                }
            },

            deleteItems: function () {
                var self = this;
                var mid = this.mId;
                $.each($("input:checked"), function (index, checkbox) {
                    var project = self.collection.where({id: checkbox.value})[0];
                    project.destroy({
                        headers: {
                            mid: mid
                        },
                        wait   : true
                    });
                });
                this.collection.trigger('reset');
            }
        });
        return ContentView;
    });