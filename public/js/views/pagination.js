define([
    'Backbone',
    'jQuery',
    'Underscore',
    'constants',
    'dataService'
], function (Backbone, $, _, CONSTANTS, dataService) {
    var View = Backbone.View.extend({
        /*listLength        : null,*/
        /*defaultItemsNumber: null,*/
        /*newCollection     : null,*/
        $pagination       : null,
        /*rowClicks         : 0,*/

        events: {
            'click .oe_sortable': 'goSort',
            'click #check_all'  : 'checkAll',
            click               : 'hide'
        },

        checkAll: function (e) {
            var $el = $(e.target);
            var $thisEl = this.$el;

            var $checkedContent = (this.viewType === 'thumbnails') ?
                $thisEl.find('.thumbnailsItems') :
                $thisEl.find('.listTable');

            var $checkboxes = $checkedContent.find('input[type="checkbox"]');
            var check = $el.prop('checked');

            $checkboxes.prop('checked', check);

            this.inputClick(e);
        },

        inputClick: function (e) {
            var $checkBoxes = this.$el.find('input[type="checkbox"]:checked:not(#check_all)');
            var $currentChecked = $(e.target);
            var checkAllBool = ($checkBoxes.length === this.collection.length);

            if ($currentChecked.attr('id') !== 'check_all') {
                if (checkAllBool) {
                    this.$el.find('#check_all').prop('checked', true);
                } else {
                    this.$el.find('#check_all').prop('checked', false);
                }
            }

            this.trigger('selectedElementsChanged', {
                length  : $checkBoxes.length,
                $element: $currentChecked,
                checkAll: checkAllBool
            });

            e.stopPropagation();
        },

        goSort: function (e) {
            var newRows = this.$el.find('#false');
            var filter = this.filter || {};
            var target$;
            var currentParrentSortClass;
            var sortClass;
            var sortConst;
            var sortBy;
            var sortObject;
            var data;

            if ((this.changed && this.changedModels && Object.keys(this.changedModels).length) ||
                (this.isNewRow ? this.isNewRow() : newRows.length)) {
                return App.render({
                    type   : 'notify',
                    message: 'Please, save previous changes or cancel them!'
                });
            }

            this.collection.unbind('reset');
            this.collection.unbind('showmore');

            target$ = $(e.target).closest('th');
            currentParrentSortClass = target$.attr('class');
            sortClass = currentParrentSortClass.split(' ')[1];
            sortConst = 1;
            sortBy = target$.data('sort');
            sortObject = {};

            if (!sortClass) {
                target$.addClass('sortUp');
                sortClass = 'sortUp';
            }

            switch (sortClass) {
                case 'sortDn':
                {
                    target$.parent().find('th').removeClass('sortDn').removeClass('sortUp');
                    target$.removeClass('sortDn').addClass('sortUp');
                    sortConst = 1;
                }
                    break;
                case 'sortUp':
                {
                    target$.parent().find('th').removeClass('sortDn').removeClass('sortUp');
                    target$.removeClass('sortUp').addClass('sortDn');
                    sortConst = -1;
                }
                    break;
                // skip default case
            }

            sortObject[sortBy] = sortConst;

            data = {
                sort: sortObject
            };

            if (this.filter) {
                data.filter = this.filter;
            }
            if (this.viewType) {
                data.viewType = this.viewType;
            }
            if (this.parrentContentId) {
                data.parrentContentId = this.parrentContentId;
            }
            if (this.contentType) {
                data.contentType = this.contentType;
            }

            data.page = 1;

            this.changeLocationHash(null, this.collection.pageSize, filter);
            this.collection.getFirstPage({filter: filter, viewType: this.viewType});
            this.collection.getFirstPage(data);
        },

        makeRender: function (options) {
            _.bindAll(this, 'render', 'afterRender', 'beforeRender');
            var self = this;

            this.render = _.wrap(this.render, function (render) {
                self.beforeRender(options);
                render();
                self.afterRender(options);

                return self;
            });
        },

        beforeRender: function (options) {
            // this.contentType = options.contentType;
        },

        afterRender: function (options) {
            var contentType = options.contentType || null;

            /*$curEl.find('.scrollable').mCustomScrollbar();
             $curEl.find('.tabs').tabs();

             this.runClickItem = _.debounce(this.clickItem, 300);
             this.runClickThumbnail = _.debounce(this.clickThumbnail, 300);*/
        },

        appFiltersCollectionLoaded: function (options) {
            var $curEl = this.$el;
            var contentType = options.contentType || null;
            var $filterBar = $curEl.find('.filterBar');
            var self = this;
            var filterHolder;

            if (!$filterBar.length) {
                $filterBar = $curEl.siblings('.topBarHolder').find('.filterBar');
            }

            if ($filterBar.length) {
                if (this.domainsArray.indexOf(contentType) !== -1) {
                    $filterBar.html(this.filterBarTemplate({
                        showHeader : false,
                        showClear  : false,
                        contentType: contentType
                    }));
                } else {
                    $filterBar.html(this.filterBarTemplate({
                        contentType: contentType,
                        showHeader : true,
                        showClear  : true
                    }));
                }

                filterHolder = $filterBar.find('.filtersFullHolder');

                options.el = filterHolder;

                this.filterView = new FilterView(options);
                this.filterView.render();

                this.filterView.bind('filter', function (filter) {
                    self.filter = filter;

                    if (!self.$el.hasClass("ui-dialog-content ui-widget-content") && !self.$el.parents(".ui-dialog").length) {
                        self.changeLocationHash(1, CONSTANTS.DEFAULT_ELEMENTS_PER_PAGE, filter);
                    }

                    self.trigger('filter');
                });
            }
        },

        changeLocationHash: function (page, count, filter) {
            var location = Backbone.history.fragment;
            var mainLocation = '#easyErp/' + this.contentType + '/' + this.viewType;
            var pId = (location.split('/pId=')[1]) ? location.split('/pId=')[1].split('/')[0] : '';
            var url;
            var thumbnails;
            var locationFilter;
            var value = false;

            if (!page && this.viewType === 'list') {
                page = (location.split('/p=')[1]) ? location.split('/p=')[1].split('/')[0] : 1;
            }

            if (!count) {
                thumbnails = location.split('thumbnails')[0];
                count = (location.split('/c=')[1]) ? location.split('/c=')[1].split('/')[0] : 100;

                if (thumbnails && count < 100) {
                    count = 100;
                }
            }

            url = mainLocation;
            if (pId) {
                url += '/pId=' + pId;

                if (pId.split(',')[1] === 'true') {
                    value = true;
                }
            }

            if (page) {
                url += '/p=' + page;
            }
            if (count) {
                url += '/c=' + count;
            }

            this.trigger('hideCreateForBreadCrumbs', value);

            if (!filter) {
                locationFilter = location.split('/filter=')[1];
                if (locationFilter) {
                    url += '/filter=' + locationFilter;
                }
            } else {
                url += '/filter=' + encodeURIComponent(JSON.stringify(filter));
            }

            Backbone.history.navigate(url, false);
        },

        nextPage: function (options) {
            var page = options.page;
            //todo change it for count
            var itemsNumber = options.itemsNumber;

            options = options || {count: itemsNumber};

            options.filter = this.filter;

            this.collection.getNextPage(options);
            this.changeLocationHash(page, itemsNumber);
        },

        previousPage: function (options) {
            var page = options.page;
            var itemsNumber = options.itemsNumber;

            options = options || {count: itemsNumber};

            options.filter = this.filter;

            this.collection.getPreviousPage(options);
            this.changeLocationHash(page, itemsNumber);
        },

        firstPage: function (options) {
            var itemsNumber = $('#itemsNumber').text();
            var currentShowPage = $('#currentShowPage');
            var page = 1;
            var lastPage = $('#lastPage').text();
            var i;

            currentShowPage.val(page);

            $('#firstShowPage').prop('disabled', true);

            $('#pageList').empty();

            if (lastPage >= 7) {
                for (i = 1;
                     i <= 7;
                     i++) {
                    $("#pageList").append('<li class="showPage">' + i + '</li>');
                }
            } else {
                for (i = 1;
                     i <= lastPage;
                     i++) {
                    $("#pageList").append('<li class="showPage">' + i + '</li>');
                }
            }
            $("#gridStart").text((page - 1) * itemsNumber + 1);

            if (this.listLength <= 1 * itemsNumber) {
                $("#gridEnd").text(this.listLength);
            } else {
                $("#gridEnd").text(page * itemsNumber);
            }

            $("#previousPage").prop("disabled", true);
            $("#nextPage").prop("disabled", false);
            $("#lastShowPage").prop("disabled", false);

            options = options || {
                    count : itemsNumber,
                    filter: this.filter
                };

            this.collection.getFirstPage(options);
            this.changeLocationHash(1, itemsNumber);
        },

        lastPage: function (options) {
            var itemsNumber = $("#itemsNumber").text();
            var page = $("#lastPage").text();
            var i;

            $("#firstShowPage").prop("disabled", true);
            $("#pageList").empty();

            if (page >= 7) {
                for (i = page - 6;
                     i <= page;
                     i++) {
                    $("#pageList").append('<li class="showPage">' + i + '</li>');
                }
            } else {
                for (i = 1;
                     i <= page;
                     i++) {
                    $("#pageList").append('<li class="showPage">' + i + '</li>');
                }
            }

            $("#currentShowPage").val(page);
            $("#gridStart").text((page - 1) * itemsNumber + 1);

            if (this.listLength <= page * itemsNumber) {
                $("#gridEnd").text(this.listLength);
                $("#nextPage").prop("disabled", true);
            } else {
                $("#gridEnd").text(page * itemsNumber);
            }

            $("#nextPage").prop("disabled", true);
            $("#lastShowPage").prop("disabled", true);
            $("#previousPage").prop("disabled", false);
            $("#firstShowPage").prop("disabled", false);

            options = options || {
                    page  : page,
                    count : itemsNumber,
                    filter: this.filter
                };

            this.collection.getLastPage(options);
            this.changeLocationHash(page, itemsNumber);
        },

        getPage: function (options) {
            var itemsNumber = options.count;
            var page = options.page;
            var filter = this.filter || {};
            var collectionOptions = {
                count : itemsNumber,
                filter: filter
            };

            var filterExtension = this.getFilterExtention();

            collectionOptions.filter = _.extend(collectionOptions.filter, filterExtension);

            /*this.defFilter = $.extend({}, collectionOptions.filter);
             this.filter = $.extend({}, collectionOptions.filter);  */

            this.collection.getPage(page, collectionOptions);
            this.changeLocationHash(page, itemsNumber);
        },

        switchPageCounter: function (e) {
            e.preventDefault();

            var self = this;
            var itemsNumber = e.target.textContent;

            this.defaultItemsNumber = itemsNumber;
            this.$el.find('#checkAll').prop('checked', false);

            this.collection.getPage(1, {
                count        : itemsNumber,
                page         : 1,
                filter       : this.filter,
                newCollection: false
            });

            this.changeLocationHash(1, itemsNumber);
        },

        pageAnimation: function (direction, $holder) {
            var $absolute = $holder.find('.absoluteContent');

            if ($absolute.length) {
                $holder = $absolute;
            }

            if (!direction) {
                $holder.removeClass('contentFadeInLeft');
                $holder.removeClass('contentFadeInRight');
                $holder.removeClass('contentFadeOutLeft');
                $holder.addClass('contentFadeOutRight');
            } else {
                $holder.removeClass('contentFadeInLeft');
                $holder.removeClass('contentFadeInRight');
                $holder.removeClass('contentFadeOutRight');
                $holder.addClass('contentFadeOutLeft');
            }

            setTimeout(function () {
                if (!direction) {
                    $holder.addClass('contentFadeInLeft');
                    $holder.removeClass('contentFadeOutRight');
                } else {
                    $holder.addClass('contentFadeInRight');
                    $holder.removeClass('contentFadeOutLeft');
                }
            }, 300);
        },

        // </editor-fold>

        // <editor-fold desc="Checkboxes">

        addCheckboxesFunctionality: function (context) {
            var currentEl;

            if (!context) {
                context = this;
            }

            currentEl = context.$el;

            currentEl.find(".checkbox").click(function (e) {
                e.stopPropagation();

                setViewStateAfterCheck();
            });

            currentEl.find(".checkboxArea").click(function (e) {
                var checkbox;

                e.stopPropagation();
                checkbox = $(e.target).children('input:checkbox');
                checkbox.prop('checked', !checkbox.is(':checked'));

                setViewStateAfterCheck();
            });

            var setViewStateAfterCheck = function () {

                if (!context.$checkAll) {
                    //todo change after button behavior adding
                    return;
                }

                var checkLength;
                var collectionLength = context.collection.length;
                if (collectionLength > 0) {
                    checkLength = $("input.checkbox:checked").length;

                    if (checkLength === collectionLength) {
                        context.$checkAll.prop('checked', true);
                    } else {
                        context.$checkAll.prop('checked', false);
                    }
                }
            };

        },

        checked: function (e) {
            e.stopPropagation();
        },

        checklistRow: function (e) {
            var $targetEl = $(e.target);
            var $targetDivContainer = $targetEl.closest(".listRow");
            var $checkbox = $targetDivContainer.find('input[type="checkbox"]');
            var checked = $checkbox.prop('checked');

            $checkbox.prop('checked', !checked);
            this.inputClick(e);
        },

        createItem: function (modelForDuplicate) {
            var contentType = this.contentType;
            var viewType = this.viewType;
            var parentId = this.parentId;
            var translation = this.translation;
            var modelUrl = 'models/' + contentType;
            var self = this;
            var CreateView = this.CreateView;

            require([modelUrl], function (Model) {
                var creationOptions = {
                    Model      : Model,
                    contentType: contentType,
                    viewType   : viewType,
                    parentId   : parentId,
                    translation: translation
                };

                if (modelForDuplicate) {
                    creationOptions['modelForDuplicate'] = modelForDuplicate;
                }

                var createView = new CreateView(creationOptions);

                createView.on('itemSaved', function () {
                    self.collection.getPage(1, {filter: self.filter});
                });

                createView.on('modelSaved', function (model) {
                    self.addReplaceRow(model);
                });
            });
        },

        editItem: function (id) {
            var contentType = this.contentType;
            var viewType = this.viewType;
            var parentId = this.parentId;
            var translation = this.translation;
            var currentId = id || this.$el.find('input[type="checkbox"]:checked:not(#checkAll)').attr('id');
            var model = this.collection.get(currentId);
            var self = this;

            var editView = new this.EditView({
                model      : model,
                contentType: contentType,
                viewType   : viewType,
                parentId   : parentId,
                translation: translation
            });

            editView.on('itemArchived', function () {
                self.collection.getPage(1);
            });

            editView.on('modelSaved', function (model) {

                if (App.currentUser._id === model.get('_id')) {
                    App.currentUser = model.toJSON();
                    self.trigger('renderCurrentUserInfo');
                }

                self.addReplaceRow(model);
            });
        },

        incClicks: function (e) {
            this.rowClicks += 1;
            this.runClickItem(e);
        },

        clickItem: function (e) {
            var clicks = this.rowClicks;

            this.rowClicks = 0;

            if (clicks === 1) {
                this.checklistRow(e);
            } else {
                this.listRowClick(e);
            }
        },

        showFilteredContent: function (tabName) {
            var itemsNumber = $("#itemsNumber").text();
            var creationOptions;

            var defaultFilters = new DefFilters(App.currentUser._id);
            var filter = defaultFilters.getDefFilter(this.contentType, tabName);

            var filterExtension = this.getFilterExtention();

            this.tabName = tabName;

            creationOptions = {
                viewType     : this.viewType,
                filter       : filter,
                parentId     : this.parentId,
                newCollection: false
            };

            creationOptions.filter = _.extend(creationOptions.filter, filterExtension);

            this.defFilter = $.extend({}, creationOptions.filter);
            this.filter = $.extend({}, creationOptions.filter);

            if (this.filterView) {
                this.filterView.trigger('tabsChanged', this.defFilter);
            }

            this.changeLocationHash(1, itemsNumber, filter);
            this.collection.getPage(1, creationOptions);
        },

        addReplaceRow: function (model) {
            var $curEl = this.$el;
            var $listTable = $curEl.find('.listTable');
            var id = model.get('_id');
            var $listRow = $listTable.find('.listRow[data-id = "' + id + '"]');
            var modelJSON = model.toJSON();

            if ($listRow.length) {
                $listRow.replaceWith(this.templateNew({model: modelJSON, translation: this.translation}));
                if (this.preView) {
                    this.preView.trigger('updatePreview', model);
                }

                this.collection.add(modelJSON, {merge: true});
            } else {
                $curEl.find(".noData").remove();
                this.collection.add(modelJSON, {remove: false});
                $listTable.prepend(this.templateNew({model: modelJSON, translation: this.translation}));
            }

            this.trigger('hideActionDd');
        },

        changeTranslatedFields: function (translation) {
            var self = this;
            var $curEl = this.$el;
            var $elementsForTranslation = $curEl.find('[data-translation]');

            this.translation = translation;
            $elementsForTranslation.each(function (index, el) {
                var $element = $(el);
                var property = $element.attr('data-translation');

                $element.html(self.translation[property]);
            });

        }

    });

    View.extend = function (childView) {
        var view = Backbone.View.extend.apply(this, arguments);

        view.prototype.events = _.extend({}, this.prototype.events, childView.events);

        return view;
    };

    return View;
});
