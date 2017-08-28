define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/JobPositions/CreateTemplate.html',
    'models/JobPositionsModel',
    'views/dialogViewBase',
    'populate',
    'constants'
], function (Backbone, $, _, CreateTemplate, JobPositionsModel, DialogViewBase, populate, CONSTANTS) {
    'use strict';

    var CreateView = DialogViewBase.extend({
        el         : '#content-holder',
        contentType: 'JobPositions',
        template   : _.template(CreateTemplate),

        initialize: function () {
            _.bindAll(this, 'saveItem', 'render');
            this.model = new JobPositionsModel();
            this.responseObj = {};
            this.render();
        },

        chooseOption: function (e) {
            $(e.target).parents('ul').closest('.current-selected').text($(e.target).text()).attr('data-id', $(e.target).attr('id'));
            $('.newSelectList').hide();
        },

        saveItem: function () {
            var afterPage = '';
            var location = window.location.hash;
            var pageSplited = location.split('/p=')[1];
            var $thisEl = this.$el;

            var self = this;
            var mid = 39;
            var name = $.trim($thisEl.find('#name').val());
            var expectedRecruitment = parseInt($.trim($thisEl.find('#expectedRecruitment').val()), 10);
            var description = $.trim($thisEl.find('#description').val());
            var requirements = $.trim($thisEl.find('#requirements').val());
            var workflow = this.$('#workflowsDd').data('id');
            var department = this.$('#departmentDd').data('id') || null;
            var usersId = [];
            var groupsId = [];
            var whoCanRW = $thisEl.find('[name="whoCanRW"]:checked').val();

            if (pageSplited) {
                afterPage = pageSplited.split('/')[1];
                location = location.split('/p=')[0] + '/p=1' + '/' + afterPage;
            }

            $('.groupsAndUser tr').each(function () {
                if ($(this).data('type') === 'targetUsers') {
                    usersId.push($(this).data('id'));
                }
                if ($(this).data('type') === 'targetGroups') {
                    groupsId.push($(this).data('id'));
                }
            });

            this.model.save({
                name               : name,
                expectedRecruitment: expectedRecruitment,
                description        : description,
                requirements       : requirements,
                department         : department,
                workflow           : workflow,

                groups: {
                    owner: $thisEl.find('#allUsersSelect').attr('data-id') || null,
                    users: usersId,
                    group: groupsId
                },

                whoCanRW: whoCanRW
            }, {
                headers: {
                    mid: mid
                },
                wait   : true,
                success: function () {
                    self.hideDialog();
                    Backbone.history.fragment = '';
                    Backbone.history.navigate(location, {trigger: true});
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        render: function () {
            var self = this;
            var formString = this.template({});
            var this$el;
            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Edit Job position',
                width      : '700',
                buttons    : [
                    {
                        text : 'Create',
                        class: 'btn blue',
                        click: function () {
                            self.saveItem();
                            self.gaTrackingConfirmEvents();
                        }
                    },

                    {
                        text : 'Cancel',
                        class: 'btn',
                        click: function () {
                            //$(this).dialog().remove();
                            self.hideDialog();
                        }
                    }]

            });
            this$el = this.$el;
            this$el.find('#expectedRecruitment').spinner({
                min: 0,
                max: 9999
            });

            this.renderAssignees();
            populate.get('#departmentDd', CONSTANTS.URLS.DEPARTMENTS_FORDD, {}, 'name', this, true, true);
            populate.getWorkflow('#workflowsDd', '#workflowNamesDd', CONSTANTS.URLS.WORKFLOWS_FORDD, {id: 'Job positions'}, 'name', this, true);
            this.delegateEvents(this.events);
            return this;
        }
    });
    return CreateView;
});
