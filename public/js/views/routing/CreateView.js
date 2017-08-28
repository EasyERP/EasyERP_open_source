define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/routing/CreateTemplate.html',
    'text!templates/routing/OperationCreateTemplate.html',
    'text!templates/routing/OperationsTemplate.html',
    'views/dialogViewBase',
    'models/RoutingModel',
    'populate',
    'helpers/keyValidator'
], function (Backbone, $, _, CreateTemplate, OperationCreateTemplate, OperationsTemplate, ParentView, Model, populate, keyValidator) {

    var CreateView = ParentView.extend({
        el                  : '#content-holder',
        template            : _.template(CreateTemplate),
        imageSrc            : '',
        searchProdCollection: null,
        createOperation     : _.template(OperationCreateTemplate),
        operationsTemplate  : _.template(OperationsTemplate),

        initialize: function () {
            this.operations = {};

            this.render();
        },

        events: {
            'click #addItem'  : 'renderCreateView',
            'click .removeRow': 'removeOperation',
            'keypress .forNum': 'keypressHandler'
        },

        keypressHandler: function (e) {
            return keyValidator(e, true);
        },

        closeCreateDialog: function () {
            $('.createOperation-dialog').remove();
        },

        removeOperation: function (e) {
            var $tr = $(e.target).closest('tr');
            var id = $tr.attr('id');

            delete this.operations[id];

            $tr.remove();
        },

        renderOperations: function () {
            var self = this;
            var keys = Object.keys(this.operations);
            var operationsArray = [];

            keys.forEach(function (key) {
                operationsArray.push(self.operations[key]);
            });

            $('#operationsContainer').html(this.operationsTemplate({operations: operationsArray}));
        },

        gatherInfoForCreate: function () {
            var data;
            var key = (new Date()).getTime();
            var operation = $.trim(this.$el.find('#name').val());
            var duration = parseFloat(this.$el.find('#defaultDuration').val() || 0) * 100;
            var description = $.trim(this.$el.find('#description').val());
            var workCentre = this.$el.find('#workCentre');

            data = {
                _id             : key,
                operation       : operation,
                duration        : duration,
                description     : description,
                workCentre      : workCentre.attr('data-id'),
                workCentreObject: {
                    _id : workCentre.attr('data-id'),
                    name: $.trim(workCentre.text())
                }
            };

            if (!operation) {
                return App.render({type: 'error', message: 'Enter name, please.'});
            }

            if (!duration) {
                return App.render({type: 'error', message: 'Enter duration, please.'});
            }

            this.operations[key] = data;

            this.closeCreateDialog();

            this.renderOperations();
        },

        chooseOption: function (e) {
            var $target = $(e.target).closest('.current-selected');

            $target.text($.trim($(e.target).text())).attr('data-id', $(e.target).attr('id'));
        },

        renderCreateView: function () {
            var self = this;
            var dialogOptions = {
                dialogClass: 'createOperation-dialog',
                width      : 600,
                buttons    : {
                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        click: function () {
                            self.closeCreateDialog();
                        }
                    },

                    save: {
                        text : 'Create',
                        class: 'btn',
                        click: function () {
                            self.gatherInfoForCreate();
                        }
                    }
                }
            };
            var createTemplate = this.createOperation({});

            this.$el = $(createTemplate).dialog(dialogOptions);

            this.responseObj = {};

            populate.get('#workCentre', '/workCentre/getForDd', {}, 'name', this, true, false);

            this.delegateEvents(this.events);
        },

        saveItem: function () {
            var routingModel = new Model();
            var self = this;
            var name = $('#nameRouting').val();
            var keys = Object.keys(this.operations);
            var operationsArray = [];

            keys.forEach(function (key) {

                delete self.operations[key]._id;

                operationsArray.push(self.operations[key]);
            });

            if (!name) {
                return App.render({type: 'error', message: 'Enter name, please.'});
            }

            if (!operationsArray.length) {
                return App.render({type: 'error', message: 'Choose at least one operation, please.'});
            }

            routingModel.save({
                name : _.escape(name),
                steps: operationsArray
            }, {
                success: function (model, response) {
                    Backbone.history.fragment = '';
                    Backbone.history.navigate(window.location.hash, {trigger: true});
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
        },

        render: function () {
            var self = this;
            var formString = self.template({});

            this.$el = $(formString).dialog({
                dialogClass: 'edit-dialog',
                width      : 600,
                title      : 'Create Product',
                buttons    : {
                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        click: function () {
                            self.hideDialog();
                        }
                    },

                    save: {
                        text : 'Create',
                        class: 'btn blue',
                        click: function () {
                            self.saveItem();
                        }
                    }
                }
            });

            this.delegateEvents(self.events);

            this.renderOperations();

            return this;
        }

    });

    return CreateView;
});
