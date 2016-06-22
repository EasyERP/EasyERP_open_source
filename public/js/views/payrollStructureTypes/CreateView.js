define([
    'jQuery',
    'Underscore',
    'Backbone',
    'views/dialogViewBase',
    'text!templates/payrollStructureTypes/CreateTemplate.html',
    'models/PayrollStructureTypesModel',
    'views/payrollStructureTypes/structureElement/CreateView',
    'text!templates/payrollStructureTypes/componentTemplate.html',
    'populate'
], function ($, _, Backbone, Parent, CreateTemplate, PayrollStructureTypesModel, StructureElementView, componentTemplate, populate) {

    var CreateView = Parent.extend({
        el               : '#content-holder',
        contentType      : 'payrollStructureType',
        template         : _.template(CreateTemplate),
        componentTemplate: _.template(componentTemplate),
        responseObj      : {},
        componentObject  : {
            earnings  : [],
            deductions: []
        },

        initialize: function (options) {
            var self = this;

            self.model = options.model || new PayrollStructureTypesModel();

            self.seq = {};

            self.seq.deduction = Object.keys(self.model.get('deductions')).length;
            self.seq.earning = Object.keys(self.model.get('earnings')).length;

            self.eventChannel = options.eventChannel;

            self.eventChannel.on('newStructureComponent', self.newStructureComponent, self);

            self.render();
        },

        events: {
            'click li'         : 'goToEditDialog',
            'click .fa-plus'   : 'create',
            'click .fa-trash-o': 'remove'
        },

        newStructureComponent: function (component, modelComponent) {
            var self = this;
            var model = self.model;

            if (!this.componentObject[component.type]) {
                this.componentObject[component.type] = [];
            }

            this.componentObject[component.type].push(component);

            component._id = modelComponent.id;

            (model.get([component.type]))[component.id] = component;

            self.renderComponents();
        },

        goToEditDialog: function (e) {
            var self = this;
            var $el = $(e.target).closest('li');
            var type = $el.closest('div').attr('data-id');
            var id = $el.attr('data-id');

            e.preventDefault();

            return new StructureElementView({
                eventChannel: self.eventChannel,
                type        : type,
                data        : (self.model.get(type))[id]
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

            return new StructureElementView({
                eventChannel: self.eventChannel,
                type        : type,
                data        : {
                    id : Date.now(),
                    seq: self.seq[type]++
                }
            });
        },

        saveItem: function () {
            var self = this;
            var model;
            var $currentEl = this.$el;
            var data;
            var name = $.trim($currentEl.find('#payrollStructureName').val());
            var earnings = [];
            var deductions = [];

            this.componentObject.earnings.forEach(function (el) {
                earnings = _.union(earnings, el.formula);
            });

            this.componentObject.deductions.forEach(function (el) {
                deductions = _.union(deductions, el.formula);
            });

            data = {
                name      : name,
                earnings  : earnings,
                deductions: deductions
            };

            if (!name) {
                return App.render({
                    type   : 'error',
                    message: 'name can\'t be empty'
                });
            }

            model = new PayrollStructureTypesModel();
            model.urlRoot = function () {
                return 'payrollStructureTypes';
            };

            model.save(data, {
                patch  : true,
                wait   : true,
                success: function () {
                    self.hideDialog();
                    self.eventChannel.trigger('updatePayrollStructureTypes');
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
        },

        renderComponents: function () {
            var self = this;
            var model = self.model.toJSON();
            var arr = [];
            var $earningComponents = self.$el.find('#earningComponents ul');
            var $deductionComponents = self.$el.find('#deductionComponents ul');

            $earningComponents.html('');
            $deductionComponents.html('');

            Object.keys(model.deductions).forEach(function (deduction) {
                arr.push(model.deductions[deduction]);
            });

            arr = _.sortBy(arr, 'seq');

            arr.forEach(function (deduction) {
                $deductionComponents.append(self.componentTemplate(deduction));
            });

            arr = [];

            Object.keys(model.earnings).forEach(function (earning) {
                arr.push(model.earnings[earning]);
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
            var url;
            var ddId;
            var typeEarning = 'earning';
            var typeDeduction = 'deduction';

            self.$el = $(formString).dialog({
                closeOnEscape: false,
                autoOpen     : true,
                resizable    : true,
                dialogClass  : 'edit-dialog',
                title        : 'Create Payroll Structure',
                width        : '900px',
                position     : {within: $('#wrapper')},
                buttons      : [
                    {
                        text : 'Create',
                        click: function () {
                            self.saveItem();
                        }
                    }, {
                        text : 'Cancel',
                        click: function () {
                            self.hideDialog();
                        }
                    }]

            });

            self.$el.find('ul').sortable();

            url = '/payrollComponentTypes/forDd/' + typeEarning + 's';
            ddId = '#' + typeEarning + 'TypeDd';

            populate.get(ddId, url, {formula: true}, 'name', self);

            url = '/payrollComponentTypes/forDd/' + typeDeduction + 's';
            ddId = '#' + typeDeduction + 'TypeDd';

            populate.get(ddId, url, {formula: true}, 'name', self);

            self.renderComponents();

            self.delegateEvents(this.events);

            return this;
        }

    });

    return CreateView;
});
