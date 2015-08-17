define([
    'text!templates/Departments/list/ListHeader.html',
    'views/Departments/CreateView',
    'models/DepartmentsModel',
    'views/Departments/list/ListItemView',
    'views/Departments/EditView',
],

function (ListTemplate, CreateView, currentModel, ListItemView, EditView) {
    var DepartmentsListView = Backbone.View.extend({
        el: '#content-holder',

        initialize: function (options) {
            this.startTime = options.startTime;
            this.collection = options.collection;
            this.collection.bind('reset', _.bind(this.render, this));
            this.startNumber = 0;
            this.render();
        },

        events: {
            "click #showMore": "showMore",
            "click .checkbox": "checked",
            "click #groupList li": "editItem",
            "click #groupList .edit": "editItem",
            "click #groupList .trash": "deleteItem"
        },
        createDepartmentListRow: function (department, index, className) {
            return ('<li class="' + className + '" data-id="' + department._id + '" data-level="' + department.nestingLevel + '" data-sequence="' + department.sequence + '"><span class="content"><span class="dotted-line"></span><span class="text">' + department.departmentName + '<span title="Delete" class="trash icon">1</span><span title="Edit" class="edit icon">e</span></span></span></li>');
        },
        editItem: function (e) {
            var self = this;
            var model = new currentModel({ validate: false });
            model.urlRoot = '/Departments/form/';
            model.fetch({
                data: { id: $(e.target).closest("li").data("id") },
                success: function (model) {
                    new EditView({ myModel: model });
                },
                error: function () { alert('Please refresh browser'); }
            });
            return false;
        },
        deleteItem: function (e) {
            var myModel = this.collection.get($(e.target).closest("li").data("id"));
            var mid = 39;
            e.preventDefault();
            var self = this;
            var answer = confirm("Realy DELETE items ?!");
            if (answer == true) {
                myModel.destroy({
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function () {
                        self.render();
                    },
                    error: function (model, err) {
                        if (err.status === 403) {
                            alert("You do not have permission to perform this action");
                        } else {
                            Backbone.history.navigate("home", { trigger: true });
                        }
                    }
                });
            }
            return false;
        },
        groupMove: function () {
            $("#groupList li").each(function () {
                if ($(this).find("li").length > 0) {
                    $(this).attr("class", "parent");
                }
                else {
                    $(this).attr("class", "child");
                }
            });
        },
        render: function () {
            $('.ui-dialog ').remove();

            this.$el.html(_.template(ListTemplate));
            var departments = this.collection.toJSON();
            var self = this;

            departments.forEach(function (elm, i) {
                if (!elm.parentDepartment) {
                    self.$el.find("#groupList").append(self.createDepartmentListRow(elm, i + 1, "child"));
                } else {
                    var par = self.$el.find("[data-id='" + elm.parentDepartment._id + "']").removeClass('child').addClass('parent');
                    if (par.find("ul").length === 0) {
                        par.append("<ul style='margin-left:20px'></ul>");
                    }
                    par.find("ul").append(self.createDepartmentListRow(elm, i + 1, "child"));
                }
            });
            self = this;
            this.$("ul").sortable({
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
                    model.set({ "parentDepartmentStart": model.toJSON().parentDepartment ? model.toJSON().parentDepartment._id : null, "sequenceStart": parseInt(ui.item.attr("data-sequence")), "parentDepartment": ui.item.parents("li").attr("data-id") ? ui.item.parents("li").attr("data-id") : null, "nestingLevel": nestingLevel, departmentManager: model.toJSON.departmentManager ? model.toJSON.departmentManager._id : null, sequence: sequence });
                    model.save();
                    ui.item.attr("data-sequence", sequence);
                }
            });
            $('#check_all').click(function () {
                $(':checkbox').prop('checked', this.checked);
                if ($("input.checkbox:checked").length > 0)
                    $("#top-bar-deleteBtn").show();
                else
                    $("#top-bar-deleteBtn").hide();
            });
            this.$el.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
        },

        showMore: function () {
            _.bind(this.collection.showMore, this.collection);
            this.collection.showMore({ count: 100 });
        },

        showMoreContent: function (newModels) {
            new ListItemView({ collection: newModels, startNumber: this.startNumber }).render();
            this.startNumber += newModels.length;
        },

        createItem: function () {
            new CreateView();
        },

        checked: function () {
            if (this.collection.length > 0) {
                if ($("input.checkbox:checked").length > 0)
                    $("#top-bar-deleteBtn").show();
                else {
                    $("#top-bar-deleteBtn").hide();
                    $('#check_all').prop('checked', false);
                }
            }
        },

        deleteItems: function () {
            var that = this,
        		mid = 39,
                model;
            $.each($("tbody input:checked"), function (index, checkbox) {
                model = that.collection.get(checkbox.value);
                model.destroy({
                    headers: {
                        mid: mid
                    }
                });
            });
            this.collection.trigger('reset');
        }
    });
    return DepartmentsListView;
});