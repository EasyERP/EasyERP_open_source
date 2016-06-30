define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Product/thumbnails/ThumbnailsItemTemplate.html',
    'views/thumbnailsViewBase',
    'views/Product/EditView',
    'views/Product/CreateView',
    'dataService',
    'models/ProductModel',
    'common',
    'constants'
], function (Backbone, $, _, thumbnailsItemTemplate, BaseView, EditView, CreateView, dataService, CurrentModel, common, CONSTANTS) {
    var ProductThumbnalView = BaseView.extend({
        el         : '#content-holder',
        template   : _.template(thumbnailsItemTemplate),
        contentType: 'Products',
        hasAlphabet : true,
        
        initialize: function (options) {
            $(document).off('click');

            this.EditView = EditView;
            this.CreateView = CreateView;

            _.bind(this.collection.showMoreAlphabet, this.collection);

            this.allAlphabeticArray = common.buildAllAphabeticArray();
            this.filter = options.filter;

            this.asyncLoadImgs(this.collection);

            BaseView.prototype.initialize.call(this, options);
        },

        events: {
            'click #showMore'           : 'showMore',
            'click .thumbnailwithavatar': 'gotoEditForm',
            'click .letter:not(.empty)' : 'alpabeticalRender',
            'click .saveFilterButton'   : 'saveFilter',
            'click .removeFilterButton' : 'removeFilter'
        },

        asyncLoadImgs: function (collection) {
            var ids = _.map(collection.toJSON(), function (item) {
                return item._id;
            });
            common.getImages(ids, '/products/getProductsImages');
        },

        render: function () {
            var $currentEl = this.$el;

            $currentEl
                .find('#thumbnailContent')
                .append(this.template({collection: this.collection.toJSON()}));

            return this;
        },

        gotoEditForm: function (e) {
            this.$el.delegate('a', 'click', function (e) {
                e.stopPropagation();
                e.default;
            });
            var clas = $(e.target).parent().attr("class");
            if ((clas === "dropDown") || (clas === "inner")) {
            } else {
                e.preventDefault();
                var id = $(e.target).closest('.thumbnailwithavatar').attr("id");
                var model = new currentModel({validate: false});
                model.urlRoot = '/Product/form/';
                model.fetch({
                    data   : {id: id},
                    success: function (model) {
                        new editView({model: model});
                    },
                    error  : function () {
                        App.render({
                            type   : 'error',
                            message: "Please refresh browser"
                        });
                    }
                });
            }
        },

        showMore: function (event) {
            event.preventDefault();
            this.collection.showMore({filter: this.filter, newCollection: this.newCollection});
        },

        showMoreContent: function (newModels) {
            var holder = this.$el;
            var content = holder.find("#thumbnailContent");
            var showMore = holder.find('#showMoreDiv');
            var created = holder.find('#timeRecivingDataFromServer');
            this.defaultItemsNumber += newModels.length;
            this.changeLocationHash(null, (this.defaultItemsNumber < 100) ? 100 : this.defaultItemsNumber, this.filter);
            this.getTotalLength(this.defaultItemsNumber, this.filter);

            if (showMore.length != 0) {
                showMore.before(this.template({collection: this.collection.toJSON()}));
                $(".filter-check-list").eq(1).remove();

                showMore.after(created);
            } else {
                content.html(this.template({collection: this.collection.toJSON()}));

            }
            this.asyncLoadImgs(newModels);

            this.filterView.renderFilterContent();
        },

        showMoreAlphabet: function (newModels) {
            var holder = this.$el;
            var created = holder.find('#timeRecivingDataFromServer');
            var showMore = holder.find('#showMoreDiv');

            this.defaultItemsNumber += newModels.length;

            this.changeLocationHash(null, (this.defaultItemsNumber < 100) ? 100 : this.defaultItemsNumber, this.filter);
            this.getTotalLength(this.defaultItemsNumber, this.filter);

            holder.append(this.template({collection: newModels.toJSON()}));
            holder.append(created);
            created.before(showMore);

            this.asyncLoadImgs(newModels);
        },

        createItem: function () {
            new createView();
        },

        exportToCsv: function () {
            //todo change after routes refactoring
            window.location = '/Product/exportToCsv'
        },

        exportToXlsx: function () {
            //todo change after routes refactoring
            window.location = '/Product/exportToXlsx'
        }

    });

    return ProductThumbnalView;
});