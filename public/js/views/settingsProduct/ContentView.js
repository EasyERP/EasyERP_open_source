define([
        "text!templates/settingsProduct/index.html",
        "views/settingsProduct/CreateView"
    ],
    function (template, CreateView) {
        var ContentView = Backbone.View.extend({
            el: '#content-holder',
            contentType: "Product Settings",
            actionType: "Content",

            template: _.template(template),

            events: {

            },

            initialize: function (options) {
                this.startTime = options.startTime;
                this.collection = options.collection;
               /* this.collection.bind('add', _.bind(this.render, this));*/
                this.collection.bind('reset', _.bind(this.render, this));

                this.render();
            },

            createCategoryListRow: function (category, index, className) {
                return ('<li class="' + className + '" data-id="' + category._id + '" data-level="' + category.nestingLevel + '" data-sequence="' + category.sequence + '"><span class="content"><span class="dotted-line"></span><span class="text">' + category.name + '<span title="Delete" class="trash icon">1</span><span title="Edit" class="edit icon">e</span></span></span></li>');
            },

            render: function () {
                var self = this;
                var curEl = this.$el;
                var categories = this.collection.toJSON();
                var par;

                curEl.html(this.template());

                categories.forEach(function (elm, i) {
                    if (!elm.parentCategory) {
                        self.$el.find("#groupList").append(self.createCategoryListRow(elm, i + 1, "child"));
                    } else {
                        par = self.$el.find("[data-id='" + elm.parentDepartment._id + "']").removeClass('child').addClass('parent');

                        if (par.find("ul").length === 0) {
                            par.append("<ul style='margin-left:20px'></ul>");
                        }
                        par.find("ul").append(self.createDepartmentListRow(elm, i + 1, "child"));
                    }
                });

                this.$("#groupList").sortable({
                    connectWith: 'ul',
                    containment: 'document',

                    stop: function (event, ui) {
                        self.groupMove();

                        var model = self.collection.get(ui.item.attr("data-id"));
                        var sequence = 0;
                        var nestingLevel = 0;

                        if (ui.item.next().hasClass("parent") || ui.item.next().hasClass("child")) {
                            sequence = parseInt(ui.item.next().attr("data-sequence")) + 1;
                        }
                        if (ui.item.parents("li").length > 0) {
                            nestingLevel = parseInt(ui.item.parents("li").attr("data-level")) + 1;
                        }

                        model.set({
                            parentCategory: ui.item.parents("li").attr("data-id") ? ui.item.parents("li").attr("data-id") : null,
                            nestingLevel: nestingLevel,
                            //name: model.toJSON.departmentManager ? model.toJSON.departmentManager._id : null,
                            sequence: sequence });
                        model.save();
                        ui.item.attr("data-sequence", sequence);
                    }
                });

                curEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");

                return this;
            }
        });

        return ContentView;
    });
