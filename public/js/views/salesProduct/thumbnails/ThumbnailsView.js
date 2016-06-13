define([
    'Backbone',
    'jQuery',
    'Underscore',
    'thumbnailsViewBase',
    'text!templates/Product/thumbnails/ThumbnailsItemTemplate.html',
    'views/Product/EditView',
    'views/Product/CreateView',
    'dataService',
    'models/ProductModel',
    'views/Filter/FilterView',
    'common',
    'text!templates/Alpabet/AphabeticTemplate.html',
    'constants'
], function (Backbone, $, _, BaseView, thumbnailsItemTemplate, EditView, CreateView, dataService, currentModel, filterView, common, AphabeticTemplate, CONSTANTS) {
    var ProductThumbnalView = BaseView.extend({
        el                : '#content-holder',
        countPerPage      : 0,
        template          : _.template(thumbnailsItemTemplate),
        defaultItemsNumber: null,
        listLength        : null,
        filter            : null,
        newCollection     : null,
        contentType       : CONSTANTS.SALESPRODUCT,
        viewType          : 'thumbnails',

        initialize: function (options) {
            $(document).off('click');

            this.EditView = EditView;
            this.CreateView = CreateView;

            _.bind(this.collection.showMoreAlphabet, this.collection);
            this.allAlphabeticArray = common.buildAllAphabeticArray();

            this.asyncLoadImgs(this.collection);
            this.stages = [];

            BaseView.prototype.initialize.call(this, options);

            this.filter = options.filter || {};
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
            common.getImages(ids, '/product/getProductsImages');
        },

        render: function () {
            var self = this;
            var $currentEl = this.$el;
            var createdInTag = '<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>';

            $currentEl.html('');

            this.renderAlphabeticalFilter();

            $currentEl.append(this.template({collection: this.collection.toJSON()}));

            $currentEl.append(createdInTag);

            $(document).on('click', function (e) {
                self.hideItemsNumber(e);
            });

            self.filterView = new filterView({contentType: self.contentType});

            self.filterView.bind('filter', function (filter) {
                self.showFilteredPage(filter);
            });
            self.filterView.bind('defaultFilter', function () {
                self.showFilteredPage({});
            });

            self.filterView.render();

            return this;
        },

        gotoForm: function (e) {
            var id;

            e.preventDefault();
            App.ownContentType = true;
            id = $(e.target).closest('.thumbnailwithavatar').attr('id');
            window.location.hash = '#easyErp/product/form/' + id;
        },

        /*  gotoEditForm: function (e) {
         var clas;

         this.$el.delegate('a', 'click', function (e) {
         e.stopPropagation();
         e.default;
         });
         clas = $(e.target).parent().attr('class');
         if ((clas === 'dropDown') || (clas === 'inner')) {
         } else {
         e.preventDefault();
         var id = $(e.target).closest('.thumbnailwithavatar').attr('id');
         var model = new currentModel({validate: false});
         model.urlRoot = '/product/form/';
         model.fetch({
         data   : {id: id},
         success: function (model) {
         new editView({model: model});
         },
         error  : function () {
         App.render({
         type   : 'error',
         message: 'Please refresh browser'
         });
         }
         });
         }
         },*/

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
            return new CreateView({contentType: this.contentType});
        },

        exportToCsv: function () {
            window.location = '/Product/exportToCsv';
        },

        exportToXlsx: function () {
            window.location = '/Product/exportToXlsx';
        }
    });

    return ProductThumbnalView;
});
