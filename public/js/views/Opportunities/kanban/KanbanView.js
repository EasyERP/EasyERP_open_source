define([
        'Backbone',
        'text!templates/Opportunities/kanban/WorkflowsTemplate.html',
        'text!templates/Opportunities/kanbanSettings.html',
        'collections/Workflows/WorkflowsCollection',
        'views/Opportunities/kanban/KanbanItemView',
        'views/Opportunities/EditView',
        'views/Opportunities/CreateView',
        'collections/Opportunities/OpportunitiesCollection',
        'models/OpportunitiesModel',
        'dataService',
        'views/Filter/FilterView',
        'collections/Opportunities/filterCollection'
    ],
    function (Backbone, WorkflowsTemplate, kanbanSettingsTemplate, WorkflowsCollection, KanbanItemView, EditView, CreateView, OpportunitiesCollection, CurrentModel, dataService, filterView, contentCollection) {
        var collection = new OpportunitiesCollection();
        var OpportunitiesKanbanView = Backbone.View.extend({
            el                      : '#content-holder',
            filterView              : filterView,
            contentCollection       : contentCollection,
            contentType             : 'Opportunities',
            viewType                : 'kanban',
            events: {
                "dblclick .item"    : "gotoEditForm",
                "click .item"       : "selectItem",
                "click .column.fold": "foldUnfoldKanban",
                "click .fold-unfold": "foldUnfoldKanban"
            },

            columnTotalLength: null,

            initialize        : function (options) {
                this.startTime = options.startTime;
                this.buildTime = 0;
                this.workflowsCollection = options.workflowCollection;
                this.foldWorkflows = [];

                this.render();

                this.filterView.trigger('filter', App.filter);

                //this.asyncFetc(options.workflowCollection.toJSON());
                this.getCollectionLengthByWorkflows(this);
            },
            updateFoldWorkflow: function () {
                if (this.foldWorkflows.length === 0) {
                    this.foldWorkflows = ["Empty"];
                }
                dataService.postData('/currentUser', {'kanbanSettings.opportunities.foldWorkflows': this.foldWorkflows}, function (error, success) {
                });
            },

            foldUnfoldKanban: function (e, id) {
                var el;
                if (id) {
                    el = $("td.column[data-id='" + id + "']");
                } else {
                    el = $(e.target).closest("td");
                }
                if (!el.hasClass("fold")) {
                    el.addClass("fold");
                } else {
                    el.removeClass("fold");
                }
                if (el.hasClass("fold")) {

                    var w = el.find(".columnName .text").width();
                    var k = w / 2 - 20;
                    if (k <= 0) {
                        k = 20 - w / 2;
                    }
                    k = -k;
                    el.find(".columnName .text").css({"left": k + "px", "top": Math.abs(w / 2 + 47) + "px"});
                    this.foldWorkflows.push(el.attr("data-id"));
                } else {
                    var idx = this.foldWorkflows.indexOf(el.attr("data-id"));
                    if (idx !== -1) {
                        this.foldWorkflows.splice(idx, 1);
                    }
                }
                if (!id) {
                    this.updateFoldWorkflow();
                }
                if (el.closest("table").find(".fold").length == el.closest("table").find(".column").length) {
                    el.closest("table").css({"min-width": "inherit"});
                    el.closest("table").css({"width": "auto"});
                }
                else {
                    el.closest("table").css({"min-width": "100%"});
                }
                var k = $(document).height() - 115;
                if (k < 190) {
                    k = 190;
                }
                el.closest("table").css({"min-height": (k) + "px"});
                this.$(".column").sortable("enable");
                this.$(".column.fold").sortable("disable");
            },
            isNumberKey     : function (evt) {
                var charCode = (evt.which) ? evt.which : event.keyCode;
                if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                    return false;
                }
                return true;
            },

            saveKanbanSettings: function (context) {
                var countPerPage = context.$el.find('#cPerPage').val();
                if (countPerPage == 0) {
                    countPerPage = 5;
                }
                dataService.postData('/currentUser', {'kanbanSettings.opportunities.countPerPage': countPerPage}, function (error, success) {
                    if (success) {
                        $(".edit-dialog").remove();
                        Backbone.history.fragment = '';
                        Backbone.history.navigate("easyErp/Opportunities", {trigger: true});
                    }
                });
            },

            hideDialog: function () {
                $(".edit-dialog").remove();
            },

            editKanban: function (e) {
                var self = this;
                dataService.getData('/currentUser', null, function (user, context) {
                    var tempDom = _.template(kanbanSettingsTemplate, {opportunities: user.user.kanbanSettings.opportunities});
                    var self = context;
                    context.$el = $(tempDom).dialog({
                        dialogClass: "edit-dialog",
                        width      : "400",
                        title      : "Edit Kanban Settings",
                        buttons    : {
                            save  : {
                                text : "Save",
                                class: "btn",
                                click: function () {
                                    context.saveKanbanSettings(context);
                                }

                            },
                            cancel: {
                                text : "Cancel",
                                class: "btn",
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
                dataService.getData('/getLengthByWorkflows', {}, function (data) {
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
                $(e.target).parents(".item").parents("table").find(".active").removeClass("active");
                $(e.target).parents(".item").addClass("active");
            },

            gotoEditForm: function (e) {
                e.preventDefault();
                var id = $(e.target).closest(".inner").data("id");
                var model = new CurrentModel();
                model.urlRoot = '/Opportunities/form';
                model.fetch({
                    data   : {id: id},
                    success: function (model) {
                        new EditView({model: model});
                    },
                    error  : function () {
                        App.render({
                            type: 'error',
                            message: "Please refresh browser"
                        });
                    }
                });
            },

            asyncFetc: function (workflows, filter) {
                var url = '/Opportunities/kanban';

                filter = filter || {};

                _.each(workflows, function (wfModel) {
                    filter.workflowId = wfModel._id;
                    dataService.getData(url, filter, this.asyncRender, this);
                }, this);
            },

            asyncRender: function (response, context) {
                var contentCollection = new OpportunitiesCollection();
                var kanbanItemView;
                var forContent;
                var column;

                contentCollection.set(contentCollection.parse(response));
                if (collection) {
                    collection.add(contentCollection.models);
                } else {
                    collection = new OpportunitiesCollection();
                    collection.set(collection.parse(response));
                }

                column = this.$("[data-id='" + response.workflowId + "']");

                forContent = column.find('#forContent');
                forContent.html(''); // for duplicated content edited by Lilya

                if (response.fold) {
                    context.foldUnfoldKanban(null, response.workflowId);
                }
                column.find(".counter").html(parseInt(column.find(".counter").html()) + contentCollection.models.length);
                _.each(contentCollection.models, function (wfModel) {
                    var curEl;

                    kanbanItemView = new KanbanItemView({model: wfModel});
                    curEl = kanbanItemView.render().el;
                    forContent.append(curEl);
                }, this);
            },

            editItem: function () {
                //create editView in dialog here
                var edit = new EditView({collection: this.collection});
                edit.bind('recalc', this.updateCounter, this);
            },

            createItem: function () {
                //create editView in dialog here
                new CreateView();
            },

            updateSequence: function (item, workflow, sequence, workflowStart, sequenceStart) {
                if (workflow == workflowStart) {
                    if (sequence > sequenceStart) {
                        sequence -= 1;
                    }
                    var a = sequenceStart;
                    var b = sequence;
                    var inc = -1;
                    if (a > b) {
                        a = sequence;
                        b = sequenceStart;
                        inc = 1;
                    }
                    $(".column[data-id='" + workflow + "']").find(".item").each(function () {
                        var sec = parseInt($(this).find(".inner").attr("data-sequence"));
                        if (sec >= a && sec <= b) {
                            $(this).find(".inner").attr("data-sequence", sec + inc);
                        }
                    });
                    item.find(".inner").attr("data-sequence", sequence);

                } else {
                    $(".column[data-id='" + workflow + "']").find(".item").each(function () {
                        if (parseInt($(this).find(".inner").attr("data-sequence")) >= sequence) {
                            $(this).find(".inner").attr("data-sequence", parseInt($(this).find(".inner").attr("data-sequence")) + 1);
                        }
                    });
                    $(".column[data-id='" + workflowStart + "']").find(".item").each(function () {
                        if (parseInt($(this).find(".inner").attr("data-sequence")) >= sequenceStart) {
                            $(this).find(".inner").attr("data-sequence", parseInt($(this).find(".inner").attr("data-sequence")) - 1);
                        }
                    });
                    item.find(".inner").attr("data-sequence", sequence);

                }
            },

            updateCounter: function (el, inc) {
                var i = inc ? 1 : -1;
                var counter = el.closest(".column").find(".totalCount");
                counter.html(parseInt(counter.html()) + i);
            },

            hideItemsNumber: function (e) {
                var el = e.target;

                this.$el.find(".allNumberPerPage, .newSelectList").hide();
                if (!el.closest('.search-view')) {
                    $('.search-content').removeClass('fa-caret-up');
                    this.$el.find('.search-options').addClass('hidden');
                }
                ;

                //this.$el.find(".allNumberPerPage, .newSelectList").hide();
                //if (!el.closest('.search-view')) {
                //    $('.search-content').removeClass('fa-caret-up');
                //};

            },

            showFiltredPage: function (workflows) {
                var list_id;
                var foldList;
                var showList;
                var el;
                var self = this;
                var itemsNumber = $("#itemsNumber").text();
                var checkedElements = $('.drop-down-filter input:checkbox:checked');
                var condition = this.$el.find('.conditionAND > input')[0];
                var chosen = this.$el.find('.chosen');

                this.filter = {};
                this.filter['condition'] = 'and';

                if (condition && !condition.checked) {
                    self.filter['condition'] = 'or';
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
                                })
                            } else {
                                self.filter[elem.children[1].value] = [];
                                $($($(elem.children[2]).children('li')).children('input:checked')).each(function (index, element) {
                                    self.filter[elem.children[1].value].push($(element).next().text());
                                })
                            }
                        }

                    });

                    _.each(workflows, function (wfModel) {
                        $('.column').children('.item').remove();
                        dataService.getData('/Opportunities/kanban', {
                            workflowId: wfModel._id,
                            filter    : this.filter
                        }, this.asyncRender, this);
                    }, this);

                    return false
                }

                list_id = _.pluck(workflows, '_id');
                showList = $('.drop-down-filter input:checkbox:checked').map(function () {
                    return this.value;
                }).get();
                foldList = _.difference(list_id, showList);

                if ((checkedElements.length && checkedElements.attr('id') === 'defaultFilter') || (!chosen.length)) {
                    self.filter = {};

                    _.each(workflows, function (wfModel) {
                        $('.column').children('.item').remove();
                        dataService.getData('/Opportunities/kanban', {
                            workflowId: wfModel._id,
                            filter    : this.filter
                        }, this.asyncRender, this);
                    }, this);

                    return false
                }
                ;

                foldList.forEach(function (id) {
                    var w;
                    var k;

                    el = $("td.column[data-id='" + id + "']");
                    el.addClass("fold");
                    w = el.find(".columnName .text").width();
                    k = w / 2 - 20;
                    if (k <= 0) {
                        k = 20 - w / 2;
                    }
                    k = -k;
                    el.find(".columnName .text").css({"left": k + "px", "top": Math.abs(w / 2 + 47) + "px"});
                });

                showList.forEach(function (id) {
                    el = $("td.column[data-id='" + id + "']");
                    el.removeClass("fold");
                });
            },

            renderFilter: function () {
                var self = this;
                
                self.filterView = new this.filterView({
                    contentType: self.contentType
                });

                self.filterView.bind('filter', function (filter) {
                    self.showFilteredPage(filter);
                });

                self.filterView.bind('defaultFilter', function () {
                    self.showFilteredPage({});
                });

                self.filterView.render();
            },

            showFilteredPage: function (filter) {
                var self = this;
                var workflows = this.workflowsCollection.toJSON();

                if (filter.workflow) {
                    workflows = [];
                    filter.workflow.value.forEach(function(wId) {
                        workflows.push({
                            _id: wId
                        });
                    });
                }

                this.filter = Object.keys(filter).length === 0 ? {} : filter;

                self.changeLocationHash(false, false, filter);

                self.$el.find('td.column #forContent').html('');

                this.asyncFetc(workflows, filter);
            },

            render: function () {
                var self = this;
                var FilterView;
                var showList;
                var el;
                var workflows = this.workflowsCollection.toJSON();

                this.$el.html(_.template(WorkflowsTemplate, {workflowsCollection: workflows}));
                $(".column").last().addClass("lastColumn");
                var itemCount;
                _.each(workflows, function (workflow, i) {
                    itemCount = 0;
                    var column = this.$(".column").eq(i);
                    //var count = " <span>(<span class='counter'>" + itemCount + "</span> / </span>";
                    var total = " <span><span class='totalCount'>" + itemCount + "</span></span>";
                    column.find(".columnNameDiv h2").append(total);
                }, this);

                this.$(".column").sortable({
                    connectWith: ".column",
                    cancel     : "h2",
                    cursor     : "move",
                    items      : ".item",
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
                        var column = ui.item.closest(".column");
                        var sequence = 0;
                        if (ui.item.next().hasClass("item")) {
                            sequence = parseInt(ui.item.next().find(".inner").attr("data-sequence")) + 1;
                        }
                        if (model) {
                            var secStart = parseInt($(".inner[data-id='" + model.toJSON()._id + "']").attr("data-sequence"));
                            var workStart = model.toJSON().workflow._id ? model.toJSON().workflow._id : model.toJSON().workflow;
                            model.save({
                                workflow     : column.data('id'),
                                sequenceStart: parseInt($(".inner[data-id='" + model.toJSON()._id + "']").attr("data-sequence")),
                                sequence     : sequence,
                                workflowStart: model.toJSON().workflow._id ? model.toJSON().workflow._id : model.toJSON().workflow
                            }, {
                                patch   : true,
                                validate: false,
                                success : function (model2) {
                                    self.updateSequence(ui.item, column.attr("data-id"), sequence, workStart, secStart);

                                    collection.add(model2, {merge: true});
                                }
                            });
                            self.updateCounter(column, true);
                        }
                    }
                }).disableSelection();
                this.$el.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
                $(document).on("keypress", "#cPerPage", this.isNumberKey);

                this.$el.unbind();

                $(document).on("click", function (e) {
                    self.hideItemsNumber(e);
                });

                this.renderFilter(self);

                return this;
            }
        });

        return OpportunitiesKanbanView;
    });
