/**
 * Created by liliya on 20.10.15.
 */
define([
    'text!templates/Projects/projectInfo/orders/ListTemplate.html',
    'text!templates/Projects/projectInfo/orders/ListHeader.html',
    'text!templates/stages.html',
    'text!templates/Pagination/PaginationTemplate.html',
    'views/salesOrder/EditView',
    'views/salesOrder/list/ListView',
    'collections/Quotation/filterCollection',
    'models/QuotationModel',
    'dataService',
    'common'

], function (ListTemplate, lisHeader, stagesTemplate, paginationTemplate, editView, listView, quotationCollection, orderModel, dataService, common) {
    var orderView = listView.extend({

        el                      : '#orders',
        totalCollectionLengthUrl: '/quotation/totalCollectionLength',
        contentCollection       : quotationCollection,
        templateList            : _.template(ListTemplate),
        templateHeader          : _.template(lisHeader),

        events: {
            "click .checkbox"                    : "checked",
            "click #removeOrder"                 : "removeItems",
            "click  .list tbody td:not(.notForm)": "goToEditDialog",
            "click .stageSelect"                 : "showNewSelect",
            "mouseover .currentPageList"         : "showPagesPopup",
            "click .itemsNumber"                 : "switchPageCounter",
            "click .showPage"                    : "showPage",
            "change #currentShowPage"            : "showPage",
            "click #previousPage"                : "previousPage",
            "click #nextPage"                    : "nextPage",
            "click #firstShowPage"               : "firstPage",
            "click #lastShowPage"                : "lastPage"
        },

        initialize: function (options) {
            this.remove();
            this.collection = options.collection;
            this.projectID = options.projectId;
            this.customerId = options.customerId;
            this.projectManager = options.projectManager;
            this.filter = options.filter ? options.filter : {};
            this.defaultItemsNumber = 50;
            this.page = options.page ? options.page : 1;
            this.startNumber = options.startNumber ? options.startNumber : 1;

            if (this.startNumber < 50) {
                this.getTotalLength(null, this.defaultItemsNumber, this.filter);
            }

            this.render(options);
        },

        goToEditDialog: function (e) {
            e.preventDefault();

            var self = this;
            var tr = $(e.target).closest('tr');
            var id = tr.data("id");
            var notEditable = tr.hasClass('notEditable');
            var model = new orderModel({validate: false});

            if (notEditable){
                return false;
            }

            model.urlRoot = '/Order/form/' + id;
            model.fetch({
                data   : {contentType: this.contentType},
                success: function (model) {
                    new editView({model: model, redirect: true,  projectManager: self.projectManager});
                },
                error  : function () {
                    alert('Please refresh browser');
                }
            });
        },


        showPage: function (event) {

            event.preventDefault();
            this.showP(event, {filter: this.filter, newCollection: this.newCollection, sort: this.sort}, true);
        },

        previousPage: function (event) {

            event.preventDefault();
            $("#top-bar-deleteBtn").hide();
            $('#check_all').prop('checked', false);
            this.prevP({
                sort         : this.sort,
                filter       : this.filter,
                newCollection: this.newCollection
            }, true);
            dataService.getData(this.totalCollectionLengthUrl, {
                filter       : this.filter,
                contentType  : this.contentType,
                newCollection: this.newCollection
            }, function (response, context) {
                context.listLength = response.count || 0;
            }, this);
        },

        nextPage: function (event) {

            event.preventDefault();

            $("#top-bar-deleteBtn").hide();
            $('#check_all').prop('checked', false);

            this.nextP({
                sort         : this.sort,
                filter       : this.filter,
                newCollection: this.newCollection
            }, true);
            dataService.getData(this.totalCollectionLengthUrl, {
                filter       : this.filter,
                newCollection: this.newCollection
            }, function (response, context) {
                context.listLength = response.count || 0;
            }, this);
        },

        firstPage: function (event) {

            event.preventDefault();
            $("#top-bar-deleteBtn").hide();
            $('#check_all').prop('checked', false);
            this.firstP({
                sort         : this.sort,
                filter       : this.filter,
                newCollection: this.newCollection
            }, true);
            dataService.getData(this.totalCollectionLengthUrl, {
                sort  : this.sort,
                filter: this.filter
            }, function (response, context) {
                context.listLength = response.count || 0;
            }, this);
        },

        lastPage: function (event) {

            event.preventDefault();
            $("#top-bar-deleteBtn").hide();
            $('#check_all').prop('checked', false);
            this.lastP({
                sort         : this.sort,
                filter       : this.filter,
                newCollection: this.newCollection
            }, true);
            dataService.getData(this.totalCollectionLengthUrl, {
                sort  : this.sort,
                filter: this.filter
            }, function (response, context) {
                context.listLength = response.count || 0;
            }, this);
        },

        chooseOption: function (e) {
            var target$ = $(e.target);
            var targetElement = target$.closest("tr");
            var parentTd = target$.closest("td");
            var a = parentTd.find("a");
            var id = targetElement.attr("data-id");
            var model = this.collection.get(id);

            model.save({
                workflow: {
                    _id : target$.attr("id"),
                    name: target$.text()
                }
            }, {
                headers : {
                    mid: 55
                },
                patch   : true,
                validate: false,
                success : function () {
                    a.text(target$.text())
                }
            });

            this.hideNewSelect();
            return false;
        },

        renderContent: function () {
            var currentEl = this.$el;
            var tBody = currentEl.find('#orderTable');
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

        getTotalLength: function (currentNumber, itemsNumber, filter) {
            var self = this;

            dataService.getData(this.totalCollectionLengthUrl, {
                currentNumber: currentNumber,
                filter       : filter,
                contentType  : this.contentType,
                newCollection: this.newCollection
            }, function (response, context) {

                var page = context.page || 1;
                var length = context.listLength = response.count || 0;

                if (itemsNumber === 'all') {
                    itemsNumber = response.count;
                }

                if (itemsNumber * (page - 1) > length) {
                    context.page = page = Math.ceil(length / itemsNumber);
                    // context.fetchSortCollection(context.sort);
                    // context.changeLocationHash(page, context.defaultItemsNumber, filter);
                }

                context.pageElementRenderProject(response.count, itemsNumber, page, self);//prototype in main.js
            }, this);
        },

        renderPagination: function (currentEl, self) {
            currentEl.append(_.template(paginationTemplate));

            var pagenation = self.$el.find('.pagination');

            if (self.collection.length === 0) {
                pagenation.hide();
            } else {
                pagenation.show();
            }

            $(document).on("click", function (e) {
                self.hidePagesPopup(e);
            });
        },

        removeItems: function (event) {
            event.preventDefault();

            var answer = confirm("Really DELETE items ?!");

            var that = this;
            var mid = 39;
            var model;
            var localCounter = 0;
            var listTableCheckedInput;
            var count;
            var table = $("#ordersTable");

            listTableCheckedInput = table.find("input:not('#check_all_orders'):checked");
            count = listTableCheckedInput.length;
            this.collectionLength = this.collection.length;

            if (answer == true) {
                $.each(listTableCheckedInput, function (index, checkbox) {
                    model = that.collection.get(checkbox.value);
                    model.destroy({
                        headers: {
                            mid: mid
                        },
                        wait   : true,
                        success: function (model) {
                            var id = model.get('_id');

                            table.find('[data-id="' + id + '"]').remove();

                            //that.deleteItemsRender(that.deleteCounter, that.deletePage);
                        },
                        error  : function (model, res) {
                            if (res.status === 403 && index === 0) {
                                alert("You do not have permission to perform this action");
                            }
                            that.listLength--;
                            count--;
                            if (count === 0) {
                                that.deleteCounter = localCounter;
                                that.deletePage = $("#currentShowPage").val();
                                that.deleteItemsRender(that.deleteCounter, that.deletePage);
                            }
                        }
                    });
                });
            }

        },

        checked: function (e) {
            var el = this.$el;

            if (this.collection.length > 0) {
                var checkLength = el.find("input.checkbox:checked").length;

                if (el.find("input.checkbox:checked").length > 0) {
                    el.find("#removeOrder").show();
                    el.find('#check_all_orders').prop('checked', false);

                    if (checkLength === this.collection.length) {
                        el.find('#check_all_orders').prop('checked', true);
                    }
                }
                else {
                    el.find("#removeOrder").hide();
                    el.find('#check_all_orders').prop('checked', false);
                }
            }
        },

        hideDialog: function () {
            $(".edit-dialog").remove();
        },

        render: function (options) {
            var currentEl = this.$el;
            var self = this;
            var tabs;
            var dialogHolder;
            var n;
            var target;

            if (options && options.activeTab) {
                self.hideDialog();

                tabs = $(".chart-tabs");
                target = tabs.find('#ordersTab');

                target.closest(".chart-tabs").find("a.active").removeClass("active");
                target.addClass("active");
                n = target.parents(".chart-tabs").find("li").index(target.parent());
                dialogHolder = $(".dialog-tabs-items");
                dialogHolder.find(".dialog-tabs-item.active").removeClass("active");
                dialogHolder.find(".dialog-tabs-item").eq(n).addClass("active");
            }

            currentEl.html('');
            currentEl.prepend(this.templateHeader);

            currentEl.find('#orderTable').html(this.templateList({
                orderCollection: this.collection.toJSON(),
                startNumber    : 0,
                dateToLocal    : common.utcDateToLocaleDate
            }));

            //this.renderPagination(currentEl, this);

            this.$el.find('.fa.fa-times').hide();

            $('#check_all_orders').click(function () {
                self.$el.find(':checkbox').prop('checked', this.checked);
                if ($("input.checkbox:checked").length > 0) {
                    $("#removeOrder").show();
                } else {
                    $("#removeOrder").hide();
                }
            });

            dataService.getData("/workflow/fetch", {
                wId         : 'Sales Order',
                source      : 'purchase',
                targetSource: 'order'
            }, function (stages) {
                self.stages = stages;
            });


        }
    });

    return orderView;
});
