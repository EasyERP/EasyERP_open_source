/**
 * Created by liliya on 17.09.15.
 */

define([
    'views/customerPayments/list/ListView',
    'text!templates/Projects/projectInfo/paymentTemplate.html',
    'views/customerPayments/list/ListItemView',
    'collections/customerPayments/filterCollection',
    'collections/customerPayments/editCollection',
    'helpers',
    'common'

], function (ListView, paymentTemplate, listItemView, paymentCollection, editCollection, helpers, common) {
    var paymentView = ListView.extend({

        el               : '#payments',
        listItemView     : listItemView,
        contentCollection: paymentCollection,

        initialize: function (options) {
            this.remove();
            this.collection = options.model;
            this.filter = options.filter ? options.filter : {};

            this.render();
        },

        template: _.template(paymentTemplate),

        events: {
            "click .checkbox": "checked",
            "click #savePayment": "saveItem",
            "click #removePayment": "deleteItems"
        },

        deleteItems: function (e) {
            e.preventDefault();

            var that = this;
            var model;
            var listTableCheckedInput;
            listTableCheckedInput = $('#paymentsTable').find("input:not('#check_all_payments'):checked");

            this.collectionLength = this.collection.length;
            $.each(listTableCheckedInput, function (index, checkbox) {
                model = that.collection.get(checkbox.value);
                model.destroy({
                    wait   : true,
                    success: function (model) {
                        var id = model.get('_id');

                        that.$listTable.find('[data-id="' + id + '"]').remove();

                        $("#removePayment").hide();
                    },
                    error  : function (model, res) {
                        if (res.status === 403 && index === 0) {
                            alert("You do not have permission to perform this action");
                        }
                    }
                });
            });
        },

        saveItem: function (e) {

            e.preventDefault();

            var model;
            var modelJSON;

            this.setChangedValueToModel();

            for (var id in this.changedModels) {
                model = this.editCollection.get(id);
                modelJSON = model.toJSON();
                model.changed = this.changedModels[id];
            }
            this.editCollection.save();
            this.changedModels = {};
        },

        setChangedValueToModel: function () {
            var editedElement = this.$el.find('#listTable').find('.editing');
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

        updatedOptions: function () {
            var savedRow = this.$listTable.find('#false');
            var editedEl = savedRow.find('.editing');
            var editedCol = editedEl.closest('td');
            this.hideSaveCancelBtns();

            editedCol.text(editedEl.val());
            editedEl.remove();

            this.resetCollection();
        },

        resetCollection: function (model) {
            if (model && model._id) {
                model = new currentModel(model);
                this.collection.add(model);
            } else {
                this.collection.set(this.editCollection.models, {remove: false});
            }
        },

        renderContent: function () {
            var $currentEl = this.$el;
            var tBody = $currentEl.find("#listTable");
            var itemView;
            var pagenation;

            tBody.empty();
            $("#top-bar-deleteBtn").hide();
            $('#check_all').prop('checked', false);

            if (this.collection.length > 0) {
                itemView = new this.listItemView({
                    collection : this.collection,
                    page       : this.page,
                    itemsNumber: this.collection.namberToShow
                });
                tBody.append(itemView.render({thisEl: tBody}));
            }

            pagenation = this.$el.find('.pagination');
            if (this.collection.length === 0) {
                pagenation.hide();
            } else {
                pagenation.show();
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

        checked: function (e) {
            if (this.collection.length > 0) {
                var el = this.$el;
                var checkLength = el.find("input.checkbox:checked").length;
                var checkAll$ = el.find('#check_all_payments');
                var removeBtnEl = $('#removePayment');

                if (checkLength > 0) {
                    checkAll$.prop('checked', false);

                    removeBtnEl.show();

                    if (checkLength == this.collection.length) {

                        checkAll$.prop('checked', true);
                    }
                } else {
                    removeBtnEl.hide();
                    checkAll$.prop('checked', false);
                }
            }
        },

        hideDialog: function () {
            $(".edit-dialog").remove();
            $(".ui-dialog").remove();
            $(".add-group-dialog").remove();
            $(".add-user-dialog").remove();
            $(".crop-images-dialog").remove();
        },

        hideSaveCancelBtns: function () {
            var saveBtnEl = $('#savePayment');
            var cancelBtnEl = $('#removePayment');

            this.changed = false;

            saveBtnEl.hide();
            cancelBtnEl.hide();

            return false;
        },

        showSaveCancelBtns: function () {
            var saveBtnEl = $('#savePayment');
            var cancelBtnEl = $('#removePayment');

            saveBtnEl.show();
            //cancelBtnEl.show();

            return false;
        },

        setChangedValue: function () {
            if (!this.changed) {
                this.changed = true;
                this.showSaveCancelBtns()
            }
        },

        render: function (options) {
            var $currentEl = this.$el;
            var self = this;
            var tabs;
            var dialogHolder;
            var n;
            var target;
            var template = _.template(paymentTemplate);

            $currentEl.html('');

            if (options && options.activeTab) {
                self.hideDialog();

                tabs = $(".chart-tabs");
                target = tabs.find('#paymentsTab');

                target.closest(".chart-tabs").find("a.active").removeClass("active");
                target.addClass("active");
                n = target.parents(".chart-tabs").find("li").index(target.parent());
                dialogHolder = $(".dialog-tabs-items");
                dialogHolder.find(".dialog-tabs-item.active").removeClass("active");
                dialogHolder.find(".dialog-tabs-item").eq(n).addClass("active");
            }

            $currentEl.append(template({
                paymentCollection  : this.collection.toJSON(),
                startNumber        : 0,
                utcDateToLocaleDate: common.utcDateToLocaleDate,
                currencySplitter   : helpers.currencySplitter
            }));

            this.$el.find("#savePayment").hide();
            this.$el.find("#removePayment").hide();

            $('#check_all_payments').click(function () {
                self.$el.find(':checkbox').prop('checked', this.checked);
                if (self.$el.find("input.checkbox:checked").length > 0) {
                    self.$el.find("#removePayment").show();
                } else {
                    self.$el.find("#removePayment").hide();
                }
            });

            setTimeout(function () {
                self.editCollection = new editCollection(self.collection.toJSON());
                self.editCollection.on('updated', self.updatedOptions, self);

                self.$listTable = $('#paymentsTable');
            }, 10);

            return this;
        }
    });

    return paymentView;
});