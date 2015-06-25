define([
        'text!templates/Salary/list/ListHeader.html',
        'views/Salary/list/ListItemView',
        'views/Salary/subSalary/list/ListView',
        'models/SalaryModel',
        'collections/Salary/filterCollection',
        'collections/Salary/editCollection',
        'common',
        'dataService'
    ],

    function (listTemplate, listItemView, subSalaryView, salaryModel, contentCollection, salaryEditableCollection, common, dataService) {
        var SalaryListView = Backbone.View.extend({
            el: '#content-holder',
            defaultItemsNumber: null,
            listLength: null,
            filter: null,
            sort: null,
            newCollection: null,
            page: null, //if reload page, and in url is valid page
            contentType: 'Salary',//needs in view.prototype.changeLocationHash
            viewType: 'list',//needs in view.prototype.changeLocationHash

            initialize: function (options) {
                this.startTime = options.startTime;
                this.collection = options.collection;
                this.filter = options.filter;
                this.sort = options.sort;
                this.defaultItemsNumber = this.collection.namberToShow || 50;
                this.newCollection = options.newCollection;
                this.deleteCounter = 0;
                this.page = options.collection.page;
                this.render();
                this.getTotalLength(null, this.defaultItemsNumber, this.filter);
                this.contentCollection = contentCollection;
                this.editCollection;
                this.newCollection;
            },

            events: {
                "click .itemsNumber": "switchPageCounter",
                "click .showPage": "showPage",
                "change #currentShowPage": "showPage",
                "click #previousPage": "previousPage",
                "click #nextPage": "nextPage",
                "click .mainCB": "checked",
                "click .stageSelect": "showNewSelect",
                "click td.editable": "editRow",
                "click .list tbody tr:not(.subRow, .disabled, .copy) td:not(.notForm, .editable)": "showSubSalary",
                "click #itemsButton": "itemsNumber",
                "click .currentPageList": "itemsNumber",
                "click": "hideItemsNumber",
                "click #firstShowPage": "firstPage",
                "click #lastShowPage": "lastPage",
                "click .oe_sortable": "goSort",
                "change .editable ": "setEditable"
            },

            saveItem: function () {
                var self = this;
                var modelToSave;
                var row = $('#listTable').find('tr.copy');
                var modelJSON;
                var input = row.find('input.editing');
                var month;
                var year;
                this.newCollection = new salaryEditableCollection();

                this.editCollection.each(function(model, index){
                    modelJSON = model.toJSON();
                    delete modelJSON._id;
                    month = row.find('.month').text();
                    year = row.find('.year').text();
                    modelJSON['month'] = month ? month : input.val();
                    modelJSON['year'] = year ? year : input.val();

                    modelToSave = new salaryModel(modelJSON);
                    self.newCollection.add(modelToSave);
                });

                self.newCollection.save();

                dataService.getData('/salary/recalculateSalaryCash', {}, function (response, context) {

                }, this);
            },

            setEditable: function (td) {
                var tr;

                if(!td.parents) {
                    td = $(td.target).closest('td');
                }

                tr = td.parents('tr');

                /*tr.addClass('edited');*/
                td.addClass('edited');

                if (this.isEditRows()) {
                    this.setChangedValue();
                }

                return false;
            },

            isEditRows: function () {
                var edited = $('#listTable').find('.edited');

                this.edited = edited;

                return !!edited.length;
            },

            setChangedValue: function () {
                if (!this.changed) {
                    this.changed = true;
                    this.showSaveCancelBtns()
                }
            },

            showSaveCancelBtns: function () {
                var saveBtnEl = $('#top-bar-saveBtn');
                var cancelBtnEl = $('#top-bar-deleteBtn');

                saveBtnEl.show();
                cancelBtnEl.show();

                return false;
            },

            editRow: function (e, prev, next) {
                var el = $(e.target);
                var tr = $(e.target).closest('tr');
                var tempContainer;
                var width;
                var editedElement;
                var editedCol;
                var editedElementValue;

                if (el.prop('tagName') !== 'INPUT') {
                    editedElement = $("#listTable").find('.editing');

                    if (editedElement.length) {
                        editedCol = editedElement.closest('td');
                        editedElementValue = editedElement.val();

                        editedCol.text(editedElementValue);
                        editedElement.remove();
                    }
                }


                tempContainer = el.text();
                width = el.width() - 6;
                el.html('<input class="editing" type="text" value="' + tempContainer + '"  maxLength="4" style="width:' + width + 'px">');


                return false;
            },

            fetchSortCollection: function (sortObject) {
                this.sort = sortObject;
                this.collection = new contentCollection({
                    viewType: 'list',
                    sort: sortObject,
                    page: this.page,
                    count: this.defaultItemsNumber,
                    filter: this.filter,
                    parrentContentId: this.parrentContentId,
                    contentType: this.contentType,
                    newCollection: this.newCollection
                });
                this.collection.bind('reset', this.renderContent, this);
            },

            goSort: function (e) {
                var target$ = $(e.target);
                var currentParrentSortClass = target$.attr('class');
                var sortClass = currentParrentSortClass.split(' ')[1];
                var sortConst = 1;
                var sortBy = target$.data('sort');
                var sortObject = {};

                this.collection.unbind('reset');
                this.collection.unbind('showmore');

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
                this.changeLocationHash(1, this.defaultItemsNumber);
                this.getTotalLength(null, this.defaultItemsNumber, this.filter);
            },

            hideItemsNumber: function (e) {
                $(".allNumberPerPage").hide();
                $(".newSelectList").hide();
            },

            itemsNumber: function (e) {
                $(e.target).closest("button").next("ul").toggle();
                return false;
            },

            getTotalLength: function (currentNumber, itemsNumber, filter) {
                dataService.getData('/salary/totalCollectionLength', {
                    contentType: this.contentType,
                    currentNumber: currentNumber,
                    filter: filter,
                    newCollection: this.newCollection
                }, function (response, context) {
                    var page = context.page || 1;
                    var length = context.listLength = response.count || 0;
                    if (itemsNumber * (page - 1) > length) {
                        context.page = page = Math.ceil(length / itemsNumber);
                        context.fetchSortCollection(context.sort);
                        context.changeLocationHash(page, context.defaultItemsNumber, filter);
                    }
                    context.pageElementRender(response.count, itemsNumber, page);//prototype in main.js
                }, this);
            },

            render: function () {
                $('.ui-dialog ').remove();
                var self = this;
                var currentEl = this.$el;

                currentEl.html('');
                currentEl.append(_.template(listTemplate));
                currentEl.append(new listItemView({
                    collection: this.collection,
                    page: this.page,
                    itemsNumber: this.collection.namberToShow
                }).render());//added two parameters page and items number

                $('#check_all').click(function () {
                    $('.mainCB').prop('checked', this.checked);
                    if ($("input.mainCb:checked").length > 0) {
                        $("#top-bar-deleteBtn").show();
                    }
                    else
                        $("#top-bar-deleteBtn").hide();
                });

                $("#top-bar-createBtn").hide();

                $(document).on("click", function () {
                    self.hideItemsNumber();
                });
                var pagenation = this.$el.find('.pagination');
                if (this.collection.length === 0) {
                    pagenation.hide();
                } else {
                    pagenation.show();
                }
                currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
            },

            renderContent: function () {
                var currentEl = this.$el;
                var tBody = currentEl.find('#listTable');
                $("#top-bar-deleteBtn").hide();
                $("#top-bar-createBtn").hide();
                $('#check_all').prop('checked', false);
                tBody.empty();
                var itemView = new listItemView({
                    collection: this.collection,
                    page: currentEl.find("#currentShowPage").val(),
                    itemsNumber: currentEl.find("span#itemsNumber").text()
                });
                tBody.append(itemView.render());

                var pagenation = this.$el.find('.pagination');
                if (this.collection.length === 0) {
                    pagenation.hide();
                } else {
                    pagenation.show();
                }
            },
            previousPage: function (event) {
                event.preventDefault();
                $('#check_all').prop('checked', false);
                $("#top-bar-deleteBtn").hide();
                $("#top-bar-createBtn").hide();
                this.prevP({
                    sort: this.sort,
                    filter: this.filter,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId
                });
                dataService.getData('/salary/totalCollectionLength', {
                    filter: this.filter,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId,
                    contentType: this.contentType
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },

            nextPage: function (event) {
                event.preventDefault();
                $('#check_all').prop('checked', false);
                $("#top-bar-deleteBtn").hide();
                $("#top-bar-createBtn").hide();
                this.nextP({
                    sort: this.sort,
                    filter: this.filter,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId

                });

                dataService.getData('/salary/totalCollectionLength', {
                    contentType: this.contentType,
                    filter: this.filter,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },

            firstPage: function (event) {
                event.preventDefault();
                $('#check_all').prop('checked', false);
                $("#top-bar-deleteBtn").hide();
                $("#top-bar-createBtn").hide();
                this.firstP({
                    sort: this.sort,
                    filter: this.filter,
                    newCollection: this.newCollection
                });
                dataService.getData('/salary/totalCollectionLength', {
                    contentType: this.contentType,
                    filter: this.filter,
                    newCollection: this.newCollection
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },

            lastPage: function (event) {
                event.preventDefault();
                $('#check_all').prop('checked', false);
                $("#top-bar-deleteBtn").hide();
                $("#top-bar-createBtn").hide();
                this.lastP({
                    sort: this.sort,
                    filter: this.filter,
                    newCollection: this.newCollection
                });
                dataService.getData('/salary/totalCollectionLength', {
                    contentType: this.contentType,
                    filter: this.filter,
                    newCollection: this.newCollection
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },  //end first last page in paginations

            switchPageCounter: function (event) {
                event.preventDefault();
                this.startTime = new Date();
                var itemsNumber = event.target.textContent;
                this.defaultItemsNumber = itemsNumber;
                this.getTotalLength(null, itemsNumber, this.filter);
                this.collection.showMore({
                    count: itemsNumber,
                    page: 1,
                    filter: this.filter,
                    newCollection: this.newCollection
                });
                this.page = 1;
                $("#top-bar-deleteBtn").hide();
                $("#top-bar-createBtn").hide();
                $('#check_all').prop('checked', false);
                this.changeLocationHash(1, itemsNumber, this.filter);
            },

            showFilteredPage: function () {
                var itemsNumber;

                this.startTime = new Date();
                this.newCollection = false;
                var workflowIdArray = [];
                $('.filter-check-list input:checked').each(function () {
                    workflowIdArray.push($(this).val());
                });
                this.filter = this.filter || {};
                this.filter['workflow'] = workflowIdArray;

                itemsNumber = $("#itemsNumber").text();
                $("#top-bar-deleteBtn").hide();
                $("#top-bar-createBtn").hide();
                $('#check_all').prop('checked', false);

                this.changeLocationHash(1, itemsNumber, this.filter);
                this.collection.showMore({count: itemsNumber, page: 1, filter: this.filter});
                this.getTotalLength(null, itemsNumber, this.filter);
            },

            showPage: function (event) {
                event.preventDefault();
                this.showP(event, {filter: this.filter, newCollection: this.newCollection, sort: this.sort});
            },

            showMoreContent: function (newModels) {
                var holder = this.$el;
                holder.find("#listTable").empty();
                var itemView = new listItemView({
                    collection: newModels,
                    page: holder.find("#currentShowPage").val(),
                    itemsNumber: holder.find("span#itemsNumber").text()
                });//added two parameters page and items number
                holder.append(itemView.render());

                itemView.undelegateEvents();
                var pagenation = holder.find('.pagination');
                if (newModels.length !== 0) {
                    pagenation.show();
                } else {
                    pagenation.hide();
                }
                $("#top-bar-deleteBtn").hide();
                $("#top-bar-createBtn").hide();
                $('#check_all').prop('checked', false);
                holder.find('#timeRecivingDataFromServer').remove();
                holder.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
            },

            showSubSalary: function (e) {
                e.preventDefault();
                var self = this;

                var tr = $(e.target).closest('tr');
                var id = $(tr).data("id");
                var subId ="subSalary-row" + id
                var subRowCheck = $('#' + subId);

                if (subRowCheck.length > 0) {
                    $(tr).find('.icon').html('5');
                    $(subRowCheck).remove();
                } else {
                    $(tr).find('.icon').html('2');
                    $('<tr id=' + subId + ' class="subRow">' +
                    '<td colspan="3"></td>' +
                    '<td colspan="6" id="subSalary-holder' + id + '"></td>' +
                    '<td colspan="2"></td>' +
                    '</tr>').insertAfter(tr);
                    $('#subSalary-holder' + id).append(new subSalaryView({el: '#subSalary-holder' + id, model: self.collection.get(id)}));
                }

            },

            createItem: function () {
                var checked = $("#listTable input.mainCB:checked");
                var row = checked.closest('tr');
                var id = $(row).data('id');
                var salaryModel = this.collection.get(id);
                var employeesArary = salaryModel.toJSON().employeesArray;

                this.editCollection = new salaryEditableCollection(employeesArary);

                checked[0].checked = false;

                $(row).find('.month').addClass('editable');
                $(row).find('.month').attr('data-type', 'input');

                $(row).find('.year').addClass('editable');
                $(row).find('.year').attr('data-type', 'input');
                $(row).find('.mainCB').attr('checked', 'true');
                $(row).find('.mainCB').attr('id', 'copy');

                $('#listTable').prepend('<tr data-id="false" class="copy">' + $(row).html() + '</tr>');
                $("#top-bar-createBtn").hide();

                $('#listTable').find('tr:not(.copy)').each(function (index, element) {
                    $(element).addClass('disabled');
                    $(element).find('.mainCB').attr("disabled", true);
                })

            },

            checked: function () {
                var checked = $("input.mainCB:checked");

                if (this.collection.length > 0) {
                    var checkLength = checked.length;
                    if (checkLength > 0) {
                        if (checked.length === 1 && !checked.closest('tr.copy').length) {
                            $("#top-bar-createBtn").show();
                        } else {
                            $("#top-bar-createBtn").hide();
                        }
                        $("#top-bar-deleteBtn").show();

                        if (checkLength == this.collection.length) {
                            $('#check_all').prop('checked', true);
                        }
                    }
                    else {
                        $("#top-bar-createBtn").hide();
                        $("#top-bar-deleteBtn").hide();
                        $('#check_all').prop('checked', false);
                    }
                }
            },

            deleteItemsRender: function (deleteCounter, deletePage) {
                dataService.getData('/salary/totalCollectionLength', {
                    contentType: this.contentType,
                    filter: this.filter,
                    newCollection: this.newCollection
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
                this.deleteRender(deleteCounter, deletePage, {
                    filter: this.filter,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId
                });

                var holder = this.$el;

                if (deleteCounter !== this.collectionLength) {
                    var created = holder.find('#timeRecivingDataFromServer');
                    created.before(new listItemView({
                        collection: this.collection,
                        page: holder.find("#currentShowPage").val(),
                        itemsNumber: holder.find("span#itemsNumber").text()
                    }).render());//added two parameters page and items number
                }
                var pagenation = this.$el.find('.pagination');
                if (this.collection.length === 0) {
                    pagenation.hide();
                } else {
                    pagenation.show();
                }
            },

            deleteItems: function () {
                var currentEl = this.$el;
                var that = this;
                var mid = 39;
                var salaryModel;
                var editCollection;
                var localCounter = 0;
                var count;
                this.collectionLength = this.collection.length;
                var checkedCB = $("#listTable input.mainCB:checked");
                var checkCount = checkedCB.length;
                var employeesArary;

                $("#top-bar-saveBtn").hide();

                $.each(checkedCB, function (index, checkbox) {
                    salaryModel = that.collection.get(checkbox.value);
                    employeesArary = salaryModel.toJSON().employeesArray;
                    this.editCollection = new salaryEditableCollection(employeesArary);
                    count = editCollection.length;
                    if ($(checkbox).attr("id") !== 'copy') {
                        editCollection.each(function (model) {
                            model.destroy({
                                headers: {
                                    mid: mid
                                },
                                wait: true,
                                success: function () {
                                    that.listLength--;
                                    localCounter++;

                                    if (localCounter == count) {

                                        that.deleteCounter = localCounter;
                                        that.deletePage = $("#currentShowPage").val();

                                        dataService.getData('/salary/recalculateSalaryCash', {}, function (response, context) {
                                            context.listLength = response.count || 0;
                                        }, that);

                                        that.deleteItemsRender(checkCount, that.deletePage);

                                    }
                                },
                                error: function (model, res) {
                                    if (res.status === 403 && index === 0) {
                                        alert("You do not have permission to perform this action");
                                    }
                                    that.listLength--;
                                    localCounter++;
                                    if (index == count - 1) {
                                        that.deleteCounter = localCounter;
                                        that.deletePage = $("#currentShowPage").val();
                                        that.deleteItemsRender(that.deleteCounter, that.deletePage);

                                    }

                                }
                            });
                        });
                    } else {
                        that.render();
                    };

                });
            }

        });

        return SalaryListView;
    });
