define([
        'views/listViewBase',
        'text!templates/Holiday/list/ListHeader.html',
        'text!templates/Holiday/list/cancelEdit.html',
        'views/Holiday/CreateView',
        'views/Holiday/list/ListItemView',
        'models/HolidayModel',
        'collections/Holiday/filterCollection',
        'collections/Holiday/editCollection',
        'common',
        'dataService',
        'constants',
        'async',
        'moment'
    ],

    function (listViewBase, listTemplate, cancelEdit, createView, listItemView, holidayModel, holidayCollection, editCollection, common, dataService, CONSTANTS, async, moment) {
        var HolidayListView = listViewBase.extend({
            page:null,
            sort: null,
            createView              : createView,
            listTemplate            : listTemplate,
            listItemView            : listItemView,
            contentType: CONSTANTS.HOLIDAY,//needs in view.prototype.changeLocationHash
            changedModels: {},
            totalCollectionLengthUrl: '/holiday/totalCollectionLength',
            holidayId: null,
            editCollection: null,

            initialize: function (options) {
                this.startTime = options.startTime;
                this.collection = options.collection;
                _.bind(this.collection.showMore, this.collection);
                this.filter = options.filter ? options.filter : {};
                this.sort = options.sort ? options.sort : {};
                this.defaultItemsNumber = this.collection.namberToShow || 100;
                this.newCollection = options.newCollection;
                this.deleteCounter = 0;
                this.page = options.collection.page;
                this.render();
                this.getTotalLength(null, this.defaultItemsNumber, this.filter);
                this.contentCollection = holidayCollection;
            },

            events: {

                "click .checkbox": "checked",
                "click td.editable": "editRow",
                "click .oe_sortable": "goSort",
                "change .editable ": "setEditable",
                "keydown input.editing": "setChanges"
            },

            setChanges: function(e){
                if (e.which === 13) {
                    this.setChangedValueToModel();
                }
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
                    model = new holidayModel(model);
                    this.collection.add(model);
                } else {
                    this.collection.set(this.editCollection.models, { remove: false });
                }
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

            saveItem: function () {
                var model;
                var modelJSON;
                var date;

                for (var id in this.changedModels) {
                    model = this.editCollection.get(id);
                    modelJSON = model.toJSON();
                    date = new Date(modelJSON.date);
                    model.changed = this.changedModels[id];
                    model.changed.year = moment(date).year();
                    model.changed.week = moment(date).isoWeek();
                }
                this.editCollection.save();
            },

            setChangedValueToModel: function(){
                var editedElement = this.$listTable.find('.editing');
                var editedCol;
                var editedElementRowId;
                var editedElementContent;
                var editedElementValue;
                var editHolidayModel;

                if(navigator.userAgent.indexOf("Firefox") > -1) {
                    this.setEditable(editedElement);
                }

                if (editedElement.length) {
                    editedCol = editedElement.closest('td');
                    editedElementRowId = editedElement.closest('tr').data('id');
                    editedElementContent = editedCol.data('content');
                    editedElementValue = editedElement.val();

                    editHolidayModel = this.editCollection.get(editedElementRowId);

                    if (!this.changedModels[editedElementRowId]) {
                        if(!editHolidayModel.id){
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

            editRow: function (e) {
                var self = this;

                var el = $(e.target);
                var tr = $(e.target).closest('tr');
                var holidayId = tr.data('id');
                var colType = el.data('type');
                var isDTPicker = colType !== 'input' && el.prop("tagName") !== 'INPUT';
                var tempContainer;
                var width;

                if (holidayId && el.prop('tagName') !== 'INPUT') {
                    if (this.holidayId) {
                        this.setChangedValueToModel();
                    }
                    this.holidayId = holidayId;
                }


                if (isDTPicker) {
                    tempContainer = (el.text()).trim();
                    el.html('<input class="editing" type="text" value="' + tempContainer + '"  maxLength="255">');
                    $('.editing').datepicker({
                        dateFormat: "d M, yy",
                        changeMonth: true,
                        changeYear: true
                    }).addClass('datepicker');
                } else {
                    tempContainer = el.text();
                    width = el.width() - 6;
                    el.html('<input class="editing" type="text" value="' + tempContainer + '"  maxLength="255" style="width:' + width + 'px">');
                }

                return false;
            },

            setEditable: function (td) {
                var tr;

                if (!td.parents) {
                    td = $(td.target).closest('td');
                }

                tr = td.parents('tr');

                td.addClass('edited');

                if (this.isEditRows()) {
                    this.setChangedValueToModel();
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


            render: function () {
                $('.ui-dialog ').remove();
                var self = this;
                var $currentEl = this.$el;

                $currentEl.html('');
                $currentEl.append(_.template(listTemplate));
                $currentEl.append(new listItemView({
                    collection: this.collection,
                    page: this.page,
                    itemsNumber: this.collection.namberToShow
                }).render());//added two parameters page and items number

                setTimeout(function () {
                    self.editCollection = new editCollection(self.collection.toJSON());
                    self.editCollection.on('saved', self.savedNewModel, self);
                    self.editCollection.on('updated', self.updatedOptions, self);

                    self.$listTable = $('#listTable');
                }, 10);

                this.renderCheckboxes();

                this.renderPagination($currentEl, this);


                $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
            },

            renderContent: function () {
                var $currentEl = this.$el;
                var tBody = $currentEl.find('#listTable');
                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);
                tBody.empty();
                var itemView = new listItemView({
                    collection: this.collection,
                    page: $currentEl.find("#currentShowPage").val(),
                    itemsNumber: $currentEl.find("span#itemsNumber").text()
                });
                tBody.append(itemView.render());

                var pagenation = this.$el.find('.pagination');
                if (this.collection.length === 0) {
                    pagenation.hide();
                } else {
                    pagenation.show();
                }
            },

            createItem: function () {
                var now = new Date();
                var startData = {
                    date: now
                };

                var model = new holidayModel(startData, { parse: true });

                startData._id = model.cid;

                if (!this.isNewRow()) {
                    //this.showSaveCancelBtns();
                    this.editCollection.add(model);

                    new createView(startData);
                }
            },

            isNewRow: function () {
                var newRow = $('#false');

                return !!newRow.length;
            },

            deleteItemsRender: function (deleteCounter, deletePage) {
                var pagenation;
                var holder;

                dataService.getData(this.collectionLengthUrl, {
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

                holder = this.$el;

                if (deleteCounter !== this.collectionLength) {
                    var created = holder.find('#timeRecivingDataFromServer');
                    created.before(new listItemView({
                        collection: this.collection,
                        page: holder.find("#currentShowPage").val(),
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
                    mid = 39,
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
                            that.changedModels = {};;

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
                                    wait: true,
                                    success: function () {
                                        that.listLength--;
                                        localCounter++;

                                        if (index === count - 1) {
                                            that.triggerDeleteItemsRender(localCounter);
                                        }
                                    },
                                    error: function (model, res) {
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

                async.each(edited, function (el, cb) {
                    var tr = $(el).closest('tr');
                    var trId = tr.attr("id");
                    var rowNumber = tr.find('[data-content="number"]').text();
                    var id = tr.data('id');
                    var template = _.template(cancelEdit);
                    var model;

                    if (!id) {
                        return cb('Empty id');
                    }

                    model = editedCollectin.get(id);
                    model = model.toJSON();
                    model.index = rowNumber;
                    if (!trId) {
                        tr.replaceWith(template({holiday: model}));
                    } else {
                        tr.remove();
                    }
                    cb();
                }, function (err) {
                    if (!err) {
                        self.editCollection = new editCollection(collection.toJSON());
                        self.hideSaveCancelBtns();
                    }
                });
            }

        });

        return HolidayListView;
    });
