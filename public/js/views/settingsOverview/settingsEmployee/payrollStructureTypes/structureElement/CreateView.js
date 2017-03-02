define([
    'jQuery',
    'Underscore',
    'Backbone',
    'views/dialogViewBase',
    'text!templates/settingsOverview/settingsEmployee/payrollStructureTypes/structureElement/CreateTemplate.html',
    'text!templates/settingsOverview/settingsEmployee/payrollStructureTypes/structureElement/FormulaElementTemplate.html',
    'models/PayrollComponentTypeModel',
    'common',
    'populate'
], function ($, _, Backbone, Parent, CreateTemplate, FormulaElementTemplate, PayrollComponentTypeModel, common, populate) {

    var CreateView = Parent.extend({
        el             : '#content-holder',
        contentType    : 'payrollStructureType',
        template       : _.template(CreateTemplate),
        elementTemplate: _.template(FormulaElementTemplate),
        responseObj    : {},

        initialize: function (options) {
            var self = this;

            self.data = options.data || {};

            self.type = options.type;
            self.eventChannel = options.eventChannel;
            self.collection = options.collection;
            self.updateAfterCreate = options.updateAfterCreate;

            self.seq = (self.data && self.data.formula && self.data.formula.length) || 0;

            self.responseObj['#sumSubDd'] = [
                {
                    _id : 'add',
                    name: '+'
                }, {
                    _id : 'substract',
                    name: '-'
                }
            ];

            self.responseObj['#mulDivDd'] = [
                {
                    _id : 'multiply',
                    name: 'x'
                }, {
                    _id : 'divide',
                    name: '/'
                }
            ];

            self.responseObj['#operandDd'] = [
                {
                    _id : 'const',
                    name: 'Constant'
                }, {
                    _id : 'base',
                    name: 'base'
                }, {
                    _id : 'overtime',
                    name: 'overtime'
                }, {
                    _id : 'vacation',
                    name: 'vacation'
                }
            ];

            self.mapValues = {};

            Object.keys(self.responseObj).forEach(function (ddElement) {
                var val = {};
                self.responseObj[ddElement].forEach(function (el) {
                    val[el._id] = el.name;
                });
                self.mapValues[ddElement] = val;
            });

            self.render();
        },

        events: {
            'click #addFormulaElement': 'addFormulaElement',
            'click .icon-trash'       : 'removeEl',
            'click #range'            : 'toggleRange'
        },

        removeEl: function (e) {

            e.preventDefault();
            e.stopPropagation();

            $(e.target).closest('div.formulaElement').remove();
        },

        toggleRange: function () {

            this.$el.find('.maxRange').toggle();
            this.$el.find('.minRange').toggle();

        },

        addFormulaElement: function (e) {
            var self = this;

            e.preventDefault();
            e.stopPropagation();

            $('#formula').append(self.elementTemplate({seq: self.seq++}));
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            var parentUl = $target.parent();
            var element = $target.closest('a') || parentUl.closest('a');
            var targetId = $target.attr('id');
            var $mulDivDd = $target.closest('.formulaElementOperand').find('#mulDivDd');

            $target.closest('.current-selected').text($target.text()).attr('data-id', targetId);

            if (targetId === 'const') {
                $mulDivDd.hide();
            } else {
                $mulDivDd.show();
            }
        },

        saveItem: function () {
            var self = this;
            var $currentEl = this.$el;
            var name = $.trim($currentEl.find('#structureComponentName').val());
            var data = self.data;
            var err;
            var model;

            if (self.type[self.type.length - 1] !== 's') {
                self.type += 's';
            }

            data.name = name;
            data.type = self.type;
            data.formula = [];
            data.minRange = $.trim($currentEl.find('#minRange').val());
            data.maxRange = $.trim($currentEl.find('#maxRange').val());

            if (!name) {
                err = 'name can\'t be empty';
            }

            if (data.minRange > data.maxRange) {
                return App.render({
                    type   : 'error',
                    message: 'max range must be less or equal min range'
                });
            }

            $('.formulaElement').each(function () {
                var $element = $(this);
                var element = {};
                var seq = $element.attr('data-seq');

                element.prefix = $.trim($element.find('#sumSubDd').attr('data-id'));
                element.operand = $.trim($element.find('#operandDd').attr('data-id'));
                element.operation = $.trim($element.find('#mulDivDd').attr('data-id'));
                element.ratio = $.trim($element.find('#ratio').val());

                if (!element.operand) {
                    err = 'All operands should be selected';
                }

                data.formula[seq] = element;
            });

            if (err) {
                return App.render({
                    type   : 'error',
                    message: err
                });
            }

            model = new PayrollComponentTypeModel();
            model.urlRoot = function () {
                return 'payrollComponentTypes';
            };

            model.save(data, {
                patch  : true,
                success: function (model) {
                    self.remove();

                    self.eventChannel.trigger('newStructureComponent', data, model);

                    if (self.updateAfterCreate) {
                        self.eventChannel.trigger('updatePayrollDeductionsType', data, model);
                        self.eventChannel.trigger('updatePayrollEarningsType', data, model);
                    }

                    if (self.collection) {
                        self.collection.add(model, {remove: false});
                    }
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        hideDialog: function () {
            $('.create-structureElement-dialog').remove();
        },

        renderFormula: function () {
            var self = this;
            var $formula;
            var elemString;
            var formula;
            var mapValues = self.mapValues;
            var data = self.data;

            $formula = $('#formula');

            if (!self.seq) {
                elemString = self.elementTemplate({seq: self.seq++});
                $formula.append(elemString);
            } else {
                formula = data.formula;
                formula.forEach(function (formulaEl, seq) {
                    var elData = {
                        prefix   : {},
                        operand  : {},
                        operation: {}
                    };

                    elData.prefix.id = formulaEl.prefix;
                    elData.prefix.name = mapValues['#sumSubDd'][formulaEl.prefix];
                    elData.operand.id = formulaEl.operand;
                    elData.operand.name = mapValues['#operandDd'][formulaEl.operand];
                    elData.operation.id = formulaEl.operation;
                    elData.operation.name = mapValues['#mulDivDd'][formulaEl.operation];
                    elData.ratio = formulaEl.ratio;

                    $('#formula').append(self.elementTemplate({
                        seq   : seq,
                        elData: elData
                    }));
                });
            }

            $formula.find('a').first().hide();
        },

        render: function () {
            var self = this;
            var data = self.data;
            var type = self.type;

            var formString = self.template({
                type         : type,
                name         : data.name,
                componentType: data.componentType
            });
            var buttons = [
                {
                    class: 'btn',
                    text : 'Cancel',
                    click: function () {
                        self.hideDialog();
                    }
                }];

            if (data.name) {
                buttons.unshift(
                    {
                        id   : 'create-weeklyScheduler-dialog',
                        class: 'btn blue',
                        text : 'Update',
                        click: function () {
                            self.saveItem();
                        }
                    }
                );
            } else {
                buttons.unshift(
                    {
                        id   : 'create-weeklyScheduler-dialog',
                        class: 'btn blue',
                        text : 'Create',
                        click: function () {
                            self.saveItem();
                        }
                    }
                );
            }

            self.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'create-structureElement-dialog',
                title      : 'Create WeeklyScheduler',
                width      : '800px',
                position   : {within: $('#wrapper')},
                buttons    : buttons

            });

            self.renderFormula();

            self.delegateEvents(this.events);

            return self;
        }

    });

    return CreateView;
});
