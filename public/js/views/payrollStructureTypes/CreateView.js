define([
        'jQuery',
        'Underscore',
        'Backbone',
        "text!templates/payrollStructureTypes/CreateTemplate.html",
        "models/PayrollStructureTypesModel",
        'views/payrollStructureTypes/structureElement/CreateView',
        "text!templates/payrollStructureTypes/componentTemplate.html",
        "common",
        "populate",
        "dataService",
        'constants'
    ],
    function ($, _, Backbone, CreateTemplate, PayrollStructureTypesModel, StructureElementView, componentTemplate, common, populate, dataService, CONSTANTS) {

        var CreateView = Backbone.View.extend({
            el         : '#content-holder',
            contentType: 'payrollStructureType',
            template   : _.template(CreateTemplate),
            componentTemplate: _.template(componentTemplate),


            initialize: function (options) {
                var self = this;

                self.model = options.model || new PayrollStructureTypesModel();

                self.seq = {};

                self.seq.deduction = Object.keys(self.model.get('deduction')).length;
                self.seq.earning = Object.keys(self.model.get('earning')).length;

                self.eventChannel = options.eventChannel;

                self.eventChannel.on('newStructureComponent', self.newStructureComponent, self);

                self.render();
            },

            events: {
                "click li": "goToEditDialog",
                "click .fa-plus": "create",
                "click .fa-trash-o": "remove"
            },

            newStructureComponent: function(component) {
                var self = this;
                var model = self.model;

                (model.get([component.type]))[component.id] = component;

                self.renderComponents();
            },

            goToEditDialog: function (e) {
                var self = this;
                var $el = $(e.target).closest('li');
                var type = $el.closest('div').attr('data-id');
                var id = $el.attr('data-id');

                e.preventDefault();

                new StructureElementView({
                    eventChannel: self.eventChannel,
                    type: type,
                    data: (self.model.get(type))[id]
                });
            },

            remove: function (e) {
                var self = this;
                var $el = $(e.target).closest('li');
                var id = $el.attr('data-id');
                var type = $el.closest('div').attr('data-id');
                var model = self.model;
                var tempObj = {};
                var arr;

                e.preventDefault();
                e.stopPropagation();

                arr = model.get(type);
                delete arr[id];
                tempObj[type] = arr;
                model.set(tempObj);

                self.renderComponents();
            },

            create: function (e) {
                var self = this;
                var type = $(e.target).attr('data-id');

                e.preventDefault();

                new StructureElementView({
                    eventChannel: self.eventChannel,
                    type: type,
                    data: {
                        id: Date.now(),
                        seq: self.seq[type]++
                    }
                });
            },

            saveItem: function () {
                var self = this;
                var model;
                var hours;
                var $currentEl = this.$el;

                var name = $.trim($currentEl.find('#weeklySchedulerName input').val());
                var totalHours = $currentEl.find('#totalHours span').text();

                var data = {
                    name: name,
                    totalHours: totalHours
                };

                if (!name) {
                    return App.render({
                        type: 'error',
                        message: 'name can\'t be empty'
                    });
                }

                for (var i = 7; i > 0; i--) {
                    hours = parseInt($currentEl.find('td[data-content="' + i + '"] input').val());
                    hours = isNaN(hours) ? 0 : hours;

                    if (hours < 0 || hours > 24) {
                        return App.render({
                            type: 'error',
                            message: 'hours should be in 0-24 range'
                        });
                    }

                    data[i] = hours;
                }

                model = new PayrollStructureTypesModel();
                model.urlRoot = function () {
                    return 'weeklyScheduler';
                };

                model.save(data, {
                    patch  : true,
                    headers: {
                        mid: 103
                    },
                    wait   : true,
                    success: function () {
                        self.hideDialog();
                        self.eventChannel.trigger('updateWeeklyScheduler');
                    },
                    error  : function (model, xhr) {
                        self.errorNotification(xhr);
                    }
                });
            },

            hideDialog: function () {
                $(".edit-dialog").remove();
            },

            renderComponents: function () {
                var self = this;
                var model = self.model.toJSON();
                var arr = [];
                var $earningComponents = self.$el.find('#earningComponents ul');
                var $deductionComponents = self.$el.find('#deductionComponents ul');

                $earningComponents.html('');
                $deductionComponents.html('');

                Object.keys(model.deduction).forEach(function (deduction) {
                    arr.push(model.deduction[deduction]);
                });

                arr = _.sortBy(arr, 'seq');

                arr.forEach(function (deduction) {
                    $deductionComponents.append(self.componentTemplate(deduction));
                });

                arr = [];

                Object.keys(model.earning).forEach(function (earning) {
                    arr.push(model.earning[earning]);
                });

                arr = _.sortBy(arr, 'seq');

                arr.forEach(function (earning) {
                    $earningComponents.append(self.componentTemplate(earning));
                });

            },

            render: function () {
                var self = this;
                var model = self.model.toJSON();
                var formString = self.template(model);

                self.$el = $(formString).dialog({
                    closeOnEscape: false,
                    autoOpen     : true,
                    resizable    : true,
                    dialogClass  : "edit-dialog",
                    title        : "Create WeeklyScheduler",
                    width        : "900px",
                    position     : {within: $("#wrapper")},
                    buttons      : [
                        {
                            id   : "create-weeklyScheduler-dialog",
                            text : "Create",
                            click: function () {
                                self.saveItem();
                            }
                        },

                        {
                            text : "Cancel",
                            click: function () {
                                self.hideDialog();
                            }
                        }]

                });

                self.$el.find('ul').sortable();

                self.renderComponents();

                self.delegateEvents(this.events);

                return this;
            }

        });

        return CreateView;
    });
