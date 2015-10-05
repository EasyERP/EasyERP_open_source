define([
        'views/listViewBase',
        'text!templates/Salary/list/ListHeader.html',
        'views/Salary/list/ListItemView',
        'views/Salary/subSalary/list/ListView',
        'models/SalaryModel',
        'collections/Salary/filterCollection',
        'collections/Salary/editCollection',
        'views/Filter/FilterView',
        'common',
        'dataService',
        'moment'
    ],

    function (listViewBase, listTemplate, listItemView, subSalaryView, salaryModel, contentCollection, salaryEditableCollection, filterView, common, dataService, moment) {
        var SalaryListView = listViewBase.extend({
            listTemplate     : listTemplate,
            listItemView     : listItemView,
            contentCollection: contentCollection,
            filterView       : filterView,

            contentType             : 'Salary',//need
            totalCollectionLengthUrl: '/salary/totalCollectionLength',
            page                    : null, //if reload page, and in url is valid page
            contentType             : 'Salary',//needs in view.prototype.changeLocationHash

            events: {
                "click .mainCB"                                                                  : "checked",
                "click .stageSelect"                                                             : "showNewSelect",
                "click td.editable"                                                              : "editRow",
                "click .list tbody tr:not(.subRow, .disabled, .copy) td:not(.notForm, .editable)": "showSubSalary",
                "mouseover .currentPageList": "itemsNumber",
                "click": "hideItemsNumber",
                "click #firstShowPage": "firstPage",
                "click #lastShowPage": "lastPage",
                "click .oe_sortable": "goSort",
                "change .editable ": "setEditable",
                "keydown input.editing ": "keyDown"
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
                this.editCollection;
                this.newCollection;
                this.contentCollection = contentCollection;
            },

            keyDown: function (e) {
                if (e.which === 13) {
                    var editedElement = $("#listTable").find('.editing');
                    var editedCol;
                    var editedElementValue;

                    if (editedElement.length) {
                        editedCol = editedElement.closest('td');
                        editedElementValue = editedElement.val();

                        editedCol.text(editedElementValue);
                        editedElement.remove();
                    }
                }
            },

            saveItem: function () {
                var self = this;
                var modelToSave;
                var rowCopy = $('#listTable').find('tr.copy');
                var row = rowCopy.length > 0 ? rowCopy : $('#listTable').find('tr.newRow');
                var id = row.attr('data-id');
                var modelJSON;
                var input = row.find('input.editing');
                var month;
                var year;
                var dataKey;
                var momentYear;
                var momentMonth;
                var model;

                month = row.find('.month').text();
                year = row.find('.year').text();
                month = month ? month : input.val();
                year = year ? year : input.val();
                momentYear = moment().year(year).format('YY');
                momentMonth = moment().month(month - 1).format('MMM');
                dataKey = momentMonth + "/" + momentYear;

                if (id !== 'false') {
                    model = this.collection.get(id)

                    if (model.get('newModel')) {
                        this.hideSaveCancelBtns();
                        model.set({month: month, year: year, dataKey: momentMonth + '/' + momentYear});
                    }
                }

                function save() {
                    self.newCollection = new salaryEditableCollection();

                    self.newCollection.on('saved', self.savedNewModel, self);

                    if (self.editCollection && self.editCollection.length !== 0) {

                        self.editCollection.each(function (model, index) {
                            modelJSON = model.toJSON();

                            delete modelJSON._id;
                            modelJSON['month'] = month;
                            modelJSON['year'] = year;

                            modelToSave = new salaryModel(modelJSON);
                            self.newCollection.add(modelToSave);
                        });
                    }

                    self.newCollection.save();
                }

                dataService.getData('/salary/checkDataKey', {'dataKey': dataKey}, function (response) {
                    if (!response.count) {
                        save();
                    } else {
                        alert('This month already exists!');
                    }
                });
            },

            savedNewModel: function (modelObject) {
                var savedRow = $("#listTable").find('tr[data-id="false"]');
                var modelId;
                var checkbox = savedRow.find('input.mainCB');
                var editedEl = savedRow.find('.editing');
                var editedCol = editedEl.closest('td');

                modelObject = modelObject.success;

                if (modelObject) {
                    this.collection.add(modelObject);
                    modelId = modelObject._id
                    savedRow.attr("data-id", modelId);
                    savedRow.find('.mainCB').attr('id', modelId);
                    checkbox.val(modelId);
                }
                savedRow.find('.month').removeClass('editable');
                savedRow.find('.month').attr('data-type', '');

                savedRow.find('.year').removeClass('editable');
                savedRow.find('.year').attr('data-type', '');

                savedRow.find('.mainCB').attr('checked', false);

                savedRow.removeClass('copy');

                $('#listTable').find('tr:not(.copy)').each(function (index, element) {
                    $(element).removeClass('disabled');
                    $(element).find('.mainCB').attr("disabled", false);
                })

                this.hideSaveCancelBtns();

                editedCol.text(editedEl.val());
                editedEl.remove();
            },

            hideSaveCancelBtns: function () {
                var saveBtnEl = $('#top-bar-saveBtn');
                var cancelBtnEl = $('#top-bar-deleteBtn');

                this.changed = false;

                saveBtnEl.hide();
                cancelBtnEl.hide();

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

            hideNewSelect: function () {
                $(".newSelectList").remove();
            },

            render: function () {
                $('.ui-dialog ').remove();
                var self = this;
                var currentEl = this.$el;
                var date = new Date();
                var year = moment(date).format('YYYY');
                var subYear = moment(date).format('YY');
                var month = moment(date).format('M');
                var subMonth = moment(date).format('MMM');
                var model = {};

                currentEl.html('');
                currentEl.append(_.template(listTemplate));

                if (this.collection.length === 0) {
                    model = {
                        month: month,
                        year: year,
                        dataKey: subMonth + '/' + subYear,
                        calc: {
                            onCard: 0,
                            onCash: 0,
                            salary: 0
                        },
                        paid: {
                            onCard: 0,
                            onCash: 0
                        },
                        diff: {
                            onCard: 0,
                            onCash: 0,
                            total: 0
                        },
                        employeesArray: []
                    };

                    model = new salaryModel(model);
                    model.set({_id: model.cid});
                    model.set({newModel: true});

                    this.collection.set([model]);
                }

                currentEl.append(new listItemView({
                    collection: this.collection,
                    page: this.page,
                    itemsNumber: this.collection.namberToShow,
                }).render());

                $('#check_all').click(function () {
                    $('.mainCB').prop('checked', this.checked);
                    if ($("input.mainCb:checked").length > 0) {
                        $("#top-bar-deleteBtn").show();
                    }
                    else {
                        $("#top-bar-deleteBtn").hide();
                    }
                });

                $("#top-bar-createBtn").hide();

                $(document).on("click", function (e) {
                    self.hideNewSelect();
                });

                this.renderPagination(currentEl, this);
              //  this.renderFilter(self);

                currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
            },

            showSubSalary: function (e) {
                e.preventDefault();
                var self = this;

                var tr = $(e.target).closest('tr');
                var id = $(tr).attr("data-id");
                var subId = "subSalary-row" + id
                var subRowCheck = $('#' + subId);
                var icon = $(tr).find('.icon');

                if (icon.html() === '-') {
                    icon.html('5');
                    $(subRowCheck).hide();
                } else {
                    icon.html('-');
                    if (subRowCheck.length === 0) {
                        $('<tr id=' + subId + ' class="subRow">' +
                            '<td colspan="3"></td>' +
                            '<td colspan="6" id="subSalary-holder' + id + '"></td>' +
                            '<td colspan="2"></td>' +
                            '</tr>').insertAfter(tr);
                        $('#subSalary-holder' + id).append(new subSalaryView({
                            el   : '#subSalary-holder' + id,
                            model: self.collection.get(id)
                        }));
                    } else {
                        subRowCheck.show();
                    }
                }

            },

            createItem: function () {
                var checked = $("#listTable input.mainCB:checked");
                var row = checked.closest('tr');
                var id = $(row).attr('data-id');
                var salaryModel = this.collection.get(id);
                var employeesArary = salaryModel.toJSON().employeesArray;

                this.editCollection = new salaryEditableCollection(employeesArary);

                checked[0].checked = false;

                $('#listTable').prepend('<tr data-id="false" class="copy greenAlarm">' + $(row).html() + '</tr>');

                row = $("#listTable .copy");

                $(row).find('.month').addClass('editable');
                $(row).find('.month').attr('data-type', 'input');

                $(row).find('.year').addClass('editable');
                $(row).find('.year').attr('data-type', 'input');
                $(row).find('.mainCB').attr('checked', 'true');
                $(row).find('.mainCB').attr('id', 'copy');
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
                        } else {
                            $('#check_all').prop('checked', false);
                        }
                    }
                    else {
                        $("#top-bar-createBtn").hide();
                        $("#top-bar-deleteBtn").hide();
                        $('#check_all').prop('checked', false);
                    }
                }
            },

            triggerDeleteItemsRender: function (deleteCounter) {
                this.deleteCounter = deleteCounter;
                this.deletePage = $("#currentShowPage").val();
            },

            deleteItems: function () {
                var that = this;
                var mid = 39;
                var localCounter = 0;
                this.collectionLength = this.collection.length;
                var checkedCB = $("#listTable input.mainCB:checked");
                var checkCount = checkedCB.length;

                var value;
                var model;

                $("#top-bar-saveBtn").hide();

                $.each(checkedCB, function (index, checkbox) {
                    if ($(checkbox).attr("id") !== 'copy') {
                        value = checkbox.value;

                        model = that.collection.get(value);

                        model.destroy({
                            headers: {
                                mid  : mid,
                                month: model.get('month'),
                                year : model.get('year')
                            },
                            wait   : true,
                            success: function () {
                                that.listLength--;
                                localCounter++;

                                $('#listTable').find(checkbox)
                                    .closest('tr')
                                    .html('');

                                /*if (index === checkCount - 1) {
                                    that.triggerDeleteItemsRender(localCounter);
                                }*/
                            },
                            error  : function (model, res) {
                                if (res.status === 403 && index === 0) {
                                    alert("You do not have permission to perform this action");
                                }
                                that.listLength--;
                                localCounter++;
                                if (index == checkCount - 1) {
                                    if (index === checkCount - 1) {
                                        that.triggerDeleteItemsRender(localCounter);
                                    }
                                }
                            }
                        });
                    } else {
                        $('#listTable').find('.copy')
                            .html('');
                        that.hideSaveCancelBtns();
                        $('#listTable').find('tr:not(.copy)').each(function (index, element) {
                            $(element).removeClass('disabled');
                            $(element).find('.mainCB').attr("disabled", false);
                        })
                    }
                    ;
                });
            }
        });

        return SalaryListView;
    });
