define([
    'views/listViewBase',
    'text!templates/monthHours/list/listHeader.html',
    'views/monthHours/CreateView',
    'views/monthHours/list/ListItemView',
    'views/monthHours/EditView',
    'models/MonthHoursModel',
    'collections/monthHours/filterCollection',
    'collections/monthHours/editCollection',
    'common',
    'dataService',
    'populate',
    'async',
    'constants',
    'text!templates/monthHours/list/cancelEdit.html',
    'helpers'
], function (listViewBase, listTemplate, createView, listItemView, editView, currentModel, contentCollection, EditCollection, common, dataService, populate, async, CONSTANTS, cancelEdit, helpers) {
    var monthHoursListView = listViewBase.extend({
        createView              : createView,
        listTemplate            : listTemplate,
        listItemView            : listItemView,
        contentCollection       : contentCollection,
        contentType             : CONSTANTS.MONTHHOURS,
        responseObj             : {},
        modelId                 : null,
        totalCollectionLengthUrl: '/monthHours/list/totalCollectionLength',
        $listTable              : null,
        editCollection          : null,
        changedModels           : {},

        initialize: function (options) {
            this.startTime = options.startTime;
            this.collection = options.collection;
            this.filter = options.filter;
            this.sort = options.sort;
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.newCollection = options.newCollection;
            this.deleteCounter = 0;
            this.page = options.collection.page;
            this.render();
            this.getTotalLength(null, this.defaultItemsNumber, this.filter);
            this.contentCollection = contentCollection;
        },

        events: {
            "click .stageSelect"                                              : "showNewSelect",
            "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
            "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
            "click td.editable"                                               : "editRow",
            "click .oe_sortable"                                              : "goSort",
            "change .editable"                                                : "setEditable",
            'keydown input.editing'                                           : 'keyDown'
        },

        keyDown: function (e) {
            if (e.which === 13) {
                if (navigator.userAgent.indexOf("Firefox") > -1) {
                    this.setEditable(e);
                }

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
            var estimatedHours;
            var actualHours;

            if (editedElement.length) {
                editedCol = editedElement.closest('td');
                editedElementRowId = editedElement.closest('tr').data('id');
                editedElementContent = editedCol.data('content');
                editedElementValue = editedElement.val();

                editedElementValue = editedElementValue.replace(/\s+/g, '');

                editModel = this.editCollection.get(editedElementRowId);

                if (!this.changedModels[editedElementRowId]) {
                    this.changedModels[editedElementRowId] = {};
                }

                this.changedModels[editedElementRowId][editedElementContent] = editedElementValue;
                estimatedHours = this.changedModels[editedElementRowId].estimatedHours || editModel.get('estimatedHours');
                actualHours = this.changedModels[editedElementRowId].actualHours || editModel.get('actualHours');

                if (actualHours){
                    this.changedModels[editedElementRowId].idleHours = estimatedHours - actualHours;
                    editedElement.closest('tr').find('[data-content="idleHours"]').text(helpers.currencySplitter(this.changedModels[editedElementRowId].idleHours.toFixed()));
                }

                if (editedElementContent !== 'year'){
                    editedCol.text(helpers.currencySplitter(editedElementValue));
                } else {
                    editedCol.text(editedElementValue);
                }
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
            if (!td.parents) {
                td = $(td.target).closest('td');
            }

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
            var mothHoursId = tr.data('id');
            var colType = el.data('type');
            var isSelect = colType !== 'input' && el.prop("tagName") !== 'INPUT';
            var tempContainer;
            var width;
            var insertedInput;

            if (mothHoursId && el.prop('tagName') !== 'INPUT') {
                this.modelId = mothHoursId;
                this.setChangedValueToModel();
            }

            if (isSelect) {
                populate.showSelect(e, prev, next, this);
            } else {
                tempContainer = el.text();
                width = el.width() - 6;
                el.html('<input class="editing" type="text" value="' + tempContainer + '"  style="width:' + width + 'px">');
            }

            return false;
        },

        saveItem: function () {
            var id;
            var model;
            var filled = true;
            var vacationBudget;
            var estimatedHours;
            var adminBudget;
            var actualHours;
            var overtimeHours;
            var hoursForAdminCosts;
            var hoursForVacationCosts;
            var idleBudget;
            var hoursForIdleCosts;

            $(".editable").each(function (index, elem) {
                if (!$(elem).html()) {
                    filled = false;
                    return false;
                }
            });

            if (!filled) {
                return App.render({type: 'error', message: 'Fill all fields please'});
            }

            this.setChangedValueToModel();
            for (id in this.changedModels) {
                model = this.editCollection.get(id);
                if (model){
                    model.changed = this.changedModels[id];
                    vacationBudget = model.changed.vacationBudget || model.get('vacationBudget');
                    adminBudget = model.changed.adminBudget || model.get('adminBudget');
                    idleBudget = model.changed.idleBudget || model.get('idleBudget');
                    vacationBudget = parseFloat(vacationBudget);
                    adminBudget = parseFloat(adminBudget);
                    idleBudget = parseFloat(idleBudget);
                    estimatedHours = parseFloat(model.changed.estimatedHours || model.get('estimatedHours'));
                    actualHours = parseFloat(model.changed.actualHours || model.get('actualHours'));
                    overtimeHours = parseFloat(model.changed.overtimeHours || model.get('overtimeHours'));
                    hoursForVacationCosts = actualHours || estimatedHours;
                    hoursForAdminCosts = (actualHours + overtimeHours) || estimatedHours;
                    hoursForIdleCosts = actualHours || estimatedHours;
                    model.changed.vacationCoefficient = isFinite(vacationBudget / hoursForVacationCosts) ? vacationBudget / hoursForVacationCosts : 0;
                    model.changed.adminCoefficient = isFinite(adminBudget / hoursForAdminCosts) ? adminBudget / hoursForAdminCosts : 0;
                    model.changed.idleCoefficient = isFinite(idleBudget / hoursForIdleCosts) ? idleBudget / hoursForIdleCosts : 0;
                }
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
            this.changedModels = {};
        },

        showNewSelect: function (e, prev, next) {
            populate.showSelect(e, prev, next, this);

            return false;
        },

        hideNewSelect: function (e) {
            $(".newSelectList").remove();
        },

        render: function () {
            var self;
            var $currentEl;

            $('.ui-dialog ').remove();

            self = this;
            $currentEl = this.$el;

            $currentEl.html('');
            $currentEl.append(_.template(listTemplate));
            $currentEl.append(new listItemView({
                collection      : this.collection,
                page            : this.page,
                itemsNumber     : this.collection.namberToShow
            }).render());//added two parameters page and items number

            this.renderCheckboxes();

            this.renderPagination($currentEl, this);

            $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");

            setTimeout(function () {
                self.editCollection = new EditCollection(self.collection.toJSON());
                self.editCollection.on('saved', self.savedNewModel, self);
                self.editCollection.on('updated', self.updatedOptions, self);

                self.$listTable = $('#listTable');
            }, 10);

            return this;
        },

        setChangedValue: function () {
            if (!this.changed) {
                this.changed = true;
                this.showSaveCancelBtns();
            }
        },

        isNewRow: function () {
            var newRow = $('#false');

            return !!newRow.length;
        },

        createItem: function () {
            var startData = {};

            var model = new currentModel(startData);

            startData.cid = model.cid;

            this.showSaveCancelBtns();
            this.editCollection.add(model);

            new createView(startData);

            this.changed = true;
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
                filter          : this.filter,
                newCollection   : this.newCollection,
                parrentContentId: this.parrentContentId
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
            var $currentEl = this.$el;
            var that = this,
                mid = 68,
                model;
            var localCounter = 0;
            var count = $("#listTable input:checked").length;
            this.collectionLength = this.collection.length;

            if (!this.changed) {
                var answer = confirm("Really DELETE items ?!");
                var value;

                if (answer === true) {
                    $.each($("#listTable input:checked"), function (index, checkbox) {
                        value = checkbox.value;

                        if (value.length < 24) {
                            that.editCollection.remove(value);
                            that.editCollection.on('remove', function () {
                                this.listLength--;
                                localCounter++;

                                if (index === count - 1) {
                                    that.triggerDeleteItemsRender(localCounter);
                                }

                            }, that);
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
                                        App.render({
                                            type   : 'error',
                                            message: "You do not have permission to perform this action"
                                        });
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
                }
            } else {
                this.cancelChanges();
            }
        },

        cancelChanges: function () {
            var self = this;
            var edited = this.edited;
            var collection = this.collection;
            var copiedCreated;
            var dataId;

            async.each(edited, function (el, cb) {
                var tr = $(el).closest('tr');
                var rowNumber = tr.find('[data-content="number"]').text();
                var id = tr.attr('data-id');
                var template = _.template(cancelEdit);
                var model;

                if (id.length < 24) {
                    return cb('Empty id');
                }

                model = collection.get(id) || self.editCollection.get(id);
                model = model.toJSON();
                model.startNumber = rowNumber;
                tr.replaceWith(template({model: model}));
                cb();
            }, function (err) {
                self.hideSaveCancelBtns();
                if (!err) {
                    self.editCollection = new EditCollection(collection.toJSON());
                    self.editCollection.on('saved', self.savedNewModel, self);
                    self.editCollection.on('updated', self.updatedOptions, self);
                }
            });

            copiedCreated = this.$el.find('#false');
            dataId = copiedCreated.attr('data-id');
            this.editCollection.remove(dataId);
            delete this.changedModels[dataId];
            copiedCreated.remove();

            this.createdCopied = false;

            self.changedModels = {};
        }

    });

    return monthHoursListView;
});
