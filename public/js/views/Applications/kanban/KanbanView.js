define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Applications/kanban/WorkflowsTemplate.html',
    'text!templates/Applications/kanbanSettings.html',
    /* 'collections/Workflows/WorkflowsCollection',*/
    'views/Applications/kanban/KanbanItemView',
    'views/Applications/EditView',
    'views/Applications/CreateView',
    'collections/Applications/ApplicationsCollection',
    'models/ApplicationsModel',
    'dataService',
    'constants'
], function (Backbone,
             $,
             _,
             WorkflowsTemplate,
             kanbanSettingsTemplate,
             /* WorkflowsCollection,*/
             KanbanItemView,
             EditView,
             CreateView,
             ApplicationsCollection,
             CurrentModel,
             dataService,
             CONSTANTS) {

    'use strict';

    var collection = new ApplicationsCollection();
    var ApplicationsKanbanView = Backbone.View.extend({
        el    : '#content-holder',
        events: {
            'dblclick .item'    : 'gotoEditForm',
            'click .item'       : 'selectItem',
            'click .column.fold': 'foldUnfoldKanban',
            'click .fold-unfold': 'foldUnfoldKanban'
        },

        columnTotalLength: null,
        initialize       : function (options) {
            this.startTime = options.startTime;
            this.workflowsCollection = options.workflowCollection;
            this.foldWorkflows = [];

            this.render();

            this.asyncFetc(options.workflowCollection);
            this.getCollectionLengthByWorkflows(this);

        },

        updateFoldWorkflow: function () {
            if (this.foldWorkflows.length === 0) {
                this.foldWorkflows = ['Empty'];
            }
            dataService.postData(CONSTANTS.URLS.CURRENT_USER, {'kanbanSettings.applications.foldWorkflows': this.foldWorkflows}, function (error, success) {
            });
        },

        foldUnfoldKanban: function (e, id) {
            var el;
            var w;
            var k;
            var idx;
            var $thisEl = this.$el;

            if (id) {
                el = $thisEl.find('td.column[data-id="' + id + '"]');
            } else {
                el = $(e.target).closest('td');
            }
            el.toggleClass('fold');
            if (el.hasClass('fold')) {
                w = el.find('.columnName .text').width();
                k = w / 2 - 21;

                if (k < 0) {
                    k = -2 - k;
                }
                el.find('.columnName .text').css({
                    left: '-' + k + 'px',
                    top : Math.abs(w / 2 + 47) + 'px'
                });
                this.foldWorkflows.push(el.attr('data-id'));
            } else {
                idx = this.foldWorkflows.indexOf(el.attr('data-id'));

                if (idx !== -1) {
                    this.foldWorkflows.splice(idx, 1);
                }
            }
            if (!id) {
                this.updateFoldWorkflow();
            }
            if (el.closest('table').find('.fold').length === el.closest('table').find('.column').length) {
                el.closest('table').css({'min-width': 'inherit'});
                el.closest('table').css({width: 'auto'});
            } else {
                el.closest('table').css({'min-width': '100%'});
            }

            el.closest('table').css({'min-height': ($(window).height() - 110) + 'px'});
            $thisEl.find('.column').sortable('enable');
            $thisEl.find('.column.fold').sortable('disable');
        },

        isNumberKey: function (evt) {
            var charCode = evt.which || evt.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                return false;
            }
            return true;
        },

        saveKanbanSettings: function () {
            var countPerPage = $(this).find('#cPerPage').val();
            if (countPerPage === 0) {
                countPerPage = 5;
            }
            dataService.postData(CONSTANTS.URLS.CURRENT_USER, {'kanbanSettings.applications.countPerPage': countPerPage}, function (error, success) {
                if (success) {
                    $('.edit-dialog').remove();
                    Backbone.history.fragment = '';
                    Backbone.history.navigate('easyErp/Applications', {trigger: true});
                } else {
                    Backbone.history.navigate('easyErp', {trigger: true});
                }
            });
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
        },

        editKanban: function () {
            dataService.getData(CONSTANTS.URLS.CURRENT_USER, null, function (user, context) {
                var tempDom = _.template(kanbanSettingsTemplate, {applications: user.user.kanbanSettings.applications});
                context.$el = $(tempDom).dialog({
                    dialogClass: 'edit-dialog',
                    width      : '400',
                    title      : 'Edit Kanban Settings',
                    buttons    : {
                        save: {
                            text : 'Save',
                            class: 'btn',
                            click: context.saveKanbanSettings
                        },

                        cancel: {
                            text : 'Cancel',
                            class: 'btn',
                            click: function () {
                                context.hideDialog();
                            }
                        }
                    }
                });
                context.$el.find('#cPerPage').spinner({
                    min: 5,
                    max: 9999
                });
            }, this);
        },

        getCollectionLengthByWorkflows: function (context) {
            dataService.getData(CONSTANTS.URLS.APPLICATIONS_WFLENGTH, {}, function (data) {
                data.arrayOfObjects.forEach(function (object) {
                    var column = context.$('[data-id="' + object._id + '"]');
                    column.find('.totalCount').text(object.count);
                });

                if (data.showMore) {
                    context.$el.append('<div id="showMoreDiv" title="To show mor ellements per column, please change kanban settings">And More</div>');
                }
            });
        },

        selectItem: function (e) {
            var target = $(e.target);
            target.parents('.item').parents('table').find('.active').removeClass('active');
            target.parents('.item').addClass('active');
        },

        gotoEditForm: function (e) {

            var id = $(e.target).closest('.inner').data('id');
            var model = new CurrentModel();

            e.preventDefault();

            model.urlRoot = '/applications/';
            model.fetch({
                data   : {id: id, viewType: 'form'},
                success: function (response) {
                    return new EditView({model: response});
                },

                error: function () {
                    App.render({
                        type   : 'error',
                        message: 'Please refresh browser'
                    });
                }
            });
        },

        asyncFetc: function (workflows) {
            _.each(workflows.toJSON(), function (wfModel) {
                dataService.getData(CONSTANTS.URLS.APPLICATIONS_KANBAN, {
                    workflowId: wfModel._id,
                    viewType  : 'kanban'
                }, this.asyncRender, this);
            }, this);
        },

        asyncRender: function (response, context) {
            var contentCollection = new ApplicationsCollection();
            var forContent;
            var kanbanItemView;
            var column;

            contentCollection.set(contentCollection.parse(response));
            if (collection) {
                collection.add(contentCollection.models);
            } else {
                collection = new ApplicationsCollection();
                collection.set(collection.parse(response));
            }

            column = context.$el.find('[data-id="' + response.workflowId + '"]');

            forContent = column.find('#forContent');
            forContent.html(''); // for duplicated content edited by Lilya

            if (response.fold) {
                context.foldUnfoldKanban(null, response.workflowId);
            }
            column.find('.counter').html(parseInt(column.find('.counter').html(), 10) + contentCollection.models.length);
            _.each(contentCollection.models, function (wfModel) {
                var curEl;

                kanbanItemView = new KanbanItemView({model: wfModel});
                curEl = kanbanItemView.render().el;
                forContent.append(curEl);
            }, this);

        },

        editItem: function () {
            return new EditView({collection: this.collection});
        },

        createItem: function () {
            return new CreateView();
        },

        updateSequence: function (item, workflow, sequence, workflowStart, sequenceStart) {
            var a;
            var b;
            var inc;
            var $thisEl = this.$el;
            if (workflow === workflowStart) {
                if (sequence > sequenceStart) {
                    sequence -= 1;
                }

                a = sequenceStart;
                b = sequence;
                inc = -1;

                if (a > b) {
                    a = sequence;
                    b = sequenceStart;
                    inc = 1;
                }
                $thisEl.find('.column[data-id="' + workflow + '"]').find('.item').each(function () {
                    var sec = parseInt($(this).find('.inner').attr('data-sequence'), 10);
                    if (sec >= a && sec <= b) {
                        $(this).find('.inner').attr('data-sequence', sec + inc);
                    }
                });
                item.find('.inner').attr('data-sequence', sequence);

            } else {
                $thisEl.find('.column[data-id="' + workflow + '"]').find('.item').each(function () {
                    if (parseInt($(this).find('.inner').attr('data-sequence'), 10) >= sequence) {
                        $(this).find('.inner').attr('data-sequence', parseInt($(this).find('.inner').attr('data-sequence'), 10) + 1);
                    }
                });
                $thisEl.find('.column[data-id="' + workflowStart + '"]').find('.item').each(function () {
                    if (parseInt($(this).find('.inner').attr('data-sequence'), 10) > sequenceStart) {
                        $(this).find('.inner').attr('data-sequence', parseInt($(this).find('.inner').attr('data-sequence'), 10) - 1);
                    }
                });
                item.find('.inner').attr('data-sequence', sequence);

            }
        },

        /* hideItemsNumber: function (e) {
         var el = $(e.target);

         this.$el.find('.allNumberPerPage, .newSelectList').hide();
         if (!el.closest('.search-view')) {
         $('.search-content').removeClass('fa-caret-up');
         this.$el.find('.search-options').addClass('hidden');
         }
         },*/

        /* showFiltredPage: function (workflows, savedFilter) {
         var listId;
         var foldList;
         var showList;
         var el;
         var self = this;
         var chosen = this.$el.find('.chosen');
         var checkedElements = $('.drop-down-filter input:checkbox:checked');
         var condition = this.$el.find('.conditionAND > input')[0];

         this.filter = {};
         this.filter.condition = 'and';

         if (condition && !condition.checked) {
         self.filter.condition = 'or';
         }

         if (chosen.length) {
         chosen.each(function (index, elem) {
         if (self.filter[elem.children[1].value]) {
         $($($(elem.children[2]).children('li')).children('input:checked')).each(function (index, element) {
         self.filter[elem.children[1].value].push(element.value);
         });
         } else {
         self.filter[elem.children[1].value] = [];
         $($($(elem.children[2]).children('li')).children('input:checked')).each(function (index, element) {
         self.filter[elem.children[1].value].push(element.value);
         });
         }
         });

         _.each(workflows, function (wfModel) {
         $('.column').children('.item').remove();
         dataService.getData(CONSTANTS.URLS.APPLICATIONS_KANBAN, {
         workflowId: wfModel._id,
         viewType  : 'kanban',
         filter    : this.filter
         }, this.asyncRender, this);
         }, this);

         return false;
         }

         listId = _.pluck(workflows, '_id');

         if (savedFilter) {
         showList = savedFilter.workflow;
         } else {
         showList = checkedElements.map(function () {
         return this.value;
         }).get();
         }

         foldList = _.difference(listId, showList);

         if ((checkedElements.length && checkedElements.attr('id') === 'defaultFilter') || !chosen.length) {
         self.filter = {};

         _.each(workflows, function (wfModel) {
         $('.column').children('.item').remove();
         dataService.getData(CONSTANTS.URLS.APPLICATIONS_KANBAN, {
         workflowId: wfModel._id,
         viewType  : 'kanban',
         filter    : this.filter
         }, this.asyncRender, this);
         }, this);

         showList = _.pluck(workflows, '_id');
         foldList = [];
         }

         foldList.forEach(function (id) {
         var w;
         var k;

         el = $('td.column[data-id="' + id + '"]');
         el.addClass('fold');
         w = el.find('.columnName .text').width();
         k = w / 2 - 20;
         if (k <= 0) {
         k = 20 - w / 2;
         }
         k = -k;
         el.find('.columnName .text').css({
         left: k + 'px',
         top : Math.abs(w / 2 + 47) + 'px'
         });
         });

         showList.forEach(function (id) {
         el = $('td.column[data-id="' + id + '"]');
         el.removeClass('fold');
         });

         },*/

        render: function () {
            var self = this;
            var workflows = this.workflowsCollection.toJSON();
            var $thisEl = this.$el;

            $thisEl.html(_.template(WorkflowsTemplate, {workflowsCollection: workflows}));

            $thisEl.find('.column').last().addClass('lastColumn');

            _.each(workflows, function (workflow, i) {
                var column = $thisEl.find('.column').eq(i);
                var itemCount = 0;
                var total = ' <span><span class="totalCount">' + itemCount + '</span> </span>';

                column.find('.columnNameDiv h2').append(total);
            }, this);

            $thisEl.find('.column').sortable({
                connectWith: '.column',
                cancel     : 'h2',
                cursor     : 'move',
                items      : '.item',
                opacity    : 0.7,
                revert     : true,
                helper     : 'clone',
                containment: 'document',
                start      : function (event, ui) {
                    var column = ui.item.closest('.column');
                    column.find('.totalCount').html(parseInt(column.find('.totalCount').html(), 10) - 1);
                },

                stop: function (event, ui) {
                    var id = ui.item.context.id;
                    var model = collection.get(id);
                    var column = ui.item.closest('.column');
                    var sequence = 0;
                    var secStart;
                    var workStart;
                    if (ui.item.next().hasClass('item')) {
                        sequence = parseInt(ui.item.next().find('.inner').attr('data-sequence'), 10) + 1;
                    }

                    if (model) {
                        secStart = parseInt($thisEl.find('.inner[data-id="' + model.toJSON()._id + '"]').attr('data-sequence'), 10);
                        workStart = model.toJSON().workflow._id || model.toJSON().workflow;

                        model.save({
                            workflow     : column.data('id'),
                            sequenceStart: parseInt($thisEl.find('.inner[data-id="' + model.toJSON()._id + '"]').attr('data-sequence'), 10),
                            sequence     : sequence,
                            workflowStart: model.toJSON().workflow._id || model.toJSON().workflow
                        }, {
                            patch   : true,
                            validate: false,
                            success : function (model2) {
                                self.updateSequence(ui.item, column.attr('data-id'), sequence, workStart, secStart);

                                collection.add(model2, {merge: true});
                            }
                        });
                        column.find('.counter').html(parseInt(column.find('.counter').html(), 10) + 1);
                        column.find('.totalCount').html(parseInt(column.find('.totalCount').html(), 10) + 1);
                    }
                }
            }).disableSelection();
            $thisEl.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');
            $(document).on('keypress', '#cPerPage', this.isNumberKey);
            $thisEl.unbind();
            /* $(document).on('click', function (e) {
             self.hideItemsNumber(e);
             });*/

            return this;
        }
    });
    return ApplicationsKanbanView;
});
