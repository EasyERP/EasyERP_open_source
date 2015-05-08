/**
 * Created by Roman on 27.04.2015.
 */
define([
    'text!templates/Product/ProductItems.html',
    'text!templates/Product/ProductInputContent.html',
    'collections/Product/products',
    'populate'
], function (productItemTemplate, ProductInputContent, productCollection, populate) {
    var ProductItemTemplate = Backbone.View.extend({
        el: '#invoiceItemsHolder',

        events: {
            'click .addProductItem': 'getProducts',
            "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
            "click .newSelectList li.miniStylePagination": "notHide",
            "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
            "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
            "click .current-selected": "showProductsSelect",
            "mouseenter .editable:not(.quickEdit), .editable .no-long:not(.quickEdit)": "quickEdit",
            "mouseleave .editable": "removeEdit",
            "click #editSpan": "editClick"
        },

        initialize: function (options) {
            var products;

            this.responseObj = {};
            this.render();

            products = new productCollection();
            products.bind('reset', function () {
                this.products = products;
                this.filterProductsForDD();
            }, this);
        },

        template: _.template(productItemTemplate),

        getProducts: function (e) {
            var target = $(e.target);
            var parrent = target.closest('tbody');
            var parrentRow = parrent.find('.productItem').last();
            var rowId = parrentRow.attr("data-id");
            var trEll = parrent.find('tr.productItem');


            if (rowId === undefined || rowId !== 'false') {
                if (!trEll.length) {
                    return parrent.prepend(_.template(ProductInputContent));
                }
                $(trEll[trEll.length - 1]).after(_.template(ProductInputContent));
            }
        },

        filterProductsForDD: function () {
            var id = '.productsDd';
            var products = this.products.toJSON();

            this.responseObj[id] = [];
            this.responseObj[id] = this.responseObj[id].concat(_.map(products, function (item) {
                return {_id: item._id, name: item.name, level: item.projectShortDesc || ""};
            }));

            $(id).text(this.responseObj[id][0].name).attr("data-id", this.responseObj[id][0]._id);

        },

        quickEdit: function (e) {
            var target = $(e.target);
            var trId = target.closest("tr");
            var tdId = target.closest("td");

            if (trId.find("#editSpan").length === 0) {
                tdId.append('<span id="editSpan" class=""><a href="javascript:;">e</a></span>');
                if (tdId.width() - 30 < tdId.find(".no-long").width()) {
                    tdId.find(".no-long").width(tdId.width() - 30);
                }
            }
        },

        removeEdit: function (e) {
            $('#editSpan').remove();
            $("td .no-long").css({width: "auto"});
        },

        editClick: function (e) {
            var parent = $(e.target).closest('td');
            var maxlength = parent.find(".no-long").attr("data-maxlength") || 32;

            e.preventDefault();

            $('.quickEdit #editInput').remove();
            $('.quickEdit #cancelSpan').remove();
            $('.quickEdit #saveSpan').remove();

            if (this.prevQuickEdit) {
                if ($('#' + this.prevQuickEdit.id).hasClass('quickEdit')) {
                    $('.quickEdit').text(this.text ? this.text : "").removeClass('quickEdit');
                }
            }


            parent.addClass('quickEdit');

            $('#editSpan').remove();
            var objIndex = parent[0].id.split('_');

            this.text = parent.text();

            parent.text('');
            parent.append('<input id="editInput" maxlength="' + maxlength + '" type="text" class="left"/>');
            $('#editInput').val(this.text);

            this.prevQuickEdit = parent;

            parent.append('<span id="saveSpan"><a href="#">c</a></span>');
            parent.append('<span id="cancelSpan"><a href="#">x</a></span>');
            parent.find("#editInput").width(parent.find("#editInput").width() - 50);
        },

        showProductsSelect: function (e, prev, next) {
            populate.showProductsSelect(e, prev, next, this);

            return false;
        },

        chooseOption: function (e) {
            var target = $(e.target);
            var parrent = target.parents("td");
            var trEl = target.parents("tr");
            var parrents = trEl.find('td');
            var _id = target.attr("id");
            var model = this.products.get(_id);
            var selectedProduct = model.toJSON();

            trEl.attr('data-id', model.id);

            parrent.find(".current-selected").text(target.text()).attr("data-id", _id);
            $(parrents[1]).text(selectedProduct.info.description || '').attr('class', 'editable');
            $(parrents[2]).find("span[data-name='" + "quantity" + "']").text(1).attr('class', 'editable');
            $(parrents[3]).text(selectedProduct.info.salePrice).attr('class', 'editable');

            $(".newSelectList").hide();

            this.calculateTotal(selectedProduct.info.salePrice);
        },

        calculateTotal: function () {
            var thisEl = this.$el;
            var totalContainer = thisEl.find('#totalAmount');
            var resultForCalculate = thisEl.find('tr.productItem');
            var total = 0;
            var totalEls = resultForCalculate.length;
            var currentEl;
            var quantity;
            var cost;

            if (totalEls) {
                for (var i = totalEls - 1; i >= 0; i--) {
                    currentEl = $(resultForCalculate[i]);
                    quantity = currentEl.find('[data-name="quantity"]').text();
                    cost = currentEl.find('[data-name="price"]').text();
                    total += (quantity * cost);
                }
            }

            totalContainer.text(total);
        },

        nextSelect: function (e) {
            this.showProductsSelect(e, false, true);
        },

        prevSelect: function (e) {
            this.showProductsSelect(e, true, false);
        },

        render: function (options) {
            this.$el.html(this.template({
                collection: this.collection,
                options: options
            }));


            return this;
        }
    });

    return ProductItemTemplate;
});