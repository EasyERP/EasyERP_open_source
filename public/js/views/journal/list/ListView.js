define([
        'jQuery',
        'Underscore',
        'views/listViewBase',
        'views/selectView/selectView',
        'text!templates/journal/list/cancelEdit.html',
        'text!templates/journal/list/ListHeader.html',
        'text!templates/journal/list/ListTemplate.html',
        'views/journal/list/ListItemView',
        'views/journal/CreateView',
        'models/JournalModel',
        'collections/journal/filterCollection',
        'collections/journal/editCollection',
        'dataService',
        'async',
        'custom'
    ],

    function ($, _, listViewBase, selectView, cancelEdit, listHeaderTemplate, listTemplate, listItemView, createView, currentModel, contentCollection, EditCollection, dataService, async, custom) {
        "use strict";

        var ListView = listViewBase.extend({
            createView              : createView,
            listTemplate            : listTemplate,
            listItemView            : listItemView,
            contentCollection       : contentCollection,
            totalCollectionLengthUrl: '/journal/totalCollectionLength',
            contentType             : 'journal',
            changedModels           : {},
            responseObj             : {},

            initialize: function (options) {
                $(document).off("click");

                this.startTime = options.startTime;
                this.collection = options.collection;
                _.bind(this.collection.showMore, this.collection);
                this.defaultItemsNumber = this.collection.namberToShow || 100;
                this.newCollection = options.newCollection;
                this.page = options.collection.page;

                this.render();
                this.contentCollection = contentCollection;
            },

            events: {
                "click td.editable"                                : "editRow",
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "change .editable"                                 : "setEditable",
                "click .checkbox"                                  : "checked",
                "keydown input.editing "                           : "keyDown"
            },

            keyDown: function (e) {
                if (e.which === 13) {
                    this.setChangedValueToModel();
                }
            },

            deleteItems: function () {
                var self = this;
                var mid = 82;
                var model;
                var localCounter = 0;
                var count = $("#listTable input:checked").length;

                this.collectionLength = this.collection.length;

                if (!this.changed) {
                    var answer = confirm("Really DELETE items ?!");
                    var value;

                    if (answer === true) {
                        $.each($("#listTable input:checked"), function (index, checkbox) {
                            value = checkbox.value;

                            model = self.collection.get(value) || self.editCollection.get(value);
                            model.destroy({
                                headers: {
                                    mid: mid
                                },
                                wait   : true,
                                success: function () {
                                    self.listLength--;
                                    localCounter++;

                                    delete self.changedModels[value];

                                    if (index === count - 1) {
                                        self.deleteItemsRender(localCounter);
                                    }
                                },
                                error  : function (model, res) {
                                    if (res.status === 403 && index === 0) {
                                        App.render({
                                            type   : 'error',
                                            message: "You do not have permission to perform this action"
                                        });
                                    }
                                    self.listLength--;
                                    localCounter++;
                                    if (index == count - 1) {
                                        if (index === count - 1) {
                                            self.deleteItemsRender(localCounter);
                                        }
                                    }

                                }
                            });
                        });
                    }
                } else {
                    this.cancelChanges();
                }
            },

            deleteItemsRender: function (deleteCounter) {
                var holder;
                var template = _.template(listTemplate);

                holder = this.$el;

                if (deleteCounter !== this.collectionLength) {
                    holder.find('#listTable').html(template({
                        collection: this.collection.toJSON()
                    }));
                }

                this.editCollection.reset(this.collection.models);

                this.hideSaveCancelBtns();
            },

            cancelChanges: function () {
                var self = this;
                var edited = this.edited;
                var collection = this.collection;
                var createItem;
                var dataId;

                async.each(edited, function (el, cb) {
                    var tr = $(el).closest('tr');
                    var rowNumber = tr.find('[data-content="number"]').text();
                    var id = tr.attr('data-id');
                    var template = _.template(cancelEdit);
                    var model;

                    if (!id) {
                        return cb('Empty id');
                    }

                    model = collection.get(id);
                    model = model.toJSON();
                    model.startNumber = rowNumber;
                    tr.replaceWith(template({journal: model}));

                    delete self.changedModels[id];

                    cb();
                }, function (err) {
                    if (!err) {
                        self.bindingEventsToEditedCollection(self);
                        self.hideSaveCancelBtns();
                    }
                });

                if (this.createdItem) {
                    createItem = this.$el.find('#false');
                    dataId = createItem.data('id');
                    this.editCollection.remove(dataId);
                    delete this.changedModels[dataId];
                    createItem.remove();

                    this.createdItem = false;
                }
            },

            showSaveCancelBtns: function () {
                var createBtnEl = $('#top-bar-createBtn');
                var saveBtnEl = $('#top-bar-saveBtn');
                var cancelBtnEl = $('#top-bar-deleteBtn');

                if (this.changed) {
                    createBtnEl.hide();
                }
                saveBtnEl.show();
                cancelBtnEl.show();

                return false;
            },

            hideSaveCancelBtns: function () {
                var createBtnEl = $('#top-bar-createBtn');
                var saveBtnEl = $('#top-bar-saveBtn');
                var cancelBtnEl = $('#top-bar-deleteBtn');

                this.changed = false;

                saveBtnEl.hide();
                cancelBtnEl.hide();
                createBtnEl.show();

                return false;
            },

            hideSaveCancelButtons: function () {
                var saveBtn = $("#top-bar-saveBtn");
                var cancelBtn = $("#top-bar-deleteBtn");

                saveBtn.hide();
                cancelBtn.hide();
            },

            isNewRow: function () {
                var newRow = $('#false');

                return !!newRow.length;
            },

            bindingEventsToEditedCollection: function (context) {
                if (context.editCollection) {
                    context.editCollection.unbind();
                }
                context.editCollection = new EditCollection(context.collection.toJSON());
                context.editCollection.on('saved', context.savedNewModel, context);
                context.editCollection.on('updated', context.updatedOptions, context);
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

            checked: function () {
                var checkLength;
                var newRows = this.$listTable.find('#false');

                if (newRows.length) {
                    return false;
                }

                if (this.collection.length > 0) {
                    checkLength = $("input.listCB:checked").length;

                    if (checkLength > 0) {
                        if (!this.changed) {
                            $("#top-bar-deleteBtn").show();
                            $("#top-bar-createBtn").hide();
                        }
                        $('#check_all').prop('checked', false);
                        if (checkLength === this.collection.length) {
                            $('#check_all').prop('checked', true);
                        }
                    } else {
                        if (!this.changed) {
                            $("#top-bar-deleteBtn").hide();
                            $("#top-bar-createBtn").show();
                        }
                        $('#check_all').prop('checked', false);
                    }
                }
            },

            createItem: function () {
                var startData = {};
                var model = new currentModel(startData);

                startData.cid = model.cid;

                if (!this.isNewRow()) {
                    this.showSaveCancelBtns();
                    this.editCollection.add(model);

                    new createView(startData);
                }

                this.changed = true;
                this.createdItem = true;
            },

            editRow: function (e) {
                $(".newSelectList").hide();
                var el = $(e.target);
                var tr = $(e.target).closest('tr');
                var trId = tr.data('id');
                var colType = el.data('type');
                var isSelect = colType !== 'input' && el.prop("tagName") !== 'INPUT';
                var tempContainer;
                var width;

                if (trId && el.prop('tagName') !== 'INPUT') {
                    this.modelId = trId;
                    this.setChangedValueToModel();
                }

                if (isSelect) {
                    this.showNewSelect(e);
                } else {
                    tempContainer = el.text();
                    width = el.width() - 6;
                    el.html('<input class="editing" type="text" value="' + tempContainer + '"  style="width:' + width + 'px">');
                }

                return false;
            },

            setEditable: function (td) {

                if (!td.parents) {
                    td = $(td.target).closest('td');
                }

                td.addClass('edited');

                if (this.isEditRows()) {
                    this.setChangedValue();
                }

                return false;
            },

            setChangedValue: function () {
                if (!this.changed) {
                    this.changed = true;
                    this.showSaveCancelBtns();
                }
            },

            isEditRows: function () {
                var edited = this.$listTable.find('.edited');

                this.edited = edited;

                return !!edited.length;
            },

            setChangedValueToModel: function () {
                var editedElement = this.$listTable.find('.editing');
                var editedCol;
                var editedElementRowId;
                var editedElementContent;
                var editedElementValue;

                if (editedElement.length) {
                    editedCol = editedElement.closest('td');
                    editedElementRowId = editedElement.closest('tr').data('id');
                    editedElementContent = editedCol.data('content');
                    editedElementValue = editedElement.val();

                    if (!this.changedModels[editedElementRowId]) {
                        this.changedModels[editedElementRowId] = {};
                    }

                    this.changedModels[editedElementRowId][editedElementContent] = editedElementValue;

                    if (editedElementContent === 'code') {
                        editedElementValue = parseInt(editedElementValue);

                        if (isNaN(editedElementValue)) {
                            editedCol.addClass('errorContent');
                            editedElementValue = '';
                        } else {
                            editedCol.removeClass('errorContent');
                        }
                    }

                    this.changedModels[editedElementRowId][editedElementContent] = editedElementValue;

                    editedCol.text(editedElementValue);
                    editedElement.remove();
                }
            },

            renderContent: function () {
                var currentEl = this.$el;
                var template = _.template(listTemplate);
                var tBody = currentEl.find('#listTable');

                tBody.empty();

                if (this.collection.length > 0) {
                    this.$el.find('#listTable').html(template({
                        collection: this.collection.toJSON()
                    }));
                }
            },

            saveItem: function () {
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

                for (var id in this.changedModels) {
                    delete this.changedModels[id];
                }

                this.editCollection.remove(id);
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

            errorFunction: function () {
                App.render({
                    type   : 'error',
                    message: "Some error"
                });
            },

            chooseOption: function (e) {
                var target = $(e.target);
                var targetElement = target.parents("td");
                var tr = target.parents("tr");
                var id = target.attr("id");
                var modelId = tr.attr('data-id');
                var attr = targetElement.data("content");
                var elementType = '#' + attr;
                var changedAttr;

                var element = _.find(this.responseObj[elementType], function (el) {
                    return el._id === id;
                });

                var editModel = this.editCollection.get(modelId) || this.collection.get(modelId);

                if (!this.changedModels[modelId]) {
                    if (!editModel.id) {
                        this.changedModels[modelId] = editModel.attributes;
                    } else {
                        this.changedModels[modelId] = {};
                    }
                }

                changedAttr = this.changedModels[modelId];

                if (attr === 'transaction') {
                    changedAttr.transaction = target.text();
                } else if (attr === 'debitAccount') {
                    changedAttr.debitAccount = element._id;
                } else if (attr === 'creditAccount') {
                    changedAttr.creditAccount = element._id;
                }

                targetElement.text(target.text());

                this.hideNewSelect();
                this.setEditable(targetElement);

                return false;
            },

            showNewSelect: function (e, prev, next) {
                //populate.showSelect(e, prev, next, this);

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

            hideNewSelect: function () {
                this.$el.find('.newSelectList').hide();
            },

            render: function () {
                var $currentEl;
                var itemView;
                var self = this;

                $('.ui-dialog ').remove();

                $('#top-bar-deleteBtn').hide();

                var template = _.template(listTemplate);
                $currentEl = this.$el;

                $currentEl.html('');
                $currentEl.html(_.template(listHeaderTemplate));
                $currentEl.find('#itemTable').html(template({
                    collection: this.collection.toJSON()
                }));

                this.hideSaveCancelButtons();

                itemView = new listItemView({
                    collection : this.collection,
                    itemsNumber: this.collection.namberToShow
                });
                itemView.bind('incomingStages', this.pushStages, this);

                $currentEl.append(itemView.render());//added two parameters page and items number

                this.renderCheckboxes();

                $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");

                dataService.getData("/chartOfAccount/getForDd", {accountType: "Debit"}, function (debitAccount) {
                    debitAccount = _.map(debitAccount.data, function (debit) {
                        debit.name = debit.name;
                        debit._id = debit._id;
                        return debit;
                    });
                    self.responseObj['#debitAccount'] = debitAccount;
                });

                dataService.getData("/chartOfAccount/getForDd", {accountType: "Credit"}, function (creditAccount) {
                    creditAccount = _.map(creditAccount.data, function (debit) {
                        debit.name = debit.name;
                        debit._id = debit._id;
                        return debit;
                    });
                    self.responseObj['#creditAccount'] = creditAccount;
                });

                this.responseObj['#transaction'] = [{
                    _id : 'Invoice',
                    name: 'Invoice'
                }, {
                    _id : 'Payment',
                    name: 'Payment'
                }];

                setTimeout(function () {
                    self.editCollection = new EditCollection(self.collection.toJSON());
                    self.editCollection.on('saved', self.savedNewModel, self);
                    self.editCollection.on('error', self.errorFunction, self);
                    self.editCollection.on('updated', self.updatedOptions, self);

                    self.$listTable = $currentEl.find('#listTable');
                }, 10);

            }

        });

        return ListView;
    });
