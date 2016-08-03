define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/DealTasks/kanban/WorkflowsTemplate.html',
    'text!templates/DealTasks/kanbanSettings.html',
    'collections/Workflows/WorkflowsCollection',
    'views/DealTasks/kanban/KanbanItemView',
    'views/DealTasks/EditView',
    'views/DealTasks/CreateView',
    'collections/DealTasks/filterCollection',
    'models/DealTasksModel',
    'dataService',
    'views/Filter/filterView',
    'views/pagination',
    'common',
    'custom',
    'populate',
    'constants'
], function (Backbone, _, $, WorkflowsTemplate, kanbanSettingsTemplate, WorkflowsCollection, KanbanItemView, EditView, CreateView, TasksCollection, CurrentModel, dataService, FilterView,Pagination, common, custom, populate, CONSTANTS) {
    'use strict';

    var collection = new TasksCollection();
    var TasksKanbanView = Pagination.extend({
        el    : '#content-holder',
        contentType      : 'DealTasks',
        viewType         : 'kanban',
        FilterView       : FilterView,
        events: {
            'dblclick .item'                                                  : 'gotoEditForm',
            'click .item'                                                     : 'selectItem',
            'click .fold-unfold'                                              : 'foldUnfoldKanban',
            'click .current-selected'                                         : 'showNewSelect',
            'click .newSelectList li:not(.miniStylePagination)'               : 'chooseOption',
            'click .newSelectList li.miniStylePagination'                     : 'notHide',
            'click .newSelectList li.miniStylePagination .next:not(.disabled)': 'nextSelect',
            'click .newSelectList li.miniStylePagination .prev:not(.disabled)': 'prevSelect',
            'click .column.fold'                                              : 'foldUnfoldKanban',
            click                                                             : 'hideNewSelect'
        },

        columnTotalLength: null,

        initialize: function (options) {
            this.startTime = options.startTime;
            this.workflowsCollection = options.workflowCollection;
            this.responseObj = {};
            this.foldWorkflows = [];

            this.render();
            this.asyncFetch(options.workflowCollection.toJSON());
           /* this.filterView.trigger('filter', App.filtersObject.filter);*/
        },

        notHide: function (e) {
            return false;
        },


        showFilteredPage: function (filter) {
            var self = this;
            var workflows = this.workflowsCollection.toJSON();

            if (filter && filter.workflow) {
                workflows = [];
                filter.workflow.value.forEach(function (wId) {
                    workflows.push({
                        _id: wId
                    });
                });
            }

            this.filter = !filter || Object.keys(filter).length === 0 ? {} : filter;

            self.changeLocationHash(false, false, filter);

            self.$el.find('td.column #forContent').html('');

            // self.$el.find('.counter').html(0);

            this.asyncFetch(workflows, filter);
        },

        updateFoldWorkflow: function () {
            if (this.foldWorkflows.length === 0) {
                this.foldWorkflows = ['Empty'];
            }

            dataService.postData(CONSTANTS.URLS.CURRENT_USER, {'kanbanSettings.tasks.foldWorkflows': this.foldWorkflows}, function (error, success) {
            });
        },

        foldUnfoldKanban: function (e, id) {
            var el;
            var w;
            var k;
            var idx;
            var $closestTable;

            if (id) {
                el = $('#' + id);
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
                k = -k;
                el.find('.columnName .text').css({left: k + 'px', top: Math.abs(w / 2 + 47) + 'px'});
                this.foldWorkflows.push(el.attr('id'));
            } else {
                idx = this.foldWorkflows.indexOf(el.attr('id'));

                if (idx !== -1) {
                    this.foldWorkflows.splice(idx, 1);
                }
            }
            if (!id) {
                this.updateFoldWorkflow();
            }

            $closestTable = el.closest('table');

            if ($closestTable.find('.fold').length === $closestTable.find('.column').length) {
                $closestTable.css({'min-width': 'inherit'});
            } else {
                $closestTable.css({'min-width': '100%'});
            }

            $closestTable.css({'min-height': ($(window).height() - 110) + 'px'});
            this.$el.find('.column').sortable('enable');
            this.$el.find('.column.fold').sortable('disable');
        },

        nextSelect: function (e) {
            this.showNewSelect(e, false, true);
        },

        prevSelect: function (e) {
            this.showNewSelect(e, true, false);
        },

        showNewSelect: function (e, prev, next) {
            populate.showSelectPriority(e, prev, next, this);

            return false;
        },

        hideNewSelect: function (e) {
            $('.newSelectList').hide();
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            var currentSelected = $target.parents('.taskSelect').find('.current-selected');
            var selectType = currentSelected.attr('id').split('_')[0];
            var model;
            var id;
            var priority;
            var type;

            currentSelected.text($target.text());

            if (selectType === 'priority') {
                id = currentSelected.attr('id').replace('priority_', '');
                model = collection.get(id);
                priority = currentSelected.text();
                model.save(
                    {
                        priority: priority
                    },
                    {
                        headers: {
                            mid: 39
                        },
                        patch  : true,
                        success: function () {
                        }
                    });
            } else if (selectType === 'type') {
                type = currentSelected.text();
                id = currentSelected.attr('id').replace('type_', '');
                model = collection.get(id);
                model.save(
                    {
                        type: type
                    },
                    {
                        headers: {
                            mid: 39
                        },
                        patch  : true,
                        success: function () {

                        }
                    });
            }
            this.hideNewSelect();
            return false;
        },

        isNumberKey: function (event) {
            var charCode = event.which || event.keyCode;

            return !(charCode > 31 && (charCode < 48 || charCode > 57));
        },

        saveKanbanSettings: function (context) {
            var countPerPage = context.$el.find('#cPerPage').val();
            var id;
            var url;
            var self = this;

            if (countPerPage === 0) {
                countPerPage = 5;
            }

            id = window.location.hash.split('/')[3];
            url = (id && id.length === 24) ? 'easyErp/DealTasks/kanban/' + id : 'easyErp/DealTasks/kanban';

            dataService.postData(CONSTANTS.URLS.CURRENT_USER, {'kanbanSettings.tasks.countPerPage': countPerPage}, function (error, success) {
                if (success) {
                    self.hideDialog();
                    Backbone.history.fragment = '';
                    Backbone.history.navigate(url, {trigger: true});
                }
            });
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
        },

        editKanban: function (e) {
            dataService.getData(CONSTANTS.URLS.CURRENT_USER, null, function (user, context) {
                var tempDom = _.template(kanbanSettingsTemplate, {tasks: user.user.kanbanSettings.tasks});

                context.$el = $(tempDom).dialog({
                    dialogClass: 'edit-dialog',
                    width      : '400',
                    title      : 'Edit Kanban Settings',
                    buttons    : {
                        save: {
                            text : 'Save',
                            class: 'btn',
                            click: function () {
                                context.saveKanbanSettings(context);
                            }

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

        getCollectionLengthByWorkflows: function (context, parrentContentId) {
            dataService.getData('/DealTasks/getLengthByWorkflows', {parrentContentId: parrentContentId}, function (data) {
                data.arrayOfObjects.forEach(function (object) {
                    var column = context.$el.find('#' + object._id);

                    column.find('.totalCount').text(object.count);
                    column.find('.remaining').text(object.remaining);
                });

                if (data.showMore) {
                    context.$el.append('<div id="showMoreDiv" title="To show more elements per column, please change kanban settings">And More</div>');
                }
            });
        },

        selectItem: function (e) {
            var $itemParents = $(e.target).parents('.item');

            $itemParents.parents('table').find('.active').removeClass('active');
            $itemParents.addClass('active');
        },

        gotoEditForm: function (e) {
            var id;
            var model;

            e.preventDefault();

            id = $(e.target).closest('.inner').attr('data-id');
            model = new CurrentModel();
            model.urlRoot = CONSTANTS.URLS.DEALTASKS;

            model.fetch({
                data   : {
                    id      : id,
                    viewType: 'form'
                },
                success: function (newModel) {
                    return new EditView({model: newModel});
                },

                error: function () {
                    App.render({
                        type   : 'error',
                        message: 'Please refresh browser'
                    });
                }
            });
        },

        asyncFetch: function (workflows, filter) {

            filter = filter || {};
            _.each(workflows, function (wfModel) {
                dataService.getData(CONSTANTS.URLS.DEALTASKS, {
                    viewType        : 'kanban',
                    workflowId      : wfModel._id,
                    filter          : filter
                }, this.asyncRender, this);
            }, this);
        },

        asyncLoadImgs: function (collection) {
            var arr = _.filter(collection, function (item) {
                return item.assignedTo !== null;
            });
            var ids = _.map(arr, function (item) {
                return item.assignedTo._id;
            });
            // added condition(ids.length>0)  if no ids don't run common code)
            if (ids.length > 0) {
                common.getImages(ids, '/employees/getEmployeesImages');
            }
        },

        asyncRender: function (response, context) {
            var contentCollection = new TasksCollection();
            var kanbanItemView;
            var column;
            var forContent;

            contentCollection.set(contentCollection.parse(response));



            if (collection) {
                collection.add(contentCollection.models);
            } else {
                collection = new TasksCollection();
                collection.set(collection.parse(response));
            }

            column = context.$el.find('#' + response.workflowId);

            forContent = column.find('#forContent');
            forContent.html('');

            if (response.fold) {
                context.foldUnfoldKanban(null, response.workflowId);
            }

            column.find('.totalCount').html(/*parseInt(column.find('.totalCount').html(), 10)*/ + contentCollection.models.length);
            _.each(contentCollection.models, function (wfModel) {
                var $curEl;

                kanbanItemView = new KanbanItemView({model: wfModel});
                $curEl = kanbanItemView.render().el;
                forContent.append($curEl);
                //column.append($curEl);
            }, this);

            context.asyncLoadImgs(response.data);
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
            var $workflowItems = this.$el.find('#' + workflow).find('.item');

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

                $workflowItems.each(function () {
                    var sec = parseInt($(this).find('.inner').attr('data-sequence'), 10);

                    if (sec >= a && sec <= b) {
                        $(this).find('.inner').attr('data-sequence', sec + inc);
                    }
                });

                item.find('.inner').attr('data-sequence', sequence);

            } else {
                $workflowItems.each(function () {
                    if (parseInt($(this).find('.inner').attr('data-sequence'), 10) >= sequence) {
                        $(this).find('.inner').attr('data-sequence', parseInt($(this).find('.inner').attr('data-sequence'), 10) + 1);
                    }
                });

                $('#' + workflowStart).find('.item').each(function () {
                    if (parseInt($(this).find('.inner').attr('data-sequence'), 10) > sequenceStart) {
                        $(this).find('.inner').attr('data-sequence', parseInt($(this).find('.inner').attr('data-sequence'), 10) - 1);
                    }
                });

                item.find('.inner').attr('data-sequence', sequence);
            }
        },

        hideItemsNumber: function (e) {
            var el = $(e.target);

            this.$el.find('.allNumberPerPage, .newSelectList').hide();

            if (!el.closest('.search-view')) {
                $('.search-content').removeClass('fa-caret-up');
                this.$el.find('.search-options').addClass('hidden');
            }
        },

        foldUnfiltredItems: function (workflows) {
            var showList;
            var el;
            var listId;
            var foldList;
            var choosen = this.$el.find('.chosen');
            var checkedElements = $('.drop-down-filter > input:checkbox:checked');
            var self = this;

            this.filter = {};

            if (choosen.length) {
                choosen.each(function (index, elem) {
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
                    dataService.getData(CONSTANTS.URLS.DEALTASKS, {
                        viewType  : 'kanban',
                        workflowId: wfModel._id,
                        filter    : this.filter
                    }, this.asyncRender, this);
                }, this);

                return false;
            }

            listId = _.pluck(workflows, '_id');
            showList = $('.drop-down-filter input:checkbox:checked').map(function () {
                return this.value;
            }).get();
            foldList = _.difference(listId, showList);

            foldList.forEach(function (id) {
                var w;
                var k;

                el = $('td.column[id=' + id + '"]');
                el.addClass('fold');
                w = el.find('.columnName .text').width();
                k = w / 2 - 20;

                if (k <= 0) {
                    k = 20 - w / 2;
                }

                k = -k;
                el.find('.columnName .text').css({left: k + 'px', top: Math.abs(w / 2 + 47) + 'px'});
            });
            showList.forEach(function (id) {
                el = $('td.column[id="' + id + '"]');
                el.removeClass('fold');
            });
        },

        showDefaultFilter: function (workflows) {
            var el;
            var showList = _.pluck(workflows, '_id');

            this.filter = {};

            _.each(workflows, function (wfModel) {
                $('.column').children('.item').remove();
                dataService.getData(CONSTANTS.URLS.TASKS, {
                    viewType  : 'kanban',
                    workflowId: wfModel._id,
                    filter    : this.filter
                }, this.asyncRender, this);
            }, this);
            showList.forEach(function (id) {
                el = $('td.column[id="' + id + '"]');
                el.removeClass('fold');
            });
        },

        render: function () {
            var self = this;
            var filterView;
            var itemCount;
            var workflows = this.workflowsCollection.toJSON();

            this.$el.html(_.template(WorkflowsTemplate, {workflowsCollection: workflows}));
            $('.column').last().addClass('lastColumn');
            _.each(workflows, function (workflow, i) {
                var column;
                var total;

                itemCount = 0;
                column = this.$('.column').eq(i);
                total = ' <span><span class="totalCount">' + itemCount + '</span> </span>';
                column.find('.columnNameDiv h2').append(total);
            }, this);

            populate.getPriority('#priority', this);

            this.$el.find('.column').sortable({
                connectWith: '.column',
                cancel     : 'h2',
                cursor     : 'move',
                items      : '.item',
                opacity    : 0.7,
                revert     : true,
                helper     : 'clone',
                containment: 'document',
                start      : function (event, ui) {
                    var id = ui.item.context.id;
                    var model = collection.get(id);
                    var column = ui.item.closest('.column');

                    column.find('.totalCount').html(parseInt(column.find('.totalCount').html(), 10) - 1);
                    column.find('.remaining').html(parseInt(column.find('.remaining').html(), 10) - parseInt(model.get('remaining'), 10));
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
                        secStart = parseInt($('.inner[data-id="' + model.toJSON()._id + '"]').attr('data-sequence'), 10);
                        workStart = model.toJSON().workflow ? model.toJSON().workflow._id : model.toJSON().workflow;

                        model.save(
                            {
                                workflow     : column.attr('id'),
                                sequenceStart: parseInt($(".inner[data-id='" + model.toJSON()._id + "']").attr('data-sequence'), 10),
                                sequence     : sequence,
                                workflowStart: model.toJSON().workflow._id ? model.toJSON().workflow._id : model.toJSON().workflow
                            },
                            {
                                patch   : true,
                                validate: false,
                                success : function (model2) {
                                    self.updateSequence(ui.item, column.attr('id'), sequence, workStart, secStart);

                                    collection.add(model2, {merge: true});
                                }
                            });
                        column.find('.totalCount').html(parseInt(column.find('.totalCount').html(), 10) + 1);
                        column.find('.remaining').html(parseInt(column.find('.remaining').html(), 10) + parseInt(model.get('remaining'), 10));
                    }
                }
            }).disableSelection();

            this.$el.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');
            $(document).on('keypress', '#cPerPage', this.isNumberKey);
            this.$el.unbind();

           /* dataService.getData('/dealTasks/getFilterValues', null, function (values) {
                filterView = new FilterView({collection: workflows, customCollection: values});
                // Filter custom event listen ------begin
                filterView.bind('filter', function () {
                    self.foldUnfiltredItems(workflows);
                });
                filterView.bind('defaultFilter', function () {
                    self.showDefaultFilter(workflows);
                    $('.saveFilterButton').hide();
                    $('.clearFilterButton').hide();
                    $('.removeFilterButton').show();
                });

            });*/
            if (!App || !App.filtersObject || !App.filtersObject.filtersValues || !App.filtersObject.filtersValues[this.contentType]) {
                custom.getFiltersValues({contentType: this.contentType}, this.renderFilter(this.baseFilter));
            } else {
                this.renderFilter(this.baseFilter);
            }

            $(document).on('click', function (e) {
                self.hideItemsNumber(e);
            });

            return this;
        }
    });

    return TasksKanbanView;
});
