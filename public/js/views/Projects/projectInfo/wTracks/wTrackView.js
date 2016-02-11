/**
 * Created by liliya on 17.09.15.
 */
define([
    'text!templates/Projects/projectInfo/wTrackTemplate.html',
    'text!templates/Projects/projectInfo/wTracks/wTrackHeader.html',
    'text!templates/Pagination/PaginationTemplate.html',
    'text!templates/wTrack/list/cancelEdit.html',
    'views/wTrack/CreateView',
    'views/wTrack/list/ListView',
    'views/wTrack/list/ListItemView',
    'models/wTrackModel',
    'collections/wTrack/editCollection',
    'collections/wTrack/filterCollection',
    'dataService',
    'populate',
    'async'

], function (wTrackTemplate, wTrackTopBar, paginationTemplate, cancelEdit, createView, listView, listItemView, currentModel, EditCollection, wTrackCollection, dataService, populate, async) {
    var wTrackView = listView.extend({

        el                      : '#timesheet',
        totalCollectionLengthUrl: '/wTrack/totalCollectionLength',
        templateHeader          : _.template(wTrackTopBar),
        listItemView            : listItemView,
        template                : _.template(wTrackTemplate),
        changedModels           : {},

        events: {
            "mouseover .currentPageList"                             : "showPagesPopup",
            "click .itemsNumber"                                     : "switchPageCounter",
            "click .showPage"                                        : "showPage",
            "change #currentShowPage"                                : "showPage",
            "click .checkbox"                                        : "checked",
            "change .listCB"                                         : "setAllTotalVals",
            "click #top-bar-copyBtn"                                 : "copyRow",
            "click #savewTrack"                                      : "saveItem",
            "click #deletewTrack"                                    : "deleteItems",
            "click #createBtn"                                       : "createItem",
            "click .oe_sortable :not(span.arrow.down, span.arrow.up)": "goSort",
            "click"                                                  : "removeInputs"
        },

        initialize: function (options) {
            this.remove();
            this.collection = options.model;
            this.defaultItemsNumber = options.defaultItemsNumber;
            this.filter = options.filter ? options.filter : {};
            this.project = options.project ? options.project : {};

            this.startNumber = options.startNumber;

            if (this.startNumber < 100) {
                this.getTotalLength(null, this.defaultItemsNumber, this.filter);
            }

            this.render();
        },

        createItem: function (e) {
            e.preventDefault();

            var projectModel = this.project.toJSON();
            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var week = now.getWeek();
           // var rate = 3;
            this.projectModel = projectModel;
            var startData = {
                year        : year,
                month       : month,
                week        : week,
               // rate        : rate,
                project     : projectModel._id,
                projectModel: projectModel
            };

            var model = new currentModel(startData);

            startData.cid = model.cid;

            if (!this.isNewRow()) {
                this.showSaveCancelBtns();
                this.editCollection.add(model);

                new createView(startData);
            } else {
                App.render({
                    type   : 'notify',
                    message: 'Please confirm or discard changes before create a new item'
                });
            }

            this.createdCopied = true;
            this.changed = true;
        },

        stopDefaultEvents: function (e) {
            e.stopPropagation();
            e.preventDefault();
        },

        showMoreContent: function (newModels) {
            var holder = this.$el;
            var itemView;

            this.editCollection.reset(newModels);

            holder.find("#listTable").empty();

            itemView = new this.listItemView({
                collection : newModels,
                page       : holder.find("#currentShowPage").val(),
                itemsNumber: this.defaultItemsNumber
            });

            holder.append(itemView.render());

            itemView.undelegateEvents();

            var pagenation = holder.find('.pagination');
            if (newModels.length !== 0) {
                pagenation.show();
            } else {
                pagenation.hide();
            }
            $("#top-bar-deleteBtn").hide();
            $('#check_all').prop('checked', false);
        },

        goSort: function (e) {
            e.preventDefault();
            var target$;
            var currentParrentSortClass;
            var sortClass;
            var sortConst;
            var sortBy;
            var sortObject;

            var newRows = this.$el.find('#false').length;

            if (this.isNewRow) {
                newRows = this.isNewRow();
            }

            if ((this.changedModels && Object.keys(this.changedModels).length) || newRows) {
                return App.render({
                    type   : 'notify',
                    message: 'Please, save previous changes or cancel them!'
                });
            }

            this.collection.unbind('reset');
            this.collection.unbind('showmore');

            target$ = $(e.target);
            currentParrentSortClass = target$.attr('class');
            sortClass = currentParrentSortClass.split(' ')[1];
            sortConst = 1;
            sortBy = target$.data('sort');
            sortObject = {};

            if (!sortClass) {
                target$.addClass('sortDn');
                sortClass = "sortDn";
            }
            switch (sortClass) {
                case "sortDn":
                {
                    target$.parent().find("th").removeClass('sortDn').removeClass('sortUp');
                    target$.removeClass('sortDn').addClass('sortUp');
                    sortConst = 1;
                }
                    break;
                case "sortUp":
                {
                    target$.parent().find("th").removeClass('sortDn').removeClass('sortUp');
                    target$.removeClass('sortUp').addClass('sortDn');
                    sortConst = -1;
                }
                    break;
            }
            sortObject[sortBy] = sortConst;

            this.fetchSortCollection(sortObject);
            this.getTotalLength(null, this.defaultItemsNumber, this.filter);
        },

        fetchSortCollection: function (sortObject) {
            this.sort = sortObject;
            this.collection = new wTrackCollection({
                viewType        : 'list',
                sort            : sortObject,
                page            : this.page,
                count           : this.defaultItemsNumber,
                filter          : this.filter,
                parrentContentId: this.parrentContentId,
                contentType     : this.contentType,
                newCollection   : this.newCollection
            });
            this.collection.bind('reset', this.renderContent, this);
            this.collection.bind('showmore', this.showMoreContent, this);
        },

        getTotalLength: function (currentNumber, itemsNumber, filter) {
            var self = this;

            dataService.getData(this.totalCollectionLengthUrl, {
                currentNumber: currentNumber,
                filter       : filter,
                contentType  : this.contentType,
                newCollection: this.newCollection
            }, function (response, context) {

                var page = context.page || 1;
                var length = context.listLength = response.count || 0;

                if (itemsNumber === 'all') {
                    itemsNumber = response.count;
                }

                if (itemsNumber * (page - 1) > length) {
                    context.page = page = Math.ceil(length / itemsNumber);
                    context.fetchSortCollection(context.sort);
                    // context.changeLocationHash(page, context.defaultItemsNumber, filter);
                }

                context.pageElementRenderProject(response.count, itemsNumber, page, self);//prototype in main.js
            }, this);
        },

        /*renderPagination: function ($currentEl, self) {
            $currentEl.append(_.template(paginationTemplate));

            var pagenation = self.$el.find('.pagination');

            if (self.collection.length === 0) {
                pagenation.hide();
            } else {
                pagenation.show();
            }

            $(document).on("click", function (e) {
                self.hidePagesPopup(e);
            });
        },*/
        showPage: function (event) {
            event.preventDefault();
            event.stopPropagation();

            this.collection.unbind('reset');
            this.collection.unbind('showmore');

            this.showPProject(event, {
                filter       : this.filter,
                newCollection: this.newCollection,
                sort         : this.sort
            }, true, this);
        },

        checkPage: function (event) {
            var elementId = $(event.target).attr('id');
            var checkProject;
            var data = {
                sort         : this.sort,
                filter       : this.filter,
                newCollection: this.newCollection
            };

            event.preventDefault();
            event.stopPropagation();

            this.collection.unbind('reset');
            this.collection.unbind('showmore');


            $('#check_all').prop('checked', false);
            switch(elementId) {
                case 'previousPage':
                    this.prevPProject(data, true, this);
                    break;

                case 'nextPage':
                    this.nextPProject(data, true, this);
                    break;

                case 'firstShowPage':
                    this.firstPProject(data, true, this);
                    break;

                case 'lastShowPage':
                    this.lastPProject(data, true, this);
                    break;
            }
            dataService.getData(this.totalCollectionLengthUrl, {
                filter       : this.filter,
                newCollection: this.newCollection
            }, function (response, context) {
                context.listLength = response.count || 0;
            }, this);
        },

        //showNewSelect: function (e, prev, next) {
        //    populate.showSelect(e, prev, next, this);
        //
        //    return false;
        //},
        //
        //nextSelect: function (e) {
        //    this.showNewSelect(e, false, true);
        //},
        //
        //prevSelect: function (e) {
        //    this.showNewSelect(e, true, false);
        //},

        //showPagesPopup: function (e) {
        //    $(e.target).closest("button").next("ul").toggle();
        //    return false;
        //},

        bindingEventsToEditedCollection: function (context) {
            if (context.editCollection) {
                context.editCollection.unbind();
            }
            context.editCollection = new EditCollection(context.collection.toJSON());
            context.editCollection.on('saved', context.savedNewModel, context);
            context.editCollection.on('updated', context.updatedOptions, context);
        },

        savedNewModel: function (modelObject) {
            var savedRow = this.$listTable.find('.false');
            var modelId;
            var checkbox = savedRow.find('input[type=checkbox]');

            modelObject = modelObject.success;

            if (modelObject) {
                modelId = modelObject._id;
                savedRow.attr("data-id", modelId);
                checkbox.val(modelId);
                savedRow.removeAttr('id');
                savedRow.removeClass('false');
            }

            this.hideSaveCancelBtns();
            this.resetCollection(modelObject);
        },

        removeInputs: function () {
            this.setChangedValueToModel();
        },

        rerenderNumbers: function () {
            var tableTr = $("#listTable").find('tr');

            tableTr.each(function (index) {
                $(this).find('[data-content="number"]').text(index + 1);
            });

        },

        deleteItems: function (e) {
            e.preventDefault();

            var that = this;
            var mid = 39;
            var model;
            var table = $("#listTable");
            this.collectionLength = this.collection.length;

            if (!this.changed) {

                var answer = confirm("Really DELETE items ?!");
                var value;

                if (answer === true) {
                    async.each($("#listTable input:checked"), function (checkbox, cb) {
                        value = checkbox.value;

                        model = that.collection.get(value);
                        model.destroy({
                            headers: {
                                mid: mid
                            },
                            wait   : true,
                            success: function (model) {
                                var id = model.get('_id');

                                table.find('[data-id="' + id + '"]').remove();

                                that.$el.find('#check_all').prop('checked', false);

                                cb();
                            },
                            error  : function (model, res) {
                                if (res.status === 403) {
                                    App.render({
                                        type: 'error',
                                        message: "You do not have permission to perform this action"
                                    });
                                }
                                cb();
                            }
                        });
                    }, function () {
                        that.setAllTotalVals();
                        that.hideSaveCancelBtns();
                        that.rerenderNumbers();
                        that.getTotalLength(null, that.defaultItemsNumber, that.filter);

                        that.copyEl.hide();
                        that.genInvoiceEl.hide();
                    });
                }
            } else {
                this.cancelChanges();
            }
        },

        cancelChanges: function () {
            var self = this;
            var edited = this.edited;
            var collection = this.collection;
            var editedCollectin = this.editCollection;
            var copiedCreated;
            var dataId;
            var enable;

            async.each(edited, function (el, cb) {
                var tr = $(el).closest('tr');
                var rowNumber = tr.find('[data-content="number"]').text();
                var id = tr.attr('data-id');
                var template = _.template(cancelEdit);
                var model;

                if (!id) {
                    return cb('Empty id');
                } else if (id.length < 24) {
                    tr.remove();
                    model = self.changedModels;

                    if (model) {
                        delete model[id];
                    }

                    return cb();
                }

                model = collection.get(id);
                model = model.toJSON();
                model.startNumber = rowNumber;
                enable = model && model.workflow.name !== 'Closed' ? true : false;
                tr.replaceWith(template({model: model, enable: enable}));
                cb();
            }, function (err) {
                if (!err) {

                    self.hideSaveCancelBtns();
                }
            });

            if (this.createdCopied) {
                copiedCreated = this.$el.find('.false');
                copiedCreated.each(function () {
                    dataId = $(this).attr('data-id');
                    self.editCollection.remove(dataId);
                    delete self.changedModels[dataId];
                    $(this).remove();
                });

                this.createdCopied = false;
            }

            self.changedModels = {};
            self.responseObj['#jobs'] = [];
        },

        hideSaveCancelBtns: function () {
            var saveBtnEl = $('#savewTrack');
            var cancelBtnEl = $('#deletewTrack');
            var createBtnEl = $('#createBtn');

            this.changed = false;

            saveBtnEl.hide();
            cancelBtnEl.hide();
            createBtnEl.show();

            return false;
        },

        switchPageCounter: function (event) {
            var newRows = this.$el.find('#false');

            event.preventDefault();

            if ((this.changedModels && Object.keys(this.changedModels).length) || (this.isNewRow ? this.isNewRow() : newRows.length)){
                return App.render({
                    type   : 'notify',
                    message: 'Please, save previous changes or cancel them!'
                });
            }

            var targetEl = $(event.target);
            var itemsNumber;

            if (this.previouslySelected) {
                this.previouslySelected.removeClass("selectedItemsNumber");
            }

            this.previouslySelected = targetEl;
            targetEl.addClass("selectedItemsNumber");

            this.startTime = new Date();
            itemsNumber = targetEl.text();

            if (itemsNumber === 'all') {
                itemsNumber = this.listLength;
            }

            this.defaultItemsNumber = itemsNumber;

            this.getTotalLength(null, itemsNumber, this.filter);

            this.collection.showMore({
                count        : itemsNumber,
                page         : 1,
                filter       : this.filter,
                newCollection: this.newCollection
            });
            this.page = 1;

            $("#top-bar-deleteBtn").hide();
            $('#check_all').prop('checked', false);

         //   this.changeLocationHash(1, itemsNumber, this.filter);
        },

        saveItem: function (e) {
            e.preventDefault();

            var model;

            var errors = this.$el.find('.errorContent');

            for (var id in this.changedModels) {
                model = this.editCollection.get(id) ? this.editCollection.get(id) : this.collection.get(id);
                if (model){
                    model.changed = this.changedModels[id];
                }
            }

            if (errors.length) {
                return
            }
            this.editCollection.save();

            for (var id in this.changedModels) {
                delete this.changedModels[id];
                this.editCollection.remove(id);
            }

            this.$el.find('.edited').removeClass('edited');
        },

        checked: function (e) {
            e.stopPropagation();
            var el = this.$el;
            var checkLength;
            var rawRows;

            if (this.collection.length > 0) {
                var $checkLength = el.find("input.checkbox:checked");

                checkLength = $checkLength.length;
                rawRows = $checkLength.closest('.false');

                if (el.find("input.checkbox:checked").length > 0) {
                    this.$createBtn.hide();
                    this.copyEl.show();
                    $("#deletewTrack").show();

                    el.find('#check_all').prop('checked', false);

                    if (checkLength === this.collection.length) {
                        el.find('#check_all').prop('checked', true);
                    }
                }
                else {
                    $("#deletewTrack").hide();
                    this.copyEl.hide();
                    this.$createBtn.show();
                    el.find('#check_all').prop('checked', false);
                }
            }

            if (rawRows.length !== 0 && rawRows.length !== checkLength) {
                this.$saveBtn.hide();
            } else {
                this.$saveBtn.show();
            }

            this.setAllTotalVals();
        },

        setAllTotalVals: function () {
            this.getAutoCalcField('hours', 'worked');
            this.getAutoCalcField('monHours', '1');
            this.getAutoCalcField('tueHours', '2');
            this.getAutoCalcField('wedHours', '3');
            this.getAutoCalcField('thuHours', '4');
            this.getAutoCalcField('friHours', '5');
            this.getAutoCalcField('satHours', '6');
            this.getAutoCalcField('sunHours', '7');
        },

        getAutoCalcField: function (idTotal, dataRow, money) {
            var footerRow = this.$el.find('#listFooter');

            var checkboxes = this.$el.find('.listCB:checked');

            var totalTd = $(footerRow).find('#' + idTotal);
            var rowTdVal = 0;
            var row;
            var rowTd;

            $(checkboxes).each(function (index, element) {
                row = $(element).closest('tr');
                rowTd = row.find('[data-content="' + dataRow + '"]');

                rowTdVal += parseFloat(rowTd.html() || 0) * 100;
            });

            if (money) {
                totalTd.text((rowTdVal / 100).toFixed(2));
            } else {
                totalTd.text(rowTdVal / 100);
            }
        },

        showSaveCancelBtns: function () {
            var saveBtnEl = $('#savewTrack');
            var cancelBtnEl = $('#deletewTrack');
            var createBtnEl = $('#createBtn');

            saveBtnEl.show();
            cancelBtnEl.show();
            createBtnEl.hide();

            return false;
        },

        hideGenerateCopy: function () {
            $('#top-bar-generateBtn').hide();
            $('#top-bar-copyBtn').hide();
        },

        copyRow: function (e) {
            this.stopDefaultEvents(e);
            this.hideGenerateCopy();

            this.changed = true;
            this.createdCopied = true;
            var checkedRows = this.$el.find('input.listCB:checked:not(#check_all)');
            var length = checkedRows.length;

            for (var i = length - 1; i >= 0; i--) {
                var selectedWtrack = checkedRows[i];
                var self = this;
                var target = $(selectedWtrack);
                var id = target.val();
                var row = target.closest('tr');
                var model = self.collection.get(id) ? self.collection.get(id) : self.editCollection.get(id);
                var _model;
                var tdsArr;
                var cid;
               // var hours = model.get('worked');
                //var rate = model.get('rate');
                //var revenue = parseInt(hours) * parseFloat(rate);

                $(selectedWtrack).attr('checked', false);

                model.set({"isPaid": false});
                model.set({"amount": 0});
                model.set({"cost": 0});
                model.set({"revenue": 0});
                model = model.toJSON();
                delete model._id;
                _model = new currentModel(model);

                this.showSaveCancelBtns();
                this.editCollection.add(_model);

                cid = _model.cid;

                if (!this.changedModels[cid]) {
                    this.changedModels[cid] = model;
                }

                this.$el.find('#listTable').prepend('<tr class="false enableEdit" data-id="' + cid + '">' + row.html() + '</tr>');
                row = this.$el.find('.false');

                tdsArr = row.find('td');
                $(tdsArr[0]).find('input').val(cid);
                $(tdsArr[1]).text("New");
            }
        },

        render: function () {
            var self = this;
            var $currentEl = this.$el;
            var wTracks = this.collection.toJSON();
            var allInputs;
            var checkedInputs;

            if (this.startNumber < 100) {
                $currentEl.html('');
                $currentEl.prepend(this.templateHeader);
            }

            $currentEl.find('#listTable').html(this.template({
                wTracks    : wTracks,
                startNumber: self.startNumber - 1
            }));

            if (this.startNumber < 100) {
                this.renderPagination(self.$el, self);
            }

            this.genInvoiceEl = this.$el.find('#top-bar-generateBtn');
            this.copyEl = this.$el.find('#top-bar-copyBtn');
            this.$saveBtn = this.$el.find('#saveBtn');
            this.$createBtn = this.$el.find('#createBtn');
            this.$removeBtn = this.$el.find('#deletewTrack');
            this.genInvoiceEl.hide();
            this.copyEl.hide();

            if (this.project.toJSON().workflow.name === 'Closed'){
                this.$createBtn.remove();
                this.copyEl.remove();
                this.$removeBtn.remove();
            }

            $('#savewTrack').hide();
            $('#deletewTrack').hide();

            $('#check_all').click(function () {
                var checkLength;

                allInputs = self.$el.find('.listCB');
                allInputs.prop('checked', this.checked);
                checkedInputs = $("input.listCB:checked");

                if (wTracks.length > 0) {
                    checkLength = checkedInputs.length;

                    if (checkLength > 0) {
                        $("#deletewTrack").show();
                        self.$createBtn.hide();

                        if (checkLength === self.collection.length) {
                            //checkedInputs.each(function (index, element) {
                            //    self.checkProjectId(element, checkLength);
                            //});

                            $('#check_all').prop('checked', true);
                        }
                    } else {
                        $("#deletewTrack").hide();
                        self.$createBtn.show();

                        $('#check_all').prop('checked', false);
                        self.$el.find('#top-bar-copyBtn').hide();
                    }
                }

                self.setAllTotalVals();

            });

            dataService.getData("/project/getForWtrack", null, function (projects) {
                projects = _.map(projects.data, function (project) {
                    project.name = project.projectName;

                    return project
                });

                self.responseObj['#project'] = projects;
            });

            dataService.getData("/employee/getForDD", null, function (employees) {
                employees = _.map(employees.data, function (employee) {
                    employee.name = employee.name.first + ' ' + employee.name.last;

                    return employee
                });

                self.responseObj['#employee'] = employees;
            });

            dataService.getData("/department/getForDD", null, function (departments) {
                departments = _.map(departments.data, function (department) {
                    department.name = department.departmentName;

                    return department
                });

                self.responseObj['#department'] = departments;
            });

            setTimeout(function () {
                self.bindingEventsToEditedCollection(self);
                self.$listTable = $('#listTable');
            }, 10);

            return this;
        }
    });

    return wTrackView;
});