define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/routing/EditTemplate.html',
    'text!templates/routing/OperationCreateTemplate.html',
    'text!templates/routing/OperationsTemplate.html',
    'views/dialogViewBase',
    'populate'
], function (Backbone, $, _, CreateTemplate, OperationCreateTemplate, OperationsTemplate, ParentView, populate) {

    var CreateView = ParentView.extend({
        el                  : '#content-holder',
        template            : _.template(CreateTemplate),
        imageSrc            : '',
        searchProdCollection: null,
        createOperation     : _.template(OperationCreateTemplate),
        operationsTemplate  : _.template(OperationsTemplate),

        initialize: function (options) {
            var self = this;
            this.model = options.model;

            this.operations = {};

            this.model.toJSON().steps.forEach(function (el) {
                if (el._id) {
                    self.operations[el._id] = el;
                }
            });

            this.render();
        },

        events: {
            'click #addItem'  : 'renderCreateView',
            'click .removeRow': 'removeOperation'
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
                operation       : operation,
                duration        : duration,
                description     : description,
                workCentre      : workCentre.attr('data-id'),
                workCentreObject: {
                    _id : workCentre.attr('data-id'),
                    name: $.trim(workCentre.text())
                }
            };

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
            var self = this;
            var name = $('#nameRouting').val();
            var keys = Object.keys(this.operations);
            var operationsArray = [];

            keys.forEach(function (key) {
                if (self.operations[key]._id.length < 24) {
                    delete self.operations[key]._id;
                }
                operationsArray.push(self.operations[key]);
            });

            this.model.set({
                name : name,
                steps: operationsArray
            });

            if (!name) {
                return App.render({type: 'error', message: 'Enter name, please.'});
            }

            if (!operationsArray.length) {
                return App.render({type: 'error', message: 'Choose at least one operation, please.'});
            }

            this.model.save(this.model.changed, {
                patch  : true,
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
            var formString = self.template({model: this.model.toJSON()});

            this.$el = $(formString).dialog({
                dialogClass: 'edit-dialog',
                width      : 600,
                title      : 'Create Product',
                buttons    : {
                    save: {
                        text : 'Save',
                        class: 'btn blue',
                        click: function () {
                            self.saveItem();
                        }
                    },

                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        click: function () {
                            self.hideDialog();
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
