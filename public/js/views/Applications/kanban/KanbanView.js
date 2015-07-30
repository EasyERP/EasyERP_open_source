define([
        'text!templates/Applications/kanban/WorkflowsTemplate.html',
        'text!templates/Applications/kanbanSettings.html',
        'collections/Workflows/WorkflowsCollection',
        'views/Applications/kanban/KanbanItemView',
        'views/Applications/EditView',
        'views/Applications/CreateView',
        'collections/Applications/ApplicationsCollection',
        'models/ApplicationsModel',
        'models/UsersModel',
        'views/Filter/FilterView',
        'dataService'
    ],
    function (WorkflowsTemplate, kanbanSettingsTemplate, WorkflowsCollection, KanbanItemView, EditView, CreateView, ApplicationsCollection, CurrentModel, usersModel, filterView, dataService) {
        var collection = new ApplicationsCollection();
        var ApplicationsKanbanView = Backbone.View.extend({
            el: '#content-holder',
            events: {
                "dblclick .item": "gotoEditForm",
                "click .item": "selectItem",
                "click .column.fold": "foldUnfoldKanban",
                "click .fold-unfold": "foldUnfoldKanban",
                "click .saveFilterButton": "saveFilter",
                "click .removeFilterButton": "removeFilter",
                "click .clearFilterButton": "clearFilter"
            },

            columnTotalLength: null,
            initialize: function (options) {
                this.startTime = options.startTime;
                this.workflowsCollection = options.workflowCollection;
                this.foldWorkflows = [];
                this.render();

                this.asyncFetc(options.workflowCollection);
                this.getCollectionLengthByWorkflows(this);

                if (App.currentUser.savedFilters && App.currentUser.savedFilters['Applications']){
                    this.filter = App.currentUser.savedFilters['Applications'];
                    this.showFiltredPage(this.workflowsCollection.toJSON(), this.filter);
                }


            },

            updateFoldWorkflow: function () {
                if (this.foldWorkflows.length === 0) {
                    this.foldWorkflows = ["Empty"];
                }
                dataService.postData('/currentUser', { 'kanbanSettings.applications.foldWorkflows': this.foldWorkflows }, function (error, success) {
                });
            },

            foldUnfoldKanban: function (e, id) {
                var el;
                if (id) {
                    el = $("td.column[data-id='" + id + "']");
                } else {
                    el = $(e.target).closest("td");
                }
                el.toggleClass("fold");
                if (el.hasClass("fold")) {
                    var w = el.find(".columnName .text").width();
                    var k = w / 2 - 21;
                    if (k < 0) {
                        k = -2 - k;
                    }
                    el.find(".columnName .text").css({"left": "-" + k + "px", "top": Math.abs(w / 2 + 47) + "px" });
                    this.foldWorkflows.push(el.attr("data-id"));
                } else {
                    var idx = this.foldWorkflows.indexOf(el.attr("data-id"));
                    if (idx !== -1) {
                        this.foldWorkflows.splice(idx, 1);
                    }
                }
                if (!id)
                    this.updateFoldWorkflow();
                if (el.closest("table").find(".fold").length == el.closest("table").find(".column").length) {
                    el.closest("table").css({"min-width": "inherit"});
                    el.closest("table").css({"width": "auto"});
                }
                else {
                    el.closest("table").css({"min-width": "100%"});
                }
                el.closest("table").css({"min-height": ($(window).height() - 110) + "px"});
                this.$(".column").sortable("enable");
                this.$(".column.fold").sortable("disable");
            },

            isNumberKey: function (evt) {
                var charCode = (evt.which) ? evt.which : event.keyCode;
                if (charCode > 31 && (charCode < 48 || charCode > 57))
                    return false;
                return true;
            },

            saveKanbanSettings: function () {
                var countPerPage = $(this).find('#cPerPage').val();
                if (countPerPage == 0)
                    countPerPage = 5;
                dataService.postData('/currentUser', { 'kanbanSettings.applications.countPerPage': countPerPage }, function (error, success) {
                    if (success) {
                        $(".edit-dialog").remove();
                        Backbone.history.fragment = '';
                        Backbone.history.navigate("easyErp/Applications", { trigger: true });
                    } else {
                        Backbone.history.navigate("easyErp", { trigger: true });
                    }
                });
            },

            hideDialog: function () {
                $(".edit-dialog").remove();
            },

            editKanban: function (e) {
                dataService.getData('/currentUser', null, function (user, context) {
                    var tempDom = _.template(kanbanSettingsTemplate, { applications: user.kanbanSettings.applications });
                    context.$el = $(tempDom).dialog({
                        dialogClass: "edit-dialog",
                        width: "400",
                        title: "Edit Kanban Settings",
                        buttons: {
                            save: {
                                text: "Save",
                                class: "btn",
                                click: context.saveKanbanSettings
                            },
                            cancel: {
                                text: "Cancel",
                                class: "btn",
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
                dataService.getData('/getApplicationsLengthByWorkflows', {}, function (data) {
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
                model.urlRoot = '/Applications/form';
                model.fetch({
                    data: { id: id },
                    success: function (model, response, options) {
                        new EditView({ model: model });
                    },
                    error: function () {
                        alert('Please refresh browser');
                    }
                });
            },

            asyncFetc: function (workflows) {
                _.each(workflows.toJSON(), function (wfModel) {
                    dataService.getData('/Applications/kanban', { workflowId: wfModel._id }, this.asyncRender, this);
                }, this);
            },

            asyncRender: function (response, context) {
                var contentCollection = new ApplicationsCollection();
                contentCollection.set(contentCollection.parse(response));
                if (collection) {
                    collection.add(contentCollection.models);
                } else {
                    collection = new ApplicationsCollection();
                    collection.set(collection.parse(response));
                }
                var kanbanItemView;
                var column = this.$("[data-id='" + response.workflowId + "']");
                if (response.fold) {
                    context.foldUnfoldKanban(null, response.workflowId);
                }
                column.find(".counter").html(parseInt(column.find(".counter").html()) + contentCollection.models.length);
                _.each(contentCollection.models, function (wfModel) {
                    kanbanItemView = new KanbanItemView({ model: wfModel });
                    var curEl = kanbanItemView.render().el;
                    column.append(curEl);
                }, this);

            },

            editItem: function () {
                new EditView({ collection: this.collection });
            },

            createItem: function () {
                new CreateView();
            },

            updateSequence: function (item, workflow, sequence, workflowStart, sequenceStart) {
                if (workflow == workflowStart) {
                    if (sequence > sequenceStart)
                        sequence -= 1;
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
                        if (sec >= a && sec <= b)
                            $(this).find(".inner").attr("data-sequence", sec + inc);
                    });
                    item.find(".inner").attr("data-sequence", sequence);

                } else {
                    $(".column[data-id='" + workflow + "']").find(".item").each(function () {
                        if (parseInt($(this).find(".inner").attr("data-sequence")) >= sequence)
                            $(this).find(".inner").attr("data-sequence", parseInt($(this).find(".inner").attr("data-sequence")) + 1);
                    });
                    $(".column[data-id='" + workflowStart + "']").find(".item").each(function () {
                        if (parseInt($(this).find(".inner").attr("data-sequence")) > sequenceStart)
                            $(this).find(".inner").attr("data-sequence", parseInt($(this).find(".inner").attr("data-sequence")) - 1);
                    });
                    item.find(".inner").attr("data-sequence", sequence);

                }
            },

            hideItemsNumber: function (e) {
                var el = e.target;

                this.$el.find(".allNumberPerPage, .newSelectList").hide();
                if (!el.closest('.search-view')) {
                    $('.search-content').removeClass('fa-caret-up');
                    this.$el.find(".filterOptions, .filterActions, .search-options, .drop-down-filter").hide();
                };
            },

            showFiltredPage: function (workflows, savedFilter) {
                var list_id;
                var foldList;
                var showList;
                var el;
                var self = this;
                var chosen = this.$el.find('.chosen');
                var checkedElements = $('.drop-down-filter input:checkbox:checked');

                this.filter = {};

                if (chosen.length) {
                    chosen.each(function (index, elem) {
                        if (self.filter[elem.children[1].value]) {
                            $($($(elem.children[2]).children('li')).children('input:checked')).each(function (index, element) {
                                self.filter[elem.children[1].value].push(element.value);
                            })
                        } else {
                            self.filter[elem.children[1].value] = [];
                            $($($(elem.children[2]).children('li')).children('input:checked')).each(function (index, element) {
                                self.filter[elem.children[1].value].push(element.value);
                            })
                        }
                    });

                    _.each(workflows, function (wfModel) {
                        $('.column').children('.item').remove();
                        dataService.getData('/Applications/kanban', { workflowId: wfModel._id, filter: this.filter }, this.asyncRender, this);
                    }, this);

                    return false
                }

                list_id = _.pluck(workflows, '_id');
                if (savedFilter){
                    showList = savedFilter['workflow'];
                } else {
                    showList = checkedElements.map(function() {return this.value;}).get();
                }

                foldList = _.difference(list_id, showList);

                if ((checkedElements.length && checkedElements.attr('id') === 'defaultFilter') || !chosen.length) {
                    self.filter = {};

                    _.each(workflows, function (wfModel) {
                        $('.column').children('.item').remove();
                        dataService.getData('/Applications/kanban', { workflowId: wfModel._id, filter: this.filter }, this.asyncRender, this);
                    }, this);
                    showList = _.pluck(workflows, '_id');
                    foldList = [];
                };

                foldList.forEach(function (id) {
                    var w;
                    var k;

                    el = $("td.column[data-id='"+id+"']");
                    el.addClass("fold");
                    w = el.find(".columnName .text").width();
                    k = w/2-20;
                    if (k<=0){
                        k= 20-w/2;
                    }
                    k=-k;
                    el.find(".columnName .text").css({"left":k+"px","top":Math.abs(w/2+47)+"px" });
                });

                showList.forEach(function (id) {
                    el = $("td.column[data-id='"+id+"']");
                    el.removeClass("fold");
                });

                $(".saveFilterButton").show();
                $(".clearFilterButton").show();
                $(".removeFilterButton").show();
                if (savedFilter){
                    $(".saveFilterButton").hide();
                    $(".clearFilterButton").show();
                    $(".removeFilterButton").show();
                }

            },

            saveFilter: function () {
                var currentUser = new usersModel(App.currentUser);
                var subMenu = $('#submenu-holder').find('li.selected').text();
                var key;
                var filterObj = {};
                var mid = 39;
                var showList = $('.drop-down-filter input:checkbox:checked').map(function() {return this.value;}).get();

                key = subMenu.trim();

                filterObj['filter'] = {};
                filterObj['filter']['workflow'] = showList;
                filterObj['key'] = key;

                currentUser.changed = filterObj;

                currentUser.save(
                    filterObj,
                    {
                        headers: {
                            mid: mid
                        },
                        wait: true,
                        patch:true,
                        validate: false,
                        success: function (model) {
                            console.log('Filter was saved to db');
                        },
                        error: function (model,xhr) {
                            console.error(xhr);
                        },
                        editMode: false
                    }
                );
                if (!App.currentUser.savedFilters){
                    App.currentUser.savedFilters = {};
                }
                App.currentUser.savedFilters['Applications'] = filterObj.filter;

                this.$el.find('.filterValues').empty();
                this.$el.find('.filter-icons').removeClass('active');
                this.$el.find('.chooseOption').children().remove();

                $.each($('.drop-down-filter input'), function (index, value) {
                    value.checked = false
                });

                $(".saveFilterButton").hide();
                $(".removeFilterButton").show();
                $(".clearFilterButton").show();

            },

            removeFilter: function () {
                var currentUser = new usersModel(App.currentUser);
                var subMenu = $('#submenu-holder').find('li.selected').text();
                var key;
                var filterObj = {};
                var mid = 39;

                this.clearFilter();

                key = subMenu.trim();
                filterObj['key'] = key;

                currentUser.changed = filterObj;

                currentUser.save(
                    filterObj,
                    {
                        headers: {
                            mid: mid
                        },
                        wait: true,
                        patch:true,
                        validate: false,
                        success: function (model) {
                            console.log('Filter was remover from db');
                        },
                        error: function (model,xhr) {
                            console.error(xhr);
                        },
                        editMode: false
                    }
                );

                delete App.currentUser.savedFilters['Applications'];

                $(".saveFilterButton").hide();
                $(".removeFilterButton").hide();
                $(".clearFilterButton").hide();
            },

            clearFilter: function () {
                var showList;
                var workflows = this.workflowsCollection.toJSON();
                var el;

                this.$el.find('.filterValues').empty();
                this.$el.find('.filter-icons').removeClass('active');
                this.$el.find('.filterOptions').removeClass('chosen');
                this.$el.find('.chooseOption').children().remove();

                $.each($('.drop-down-filter input'), function (index, value) {
                    value.checked = false
                });

                showList = _.pluck(workflows, '_id');

                showList.forEach(function (id) {
                    el = $("td.column[data-id='"+id+"']");
                    el.removeClass("fold");
                });

                $(".clearFilterButton").hide();
                $(".removeFilterButton").show();
                $(".saveFilterButton").hide();
            },


            render: function () {
                var self = this;
                var FilterView;
                var workflows = this.workflowsCollection.toJSON();
                var showList;
                var el;



                this.$el.html(_.template(WorkflowsTemplate, { workflowsCollection: workflows }));
                $(".column").last().addClass("lastColumn");
                var itemCount;

                _.each(workflows, function (workflow, i) {
                    itemCount = 0;
                    var column = this.$(".column").eq(i);
                    var total = " <span><span class='totalCount'>" + itemCount + "</span> </span>";
                    column.find(".columnNameDiv h2").append(total);
                }, this);

                this.$(".column").sortable({
                    connectWith: ".column",
                    cancel: "h2",
                    cursor: "move",
                    items: ".item",
                    opacity: 0.7,
                    revert: true,
                    helper: 'clone',
                    containment: 'document',
                    start: function (event, ui) {
                        var column = ui.item.closest(".column");
                        column.find(".totalCount").html(parseInt(column.find(".totalCount").html()) - 1);
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
                            model.save({ workflow: column.data('id'), sequenceStart: parseInt($(".inner[data-id='" + model.toJSON()._id + "']").attr("data-sequence")), sequence: sequence, workflowStart: model.toJSON().workflow._id ? model.toJSON().workflow._id : model.toJSON().workflow}, {
                                patch: true,
                                validate: false,
                                success: function (model2) {
                                    self.updateSequence(ui.item, column.attr("data-id"), sequence, workStart, secStart);

                                    collection.add(model2, {merge: true});
                                }
                            });
                            column.find(".counter").html(parseInt(column.find(".counter").html()) + 1);
                            column.find(".totalCount").html(parseInt(column.find(".totalCount").html()) + 1);
                        }
                    }
                }).disableSelection();
                this.$el.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
                $(document).on("keypress", "#cPerPage", this.isNumberKey);
                this.$el.unbind();
                $(document).on("click", function (e) {
                    self.hideItemsNumber(e);
                });

                this.$el.prepend('<div class="filtersActive"><button id="saveFilterButton" class="saveFilterButton">Save Filter</button>' +
                    '<button id="clearFilterButton" class="clearFilterButton">Clear Filter</button>' +
                    '<button id="removeFilterButton" class="removeFilterButton">Remove Filter</button></div>'
                );

                $("#clearFilterButton").hide();
                $("#saveFilterButton").hide();
                $("#removeFilterButton").hide();

                if (App.currentUser.savedFilters && App.currentUser.savedFilters['Applications']) {
                    $("#clearFilterButton").show();
                    $("#removeFilterButton").show();
                }

                dataService.getData('/employee/getFilterValues', null, function (values) {
                    FilterView = new filterView({ collection: workflows, customCollection: values});
                    // Filter custom event listen ------begin
                    FilterView.bind('filter', function () {
                        self.showFiltredPage(workflows, this.filter)
                    });
                    FilterView.on('defaultFilter', function () {
                        self.showFiltredPage(workflows)
                        /*showList = _.pluck(workflows, '_id');

                        showList.forEach(function (id) {
                            el = $("td.column[data-id='"+id+"']");
                            el.removeClass("fold");
                        });*/
                    });
                    // Filter custom event listen ------end
                });

                return this;
            }
        });
        return ApplicationsKanbanView;
    });
