/**
 * Created by soundstorm on 21.05.15.
 */
define([
        'text!templates/supplierPayments/list/ListHeader.html',
        'text!templates/customerPayments/forWTrack/ListHeader.html',
        'views/customerPayments/list/ListItemView',
        'views/customerPayments/list/ListTotalView',
        'views/customerPayments/EditView',
        'views/customerPayments/CreateView',
        'collections/customerPayments/filterCollection',
        'collections/customerPayments/editCollection',
        'models/PaymentModel',
        'dataService',
        'populate'
    ],
    function (listTemplate, ListHeaderForWTrack, listItemView, listTotalView, EditView, CreateView, paymentCollection, editCollection, currentModel, dataService, populate) {
        var PaymentListView = Backbone.View.extend({
            el: '#content-holder',
            defaultItemsNumber: null,
            listLength: null,
            filter: null,
            sort: null,
            newCollection: null,
            page: null, //if reload page, and in url is valid page
            contentType: 'customerPayments',//needs in view.prototype.changeLocationHash
            viewType: 'list',//needs in view.prototype.changeLocationHash
            modelId: null,
            $listTable: null,
            editCollection: null,
            changedModels: {},

            events: {
                "click .itemsNumber": "switchPageCounter",
                "click .showPage": "showPage",
                "change #currentShowPage": "showPage",
                "click #previousPage": "previousPage",
                "click #nextPage": "nextPage",
                "click .checkbox": "checked",
                "click .stageSelect": "showNewSelect",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
                "click #itemsButton": "itemsNumber",
                "click .currentPageList": "itemsNumber",
                "click": "hideItemsNumber",
                "click #firstShowPage": "firstPage",
                "click #lastShowPage": "lastPage",
                "click .oe_sortable": "goSort",
                'click .data div': 'showDatepicker',
                'click .editable': 'showDatepicker',
                'keydown input.editing': 'keyDown',
                'onSelect .data div': 'onSelect',
            },

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
                this.contentCollection = paymentCollection;
            },

            showDatepicker: function (e) {
                var target = $(e.target);
                var parent = $(e.target).parent('td');
                var datePicker = parent.find('input');

                target.hide();
                datePicker.show();

                this.showSaveCancelBtns();
            },


            isEditRows: function () {
                var edited = this.$listTable.find('.edited');

                this.edited = edited;

                return !!edited.length;
            },

            keyDown: function (e) {
                if (e.which === 13) {
                    this.setChangedValueToModel();
                }
            },

            setChangedValueToModel: function () {
                var editedElement = this.$listTable.find('.editable');
                var editedCol;
                var editedElementRowId;
                var editedElementContent;
                var editedElementValue;
                var editModel;

                if (editedElement.length) {
                    editedCol = editedElement.closest('td');
                    editedElementRowId = editedElement.closest('tr').data('id');
                    editedElementContent = editedCol.data('content');
                    editedElementValue = editedElement.val();

                    editModel = this.editCollection.get(editedElementRowId);

                    if (!this.changedModels[editedElementRowId]) {
                        this.changedModels[editedElementRowId] = {};
                    }
                    this.changedModels[editedElementRowId][editedElementContent] = editedElementValue;
                    editedCol.text(editedElementValue);
                    //editedElement.remove();
                }
            },


            setDatepicker: function (id) {
                var self = this;
                var date  = '#' + id + 'date';

                $(date).datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true,
                    onSelect: function () {
                        var startDate = $(self.$el).find(date).datepicker('getDate');
                        var parrent = $(date).parent('td');
                        var value = $(self.$el).find(date).val();

                        parrent.find('div').html(value).show();
                        $(date).hide();
                }
                });
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

            updatedOptions: function () {
                this.hideSaveCancelBtns();
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

            createItem: function () {
                var startData = {};

                var model = new currentModel(startData);

                startData.cid = model.cid;

                if (!this.isNewRow()) {
                    this.showSaveCancelBtns();
                    this.editCollection.add(model);

                    new createView(startData);
                }
            },



            template: _.template(listTemplate),

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


            showPage: function (event) {
                event.preventDefault();
                this.showP(event,{filter: this.filter, newCollection: this.newCollection,sort: this.sort});
            },

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
                $('#check_all').prop('checked', false);
                this.changeLocationHash(1, itemsNumber, this.filter);
            },

            previousPage: function (event) {
                event.preventDefault();
                $('#check_all').prop('checked', false);
                $("#top-bar-deleteBtn").hide();
                this.prevP({
                    sort: this.sort,
                    filter: this.filter,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId
                });
                dataService.getData('/supplierPayments/totalCollectionLength', {
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
                this.nextP({
                    sort: this.sort,
                    filter: this.filter,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId

                });

                dataService.getData('/payment/customers/totalCollectionLength', {
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
                this.firstP({
                    sort: this.sort,
                    filter: this.filter,
                    newCollection: this.newCollection
                });
                dataService.getData('/payment/customers/totalCollectionLength', {
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
                this.lastP({
                    sort: this.sort,
                    filter: this.filter,
                    newCollection: this.newCollection
                });
                dataService.getData('/payment/customers/totalCollectionLength', {
                    contentType: this.contentType,
                    filter: this.filter,
                    newCollection: this.newCollection
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },  //end first last page in paginations

            checked: function () {
                if (this.collection.length > 0) {
                    var checkLength = $("input.checkbox:checked").length;
                    if ($("input.checkbox:checked").length > 0) {
                        $("#top-bar-deleteBtn").show();
                        if (checkLength == this.collection.length) {
                            $('#check_all').prop('checked', true);
                        }
                    }
                    else {
                        $("#top-bar-deleteBtn").hide();
                        $('#check_all').prop('checked', false);
                    }
                }
            },

            itemsNumber: function (e) {
                $(e.target).closest("button").next("ul").toggle();
                return false;
            },

            hideItemsNumber: function (e) {
                $(".allNumberPerPage").hide();
                $(".newSelectList").hide();
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

            fetchSortCollection: function (sortObject) {
                this.sort = sortObject;
                this.collection = new paymentCollection({
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

            getTotalLength: function (currentNumber, itemsNumber,filter) {
                dataService.getData('/payment/customers/totalCollectionLength', {
                    contentType: this.contentType,
                    currentNumber: currentNumber,
                    filter: filter,
                    newCollection: this.newCollection
                }, function (response, context) {
                    var page;
                    var length;

                    if(!response.error) {

                        page = context.page || 1;
                        length = context.listLength = response.count || 0;

                        if (itemsNumber * (page - 1) > length) {
                            context.page = page = Math.ceil(length / itemsNumber);
                            context.fetchSortCollection(context.sort);
                            context.changeLocationHash(page, context.defaultItemsNumber, filter);
                        }
                        context.pageElementRender(response.count, itemsNumber, page);//prototype in main.js
                    }
                }, this);
            },

            showMoreContent: function (newModels) {
                var holder = this.$el;
                var itemView;
                var pagenation;

                holder.find("#listTable").empty();
                itemView = new listItemView({
                    collection: newModels,
                    page: holder.find("#currentShowPage").val(),
                    itemsNumber: holder.find("span#itemsNumber").text()
                });//added two parameters page and items number

                holder.append(itemView.render());

                holder.append(new listTotalView({element: holder.find("#listTable"), cellSpan:7}).render());

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

            renderContent: function () {
                var currentEl = this.$el;
                var tBody = currentEl.find('#listTable');
                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);
                tBody.empty();
                var itemView = new listItemView({ collection: this.collection,page: currentEl.find("#currentShowPage").val(), itemsNumber: currentEl.find("span#itemsNumber").text() });
                tBody.append(itemView.render());

                currentEl.append(new listTotalView({element: tBody, cellSpan:7}).render());

                var pagenation = this.$el.find('.pagination');
                if (this.collection.length === 0) {
                    pagenation.hide();
                } else {
                    pagenation.show();
                }
            },

            render: function (options) {
                $('.ui-dialog ').remove();

                var self = this;
                var currentEl = this.$el;

                if (App.currentDb === 'weTrack'){
                    currentEl.html('');
                    currentEl.append(_.template(ListHeaderForWTrack));
                    currentEl.append(new listItemView({
                        collection: this.collection,
                        page: this.page,
                        itemsNumber: this.collection.namberToShow
                    }).render());
                } else {
                    currentEl.html('');
                    currentEl.append(_.template(listTemplate));
                    currentEl.append(new listItemView({
                        collection: this.collection,
                        page: this.page,
                        itemsNumber: this.collection.namberToShow
                    }).render());
                }

                currentEl.append(new listTotalView({element: this.$el.find("#listTable"), cellSpan: 7}).render());

                $('#check_all').click(function () {
                    $(':checkbox').prop('checked', this.checked);
                    if ($("input.checkbox:checked").length > 0)
                        $("#top-bar-deleteBtn").show();
                    else
                        $("#top-bar-deleteBtn").hide();
                });

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

                setTimeout(function () {
                    self.editCollection = new editCollection(self.collection.toJSON());
                    self.editCollection.on('saved', self.savedNewModel, self);
                    self.editCollection.on('updated', self.updatedOptions, self);

                    self.$listTable = $('#listTable');
                }, 10);

                this.$listTable = $('#listTable');

                this.collection.forEach(function(payment){
                    self.setDatepicker(payment.id);
                });
                return this;
            }
        });

        return PaymentListView;
    });