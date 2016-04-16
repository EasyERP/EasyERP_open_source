define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Projects/projectInfo/members/membersTemplate.html',
    'text!templates/Projects/projectInfo/members/createMember.html',
    'views/selectView/selectView',
    'common',
    'dataService',
    'collections/projectMembers/editCollection',
    'models/ProjectMemberModel',
    'moment'
], function (Backbone, $, _, membersTemplate, createMember, SelectView, common, dataService, prMembersCollection, currentModel, moment) {
    'use strict';

    var PMView = Backbone.View.extend({
        el: '#projectMembers',

        initialize: function (options) {
            this.project = options.project;
            this.collection = options.collection;
            this.responseObj = {};
            this.changedModels = {};

            this.collection.on('saved', this.savedNewModel, this);
            this.collection.on('updated', this.updatedOptions, this);
        },

        template: _.template(membersTemplate),

        events: {
            'click'                                            : 'hideNewSelect',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption',
            'click .selectCurrent'                             : 'showNewSelect',
            'click #addMember'                                 : 'addMember',
            'click .editable'                                  : 'editRow',
            'click #saveMember'                                : 'saveItem',
            'click .fa-trash-o'                                : 'removeMember'
        },

        editRow: function (e) {
            var self = this;
            var target = $(e.target);
            var row = target.parent('tr');
            var td = target.parent('td');
            var rowId = row.data('id');

           // var prevRow = row.prev().find('.startDateManager');
          //  var prevSalesDate = prevRow.text() === 'From start of project' ? this.model.get('StartDate') : row.prev().find('.startDateManager').text();
          //  var prevDate = new Date(prevSalesDate);
          //  var nextDay = moment(prevDate).add(1, 'd');
          // var startDate = common.utcDateToLocaleDate(nextDay.toDate());
            var text;

            if (target.prop('tagName') !== 'INPUT') {
                this.hideNewSelect();
            }
            text = (target.text()).trim();

            target.html('<input class="extrainfo" type="text" name="date" id="date" value="' + text + '" readonly="" placeholder="Date">');

            this.$el.find('#date').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                //minDate    : startDate ,
                onSelect   : function (dateText) {
                    var $editedCol = target.closest('td');
                    var dateType = $editedCol.hasClass('startDateManager') ? 'startDate' : 'endDate';
                    var date = new Date(dateText);
                    if (!self.changedModels[rowId] ) {
                        self.changedModels[rowId] = {};
                    }
                    self.changedModels[rowId][dateType] = dateText;
                  //  var prevDay = moment(date).subtract(1, 'd');
                  //  var $prSmEndDate = target.closest('tr').prev().find('.endDateManager');
                    $editedCol.text(dateText);
                    self.$el.find('#saveMember').show();
                    self.$el.find('#addMember').hide();
                  //  $prSmEndDate.text(common.utcDateToLocaleDate(prevDay.toDate()));
                 //   $('#top-bar-saveBtn').show();
                }
            });

            this.$el.find('#date').datepicker('show');

            return false;
        },

        savedNewModel: function (modelObject) {
            var savedRow = this.$el.find(".false");
            var oldId = savedRow.data('id');
            var modelId;

            if (modelObject) {
                modelId = modelObject._id;
                savedRow.attr("data-id", modelId);
                savedRow.removeClass('false');
            }
            delete this.changedModels[oldId];
            this.collection.remove(oldId);
            this.collection.add(modelObject);

            this.showCreateBtn();
        },

        updatedOptions : function (){
            this.showCreateBtn();
        },

        hideNewSelect: function () {
            var $editedDate = this.$el.find('.extrainfo');
            var $editedCol = $editedDate.closest('td');

            $editedCol.text($editedDate.val());
            $('.newSelectList').hide();

            if (this.selectView) {
                this.selectView.remove();
            }
        },

        saveItem : function (e){
            e.preventDefault();
            var model;
            var id;

            for (id in this.changedModels) {
                model = this.collection.get(id);

                if (model) {
                    model.changed = this.changedModels[id];
                }
            }

            this.collection.save();
        },

        showNewSelect: function (e, prev, next) {
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

        chooseOption: function (e) {
            var target = $(e.target);
            var targetElement = target.parents('td');
            var targetRow = target.parents('tr');
            var rowId = targetRow.data('id');
            var id = target.attr('id');
           // var prevSales = targetRow.prev().attr('data-id');
            var selectorContainer;
            var dataType;

            /*if (prevSales === id) {
                return App.render({
                    type   : 'error',
                    message: 'Please choose another Project Manager'
                });
            }*/

            //targetRow.attr('data-id', id);

            dataType = targetElement.data('content') + 'Id';
            if (!this.changedModels[rowId]) {
                this.changedModels[rowId] = {};
            }
            if (dataType) {
                this.changedModels[rowId][dataType] = id;
            }

            targetElement.text(target.text());
            targetElement.attr('data-id', id);

            this.hideNewSelect();
            this.showSavelBtn();

            return false;
        },

        addMember: function (e) {
            e.preventDefault();
            var startData = {
                projectId : this.project
            };

            var model = new currentModel(startData);

            startData.cid = model.cid;
            if (!this.changedModels[startData.cid]) {
                this.changedModels[startData.cid] = {};
            }
            this.changedModels[startData.cid].projectId = this.project;

            if (!this.isNewRow()) {
                /*this.showSaveCancelBtns();*/
                this.collection.add(model);
                this.$el.find('#projectMembersTable').append(_.template(createMember, startData));
                this.showSavelBtn();

            } else {
                App.render({
                    type   : 'notify',
                    message: 'Please confirm or discard changes befor create a new item'
                });
            }
        },

        showSavelBtn: function (){
            this.$el.find('#saveMember').show();
            this.$el.find('#addMember').hide();
        },

        showCreateBtn: function (){
            this.$el.find('#saveMember').hide();
            this.$el.find('#addMember').show();
        },

        isNewRow: function () {
            var newRow = $('.false');

            return !!newRow.length;
        },

        removeMember: function (e) {
            var target = $(e.target);
            var row = target.closest('tr');
            var id = row.data('id');
            var model = this.collection.get(id);
            if (model && id.length === 24 ){
                model.destroy({
                    wait   : true,
                    success: function () {
                        row.remove();
                    },
                    error  : function (model, res) {
                        if (res.status === 403 && index === 0) {
                            App.render({
                                type   : 'error',
                                message: "You do not have permission to perform this action"
                            });
                        }
                        self.deleteItemsRender(1, 1);

                    }
                });
            } else {
                row.remove();
                this.collection.remove(model);
            }

        },

        render: function () {
            var self = this;
            var projectMembers = this.collection.toJSON();

            self.$el.html(this.template({
                members            : projectMembers,
                utcDateToLocaleDate: common.utcDateToLocaleDate
            }));



            dataService.getData('/employee/getForDD', {salesDepartments: true, isEmployee: true}, function (employees) {
                employees = _.map(employees.data, function (employee) {
                    employee.name = employee.name.first + ' ' + employee.name.last;

                    return employee;
                });

                self.responseObj['#employee'] = employees;
            });
            dataService.getData("/bonusType/list", null, function (bonus) {
                self.responseObj['#bonus'] = bonus;
            });
            dataService.getData("/projectPosition/getForDD", null, function (data) {
                self.responseObj['#projectPosition'] = data.data;
            });
            this.$el.find('#saveMember').hide();

            return this;
        }
    });

    return PMView;
});
