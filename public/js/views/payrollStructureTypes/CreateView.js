define([
    'jQuery',
    'Underscore',
    'Backbone',
    'views/dialogViewBase',
    'text!templates/payrollStructureTypes/CreateTemplate.html',
    'models/PayrollStructureTypesModel',
    'views/payrollStructureTypes/structureElement/CreateView',
    'text!templates/payrollStructureTypes/componentTemplate.html',
    'populate',
    'dataService'
], function ($, _, Backbone, Parent, CreateTemplate, PayrollStructureTypesModel, StructureElementView, componentTemplate, populate, dataService) {

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

            this.componentNames = {
                earnings  : [],
                deductions: []
            };

            self.render();
        },

        events: {
            // 'click li'                                         : 'goToEditDialog',
            'click .selected'  : 'showNewSelect',
            'click .createBtn' : 'create',
            'click .icon-trash': 'remove'
        },

        newStructureComponent: function (component, modelComponent) {
            var self = this;
            var model = self.model;
            var modelArray = model.get(component.type);

            if (!this.componentObject[component.type]) {
                this.componentObject[component.type] = [];
            }

            this.componentObject[component.type].push(component._id || modelComponent.id);
            this.componentNames[component.type].push({name: component.name, _id: component._id || modelComponent.id});

            component._id = component._id || modelComponent.id;

            modelArray.push(component);

            self.renderComponents();
        },

        /* newStructureComponent: function (component) {
         var self = this;
         var model = self.model;

         model.set(component.type, _.union(component.formula, model.get([component.type])));

         self.renderComponents();
         },*/

        chooseOption: function (e) {
            var self = this;
            var $target = $(e.target);
            var id = $target.attr('id');

            dataService.getData('payrollComponentTypes/form', {id: id}, function (result) {
                self.newStructureComponent(result.component);
            });
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
            var type = $el.closest('div').attr('data-id') + 's';
            var model = self.model;
            var tempArray = model.get(type);
            var tempObj = _.find(tempArray, function (el) {
                return el._id === id;
            });
            var indexOfObject = tempArray.indexOf(tempObj && tempObj.length ? tempObj[0] : tempObj);

            e.preventDefault();
            e.stopPropagation();

            tempArray.splice(indexOfObject, 1);

            $el.remove();

            this.componentObject = {};
            this.componentNames = {
                earnings  : [],
                deductions: []
            };

            self.setFormulasNames();

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
            var earnings;
            var deductions;

            earnings = this.componentObject.earnings;
            deductions = this.componentObject.deductions;

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
                    self.componentObject = {};
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        hideDialog: function () {
            $('.edit-dialog').remove();

            this.componentObject = {};
            this.componentNames = {
                earnings  : [],
                deductions: []
            };
        },

        formulaParser: function (arr) {
            var formulaStr = '';
            var length = arr.length || 0;
            var i;
            var formulaObject = {};
            var lastSign;
            var signs = ['+', '-', '/', '*'];

            this.operations = {
                multiply : '*',
                divide   : '/',
                substract: '-',
                add      : '+'
            };

            for (i = 0; i <= length - 1; i++) {
                formulaObject = arr[i];

                formulaStr += ' ' + formulaObject.operand + ' ' + this.operations[formulaObject.operation] + ' ' + formulaObject.ratio + ' ' + this.operations[formulaObject.prefix];
            }

            lastSign = formulaStr[formulaStr.length - 1];

            if (signs.indexOf(lastSign) !== -1) {
                formulaStr = formulaStr.substr(0, formulaStr.length - 1);
            }

            return formulaStr;
        },

        renderComponents: function () {
            var self = this;
            var model = self.model.toJSON();
            var arr = [];
            var $earningComponents = self.$el.find('#earningComponents ul');
            var $deductionComponents = self.$el.find('#deductionComponents ul');
            var deductionsFormula = '';
            var earningsFormula = '';

            $earningComponents.html('');
            $deductionComponents.html('');

            model.deductions.forEach(function (deduction) {
                arr = arr.concat(deduction.formula || deduction);
            });

            this.componentNames.deductions.forEach(function (deduction) {
                $deductionComponents.append(self.componentTemplate({formula: deduction}));
            });

            if (arr.length) {
                deductionsFormula = self.formulaParser(arr, 'deductions');
            }

            arr = [];

            model.earnings.forEach(function (earning) {
                arr = arr.concat(earning.formula || earning);
            });

            this.componentNames.earnings.forEach(function (earning) {
                $earningComponents.append(self.componentTemplate({formula: earning}));
            });

            if (arr.length) {
                earningsFormula = self.formulaParser(arr, 'earnings');
            }

            if (deductionsFormula && earningsFormula) {
                this.$el.find('#resultFormula').text(earningsFormula + ' - ( ' + deductionsFormula + ' )');
            } else if (deductionsFormula) {
                this.$el.find('#resultFormula').text(' - ( ' + deductionsFormula + ' )');
            } else if (earningsFormula) {
                this.$el.find('#resultFormula').text(earningsFormula);
            }
        },

        setFormulasNames: function () {
            var self = this;
            var model = this.model.toJSON();

            model.deductions.forEach(function (deduction) {
                self.componentNames.deductions = _.union(self.componentNames.deductions, [{
                    name: deduction.name,
                    _id : deduction._id
                }]);

                self.componentObject.deductions = _.union(self.componentObject.deductions, [deduction._id]);
            });

            model.earnings.forEach(function (earning) {
                self.componentNames.earnings = _.union(self.componentNames.earnings, [{
                    name: earning.name,
                    _id : earning._id
                }]);

                self.componentObject.earnings = _.union(self.componentObject.earnings, [earning._id]);

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
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Create Payroll Structure',
                width      : '700px',
                position   : {within: $('#wrapper')},
                buttons    : [
                    {
                        text : 'Create',
                        class: 'btn blue',
                        click: function () {
                            self.saveItem();
                        }
                    }, {
                        text : 'Cancel',
                        class: 'btn',
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

            this.setFormulasNames();

            self.renderComponents();

            self.delegateEvents(this.events);

            return this;
        }

    });

    return CreateView;
});
