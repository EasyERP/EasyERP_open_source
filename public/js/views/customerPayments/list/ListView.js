/**
 * Created by soundstorm on 21.05.15.
 */
define([
        'views/listViewBase',
        'text!templates/supplierPayments/list/ListHeader.html',
        'text!templates/customerPayments/forWTrack/ListHeader.html',
        'views/customerPayments/list/ListItemView',
        'views/customerPayments/list/ListTotalView',
        'views/Filter/FilterView',
        'collections/customerPayments/filterCollection',
        'collections/customerPayments/editCollection',
        'models/PaymentModel',
        'dataService',
        'populate',
        'async'
    ],
    function (listViewBase, listTemplate, ListHeaderForWTrack, listItemView, listTotalView, filterView, paymentCollection, editCollection, currentModel, dataService, populate, async) {
        var PaymentListView = listViewBase.extend({

            listTemplate            : listTemplate,
            listItemView            : listItemView,
            filterView              : filterView,//if reload page, and in url is valid page
            contentType             : 'customerPayments',//needs in view.prototype.changeLocationHash
            modelId                 : null,
            $listTable              : null,
            editCollection          : null,
            totalCollectionLengthUrl: '/payment/customers/totalCollectionLength',
            changedModels           : {},
            responseObj             : {},
            template                : _.template(listTemplate),

            events: {
                "click td.editable"                                : "editRow",
                "change .editable "                                : "setEditable",
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption"
            },

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
                this.contentCollection = paymentCollection;

                this.filterView;
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

            editRow: function (e, prev, next) {
                var self = this;

                var ul;
                var el = $(e.target);
                var tr = $(e.target).closest('tr');
                var td = $(e.target).closest('td');
                var modelId = tr.data('id');
                var colType = el.data('type');
                var isDTPicker = colType !== 'input' && el.prop("tagName") !== 'INPUT' && el.data('content') === 'date';
                var tempContainer;
                var width;
                var isSelect = td.data('content') === 'workflow';

                if (modelId && el.prop('tagName') !== 'INPUT') {
                    if (this.modelId) {
                        this.setChangedValueToModel();
                    }
                    this.modelId = modelId;
                }

                if (isDTPicker) {
                    tempContainer = (el.text()).trim();
                    el.html('<input class="editing" type="text" value="' + tempContainer + '">');
                    el.find('.editing').datepicker({
                        dateFormat : "d M, yy",
                        changeMonth: true,
                        changeYear : true,
                        onChanged  : self.setChangedValue()
                    }).addClass('datepicker');
                } else if (isSelect) {
                    ul = "<ul class='newSelectList'>" + "<li data-id='Paid'>Paid</li>" + "<li data-id='Draft'>Draft</li></ul>";
                    el.append(ul);
                } else {
                    tempContainer = el.text();
                    width = el.width() - 6;
                    el.html('<input class="editing" type="text" value="' + tempContainer + '"  maxLength="255" style="width:' + width + 'px">');
                }

                return false;
            },

            setChangedValueToModel: function () {
                var editedElement = this.$listTable.find('.editing');
                var editedCol;
                var editedElementRowId;
                var editedElementContent;
                var editedElementValue;
                var editHolidayModel;

                if (editedElement.length) {
                    editedCol = editedElement.closest('td');
                    editedElementRowId = editedElement.closest('tr').data('id');
                    editedElementContent = editedCol.data('content');
                    editedElementValue = editedElement.val();

                    editHolidayModel = this.editCollection.get(editedElementRowId);

                    if (!this.changedModels[editedElementRowId]) {
                        if (!editHolidayModel.id) {
                            this.changedModels[editedElementRowId] = editHolidayModel.attributes;
                        } else {
                            this.changedModels[editedElementRowId] = {};
                        }
                    }

                    this.changedModels[editedElementRowId][editedElementContent] = editedElementValue;

                    editedCol.text(editedElementValue);
                    editedElement.remove();
                }
            },

            chooseOption: function (e) {
                var target = $(e.target);
                var targetElement = target.parents("td");
                var targetW = targetElement.find("a");
                var tr = target.parents("tr");
                var modelId = tr.data('id');
                var id = target.attr("id");
                var attr = targetElement.attr("id") || targetElement.data("content");
                var elementType = '#' + attr;
                var workflow;
                var changedAttr;

                var editModel = this.editCollection.get(modelId);

                if (!this.changedModels[modelId]) {
                    if (!editModel.id) {
                        this.changedModels[modelId] = editModel.attributes;
                    } else {
                        this.changedModels[modelId] = {};
                    }
                }

                changedAttr = this.changedModels[modelId];

                if (elementType === '#workflow') {
                    targetW.attr("class", "currentSelected");
                    changedAttr.workflow = target.text();
                    if (target.attr('data-id') === 'Paid') {
                        targetW.addClass('done');
                    } else {
                        targetW.addClass('new');
                    }
                }
                targetW.text(target.text());

                this.hideNewSelect();
                this.setEditable(targetElement);

                return false;
            },

            saveItem: function () {
                var model;
                var modelJSON;

                this.setChangedValueToModel();

                for (var id in this.changedModels) {
                    model = this.editCollection.get(id);
                    modelJSON = model.toJSON();
                    model.changed = this.changedModels[id];
                }
                this.editCollection.save();
            },

            updatedOptions: function () {
                var savedRow = this.$listTable.find('#false');
                var editedEl = savedRow.find('.editing');
                var editedCol = editedEl.closest('td');
                this.hideSaveCancelBtns();

                editedCol.text(editedEl.val());
                editedEl.remove();

                this.resetCollection();
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

            savedNewModel: function (modelObject) {
                var savedRow = this.$listTable.find('#false');
                var modelId;
                var checkbox = savedRow.find('input[type=checkbox]');
                var editedEl = savedRow.find('.editing');
                var editedCol = editedEl.closest('td');

                modelObject = modelObject.success;

                if (modelObject) {
                    modelId = modelObject._id;
                    savedRow.attr("data-id", modelId);
                    checkbox.val(modelId);
                    savedRow.removeAttr('id');
                }

                this.hideSaveCancelBtns();
                editedCol.text(editedEl.val());
                editedEl.remove();
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

            isNewRow: function () {
                var newRow = $('#false');

                return !!newRow.length;
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

            hideNewSelect: function (e) {
                $(".newSelectList").remove();
            },

            render: function (options) {
                var self;
                var currentEl;

                $('.ui-dialog ').remove();

                self = this;
                currentEl = this.$el;

                if (App.weTrack) {
                    currentEl.html('');
                    currentEl.append(_.template(ListHeaderForWTrack));
                    currentEl.append(new listItemView({
                        collection : this.collection,
                        page       : this.page,
                        itemsNumber: this.collection.namberToShow
                    }).render());
                } else {
                    currentEl.html('');
                    currentEl.append(_.template(listTemplate));
                    currentEl.append(new listItemView({
                        collection : this.collection,
                        page       : this.page,
                        itemsNumber: this.collection.namberToShow
                    }).render());
                }

                currentEl.append(new listTotalView({element: this.$el.find("#listTable"), cellSpan: 7}).render());

                this.renderCheckboxes();

                this.renderPagination(currentEl, this);

                this.renderFilter(self);

                setTimeout(function () {
                    self.editCollection = new editCollection(self.collection.toJSON());
                    self.editCollection.on('saved', self.savedNewModel, self);
                    self.editCollection.on('updated', self.updatedOptions, self);

                    self.$listTable = $('#listTable');
                }, 10);

                this.$listTable = $('#listTable');

                currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");

                return this;
            },
        });

        return PaymentListView;
    });