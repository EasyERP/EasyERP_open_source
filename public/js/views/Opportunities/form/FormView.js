define([
    'Backbone',
    'Underscore',
    'text!templates/Opportunities/form/FormTemplate.html',
    'text!templates/Opportunities/workflowProgress.html',
    'views/Editor/NoteView',
    'views/Editor/AttachView',
    'views/Opportunities/EditView',
    'views/formProperty/formPropertyView',
    'models/CompaniesModel',
    'models/PersonsModel',
    'constants',
    'dataService',
    'populate',
    'constants',
    'views/selectView/selectView'
], function (Backbone, _, OpportunitiesFormTemplate, workflowProgress, NoteView, AttachView, EditView, formProperty, CompanyModel, PersonsModel, constants, dataService, populate, CONSTANTS, SelectView) {
    var FormOpportunitiesView = Backbone.View.extend({
        el: '#content-holder',

        initialize: function (options) {
            this.formModel = options.model;
            this.formModel.urlRoot = constants.URLS.OPPORTUNITIES;
            _.bindAll(this, 'saveDeal');
            this.responseObj = {};
        },

        events: {
            click                                              : 'hideNewSelect',
            'click #tabList a'                                 : 'switchTab',
            'mouseenter .editable:not(.quickEdit)'             : 'quickEdit',
            'mouseleave .editable'                             : 'removeEdit',
            'click #editSpan'                                  : 'editClick',
            'click #cancelSpan'                                : 'cancelClick',
            'click #saveSpan'                                  : 'saveClick',
            'click .tabListItem'                               : 'changeWorkflow',
            'click .current-selected:not(.jobs)'               : 'showNewSelect',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption'
        },

        hideNewSelect: function () {
            this.$el.find('.newSelectList').hide();

            if (this.selectView) {
                this.selectView.remove();
            }
        },

        saveClick: function (e) {

            var parent = $(e.target).parent().parent();
            var field;
            var value = this.$el.find('#editInput').val();
            var newModel = {};
            e.preventDefault();

            field = parent.attr('data-id').replace('_', '.');
            newModel[field] = value;

            parent.text(value);
            parent.removeClass('quickEdit');

            this.saveDeal(newModel);
        },

        cancelClick: function (e) {
            e.preventDefault();

            var parent = $(e.target).closest('.editable');
            parent.removeClass('quickEdit');
            parent.text(this.text);
        },

        showNewSelect: function (e) {
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

        removeEdit: function () {
            var $thisEl = this.$el;
            $thisEl.find('#editSpan').remove();
            $thisEl.find('dd .no-long').css({width: 'auto'});
        },

        quickEdit: function (e) {
            var trId = $(e.target);

            if (trId.find('#editSpan').length === 0) {
                trId.append('<span id="editSpan" class=""><a href="javascript:;">e</a></span>');
            }
        },

        editClick: function (e) {
            var $target = $(e.target);
            var $thisEl = this.$el;
            var maxlength = $target.closest('.editable').find('.no-long').attr('data-maxlength') || 32;
            var parent;

            e.preventDefault();

            $thisEl.find('.quickEdit #editInput').remove();
            $thisEl.find('.quickEdit #cancelSpan').remove();
            $thisEl.find('.quickEdit #saveSpan').remove();
            $thisEl.find('.quickEdit').text(this.text).removeClass('quickEdit');

            parent = $target.closest('.editable');
            parent.addClass('quickEdit');
            $thisEl.find('#editSpan').remove();
            this.text = parent.text();
            parent.text('');
            parent.append('<input id="editInput" maxlength="32" type="text" class="left"/>');
            $thisEl.find('#editInput').val(this.text);
            parent.append('<span id="saveSpan"><a href="#">c</a></span>');
            parent.append('<span id="cancelSpan"><a href="#">x</a></span>');
            parent.find('#editInput').width(parent.find('#editInput').width() - 50);
        },

        changeWorkflow: function (e) {
            var $target = $(e.target);
            var $thisEl = this.$el;
            var wId;
            var $tabs = $thisEl.find('#workflowProgress .tabListItem');

            if (!$target.hasClass('tabListItem')) {
                $target = $target.closest('div');
            }
            wId = $target.find('span').attr('data-id');
            $tabs.removeClass('passed');
            $target.prevAll().addClass('passed');
            $target.addClass('passed');
            $thisEl.find('#statusDd').text($target.text());
            this.saveDeal({workflow: wId});
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            var holder = $target.parents('dd').find('.current-selected');
            var type = $target.closest('a').attr('data-id');
            var id = $target.attr('id');
            var changedObject = {};

            holder.text($target.text());
            changedObject[type] = id;

            this.saveDeal(changedObject);
        },

        saveDeal: function (changedAttrs, type) {
            var self = this;

            this.formModel.save(changedAttrs, {
                patch  : true,
                success: function () {
                    if (type === 'formProperty') {
                        Backbone.history.fragment = '';
                        Backbone.history.navigate(window.location.hash, {trigger: true});
                    } else {
                        self.noteView.renderTimeline();
                    }
                },
                error  : function (model, response) {
                    if (response) {
                        App.render({
                            type   : 'error',
                            message: response.error
                        });
                    }
                }
            });
        },

        editItem: function () {
            // create editView in dialog here
            return new EditView({model: this.formModel});
        },

        deleteItems: function () {
            var mid = 39;

            this.formModel.destroy({
                headers: {
                    mid: mid
                },
                success: function () {
                    Backbone.history.navigate('#easyErp/Opportunities/kanban', {trigger: true});
                }
            });

        },

        render: function () {
            var formModel = this.formModel.toJSON();
            var self = this;
            var $thisEl = this.$el;
            var personModel;
            var companyModel;

            $thisEl.html(_.template(OpportunitiesFormTemplate, formModel));

            dataService.getData('/workflows/', {id: 'Opportunities'}, function (response) {
                self.responseObj = {workflows: response.data};
                $thisEl.find('#workflowProgress').append(_.template(workflowProgress, {
                    workflows: self.responseObj.workflows,
                    workflow : formModel.workflow
                }));
            });
            populate.get2name('#customerDd', CONSTANTS.URLS.CUSTOMERS, {type: 'Company'}, this, false, true);
            dataService.getData('/employees/getForDD', {isEmployee: true}, function (employees) {
                employees = _.map(employees.data, function (employee) {
                    employee.name = employee.name.first + ' ' + employee.name.last;

                    return employee;
                });

                self.responseObj['#salesPersonDd'] = employees;
            });

            if (formModel.customer) {
                companyModel = new CompanyModel(formModel.customer);
            }

            this.formProperty = new formProperty({
                type       : 'Company',
                parentModel: this.formModel,
                model      : companyModel,
                attribute  : 'customer',
                saveDeal   : self.saveDeal
            });

            $thisEl.find('#companyHolder').html(
                this.formProperty.render().el
            );

            this.noteView = new NoteView({
                model      : this.formModel,
                contentType: 'opportunities'
            });
            $thisEl.find('.notes').append(
                this.noteView.render().el
            );

            $thisEl.find('.attachments').append(
                new AttachView({
                    model      : this.formModel,
                    contentType: 'opportunities',
                    saveNewNote: this.noteView.saveNewNote
                }).render().el
            );

            return this;
        }
    });

    return FormOpportunitiesView;
});
