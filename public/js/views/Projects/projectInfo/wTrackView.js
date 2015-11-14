/**
 * Created by liliya on 17.09.15.
 */
define([
    'text!templates/Projects/projectInfo/wTrackTemplate.html',
    'text!templates/Projects/projectInfo/wTracks/wTrackHeader.html',
    'text!templates/Pagination/PaginationTemplate.html',
    'views/wTrack/list/ListView',
    'views/wTrack/list/ListItemView',
    'models/wTrackModel',
    'collections/wTrack/editCollection',
    'collections/wTrack/filterCollection',
    'dataService',
    'populate'

], function (wTrackTemplate, wTrackTopBar, paginationTemplate, listView, listItemView, currentModel, EditCollection, wTrackCollection, dataService, populate) {
    var wTrackView = listView.extend({

        el: '#weTracks',
        totalCollectionLengthUrl: '/wTrack/totalCollectionLength',
        templateHeader: _.template(wTrackTopBar),
        listItemView: listItemView,

        initialize: function (options) {
            this.collection = options.model;
            this.defaultItemsNumber = 50;
            this.filter = options.filter ? options.filter : {};

            this.startNumber = options.startNumber;

            if(this.startNumber < 50){
                this.getTotalLength(null, this.defaultItemsNumber, this.filter);
            }

            this.render();
        },

        showMoreContent: function (newModels) {
            var holder = this.$el;
            var itemView;

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


            //this.collection.unbind('reset');
            //this.collection.unbind('showmore');
        },


        goSort: function (e) {
            var target$;
            var currentParrentSortClass;
            var sortClass;
            var sortConst;
            var sortBy;
            var sortObject;

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

        template: _.template(wTrackTemplate),

        events: {
            "mouseover .currentPageList"  : "showPagesPopup",
            "click .itemsNumber"          : "switchPageCounter",
            "click .showPage"             : "showPage",
            "change #currentShowPage"     : "showPage",
            "click #previousPage"         : "previousPage",
            "click #nextPage"             : "nextPage",
            "click #firstShowPage"        : "firstPage",
            "click #lastShowPage"         : "lastPage",
            //"click .stageSelect"                                              : "showNewSelect",
            //"click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
            //"click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
            "click .checkbox": "checked",
            "change .listCB": "setAllTotalVals",
            "click #top-bar-copyBtn": "copyRow",
            "click #savewTrack": "saveItem",
            "click #deletewTrack": "deleteItems"
        },

        rerenderContent: function () {
            var self = this;

            var wTracks = self.collection.toJSON();

                $('#listContent').html(self.template({
                    wTracks: wTracks,
                    startNumber: parseInt($('#grid-start'))
                }));


        },

        renderPagination: function (currentEl, self) {
            currentEl.append(_.template(paginationTemplate));

            var pagenation = self.$el.find('.pagination');

            if (self.collection.length === 0) {
                pagenation.hide();
            } else {
                pagenation.show();
            }

            $(document).on("click", function (e) {
                self.hidePagesPopup(e);
            });
        },

        showPage: function (event) {

            this.collection.unbind('reset');
            this.collection.unbind('showmore');

            event.preventDefault();
            this.showPProject(event, {filter: this.filter, newCollection: this.newCollection, sort: this.sort}, true, this);
        },

        previousPage: function (event) {

            this.collection.unbind('reset');
            this.collection.unbind('showmore');

            event.preventDefault();

            $('#check_all').prop('checked', false);
            this.prevPProject({
                sort         : this.sort,
                filter       : this.filter,
                newCollection: this.newCollection
            }, true, this);
            dataService.getData(this.totalCollectionLengthUrl, {
                filter       : this.filter,
                contentType  : this.contentType,
                newCollection: this.newCollection
            }, function (response, context) {
                context.listLength = response.count || 0;
            }, this);
        },

        nextPage: function (event) {

            this.collection.unbind('reset');
            this.collection.unbind('showmore');

            event.preventDefault();


            $('#check_all').prop('checked', false);

            this.nextPProject({
                sort         : this.sort,
                filter       : this.filter,
                newCollection: this.newCollection
            }, true, this);
            dataService.getData(this.totalCollectionLengthUrl, {
                filter       : this.filter,
                newCollection: this.newCollection
            }, function (response, context) {
                context.listLength = response.count || 0;
            }, this);
        },

        firstPage: function (event) {

            this.collection.unbind('reset');
            this.collection.unbind('showmore');

            event.preventDefault();

            $('#check_all').prop('checked', false);
            this.firstPProject({
                sort         : this.sort,
                filter       : this.filter,
                newCollection: this.newCollection
            }, true, this);
            dataService.getData(this.totalCollectionLengthUrl, {
                sort  : this.sort,
                filter: this.filter
            }, function (response, context) {
                context.listLength = response.count || 0;
            }, this);
        },

        lastPage: function (event) {

            event.preventDefault();

            $('#check_all').prop('checked', false);
            this.lastPProject({
                sort         : this.sort,
                filter       : this.filter,
                newCollection: this.newCollection
            }, true, this);
            dataService.getData(this.totalCollectionLengthUrl, {
                sort  : this.sort,
                filter: this.filter
            }, function (response, context) {
                context.listLength = response.count || 0;
            }, this);
        },

        showNewSelect: function (e, prev, next) {
            populate.showSelect(e, prev, next, this);

            return false;
        },

        nextSelect: function (e) {
            this.showNewSelect(e, false, true);
        },

        prevSelect: function (e) {
            this.showNewSelect(e, true, false);
        },

        showPagesPopup: function (e) {
            $(e.target).closest("button").next("ul").toggle();
            return false;
        },

        bindingEventsToEditedCollection: function (context) {
            if (context.editCollection) {
                context.editCollection.unbind();
            }
            context.editCollection = new EditCollection(context.collection.toJSON());
            context.editCollection.on('saved', context.savedNewModel, context);
            context.editCollection.on('updated', context.updatedOptions, context);
        },

        savedNewModel: function (modelObject) {
            var savedRow = this.$listTable.find('#false');
            var modelId;
            var checkbox = savedRow.find('input[type=checkbox]');

            modelObject = modelObject.success;

            if (modelObject) {
                modelId = modelObject._id;
                savedRow.attr("data-id", modelId);
                checkbox.val(modelId);
                savedRow.removeAttr('id');
            }

            this.hideSaveCancelBtns();
            // this.resetCollection(modelObject);
        },

        deleteItems: function (e) {
            e.preventDefault();

            var that = this;
            var mid = 39;
            var model;
            var table = $("#listTable");
            this.collectionLength = this.collection.length;

            var answer = confirm("Really DELETE items ?!");
            var value;

            if (answer === true) {
                $.each($("#listTable input:checked"), function (index, checkbox) {
                    value = checkbox.value;

                    model = that.collection.get(value);
                    model.destroy({
                        headers: {
                            mid: mid
                        },
                        wait: true,
                        success: function (model) {
                            var id = model.get('_id');

                            table.find('[data-id="' + id + '"]').remove();

                            that.hideSaveCancelBtns();

                            that.copyEl.hide();
                            that.genInvoiceEl.hide();

                        },
                        error: function (model, res) {
                            if (res.status === 403 && index === 0) {
                                alert("You do not have permission to perform this action");
                            }
                        }
                    });
                });
            }
        },

        hideSaveCancelBtns: function () {
            var saveBtnEl = $('#savewTrack');
            var cancelBtnEl = $('#deletewTrack');

            this.changed = false;

            saveBtnEl.hide();
            cancelBtnEl.hide();

            return false;
        },

        saveItem: function (e) {
            e.preventDefault();

            var model;

            var errors = this.$el.find('.errorContent');

            for (var id in this.changedModels) {
                model = this.editCollection.get(id) ? this.editCollection.get(id) : this.collection.get(id);
                model.changed = this.changedModels[id];

            }

            if (errors.length) {
                return
            }
            this.editCollection.save();
            this.changedModels = {};
            this.editCollection.remove(id);
        },


        checked: function (e) {
            var el = this.$el;

            if (this.collection.length > 0) {
                var checkLength = el.find("input.checkbox:checked").length;

                if (el.find("input.checkbox:checked").length > 0) {
                    // $("#top-bar-deleteBtn").show();
                    el.find('#check_all').prop('checked', false);

                    if (checkLength === this.collection.length) {
                        el.find('#check_all').prop('checked', true);
                    }
                }
                else {
                    // $("#top-bar-deleteBtn").hide();
                    el.find('#check_all').prop('checked', false);
                }
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
            this.getAutoCalcField('revenue', 'revenue', true);
            this.getAutoCalcField('cost', 'cost', true);
            this.getAutoCalcField('profit', 'profit', true);
            this.getAutoCalcField('amount', 'amount', true);
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

                rowTdVal += parseFloat(rowTd.html()) * 100;
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

            saveBtnEl.show();
            cancelBtnEl.show();

            return false;
        },

        hideGenerateCopy: function () {
            $('#top-bar-generateBtn').hide();
            $('#top-bar-copyBtn').hide();
        },

        copyRow: function (e) {
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
                var hours = model.get('worked');
                var rate = model.get('rate');
                var revenue = parseInt(hours) * parseFloat(rate);

                $(selectedWtrack).attr('checked', false);

                model.set({"isPaid": false});
                model.set({"amount": 0});
                model.set({"cost": 0});
                model.set({"revenue": revenue});
                model = model.toJSON();
                delete model._id;
                _model = new currentModel(model);

                this.showSaveCancelBtns();
                this.editCollection.add(_model);

                cid = _model.cid;

                if (!this.changedModels[cid]) {
                    this.changedModels[cid] = model;
                }

                this.$el.find('#listTable').prepend('<tr id="false" data-id="' + cid + '">' + row.html() + '</tr>');
                row = this.$el.find('#false');

                tdsArr = row.find('td');
                $(tdsArr[0]).find('input').val(cid);
                $(tdsArr[20]).find('span').text('Unpaid');
                $(tdsArr[20]).find('span').addClass('unDone');
                $(tdsArr[24]).text(0);
                $(tdsArr[22]).text(0);
                $(tdsArr[21]).text(revenue.toFixed(2));
                $(tdsArr[1]).text(cid);
            }
        },

        //checked: function (e) {
        //    var checkLength;
        //
        //    if (this.collection.length > 0) {
        //        checkLength = $("input.listCB:checked").length;
        //
        //        this.checkProjectId(e, checkLength);
        //
        //        if (checkLength > 0) {
        //            $("#deletewTrack").show();
        //            $('#check_all').prop('checked', false);
        //            if (checkLength === this.collection.length) {
        //                $('#check_all').prop('checked', true);
        //            }
        //        } else {
        //            $("#deletewTrack").hide();
        //            $('#check_all').prop('checked', false);
        //        }
        //    }
        //},


        render: function () {
            var self = this;
            var currentEl = this.$el;
            var wTracks = this.collection.toJSON();
            var allInputs;
            var checkedInputs;

            if(this.startNumber < 50) {
                currentEl.html('');
                currentEl.prepend(this.templateHeader);
            }

            currentEl.find('#listTable').html(this.template({
                wTracks: wTracks,
                startNumber: self.startNumber - 1
            }));

            if(this.startNumber < 50) {
                this.renderPagination(self.$el, self);
            }

            this.genInvoiceEl = self.$el.find('#top-bar-generateBtn');
            this.copyEl = self.$el.find('#top-bar-copyBtn');
            self.genInvoiceEl.hide();
            self.copyEl.hide();

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

                        if (checkLength === self.collection.length) {
                            //checkedInputs.each(function (index, element) {
                            //    self.checkProjectId(element, checkLength);
                            //});

                            $('#check_all').prop('checked', true);
                        }
                    } else {
                        $("#deletewTrack").hide();

                        $('#check_all').prop('checked', false);
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