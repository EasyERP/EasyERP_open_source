/**
 * Created by Liliya_Pikiner on 7/1/2015.
 */
define([
        'text!templates/Pagination/PaginationTemplate.html',
        'text!templates/bonusType/list/listHeader.html',
        'text!templates/bonusType/cancelEdit.html',
        'views/bonusType/CreateView',
        'views/bonusType/list/ListItemView',
        'views/bonusType/EditView',
        'models/bonusTypeModel',
        'collections/bonusType/filterCollection',
        'collections/bonusType/editCollection',
        'common',
        'dataService',
        'populate',
        'async',
        'constants',
        'helpers/keyCodeHelper'
    ],

    function (paginationTemplate, listTemplate, cancelEdit, createView, listItemView, editView, currentModel, contentCollection, EditCollection, common, dataService, populate, async, constants, keyCodes) {
        var bonusTypeListView = Backbone.View.extend({
            el                 : '#content-holder',
            defaultItemsNumber : null,
            listLength         : null,
            filter             : null,
            sort               : null,
            newCollection      : null,
            page               : null,
            contentType        : constants.BONUSTYPE,
            viewType           : 'list',
            responseObj        : {},
            modelId            : null,
            collectionLengthUrl: '/bonusType/list/totalCollectionLength',
            $listTable         : null,
            editCollection     : null,
            changedModels      : {},

            initialize: function (options) {
                this.startTime = options.startTime;
                this.collection = options.collection;
                this.filter = options.filter;
                this.sort = options.sort;
                this.defaultItemsNumber = this.collection.numberToShow || 100;
                this.newCollection = options.newCollection;
                this.deleteCounter = 0;
                this.page = options.collection.page;
                this.render();
                this.getTotalLength(null, this.defaultItemsNumber, this.filter);
                this.contentCollection = contentCollection;
            },

            events: {
                "click .itemsNumber"                                              : "switchPageCounter",
                "click .showPage"                                                 : "showPage",
                "change #currentShowPage"                                         : "showPage",
                "click #previousPage"                                             : "previousPage",
                "click #nextPage"                                                 : "nextPage",
                "click .checkbox"                                                 : "checked",
                "click .stageSelect"                                              : "showNewSelect",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
                "click td.editable"                                               : "editRow",
                "mouseover .currentPageList"                                      : "itemsNumber",
                "click"                                                           : "hideItemsNumber",
                "click #firstShowPage"                                            : "firstPage",
                "click #lastShowPage"                                             : "lastPage",
                "click .oe_sortable"                                              : "goSort",
                "change .editable "                                               : "setEditable",
                'keydown input.editing'                                           : 'keyDown',
                "click .newSelectList li:not(.miniStylePagination)"               : "chooseOption"
            },

            keyDown: function (e) {
                if (e.which === 13) {
                    this.setChangedValueToModel();
                }
            },

            setChangedValueToModel: function () {
                var editedElement = this.$listTable.find('.editing');
                var editedCol;
                var editedElementRowId;
                var editedElementContent;
                var editedElementValue;
                var editModel;

                if (navigator.userAgent.indexOf("Firefox") > -1) {
                    this.setEditable(editedElement);
                }

                if (editedElement.length) {
                    editedCol = editedElement.closest('td');
                    editedElementRowId = editedElement.closest('tr').data('id');
                    editedElementContent = editedCol.data('content');
                    editedElementValue = editedElement.val();

                    if (!this.changedModels[editedElementRowId]) {
                        this.changedModels[editedElementRowId] = {};
                    }
                    this.changedModels[editedElementRowId][editedElementContent] = editedElementValue;

                    editedCol.text(editedElementValue);
                    editedElement.remove();
                }
            },

            nextSelect: function (e) {
                this.showNewSelect(e, false, true);
            },

            prevSelect: function (e) {
                this.showNewSelect(e, true, false);
            },

            setEditable: function (td) {
                var tr;

                if (!td.parents) {
                    td = $(td.target).closest('td');
                }

                tr = td.parents('tr');
                td.addClass('edited');

                if (this.isEditRows()) {
                    this.setChangedValue();
                }

                return false;
            },

            isEditRows: function () {
                var edited = this.$listTable.find('.edited');

                this.edited = edited;

                return !!edited.length;
            },

            editRow: function (e, prev, next) {
                $(".newSelectList").hide();
                var el = $(e.target);
                var tr = $(e.target).closest('tr');
                var Ids = tr.data('id');
                var colType = el.data('type');
                var isSelect = colType !== 'input' && el.prop("tagName") !== 'INPUT';
                var prevValue;
                var width;

                if (Ids && el.prop('tagName') !== 'INPUT') {
                    if (this.Ids) {
                        editedElement = this.$listTable.find('.editing');
                        this.setChangedValueToModel();
                    }
                    this.modelId = Ids;
                    this.setChangedValueToModel();
                }

                if (isSelect) {
                    var ul = "<ul class='newSelectList'>" + "<li data-id='HR'>HR</li>" + "<li data-id='Sales'>Sales</li>" +
                        "<li data-id='PM'>PM</li>" + "<li data-id='Developer'>Developer</li></ul>";
                    el.append(ul);
                } else {
                    prevValue = el.text();
                    width = el.width() - 6;
                    el.html('<input class="editing" type="text" value="' + prevValue + '"   style="width:' + width + 'px">');
                    el.find('.editing').on('keydown', function (e) {
                        if (!keyCodes.isDigit(e.keyCode) && !keyCodes.isBackspace(e.keyCode)) {
                            e.preventDefault();
                        }
                    })
                }

                return false;
            },

            chooseOption: function (e) {
                var target = $(e.target);
                var targetElement = target.parents("td");
                this.setEditable(targetElement);
                var tr = target.parents("tr");
                var modelId = tr.data('id');
                var id = targetElement.attr("id");
                var model = this.collection.get(modelId);
                var changedAttr;
                var bonusType;

                if (!this.changedModels[modelId]) {
                    if (!model.id) {
                        this.changedModels[modelId] = model.attributes;
                    } else {
                        this.changedModels[modelId] = {};
                    }
                }

                targetElement.text(target.text());

                changedAttr = this.changedModels[modelId];
                targetElement.attr('data-id', id);
                bonusType = target.text();
                changedAttr.bonusType = bonusType;

                this.hideNewSelect();
                // this.setChangedValueToModel();
                this.setEditable(targetElement);

                return false;
            },

            saveItem: function () {
                var model;

                this.setChangedValueToModel();
                for (var id in this.changedModels) {
                    model = this.editCollection.get(id);
                    model.changed = this.changedModels[id];
                }
                this.editCollection.save();
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
                this.resetCollection(modelObject);
            },

            resetCollection: function (model) {
                if (model && model._id) {
                    model = new currentModel(model);
                    this.collection.add(model);
                } else {
                    this.collection.set(this.editCollection.models, {remove: false});
                }
            },

            updatedOptions: function () {
                this.hideSaveCancelBtns();
                this.resetCollection();
            },

            fetchSortCollection: function (sortObject) {
                this.sort = sortObject;
                this.collection = new contentCollection({
                    viewType       : 'list',
                    sort           : sortObject,
                    page           : this.page,
                    count          : this.defaultItemsNumber,
                    filter         : this.filter,
                    parentContentId: this.parentContentId,
                    contentType    : this.contentType,
                    newCollection  : this.newCollection
                });
                this.collection.bind('reset', this.renderContent, this);
                this.collection.bind('showmore', this.showMoreContent, this);
            },

            goSort: function (e) {
                if (this.isNewRow()) {
                    return false;
                }
                var target$ = $(e.target);
                var currentParentSortClass = target$.attr('class');
                var sortClass = currentParentSortClass.split(' ')[1];
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
                var el = e.target;

                this.$el.find(".allNumberPerPage, .newSelectList").hide();
                if (!el.closest('.search-view')) {
                    $('.search-content').removeClass('fa-caret-up');
                }
                ;
            },

            showNewSelect: function (e, prev, next) {
                populate.showSelect(e, prev, next, this);
                return false;
            },

            hideNewSelect: function (e) {
                $(".newSelectList").remove();
            },

            itemsNumber: function (e) {
                $(e.target).closest("button").next("ul").toggle();
                return false;
            },

            getTotalLength: function (currentNumber, itemsNumber, filter) {
                dataService.getData(this.collectionLengthUrl, {
                    currentNumber: currentNumber,
                    filter       : filter,
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
                        context.changeLocationHash(page, context.defaultItemsNumber, filter);
                    }

                    context.pageElementRender(response.count, itemsNumber, page);//prototype in main.js
                }, this);
            },

            render: function () {
                $('.ui-dialog ').remove();
                var self = this;
                var currentEl = this.$el;
                var pagenation;

                currentEl.html('');
                currentEl.append(_.template(listTemplate));
                currentEl.append(new listItemView({
                    collection : this.collection,
                    page       : this.page,
                    itemsNumber: this.collection.numberToShow
                }).render());//added two parameters page and items number

                $(document).on("click", function (e) {
                    self.hideItemsNumber(e);
                });

                $('#check_all').click(function () {
                    $(':checkbox').prop('checked', this.checked);
                    if ($("input.checkbox:checked").length > 0) {
                        $("#top-bar-deleteBtn").show();
                    } else {
                        $("#top-bar-deleteBtn").hide();
                    }
                });

                currentEl.append(_.template(paginationTemplate));

                pagenation = this.$el.find('.pagination');

                if (this.collection.length === 0) {
                    pagenation.hide();
                } else {
                    pagenation.show();
                }

                currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");

                setTimeout(function () {
                    self.editCollection = new EditCollection(self.collection.toJSON());
                    self.editCollection.on('saved', self.savedNewModel, self);
                    self.editCollection.on('updated', self.updatedOptions, self);

                    self.$listTable = $('#listTable');
                }, 10);

                this.createBtnEl = $('#top-bar-createBtn');
                this.saveBtnEl = $('#top-bar-saveBtn');
                this.cancelBtnEl = $('#top-bar-deleteBtn');

                return this;
            },

            setChangedValue: function () {
                if (!this.changed) {
                    this.changed = true;
                    this.showSaveCancelBtns()
                }
            },

            renderContent: function () {
                var currentEl = this.$el;
                var tBody = currentEl.find('#listTable');
                var itemView;
                var pagenation;

                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);

                tBody.empty();

                itemView = new listItemView({
                    collection : this.collection,
                    page       : currentEl.find("#currentShowPage").val(),
                    itemsNumber: currentEl.find("span#itemsNumber").text()
                });

                tBody.append(itemView.render());

                pagenation = this.$el.find('.pagination');

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

                this.prevP({
                    sort           : this.sort,
                    filter         : this.filter,
                    newCollection  : this.newCollection,
                    parentContentId: this.parentContentId
                });
                dataService.getData(this.collectionLengthUrl, {
                    filter         : this.filter,
                    newCollection  : this.newCollection,
                    parentContentId: this.parentContentId
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },

            nextPage: function (event) {
                event.preventDefault();
                $('#check_all').prop('checked', false);
                $("#top-bar-deleteBtn").hide();
                this.nextP({
                    sort           : this.sort,
                    filter         : this.filter,
                    newCollection  : this.newCollection,
                    parentContentId: this.parentContentId

                });

                dataService.getData(this.collectionLengthUrl, {
                    filter         : this.filter,
                    newCollection  : this.newCollection,
                    parentContentId: this.parentContentId
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },

            firstPage: function (event) {
                event.preventDefault();
                $('#check_all').prop('checked', false);
                $("#top-bar-deleteBtn").hide();
                this.firstP({
                    sort         : this.sort,
                    filter       : this.filter,
                    newCollection: this.newCollection
                });
                dataService.getData(this.collectionLengthUrl, {
                    filter       : this.filter,
                    newCollection: this.newCollection
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },

            lastPage: function (event) {
                event.preventDefault();
                $('#check_all').prop('checked', false);
                $("#top-bar-deleteBtn").hide();
                this.lastP({
                    sort         : this.sort,
                    filter       : this.filter,
                    newCollection: this.newCollection
                });
                dataService.getData(this.collectionLengthUrl, {
                    filter       : this.filter,
                    newCollection: this.newCollection
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },

            switchPageCounter: function (event) {
                event.preventDefault();
                this.startTime = new Date();
                var itemsNumber = event.target.textContent;

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
                this.changeLocationHash(1, itemsNumber, this.filter);
            },

            showFilteredPage: function () {
                var itemsNumber;
                var workflowIdArray = [];

                this.startTime = new Date();
                this.newCollection = false;

                $('.filter-check-list input:checked').each(function () {
                    workflowIdArray.push($(this).val());
                });

                this.filter = this.filter || {};
                this.filter['workflow'] = workflowIdArray;

                itemsNumber = $("#itemsNumber").text();
                $("#top-bar-deleteBtn").hide();
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
                var itemView;
                var pagenation;

                holder.find("#listTable").empty();
                itemView = new listItemView({
                    collection : newModels,
                    page       : holder.find("#currentShowPage").val(),
                    itemsNumber: holder.find("span#itemsNumber").text()
                });

                holder.append(itemView.render());
                itemView.undelegateEvents();
                pagenation = holder.find('.pagination');

                if (newModels.length !== 0) {
                    pagenation.show();
                } else {
                    pagenation.hide();
                }

                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);

                holder.find('#timeRecivingDataFromServer').remove();
                holder.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
            },

            isNewRow: function () {
                var newRow = $('#false');

                return !!newRow.length;
            },

            createItem: function () {
                var startData = {};

                var model = new currentModel(startData);

                startData.cid = model.cid;

                //if (!this.isNewRow()) {
                this.showSaveCancelBtns();
                this.editCollection.add(model);

                new createView(startData);
                // }
            },

            showSaveCancelBtns: function () {

                this.cancelBtnEl.prop('title', 'Cancel changes');
                if (!this.changed) {
                    this.createBtnEl.hide();
                }
                this.saveBtnEl.show();
                this.cancelBtnEl.show();

                return false;
            },

            hideSaveCancelBtns: function () {

                this.changed = false;

                this.saveBtnEl.hide();
                this.cancelBtnEl.hide();
                this.createBtnEl.show();

                return false;
            },

            checked: function () {
                if (this.collection.length > 0) {
                    var checkLength = $("input.checkbox:checked").length;

                    if ($("input.checkbox:checked").length > 0) {
                        $("#top-bar-deleteBtn").show();
                        $('#check_all').prop('checked', false);

                        if (checkLength == this.collection.length) {
                            $('#check_all').prop('checked', true);
                        }
                    } else {
                        $("#top-bar-deleteBtn").hide();
                        $('#check_all').prop('checked', false);
                    }
                }
            },

            deleteItemsRender: function (deleteCounter, deletePage) {
                var pagenation;
                var holder;

                dataService.getData(this.collectionLengthUrl, {
                    filter       : this.filter,
                    newCollection: this.newCollection
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
                this.deleteRender(deleteCounter, deletePage, {
                    filter         : this.filter,
                    newCollection  : this.newCollection,
                    parentContentId: this.parentContentId
                });

                holder = this.$el;

                if (deleteCounter !== this.collectionLength) {
                    var created = holder.find('#timeRecivingDataFromServer');
                    created.before(new listItemView({
                        collection : this.collection,
                        page       : holder.find("#currentShowPage").val(),
                        itemsNumber: holder.find("span#itemsNumber").text()
                    }).render());//added two parameters page and items number
                }

                pagenation = this.$el.find('.pagination');

                if (this.collection.length === 0) {
                    pagenation.hide();
                } else {
                    pagenation.show();
                }

                this.editCollection.reset(this.collection.models);
            },

            triggerDeleteItemsRender: function (deleteCounter) {
                this.deleteCounter = deleteCounter;
                this.deletePage = $("#currentShowPage").val();
                this.deleteItemsRender(deleteCounter, this.deletePage);
            },

            deleteItems: function () {
                var currentEl = this.$el;
                var that = this,
                    mid = 72,
                    model;
                var localCounter = 0;
                var checkboxes$ = $("#listTable").find('input:checked');
                var isObjectId = function (stringValue) {
                    return stringValue.length === 24
                };
                var count = checkboxes$.length;

                this.collectionLength = this.collection.length;

                if (!this.changed) {
                    var answer = confirm("Really DELETE items ?!");
                    var value;

                    $.each(checkboxes$, function (index, checkbox) {
                        value = checkbox.value;

                        if (!isObjectId(value)) {

                            that.listLength--;
                            localCounter++;

                            that.createBtnEl.show();
                            that.saveBtnEl.hide();

                            if (index === count - 1) {
                                that.triggerDeleteItemsRender(localCounter);
                            }

                        } else {

                            model = that.collection.get(value);
                            model.destroy({
                                headers: {
                                    mid: mid
                                },
                                wait   : true,
                                success: function () {
                                    that.listLength--;
                                    localCounter++;

                                    if (index === count - 1) {
                                        that.triggerDeleteItemsRender(localCounter);
                                    }
                                },
                                error  : function (model, res) {
                                    if (res.status === 403 && index === 0) {
                                        alert("You do not have permission to perform this action");
                                    }
                                    that.listLength--;
                                    localCounter++;
                                    if (index == count - 1) {
                                        if (index === count - 1) {
                                            that.triggerDeleteItemsRender(localCounter);
                                        }
                                    }

                                }
                            });
                        }
                    });

                } else {
                    this.cancelChanges();
                }
            },

            cancelChanges: function () {
                var self = this;
                var edited = this.edited;
                var collection = this.collection;

                async.each(edited, function (el, cb) {
                    var tr = $(el).closest('tr');
                    var rowNumber = tr.find('[data-content="number"]').text();
                    var id = tr.data('id');
                    var template = _.template(cancelEdit);
                    var model;

                    if (!id) {
                        return cb('Empty id');
                    }

                    model = collection.get(id);
                    model = model.toJSON();
                    model.startNumber = rowNumber;
                    tr.replaceWith(template({model: model}));
                    cb();
                }, function (err) {
                    if (!err) {
                        self.editCollection = new EditCollection(collection.toJSON());
                        self.hideSaveCancelBtns();
                    }
                });
            }

        });

        return bonusTypeListView;
    });

