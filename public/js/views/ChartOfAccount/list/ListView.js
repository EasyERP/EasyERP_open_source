/**
 * Created by lilya on 27/11/15.
 */
define([
        'text!templates/ChartOfAccount/list/ListHeader.html',
        'text!templates/ChartOfAccount/list/ListTemplate.html',
        'text!templates/ChartOfAccount/list/cancelEdit.html',
        'views/ChartOfAccount/CreateView',
        'collections/ChartOfAccount/filterCollection',
        'collections/ChartOfAccount/editCollection',
        'models/chartOfAccount',
        "populate",
        "async"
    ],
    function (listHeaderTemplate, listTemplate, cancelEdit, createView, contentCollection, EditCollection, currentModel, populate, async) {
        var ProjectsListView = Backbone.View.extend({
            el           : '#content-holder',
            contentType  : "ChartOfAccount",
            changedModels: {},

            events: {
                "click .oe_sortable"    : "goSort",
                "click td.editable"     : "editRow",
                "change .editable"      : "setEditable",
                "click .checkbox"       : "checked",
                "keydown input.editing ": "keyDown"
            },

            initialize: function (options) {

                this.collection = options.collection;

                this.render();
            },

            keyDown: function (e) {
                if (e.which === 13) {
                    this.setChangedValueToModel();
                }
            },

            deleteItems: function () {
                var that = this;
                var mid = 82;
                var model;
                var localCounter = 0;
                var count = $("#chartOfAccount input:checked").length;

                this.collectionLength = this.collection.length;

                if (!this.changed) {
                    var answer = confirm("Really DELETE items ?!");
                    var value;

                    if (answer === true) {
                        $.each($("#chartOfAccount input:checked"), function (index, checkbox) {
                            value = checkbox.value;

                            model = that.collection.get(value) ? that.collection.get(value) : that.editCollection.get(value);
                            model.destroy({
                                headers: {
                                    mid: mid
                                },
                                wait   : true,
                                success: function () {
                                    that.listLength--;
                                    localCounter++;

                                    if (index === count - 1) {
                                        that.deleteItemsRender(localCounter);
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
                                            that.deleteItemsRender(localCounter);
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
                    holder.find('#chartOfAccount').html(template({
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
                    tr.replaceWith(template({chart: model}));
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

                if (newRows.length){
                    return false;
                }

                if (this.collection.length > 0) {
                    checkLength = $("input.listCB:checked").length;

                    if (checkLength > 0) {
                        $("#top-bar-deleteBtn").show();
                        $('#check_all').prop('checked', false);
                        if (checkLength === this.collection.length) {
                            $('#check_all').prop('checked', true);
                        }
                    } else {
                        $("#top-bar-deleteBtn").hide();
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

            showSaveCancelBtns: function () {
                var createBtnEl = $('#top-bar-createBtn');
                var saveBtnEl = $('#top-bar-saveBtn');
                var cancelBtnEl = $('#top-bar-deleteBtn');

                if (!this.changed) {
                    createBtnEl.hide();
                }
                saveBtnEl.show();
                cancelBtnEl.show();

                return false;
            },

            editRow: function (e, prev, next) {
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

                tempContainer = el.text();
                width = el.width() - 6;
                el.html('<input class="editing" type="text" value="' + tempContainer + '"  style="width:' + width + 'px">');

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
                    this.showSaveCancelBtns()
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

                    if (editedElementContent === '_id'){
                        editedElementValue = parseInt(editedElementValue);

                        if (isNaN(editedElementValue)){
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

            goSort: function (e) {
                var target$;
                var currentParrentSortClass;
                var sortClass;
                var sortConst;
                var sortBy;
                var sortObject;

                this.collection.unbind('reset');
                this.collection.unbind('showmore');

                target$ = $(e.target).closest('th');
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
                this.hideSaveCancelBtns();
            },

            fetchSortCollection: function (sortObject) {
                this.sort = sortObject;
                this.collection = new contentCollection({
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

            renderContent: function () {
                var currentEl = this.$el;
                var template = _.template(listTemplate);
                var tBody = currentEl.find('#chartOfAccount');

                tBody.empty();

                if (this.collection.length > 0) {
                    this.$el.find('#chartOfAccount').html(template({
                        collection: this.collection.toJSON()
                    }));
                }
            },

            hideSaveCancelButtons: function () {
                var saveBtn = $("#top-bar-saveBtn");
                var cancelBtn = $("#top-bar-deleteBtn");

                saveBtn.hide();
                cancelBtn.hide();
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

            render: function () {
                var self = this;
                var currentEl;
                var template = _.template(listTemplate);
                currentEl = this.$el;

                currentEl.html('');
                currentEl.html(_.template(listHeaderTemplate));
                currentEl.find('#chartOfAccount').html(template({
                    collection: this.collection.toJSON()
                }));

                this.hideSaveCancelButtons();

                $('#check_all').click(function () {
                    $(':checkbox').prop('checked', this.checked);
                    if ($("input.checkbox:checked").length > 0) {
                        $("#top-bar-deleteBtn").show();
                    } else {
                        $("#top-bar-deleteBtn").hide();
                    }
                });

                setTimeout(function () {
                    self.editCollection = new EditCollection(self.collection.toJSON());
                    self.editCollection.on('saved', self.savedNewModel, self);
                    self.editCollection.on('updated', self.updatedOptions, self);

                    self.$listTable = currentEl.find('#chartOfAccount');
                }, 10);

                return this;
            }
        });

        return ProjectsListView;
    });
