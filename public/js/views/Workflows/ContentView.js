define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Workflows/list/ListTemplate.html',
    'views/Workflows/list/ListItemView',
    'collections/RelatedStatuses/RelatedStatusesCollection',
    'custom',
    'models/WorkflowsModel',
    'constants',
    'helpers/ga',
    'constants/googleAnalytics'
], function (Backbone, $, _, ListTemplate, ListItemView, RelatedStatusesCollection, Custom, WorkflowsModel, CONSTANTS, ga, GA) {
    'use strict';

    var ContentView = Backbone.View.extend({
        el        : '#content-holder',
        initialize: function (options) {
            this.startTime = options.startTime;
            _.bindAll(this, 'saveStatus', 'render');
            this.relatedStatusesCollection = new RelatedStatusesCollection();
            this.relatedStatusesCollection.bind('reset', _.bind(this.render, this));
            this.collection = options.collection;
            this.collection.bind('reset', _.bind(this.render, this));

            //  this.render();
        },

        events: {
            'click .checkbox'                           : 'checked',
            'click .workflow-sub'                       : 'chooseWorkflowDetailes',
            'click .workflow-list li'                   : 'chooseWorkflowDetailes',
            'click  .edit'                              : 'edit',
            'click  .delete'                            : 'deleteItems',
            'click #addNewStatus'                       : 'addNewStatus',
            'click a.cancel'                            : 'cancel',
            'click a.save'                              : 'save',
            'click #saveStatus'                         : 'saveStatus',
            'click #cancelStatus'                       : 'cancelStatus',
            'mouseenter #workflows .row:not(.quickEdit)': 'quickEdit',
            'mouseleave .workflow-sub-list li'          : 'removeEdit'
        },

        save: function (e) {
            var self = this;
            var $thisEl = this.$el;
            var mid = 39;
            var $tr = $(e.target).closest('div.row');
            var name = $tr.find('div.name input').val().trim();
            var status = $tr.find('div.status option:selected').text();
            var $tdName = $tr.find('div.name');
            var id = $tdName.data('id');
            var sequence = $tdName.data('sequence');
            var model = this.collection.get(id);

            var obj = {
                name    : name,
                status  : status,
                sequence: sequence
            };

            e.preventDefault();

            ga && ga.trackingEditConfirm(name);

            $thisEl.find('#addNewStatus').show();
            this.collection.url = CONSTANTS.URLS.WORKFLOWS;

            model.set(obj);
            model.save({}, {
                headers: {
                    mid: mid
                },

                success: function () {
                    var $targetParent = $(e.target).parent();

                    $targetParent.siblings().find('span.name').text(obj.name);
                    $targetParent.siblings().find('span.status').text(obj.status);
                    $targetParent.siblings().find('span').removeClass('hidden').end()
                        .find('input, select, a:contains("Cancel"), a:contains("Save")').remove();
                    $targetParent.find('.edit').removeClass('hidden').end().find('a:contains("Cancel"), a:contains("Save")').remove();
                    $targetParent.find('.delete').removeClass('hidden').end().find('a:contains("Cancel"), a:contains("Save")').remove();
                    $thisEl.find('#addNewStatus').show();
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        cancel: function (e) {
            var $targetParent = $(e.target).parent();
            var $thisEl = this.$el;
            e.preventDefault();

            $targetParent.siblings().find('span').removeClass('hidden').end()
                .find('input, select, a:contains("Cancel"), a:contains("Save")').remove();
            $targetParent.find('.edit').removeClass('hidden').end().find('a:contains("Cancel"), a:contains("Save")').remove();
            $targetParent.find('.delete').removeClass('hidden').end().find('a:contains("Cancel"), a:contains("Save")').remove();
            $thisEl.find('#addNewStatus').show();
        },

        edit: function (e) {
            var $target;
            var $td;
            var $thisEl = this.$el;
            var text;
            var select;
            var statusText;

            e.preventDefault();
            $thisEl.find('span').removeClass('hidden');
            $thisEl.find('.addnew, .SaveCancel').remove();
            $thisEl.find('.name input, input.nameStatus, select, a:contains("Cancel"), a:contains("Save")').remove();
            $thisEl.find('.edit').removeClass('hidden');
            $thisEl.find('.delete').removeClass('hidden');
            $thisEl.find('#addNewStatus').show();

            $target = $(e.target);
            $td = $target.parent();

            text = '<a href="#">';
            select = $('<select/>');
            $target.closest('div.row').find('span, .edit').addClass('hidden');
            $target.closest('div.row').find('span, .delete').addClass('hidden');
            $td.siblings('.status').append(select);
            statusText = $td.siblings('div.status').text().trim();

            this.relatedStatusesCollection.forEach(function (status) {
                var statusJson = status.toJSON();

                if (statusJson.status === statusText) {
                    select.append($('<option>').text(statusJson.status).attr('selected', 'selected'));
                } else {
                    select.append($('<option>').text(statusJson.status));
                }
            });

            $td.siblings('.name').append(
                $('<input maxlength="32">').val($td.siblings('div.name').text().trim()));
            $td.append(
                $(text).text('Save').addClass('save btn blue slim'),
                $(text).text('Cancel').addClass('cancel btn slim')
            );
        },

        deleteItems: function (e) {
            var mid = 39;
            var self = this;
            var $tr = $(e.target).closest('div.row');
            var $tdName = $tr.find('div.name');
            var id = $tdName.data('id');
            var model = this.collection.get(id);
            var answer = confirm('Really DELETE items ?!');

            e.preventDefault();

            this.collection.url = CONSTANTS.URLS.WORKFLOWS;
            if (answer === true) {
                model.destroy({
                    headers: {
                        mid: mid
                    },

                    success: function () {
                        $(e.target).parent().parent().remove();
                    },

                    error: function (model, xhr) {
                        self.errorNotification(xhr);
                    }
                });
            }
        },

        gotoForm: function (e) {
            var itemIndex = $(e.target).closest('tr').data('index') + 1;

            App.ownContentType = true;
            window.location.hash = '#home/content-Workflows/form/' + itemIndex;
        },

        updateSequence: function (e) {
            var n = $('#workflows .row').length;
            var $thisEl = this.$el;
            var i;

            for (i = 0; i < n; i++) {
                $thisEl.find('#workflows .row').eq(i).find('div.name').attr('data-sequence', n - i - 1);
            }
        },

        chooseWorkflowDetailes: function (e, el) {
            var $target = e ? $(e.target) : el;
            var $thisEl = this.$el;
            var self = this;
            var wId;
            var name;
            var values;

            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }

            $thisEl.find('.workflow-sub-list>*').remove();
            $thisEl.find('#details').addClass('active').show();
            $thisEl.find('#workflows').empty();
            $thisEl.find('#workflowNames').html('');

            $('#addNewStatus').show();
            if ($target.hasClass('workflow')) {
                wId = $target.text();
                $('.workflow-list .active').removeClass('active');
                $target.parent().addClass('active');
            }
            name = $target.data('id');
            values = [];

            this.collection.fetch({
                success: function (collection) {
                    _.each(collection.models, function (model) {
                        if (model.get('wId') === name) {
                            values.push({
                                id      : model.get('_id'),
                                name    : model.get('name'),
                                status  : model.get('status'),
                                sequence: model.get('sequence'),
                                color   : model.get('color')
                            });
                        }
                    }, this);

                    _.each(values, function (value) {
                        $thisEl.find('#workflows').append(new ListItemView({model: value}).render().el);
                    }, self);
                }
            });

            this.$('#workflows').sortable({
                containment: 'document',
                stop       : function (event, ui) {
                    var id = ui.item.find('div.name').attr('id');
                    var model = self.collection.get(id);
                    var sequence = 0;

                    self.collection.url = CONSTANTS.URLS.WORKFLOWS;

                    if (ui.item.next().hasClass('row')) {
                        sequence = parseInt(ui.item.next().find('div.name').attr('data-sequence'), 10) + 1;
                    }

                    model.save({
                        sequenceStart: parseInt(ui.item.find('div.name').attr('data-sequence'), 10),
                        wId          : model.toJSON().wId,
                        sequence     : sequence
                    }, {
                        patch  : true,
                        success: function (model2) {
                            self.updateSequence();

                            self.collection.add(model2, {merge: true});
                        }
                    });
                }
            });
        },

        render: function () {
            var li;
            var workflowsWIds = _.uniq(_.pluck(this.collection.toJSON(), 'wId'), false).sort();

            Custom.setCurrentCL(this.collection.models.length);
            this.$el.html(_.template(ListTemplate, {workflowsWIds: workflowsWIds}));
            this.$el.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');

            li = this.$el.find('.workflow-list li').first().find('a.workflow');
            this.chooseWorkflowDetailes(null, li);
            return this;
        },

        checked: function () {
            if ($('input:checked').length > 0) {
                $('#top-bar-deleteBtn').show();
            } else {
                $('#top-bar-deleteBtn').hide();
            }
        },

        /* createItem: function () {
         return new CreateView({collection: this.collection});
         },

         editItem: function () {
         return new EditView({collection: this.collection});
         },*/

        addNewStatus: function (e) {
            var $thisEl = this.$el;
            var $target = $(e.target);
            var text;

            e.preventDefault();

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.CREATE_STATUS_BTN
            });

            $thisEl.find('span').removeClass('hidden');
            $thisEl.find('.name input, select, a:contains("Cancel"), a:contains("Save")').remove();
            $thisEl.find('.edit').removeClass('hidden');
            $thisEl.find('.delete').removeClass('hidden');
            $thisEl.find('#addNewStatus').hide();
            $thisEl.find('#workflows').append('<div class="addnew row"><div><input type="text" class="nameStatus" maxlength="32" required /></div>' +
                '<div class="status-edit"><select id="statusesDd"></select></div>' +
                '<div class="SaveCancel"><a href="javascript:;" id="saveStatus" class="btn slim blue">Save</a>' +
                '<a  href="javascript:;" id="cancelStatus" class="btn slim ">Cancel</a></div></div>');

            text = '<a href="#">';

            this.relatedStatusesCollection.forEach(function (status) {
                var statusJson = status.toJSON();
                $('#statusesDd').append($('<option>').text(statusJson.status));
            });

        },
        cancelStatus: function (e) {
            e.preventDefault();

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.CANCEL_CREATING
            });

            $('.addnew, .SaveCancel').remove();
            $('#addNewStatus').show();
        },

        saveStatus: function (e) {
            var mid = 39;
            var workflowsModel = new WorkflowsModel();
            var wId = $('.workflow-list li.active').text();
            var workflowCollection = this.collection.toJSON();
            var self = this;

            var workflowArray = _.filter(workflowCollection, function (workflow) {
                if (workflow.wId === wId) {
                    return workflow;
                }
            });

            var length = workflowArray.length;
            var name = $.trim($('.nameStatus').val());
            var status = $('#statusesDd option:selected').val();

            e.preventDefault();

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.CONFIRM_CREATING
            });

            workflowsModel.save({
                wId     : wId.trim(),
                name    : name,
                status  : status,
                sequence: length
            }, {
                headers: {
                    mid: mid
                },

                validate: true,
                success : function (model, response) {
                    var newModel;

                    model.set('_id', response.createdModel._id);
                    model.set('color', response.createdModel.color);
                    newModel = {
                        id      : response.createdModel._id,
                        name    : response.createdModel.name,
                        status  : response.createdModel.status,
                        sequence: response.createdModel.sequence,
                        color   : response.createdModel.color,
                        wId     : response.createdModel.wId
                    };
                    self.collection.add(workflowsModel);
                    $('#workflows').prepend(new ListItemView({model: newModel}).render().el);
                    $('.addnew, .SaveCancel').remove();
                    $('#addNewStatus').show();
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        quickEdit: function () {
            var n = $('#workflows .row').length;

            if (n === 1) {
                $('a.delete').remove();
            }
        },

        removeEdit: function () {
            $('.edit-holder').remove();
        }
    });

    return ContentView;
});
