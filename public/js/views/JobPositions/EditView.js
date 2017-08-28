define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/JobPositions/EditTemplate.html',
    'views/dialogViewBase',
    'populate',
    'constants'
], function (Backbone, $, _, EditTemplate, DialogViewBase, populate, CONSTANTS) {
    'use strict';

    var EditView = DialogViewBase.extend({
        el         : '#content-holder',
        contentType: 'JobPositions',
        template   : _.template(EditTemplate),
        initialize : function (options) {
            _.bindAll(this, 'render', 'saveItem');
            _.bindAll(this, 'render', 'deleteItem');
            if (options.myModel) {
                this.currentModel = options.myModel;
            } else {
                this.currentModel = options.model || options.collection.getElement();
            }
            this.currentModel.urlRoot = CONSTANTS.URLS.JOBPOSITIONS;
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
            var department = $thisEl.find('#departmentDd').data('id');
            var usersId = [];
            var groupsId = [];
            var whoCanRW = $thisEl.find('[name="whoCanRW"]:checked').val();
            var workflow = $thisEl.find('#workflowsDd').data('id');
            var currentWorkflow = this.currentModel.get('workflow');
            var data;

            if (pageSplited) {
                afterPage = pageSplited.split('/')[1];
                location = location.split('/p=')[0] + '/p=1' + '/' + afterPage;
            }

            if (department === '') {
                department = null;
            }

            $thisEl.find('.groupsAndUser tr').each(function () {
                if ($(this).data('type') === 'targetUsers') {
                    usersId.push($(this).data('id'));
                }
                if ($(this).data('type') === 'targetGroups') {
                    groupsId.push($(this).data('id'));
                }
            });

            data = {
                name               : name,
                expectedRecruitment: expectedRecruitment,
                description        : description,
                requirements       : requirements,
                department         : department || null,
                groups             : {
                    owner: $thisEl.find('#allUsersSelect').attr('data-id') || null,
                    users: usersId,
                    group: groupsId
                },

                whoCanRW: whoCanRW
            };

            if (!currentWorkflow || (currentWorkflow && currentWorkflow._id && (currentWorkflow._id !== workflow))) {
                data.workflow = workflow || null;
            }
            this.currentModel.save(data, {
                headers: {
                    mid: mid
                },
                wait   : true,
                patch  : true,
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

            var formString = this.template({
                model: this.currentModel.toJSON()
            });
            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                width      : '700',
                title      : 'Edit Job Position',
                buttons    : [
                    {
                        text : 'Save',
                        class: 'btn blue',
                        click: function () {
                            self.saveItem();
                            self.gaTrackingEditConfirm();
                        }
                    },

                    {
                        text : 'Cancel',
                        class: 'btn',
                        click: function () {
                            $(this).dialog().remove();
                        }
                    },
                    {
                        text : 'Delete',
                        class: 'btn',
                        click: self.deleteItem
                    }

                ]
            });
            this.renderAssignees(this.currentModel);

            populate.get('#departmentDd', CONSTANTS.URLS.DEPARTMENTS_FORDD, {}, 'name', this, false, true);
            populate.getWorkflow('#workflowsDd', '#workflowNamesDd', CONSTANTS.URLS.WORKFLOWS_FORDD, {id: 'Job positions'}, 'name', this, false);
            // for input type number
            this.$el.find('#expectedRecruitment').spinner({
                min: 0,
                max: 9999
            });

            return this;
        }

    });

    return EditView;
});
