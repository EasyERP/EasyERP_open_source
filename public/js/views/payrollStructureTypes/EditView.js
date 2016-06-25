define([
    'jQuery',
    'Underscore',
    'Backbone',
    'views/dialogViewBase',
    'text!templates/payrollStructureTypes/EditTemplate.html',
    'text!templates/payrollStructureTypes/componentForEdit.html',
    'views/payrollStructureTypes/structureElement/CreateView',
    'models/PayrollStructureTypesModel',
    'populate',
    'dataService'
], function ($, _, Backbone, Parent, EditTemplate, componentTemplate, StructureElementView, PayrollStructureTypesModel, populate, dataService) {

    var EditView = Parent.extend({
        el               : '#content-holder',
        contentType      : 'payrollComponentTypes',
        template         : _.template(EditTemplate),
        componentTemplate: _.template(componentTemplate),
        responseObj      : {},

        events: {
            'click .fa-plus'                                   : 'create',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption',
            'click .fa-trash-o'                                : 'remove'
        },

        initialize: function (options) {
            var self = this;

            options = options || {};

            self.model = options.model;
            self.type = options.type;
            self.eventChannel = options.eventChannel;

            self.eventChannel.on('newStructureComponent', self.newStructureComponent, self);

            self.render();
        },

        remove: function (e) {
            var self = this;
            var $el = $(e.target).closest('li');
            var id = $el.attr('data-id');
            var type = $el.closest('div').attr('data-id') + 's';
            var model = self.model;
            var tempObj = {};

            e.preventDefault();
            e.stopPropagation();

            tempObj[type] = [];
            model.set(tempObj);

            $el.remove();

            self.renderComponents();
        },

        chooseOption: function (e) {
            var self = this;
            var $target = $(e.target);
            var id = $target.attr('id');

            dataService.getData('payrollComponentTypes/form', {id: id}, function (result) {
                self.newStructureComponent(result.component);
            });
        },

        newStructureComponent: function (component) {
            var self = this;
            var model = self.model;

            model.set(component.type, _.union(component.formula, model.get([component.type])));

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
                    seq: 0
                }
            });
        },

        saveItem: function () {
            var self = this;
            var model;
            var $currentEl = this.$el;
            var name = $.trim($currentEl.find('#payrollStructureName').val());
            var $earnings = $currentEl.find('[data-id="earning"]').find('li');
            var $deductions = $currentEl.find('[data-id="deduction"]').find('li');
            var data;
            var earnings;
            var deductions;

            earnings = this.model.get('earnings');
            deductions = this.model.get('deductions');

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

            model = self.model;
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
            $('.add-group-dialog').remove();
            $('.add-user-dialog').remove();
            $('.crop-images-dialog').remove();
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

            $earningComponents.html('');
            $deductionComponents.html('');

            Object.keys(model.deductions).forEach(function (deduction) {
                arr.push(model.deductions[deduction]);
            });

            $deductionComponents.append(self.componentTemplate({formula: self.formulaParser(arr)}));

            arr = [];

            Object.keys(model.earnings).forEach(function (earning) {
                arr.push(model.earnings[earning]);
            });

            $earningComponents.append(self.componentTemplate({formula: self.formulaParser(arr)}));

        },

        render: function () {
            var self = this;
            var formString = this.template({
                model: self.model.toJSON(),
                type : self.type
            });
            var url;
            var ddId;
            var typeEarning = 'earning';
            var typeDeduction = 'deduction';

            this.$el = $(formString).dialog({
                closeOnEscape: false,
                autoOpen     : true,
                resizable    : true,
                dialogClass  : 'edit-dialog',
                title        : 'Edit Payroll Structure Types',
                width        : '900px',
                position     : {within: $('#wrapper')},
                buttons      : [
                    {
                        text : 'Save',
                        click: function () {
                            self.saveItem();
                        }
                    },

                    {
                        text : 'Cancel',
                        click: function () {
                            self.hideDialog();
                        }
                    }]

            });

            url = '/payrollComponentTypes/forDd/' + typeEarning + 's';
            ddId = '#' + typeEarning + 'TypeDd';

            populate.get(ddId, url, {formula: true}, 'name', self);

            url = '/payrollComponentTypes/forDd/' + typeDeduction + 's';
            ddId = '#' + typeDeduction + 'TypeDd';

            populate.get(ddId, url, {formula: true}, 'name', self);

            this.renderComponents();

            this.delegateEvents(this.events);

            return this;
        }

    });

    return EditView;
});
