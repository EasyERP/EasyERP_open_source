define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/Opportunities/kanban/WorkflowsTemplate.html',
    'text!templates/Opportunities/kanbanSettings.html',
    'collections/Workflows/WorkflowsCollection',
    'views/Opportunities/kanban/KanbanItemView',
    'views/Opportunities/EditView',
    'views/Opportunities/CreateView',
    'collections/Opportunities/OpportunitiesCollection',
    'models/OpportunitiesModel',
    'dataService',
    'views/Filter/filterView',
    'views/selectView/selectView',
    'collections/Opportunities/filterCollection',
    'constants',
    'helpers',
    'views/pagination',
    'custom',
    'populate'
], function (Backbone,
             _,
             $,
             WorkflowsTemplate,
             kanbanSettingsTemplate,
             WorkflowsCollection,
             KanbanItemView,
             EditView,
             CreateView,
             OpportunitiesCollection,
             CurrentModel,
             dataService,
             FilterView,
             selectView,
             ContentCollection,
             CONSTANTS,
             helpers,
             Pagination,
             custom,
             populate) {
    var collection = new OpportunitiesCollection();
    var OpportunitiesKanbanView = Pagination.extend({
        el               : '#content-holder',
        FilterView       : FilterView,
        contentCollection: ContentCollection,
        contentType      : 'Opportunities',
        viewType         : 'kanban',

        events: {
            'dblclick .item'                                                  : 'gotoEditForm',
            'click .item'                                                     : 'selectItem',
            'click .column.fold'                                              : 'foldUnfoldKanban',
            'click .fold-unfold'                                              : 'foldUnfoldKanban',
            'click .choseDateRange .item'                                     : 'fetchFilteredOpportunities',
            'click .current-selected:not(.disabled)'                          : 'showNewSelect',
            'click .newSelectList li:not(.miniStylePagination):not(.disabled)': 'chooseOption'
        },

        columnTotalLength: null,
        collapseWon      : true,
        collapseLost     : true,

        initialize: function (options) {
            this.startTime = options.startTime;
            this.buildTime = 0;
            this.workflowsCollection = options.workflowCollection;
            this.foldWorkflows = [];

            this.render();

            this.responseObj = {};

            this.filterView.trigger('filter', App.filtersObject.filter);

            // this.asyncFetc(options.workflowCollection.toJSON());
            // this.getCollectionLengthByWorkflows(this);
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

            this.selectView = new selectView({
                e          : e,
                responseObj: this.responseObj
            });

            $target.append(this.selectView.render().el);

            return false;
        },

        chooseOption: function (e) {
            var id;
            var data;
            var $target = $(e.target);

            $('.newSelectList').hide();

            id = $target.parents('.item').attr('id');
            data = {projectType: $target.text()};

            $target.parents('.item').find('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));

            dataService.patchData('/opportunities/' + id, data, function (err) {
                if (err) {
                    return console.log(err);
                }

            });
        },

        updateFoldWorkflow: function () {
            if (this.foldWorkflows.length === 0) {
                this.foldWorkflows = ['Empty'];
            }

            dataService.postData(CONSTANTS.URLS.CURRENT_USER, {'kanbanSettings.opportunities.foldWorkflows': this.foldWorkflows}, function (error, success) {
            });
        },

        foldUnfoldKanban: function (e, id) {
            var el;
            var w;
            var k;
            var idx;
            var $closestTable;

            if (id) {
                el = $("td.column[data-id='" + id + "']");
            } else {
                el = $(e.target).closest('td');
            }

            if (!el.hasClass('fold')) {
                el.addClass('fold');
            } else {
                el.removeClass('fold');
            }

            if (el.hasClass('fold')) {

                w = el.find('.columnName .text').width();
                k = w / 2 - 20;

                if (k <= 0) {
                    k = 20 - w / 2;
                }

                k = -k;
                el.find('.columnName .text').css({left: k + 'px', top: Math.abs(w / 2 + 47) + 'px'});
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

            $closestTable = el.closest('table');

            if ($closestTable.find('.fold').length === $closestTable.find('.column').length) {
                $closestTable.css({'min-width': 'inherit'});
                $closestTable.css({width: 'auto'});
            } else {
                $closestTable.css({'min-width': '100%'});
            }

            k = $(document).height() - 115;

            if (k < 190) {
                k = 190;
            }

            $closestTable.css({'min-height': (k) + 'px'});
            this.$el.find('.column').sortable('enable');
            this.$el.find('.column.fold').sortable('disable');
        },

        isNumberKey: function (evt) {
            var charCode = evt.which || evt.keyCode;

            return !(charCode > 31 && (charCode < 48 || charCode > 57));
        },

        saveKanbanSettings: function (context) {
            var countPerPage = context.$el.find('#cPerPage').val();
            var self = this;

            if (countPerPage === 0) {
                countPerPage = 5;
            }

            dataService.postData(CONSTANTS.URLS.CURRENT_USER, {'kanbanSettings.opportunities.countPerPage': countPerPage}, function (error, success) {
                if (success) {
                    self.hideDialog();
                    Backbone.history.fragment = '';
                    Backbone.history.navigate('easyErp/Opportunities', {trigger: true});
                }
            });
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
        },

        editKanban: function (e) {
            dataService.getData(CONSTANTS.URLS.CURRENT_USER, null, function (user, context) {
                var tempDom = _.template(kanbanSettingsTemplate, {opportunities: user.user.kanbanSettings.opportunities});

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
                // for input type number
                context.$el.find('#cPerPage').spinner({
                    min: 5,
                    max: 9999
                });
            }, this);
        },

        getCollectionLengthByWorkflows: function (context) {
            dataService.getData('/opportunities/getLengthByWorkflows', {}, function (data) {
                data.arrayOfObjects.forEach(function (object) {
                    var column = context.$("[data-id='" + object._id + "']");

                    column.find('.totalCount').text(object.count);
                });

                if (data.showMore) {
                    context.$el.append('<div id="showMoreDiv" title="To show mor ellements per column, please change kanban settings">And More</div>');
                }
            });
        },

        selectItem: function (e) {
            var $parentItems = $(e.target).parents('.item');

            $parentItems.parents('table').find('.active').removeClass('active');
            $parentItems.addClass('active');
        },

        gotoEditForm: function (e) {
            var id = $(e.target).closest('.inner').attr('data-id');
            var url = '#easyErp/Opportunities/tform/' + id;

            e.preventDefault();
            App.ownContentType = true;

            if (!this.filter) {
                window.location.hash = url;
                return;
            }

            window.location.hash = url + '/filter=' + JSON.stringify(this.filter);
        },

        fetchFilteredOpportunities: function (e) {
            var $targetEl = $(e.target);
            var $parent = $targetEl.closest('.choseDateRange');
            var days = $targetEl.data('day');
            var workflows = this.workflowsCollection.models;
            var filter = {};

            $parent.find('.active').removeClass('active');
            $targetEl.addClass('active');

            var url = '/opportunities/getFilteredOpportunities/';

            _.each(workflows, function (wfModel) {
                filter.workflowId = wfModel.attributes._id;
                filter.viewType = 'kanban';
                filter.days = days;
                dataService.getData(url, filter, this.asyncRender, this);
            }, this);

        },

        asyncFetc: function (workflows, filter) {
            var url = '/Opportunities/';

            filter = filter || {};

            _.each(workflows, function (wfModel) {
                dataService.getData(url, {
                    filter    : filter,
                    workflowId: wfModel._id,
                    viewType  : 'kanban'
                }, this.asyncRender, this);
            }, this);
        },

        asyncRender: function (response, context) {
            var contentCollection = new OpportunitiesCollection();
            var kanbanItemView;
            var forContent;
            var column;
            var workflowAmount;
            contentCollection.set(contentCollection.parse(response));

            if (collection) {
                collection.add(contentCollection.models);
            } else {
                collection = new OpportunitiesCollection();
                collection.set(collection.parse(response));
            }

            column = context.$el.find("[data-id='" + response.workflowId + "']");

            forContent = column.find('#forContent');
            forContent.html(''); // for duplicated content edited by Lilya

            if (response.fold) {
                context.foldUnfoldKanban(null, response.workflowId);
            }

            column.find('.totalCount').html(contentCollection.models.length);
            workflowAmount = 0;

            _.each(contentCollection.models, function (wfModel) {
                var expectedRevenue = wfModel.get('expectedRevenue');
                var curEl;

                kanbanItemView = new KanbanItemView({model: wfModel});
                curEl = kanbanItemView.render().el;
                forContent.append(curEl);

                if (expectedRevenue && expectedRevenue.value) {
                    workflowAmount += expectedRevenue.value || 0;
                }

            }, this);
            column.find('.totalAmount').html(helpers.currencySplitter(workflowAmount.toString()));

            if (context.collapseWon && (response.workflowId === '528cdef4f3f67bc40b00000a')) {
                context.foldUnfoldKanban(null, response.workflowId);
                context.collapseWon = false;
            }
            if (context.collapseLost && (response.workflowId === '528cdf1cf3f67bc40b00000b')) {
                context.foldUnfoldKanban(null, response.workflowId);
                context.collapseLost = false;
            }
            if (response.workflowId === '528cdef4f3f67bc40b00000a') {
                context.foldUnfoldKanban(null, response.workflowId);
            }
            if (response.workflowId === '528cdf1cf3f67bc40b00000b') {
                context.foldUnfoldKanban(null, response.workflowId);
            }
        },

        editItem: function () {
            // create editView in dialog here
            var edit = new EditView({collection: this.collection});

            edit.bind('recalc', this.updateCounter, this);
        },

        createItem: function () {
            return new CreateView();
        },

        countTotalAmountForWorkflow: function (workflowId) {
            var column = $('td[data-id="' + workflowId + '"]');
            var oldColumnContainer = $('td[data-id="' + workflowId + '"] #forContent h3');
            var sum = 0;

            oldColumnContainer.each(function (item) {
                var value = $(this).text().replace(/\s/g, '');

                sum += parseFloat(value) || 0;
            });

            column.find('.totalAmount').text(helpers.currencySplitter(sum.toString()));
        },

        updateSequence: function (item, workflow, sequence, workflowStart, sequenceStart) {
            var a;
            var b;
            var inc;
            var $columnItems = $(".column[data-id='" + workflow + "']").find('.item');

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

                $columnItems.each(function () {
                    var sec = parseInt($(this).find('.inner').attr('data-sequence'), 10);

                    if (sec >= a && sec <= b) {
                        $(this).find('.inner').attr('data-sequence', sec + inc);
                    }
                });

                item.find('.inner').attr('data-sequence', sequence);

            } else {
                $columnItems.each(function () {
                    var $inner = $(this).find('.inner');
                    var sec = parseInt($inner.attr('data-sequence'), 10);

                    if (sec >= sequence) {
                        $inner.attr('data-sequence', sec + 1);
                    }
                });

                $(".column[data-id='" + workflowStart + "']").find('.item').each(function () {
                    var $inner = $(this).find('.inner');
                    var sec = parseInt($inner.attr('data-sequence'), 10);

                    if (sec >= sequenceStart) {
                        $inner.attr('data-sequence', sec - 1);
                    }
                });

                item.find('.inner').attr('data-sequence', sequence);

                this.countTotalAmountForWorkflow(workflow);
                this.countTotalAmountForWorkflow(workflowStart);
            }
        },

        updateCounter: function (el, inc) {
            var i = inc ? 1 : -1;
            var counter = el.closest('.column').find('.totalCount');

            counter.html(parseInt(counter.html(), 10) + i);
        },

        hideItemsNumber: function (e) {
            var el = $(e.target);

            this.$el.find('.allNumberPerPage, .newSelectList').hide();

            if (!el.closest('.search-view')) {
                $('.search-content').removeClass('fa-caret-up');
                this.$el.find('.search-options').addClass('hidden');
            }

            // this.$el.find('.allNumberPerPage, .newSelectList').hide();
            // if (!el.closest('.search-view')) {
            //    $('.search-content').removeClass('fa-caret-up');
            // };

        },

        /*showFiltredPage: function (workflows) {
         var listId;
         var foldList;
         var showList;
         var el;
         var self = this;
         var itemsNumber = $('#itemsNumber').text();
         var $checkedElements = $('.drop-down-filter input:checkbox:checked');
         var condition = this.$el.find('.conditionAND > input')[0];
         var chosen = this.$el.find('.chosen');

         this.filter = {};
         this.filter.condition = 'and';

         if (condition && !condition.checked) {
         self.filter.condition = 'or';
         }

         if (chosen.length) {
         chosen.each(function (index, elem) {
         if (elem.children[2].attributes.class.nodeValue === 'chooseDate') {
         if (self.filter[elem.children[1].value]) {
         self.filter[elem.children[1].value].push({
         start: $('#start').val(),
         end  : $('#end').val()
         });

         } else {
         self.filter[elem.children[1].value] = [];
         self.filter[elem.children[1].value].push({
         start: $('#start').val(),
         end  : $('#end').val()
         });
         }
         } else {
         if (self.filter[elem.children[1].value]) {
         $($($(elem.children[2]).children('li')).children('input:checked')).each(function (index, element) {
         self.filter[elem.children[1].value].push($(element).next().text());
         });
         } else {
         self.filter[elem.children[1].value] = [];

         $($($(elem.children[2]).children('li')).children('input:checked')).each(function (index, element) {
         self.filter[elem.children[1].value].push($(element).next().text());
         });
         }
         }

         });

         $('.column').children('.item').remove();

         _.each(workflows, function (wfModel) {
         dataService.getData('/Opportunities/', {
         workflowId: wfModel._id,
         viewType  : 'kanban',
         filter    : this.filter
         }, this.asyncRender, this);
         }, this);

         return false;
         }

         listId = _.pluck(workflows, '_id');

         showList = $checkedElements.map(function () {
         return this.value;
         }).get();

         foldList = _.difference(listId, showList);

         if (($checkedElements.length && $checkedElements.attr('id') === 'defaultFilter') || (!chosen.length)) {
         self.filter = {};

         $('.column').children('.item').remove();

         _.each(workflows, function (wfModel) {
         dataService.getData(CONSTANTS.URLS.OPPORTUNITIES, {
         workflowId: wfModel._id,
         viewType  : 'kanban',
         filter    : this.filter
         }, this.asyncRender, this);
         }, this);

         return false;
         }

         foldList.forEach(function (id) {
         var w;
         var k;

         el = $("td.column[data-id='" + id + "']");
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
         el = $("td.column[data-id='" + id + "']");
         el.removeClass('fold');
         });
         },*/

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

            this.asyncFetc(workflows, filter);
        },

        render: function () {
            var self = this;
            var showList;
            var el;
            var workflows = this.workflowsCollection.toJSON();
            var itemCount;

            this.$el.html(_.template(WorkflowsTemplate,
                {
                    workflowsCollection: workflows,
                    currencySplitter   : helpers.currencySplitter
                }));

            $('.column').last().addClass('lastColumn');

            _.each(workflows, function (workflow, i) {
                var column;
                // var count = ' <span>(<span class='counter'>' + itemCount + '</span> / </span>';
                var total;
                var amountOpportunity;

                itemCount = 0;
                column = this.$('.column').eq(i);
                total = "<span><span class='totalCount'>" + itemCount + '</span></span>';
                amountOpportunity = " <span class='dollar'><span class='totalAmount'>0</span></span>";
                column.find('.columnNameDiv h2').append(total);
                column.find('.text').append(amountOpportunity);
            }, this);

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
                    self.updateCounter(ui.item, false);
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
                        secStart = parseInt($(".inner[data-id='" + model.toJSON()._id + "']").attr('data-sequence'), 10);
                        workStart = model.toJSON().workflow._id ? model.toJSON().workflow._id : model.toJSON().workflow;

                        model.save({
                            workflow     : column.data('id'),
                            sequenceStart: secStart,
                            sequence     : sequence,
                            workflowStart: model.toJSON().workflow._id ? model.toJSON().workflow._id : model.toJSON().workflow
                        }, {
                            patch   : true,
                            validate: false,
                            success : function (model2) {
                                self.updateSequence(ui.item, column.attr('data-id'), sequence, workStart, secStart);

                                collection.add(model2, {merge: true});
                            }
                        });
                        self.updateCounter(column, true);
                    }
                }
            }).disableSelection();

            this.$el.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');
            $(document).on('keypress', '#cPerPage', this.isNumberKey);

            this.$el.unbind();

            $(document).on('click', function (e) {
                self.hideItemsNumber(e);
            });

            if (!App || !App.filtersObject || !App.filtersObject.filtersValues || !App.filtersObject.filtersValues[this.contentType]) {
                custom.getFiltersValues({contentType: this.contentType}, this.renderFilter(this.baseFilter));
            } else {
                this.renderFilter(this.baseFilter);
            }

            populate.get('.current-selected', CONSTANTS.URLS.PROJECT_TYPE, {}, 'name', this, false, true);

            return this;
        }
    });

    return OpportunitiesKanbanView;
});
