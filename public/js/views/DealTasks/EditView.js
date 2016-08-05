define([
    'Backbone',
    'Underscore',
    'jQuery',
    'views/dialogViewBase',
    'text!templates/DealTasks/EditTemplate.html',
    'text!templates/selectView/showSelectTemplate.html',
    'views/Notes/NoteView',
    'views/Category/TagView',
    'common',
    'populate',
    'custom',
    'constants'
], function (Backbone,
             _,
             $,
             ParentView,
             EditTemplate,
             showSelectTemplate,
             NoteView,
             CategoryView,
             common,
             populate,
             custom,
             CONSTANTS) {

    var EditView = ParentView.extend({
        contentType: 'DealTasks',
        template   : _.template(EditTemplate),
        responseObj: {},

        events: {
            'keypress #logged, #estimated': 'isNumberKey',
            'click #projectTopName'       : 'useProjectFilter',
            'click .removeSelect'         : 'removeSelect'
        },

        initialize: function (options) {
            _.bindAll(this, 'render', 'saveItem', 'deleteItem');
            this.currentModel = (options.model) || options.collection.getElement();
            this.currentModel.urlRoot = CONSTANTS.URLS.DEALTASKS;
            this.currentModel.on('change:category', this.renderCategory, this);

            this.render();
        },

        removeSelect: function (e) {
            var $target = $(e.target);
            var $div = $target.closest('.selectType');
            $div.find('.showSelect').remove();
            $div.find('a').show();
        },

        useProjectFilter: function (e) {
            var project;
            var filter;

            e.preventDefault();
            project = this.currentModel.get('project')._id;
            filter = {
                project: {
                    key  : 'project._id',
                    type : 'ObjectId',
                    value: [project]
                }
            };

            $('.edit-dialog').remove();

            Backbone.history.navigate('#easyErp/Tasks/list/p=1/c=100/filter=' + encodeURIComponent(JSON.stringify(filter)), {trigger: true});
        },

        isNumberKey: function (evt) {
            var charCode = (evt.which) ? evt.which : event.keyCode;

            return !(charCode > 31 && (charCode < 48 || charCode > 57));
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            var $div =  $target.closest('div.selectType');

            if ($div.length){

                $div.append(_.template(showSelectTemplate, {id : $target.attr('id'), name : $target.text(), imageSrc:  $target.attr('data-img')}));
                $div.find('a').hide();
            } else {
                $target.parents('.dataField').find('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));
            }

        },

        saveItem: function (event) {
            var self = this;
            var viewType;
            var holder;
            var assignedTo;
            var sequence;
            var workflow;
            var data;
            var currentWorkflow;
            var modelJSON = this.currentModel.toJSON();
            var deal = this.$el.find('#dealItem .showSelect').attr('data-id');
            var company = this.$el.find('#companyItem .showSelect').attr('data-id');
            var contact = this.$el.find('#contactItem .showSelect').attr('data-id');
            var description = $.trim(this.$el.find('#description').val());
            var category = modelJSON.category ? modelJSON.category._id : null;

            event.preventDefault();

            viewType = custom.getCurrentVT();
            holder = this.$el;
            assignedTo = holder.find('#assignedToDd').data('id');

            sequence = $.trim(holder.find('#sequence').val());

            if (!sequence) {
                sequence = null;
            }

            if (!description){
                return App.render({
                    type   : 'error',
                    message: 'Please add Description'
                });
            }

            workflow = holder.find('#workflowsDd').data('id');

            data = {
                assignedTo   : assignedTo || null,
                description  : description,
                dueDate      : $.trim(holder.find('#dueDate').val()),
                sequenceStart: modelJSON.sequence,
                company      : company || null,
                category     : category || null,
                companyDate  : company ? new Date() : null,
                contact      : contact || null,
                contactDate  : contact ? new Date() : null,
                deal         : deal || null,
                dealDate     : deal ? new Date() : null
            };

            currentWorkflow = modelJSON.workflow;

            if (currentWorkflow && currentWorkflow._id && (currentWorkflow._id !== workflow)) {
                data.workflow = workflow;
                data.sequence = -1;
                data.workflowStart = modelJSON.workflow._id;
            }

            this.currentModel.save(data, {
                patch  : true,
                success: function (model, res) {
                    var redirectUrl = window.location.hash;
                    self.hideDialog();

                    Backbone.history.fragment = '';
                    Backbone.history.navigate(redirectUrl, {trigger: true});
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        renderCategory: function () {
            var notDiv = this.$el.find('#categoryHolder');
            notDiv.empty();

            notDiv.append(
                new CategoryView({
                    model      : this.currentModel,
                    contentType: 'DealTasks'
                }).render().el
            );
        },

        deleteItem: function (event) {
            var self = this;
            var answer;

            event.preventDefault();

            answer = confirm('Really DELETE items ?!');

            if (answer === true) {
                this.currentModel.destroy({
                    success: function (model) {
                        var viewType;
                        var wId;
                        var newTotal;
                        var $totalCount;

                        model = model.toJSON();
                        viewType = custom.getCurrentVT();

                        switch (viewType) {
                            case 'list':
                                var redirectUrl = window.location.hash;
                                self.hideDialog();

                                Backbone.history.fragment = '';
                                Backbone.history.navigate(redirectUrl, {trigger: true});
                                break;
                            case 'kanban':
                                $('#' + model._id).remove();
                                wId = model.workflow._id;
                                $totalCount = $('td#' + wId + ' .totalCount');

                                newTotal = ($totalCount.html() - 1);
                                $totalCount.html(newTotal);
                        }
                        self.hideDialog();
                    },

                    error: function (model, xhr) {
                        self.errorNotification(xhr);
                    }
                });
            }
        },

        render: function () {
            var formString = this.template({
                model: this.currentModel.toJSON()
            });
            var self = this;
            var notDiv;

            this.$el = $(formString).dialog({
                dialogClass: 'edit-dialog task-dialog task-edit-dialog',
                width      : 600,
                title      : this.currentModel.toJSON().description,
                buttons    : {
                    save: {
                        text : 'Save',
                        class: 'btn',
                        click: self.saveItem
                    },

                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        click: self.hideDialog
                    },
                    delete: {
                        text : 'Delete',
                        class: 'btn',
                        click: self.deleteItem
                    }
                }
            });

            notDiv = this.$el.find('#divForNote');
            notDiv.append(
                new NoteView({
                    model      : this.currentModel,
                    contentType: 'Tasks'
                }).render().el);

            this.renderAssignees(this.currentModel);

            this.renderCategory();

            populate.getWorkflow('#workflowsDd', '#workflowNamesDd', CONSTANTS.URLS.WORKFLOWS_FORDD, {id: 'DealTasks'}, 'name', this);
            populate.get2name('#assignedToDd', CONSTANTS.URLS.EMPLOYEES_PERSONSFORDD, {}, this);
            populate.get('#contactDd', CONSTANTS.URLS.COMPANIES, {type: 'Person'},'fullName', this, false);
            populate.get('#companyDd', CONSTANTS.URLS.COMPANIES, {type: 'Company'},'fullName', this, false);
            populate.get('#dealDd', 'opportunities/getForDd', {},  'name', this, false);

            this.delegateEvents(this.events);

            this.$el.find('#dueDate').datepicker({dateFormat: 'd M, yy', minDate: new Date()});

            return this;
        }

    });
    return EditView;
});
