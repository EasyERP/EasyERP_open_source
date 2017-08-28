define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'views/dashboards/CreateView',
    'views/dashboards/EditView',
    'views/guideTours/listView',
    'views/guideTours/guideNotificationView',
    'dataService',
    'text!templates/dashboards/index.html'
], function (Backbone, $, _, Parent, CreateView, EditView, GuideTours, GuideNotify, dataService, mainTemplate) {
    'use strict';

    var ContentView = Parent.extend({
        contentType: 'reports',
        actionType : 'Content',
        CreateView : CreateView,
        EditView   : EditView,
        template   : _.template(mainTemplate),
        el         : '#content-holder',
        responseObj: {},

        initialize: function (options) {
            var collectionJson;

            this.startTime = options.startTime;
            this.collection = options.collection;
            collectionJson = this.collection.toJSON();

            this.model = collectionJson.length ? collectionJson[0] : {};

            this.render();

            if (App.guide) {
                if (App.notifyView) {
                    App.notifyView.undelegateEvents();
                    App.notifyView.stopListening();
                }
                App.notifyView = new GuideNotify({e: null, data: App.guide});
            }
        },

        events: {
            'click .mainSettings :not(.favourite, .editRow, .deleteRow)': 'chooseDetails',
            'click .mainList'                                           : 'renderChildElements',
            'click .editRow'                                            : 'editItem',
            'click .deleteRow'                                          : 'deleteItem',
            'click .favourite'                                          : 'checkFavourite'
        },

        editItem: function (e) {
            var $elem = $(e.target);
            var modelKey = $elem.closest('#parentEl').find('#tabList').find('.active').attr('id');
            var itemId = $elem.closest('.mainSettings').attr('id');
            var isPrivate = $elem.closest('.mainSettings').hasClass('private');
            var foundedArr = this.model[modelKey];

            var foundedObj = _.find(foundedArr, function (o) {
                return o._id === itemId;
            });

            e.stopPropagation();

            if (isPrivate) {

                if (foundedObj.createdBy.user !== App.currentUser._id) {
                    return App.render({type: 'error', message: 'Permission denied. It\'s private dashboard'});
                }
            }

            return new this.EditView({model: foundedObj, collection: this.collection});
        },

        checkFavourite: function (e) {
            var $target = $(e.target).closest('.favourite');
            var id = $target.closest('tr').attr('id');
            var favorite = true;

            e.stopPropagation();

            if ($target.hasClass('icon-star2')) {
                favorite = false;
            }

            dataService.patchData('/dashboards/' + id, {favorite: favorite}, function (err) {
                if (!err) {
                    if ($target.hasClass('icon-star2')) {
                        $target.removeClass('icon-star2');
                        $target.addClass('icon-star');

                        return false;
                    }

                    $target.removeClass('icon-star');
                    $target.addClass('icon-star2');
                }
            });
        },

        chooseDetails: function (e) {
            var $elem = $(e.target);
            var rowId = $elem.closest('.mainSettings').attr('id');
            var pathFragment = '#easyErp/customDashboardCharts/';
            var isPrivate = $elem.closest('.mainSettings').hasClass('private');
            var current;

            if (isPrivate) {
                current = _.find(this.model.private, function (el) {
                    return el._id === rowId;
                });

                if (current.createdBy.user !== App.currentUser._id) {
                    return App.render({type: 'error', message: 'Permission denied. It\'s private dashboard'});
                }
            }

            Backbone.history.navigate(pathFragment + rowId, {trigger: true});
        },

        deleteItem: function (e) {
            var $elem = $(e.target);
            var $currentRow = $elem.closest('.mainSettings');
            var id = $currentRow.attr('id');
            var collection = this.collection;
            var url = collection.url;
            var answer;
            var isPrivate = $elem.closest('.mainSettings').hasClass('private');
            var current;

            e.stopPropagation();

            if (this.changed) {
                return this.cancelChanges();
            }

            if (isPrivate) {
                current = _.find(this.model.private, function (el) {
                    return el._id === id;
                });

                if (current.createdBy.user !== App.currentUser._id) {
                    return App.render({type: 'error', message: 'Permission denied. It\'s private dashboard'});
                }
            }

            answer = confirm('Really DELETE items ?!');

            if (answer === false) {
                return false;
            }

            dataService.deleteData(url, {contentType: this.contentType, ids: [id]}, function (err, response) {
                if (err) {
                    return App.render({
                        type   : 'error',
                        message: 'Can\'t remove items'
                    });
                }

                $currentRow.remove();
            });
        },

        renderChildElements: function (e) {
            var allMainLi = this.$el.find('.reportsList').find('li');
            var $target = e ? $(e.target) : allMainLi.first();
            var id = $target.closest('li').attr('id');

            allMainLi.removeClass('active');
            $target.addClass('active');

            this.$el.find('.childBlock').addClass('hidden');

            this.$el.find('[data-id="' + id + '"]').removeClass('hidden');
        },

        renderGuideList: function () {
            if (this.guideTours) {
                this.guideTours.undelegateEvents();
                this.guideTours.stopListening();
            }

            this.guideTours = new GuideTours();
        },

        render: function () {
            this.$el.html(this.template({model: this.model}));

            this.renderChildElements();

            //this.renderGuideList();

            return this;
        }

    });

    return ContentView;
});

