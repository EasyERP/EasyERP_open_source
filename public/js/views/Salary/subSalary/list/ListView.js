define([
        'text!templates/Salary/subSalary/list/ListHeader.html',
        'views/Salary/subSalary/list/ListItemView',
        'collections/Employees/employee',
        'populate'
],

function (listTemplate, listItemView, employeesCollection, populate) {
    var subSalaryListView = Backbone.View.extend({
        el: '#subSalary-holder',
        viewType: 'list',//needs in view.prototype.changeLocationHash
        
        initialize: function (options) {
            var employees;

            this.model = options.model;
            this.responseObj = {};

            employees = new employeesCollection();
            employees.bind('reset', function () {
                this.employees = employees;
                this.filterEmployeesForDD();
            }, this);
            this.render();
        },

        events: {
            "click .checkbox": "checked",
            "click .current-selected": "showEmployeesSelect",
            "click": "hideNewSelect",
            "click": "disableRowClick",
            "click td.editable": "editRow",
            "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
            "click .newSelectList li.miniStylePagination": "notHide",
            "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
            "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect"
        },

        filterEmployeesForDD: function () {
            var id = '.employeesDd';
            var employees = this.employees.toJSON();

            this.responseObj[id] = [];
            this.responseObj[id] = this.responseObj[id].concat(_.map(employees, function (item) {
                return {_id: item._id, name: item.name.first + " " + item.name.last, level: item.projectShortDesc || ""};
            }));

            //$(id).text(this.responseObj[id][0].name).attr("data-id", this.responseObj[id][0]._id);

        },

        showEmployeesSelect: function (e, prev, next) {
            e.stopPropagation();
            populate.showEmployeesSelect(e, prev, next, this);

            return false;
        },

        notHide: function () {
            return false;
        },
        hideNewSelect: function () {
            $(".newSelectList").hide();
        },
        chooseOption: function (e) {
            var target = $(e.target);
            var parrent = target.parents("td");
            var trEl = target.parents("tr");
            var parrents = trEl.find('td');
            var _id = target.attr("id");
            var model = this.employees.get(_id);

            trEl.attr('data-id', model.id);

            parrent.find(".current-selected").text(target.text()).attr("data-id", _id);
            $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
        },
        nextSelect: function (e) {
            this.showEmployeesSelect(e, false, true);
        },
        prevSelect: function (e) {
            this.showEmployeesSelect(e, true, false);
        },

        disableRowClick: function (e) {
            e.stopPropagation();
            return false;
        },
        
        render: function () {
            var currentEl = this.$el;

            currentEl.html('');
            currentEl.append(_.template(listTemplate));
            currentEl.append(new listItemView({
                model: this.model
            }).render());//added two parameters page and items number

            $('#check_all').click(function () {
                $(':checkbox').prop('checked', this.checked);
                if ($("input.checkbox:checked").length > 0)
                    $("#top-bar-deleteBtn").show();
                else
                    $("#top-bar-deleteBtn").hide();
            });
        }
    });

    return subSalaryListView;
});
