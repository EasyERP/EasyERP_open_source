define([
    'Backbone',
    'Underscore',
    'text!templates/Opportunities/form/FormTemplate.html',
    'text!templates/Opportunities/workflowProgress.html',
    'views/Editor/NoteView',
    'views/Editor/AttachView',
    'views/Opportunities/EditView',
    'views/Companies/formPropertyView',
    'views/Tags/TagView',
    'models/CompaniesModel',
    'models/PersonsModel',
    'constants',
    'dataService',
    'populate',
    'constants',
    'views/selectView/selectView'
], function (Backbone, _, OpportunitiesFormTemplate, workflowProgress, NoteView, AttachView, EditView, CompanyFormProperty, TagView, CompanyModel, PersonsModel, constants, dataService, populate, CONSTANTS, SelectView) {
    var FormOpportunitiesView = Backbone.View.extend({
        el: '#content-holder',

        initialize: function (options) {
            this.formModel = options.model;
            this.formModel.urlRoot = constants.URLS.OPPORTUNITIES;
            this.formModel.on('change:tags', this.saveTags, this);
            _.bindAll(this, 'saveDeal');
            this.responseObj = {};
        },

        events: {
            click                                              : 'hideNewSelect',
            'click #tabList a'                                 : 'switchTab',
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

        setChangeValueToModel: function (e){
            var $target = $(e.target);
            var property = $target.attr('data-id').replace('_', '.');
            var value = $target.val();

            $target.closest('div').addClass('active');

            if (!this.modelChanged){
                this.modelChanged = {};
            }
            this.modelChanged[property] = value;
            this.showButtons();
        },

        showButtons : function (){
            this.$el.find('.btnBlock').addClass('showButtons');
        },

        hideButtons : function (){
            this.$el.find('.btnBlock').removeClass('showButtons');
        },

        saveChanges: function (e) {
            this.saveDeal(this.modelChanged);
            this.$el.find('.active').removeClass('active');
        },

        cancelChanges : function (e) {
            this.modelChanged = '';
            this.render();
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

            if (!this.modelChanged){
                this.modelChanged = {};
            }
            this.modelChanged[type] = id;
            this.showButtons();
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
                        self.modelChanged = '';
                        self.hideButtons();
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

        saveTags : function (){
            this.saveDeal(this.formModel.changed);
            this.renderTags();
        },

        renderTags : function (){
            var notDiv = this.$el.find('.tags-container');
            notDiv.empty();

            notDiv.append(
                new TagView({
                    model      : this.formModel,
                    contentType: 'Opportunities'
                }).render().el
            );
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

            if (formModel.customer) {
                companyModel = new CompanyModel(formModel.customer);
            }

            this.formProperty = new CompanyFormProperty({
                parentModel: this.formModel,
                model      : companyModel,
                attribute  : 'customer',
                saveDeal   : self.saveDeal
            });

            this.renderTags();

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
