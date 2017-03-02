define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/customDashboard/CreateTemplate.html',
    'views/dialogViewBase',
    'models/CustomDashboardModel',
    'common',
    'populate',
    'dataService',
    'views/Notes/AttachView',
    'constants',
    'moment'
], function (Backbone, $, _, CreateTemplate, ParentView, Model, common, populate, dataService, AttachView, CONSTANTS, moment) {

    var CreateView = ParentView.extend({
        el         : '#content-holder',
        contentType: CONSTANTS.CUSTOMDASHBOARD,
        template   : _.template(CreateTemplate),

        initialize: function () {
            _.bindAll(this, 'saveItem', 'render');
            this.model = new Model();
            this.responseObj = {};

            this.render();
        },

        saveItem: function () {
            var self = this;
            var $thisEl = this.$el;
            var name = $.trim($thisEl.find('#name').val()) || 'New Dashboard';
            var rows = $thisEl.find('#numOfRows').val();
            var columns = $thisEl.find('#numOfColumns').val();
            var description = $thisEl.find('#description').val();

            this.model.save({
                name       : name,
                rows       : rows,
                columns    : columns,
                description: description
            }, {

                success: function (model) {
                    var currentModel = model.changed;

                    self.attachView.sendToServer(null, currentModel);
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }

            });
        },

        render: function () {
            var self = this;
            var formString = this.template();
            var notDiv;

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Edit Company',
                width      : '1000',
                buttons    : [
                    {
                        text : 'Create',
                        class: 'btn blue',
                        click: function () {
                            self.saveItem();
                        }
                    },

                    {
                        text : 'Cancel',
                        class: 'btn',
                        click: function () {
                            self.hideDialog();
                        }
                    }
                ]
            });

            notDiv = this.$el.find('.attach-container');

            this.attachView = new AttachView({
                model      : this.model,
                contentType: self.contentType,
                isCreate   : true
            });
            notDiv.append(this.attachView.render().el);

            this.delegateEvents(this.events);

            return this;
        }

    });

    return CreateView;
});
