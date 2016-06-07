define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Pagination/PaginationTemplate.html',
    'text!templates/Alpabet/AphabeticTemplate.html',
    'text!templates/Notes/importTemplate.html',
    'views/pagination',
    'views/Notes/AttachView',
    'common',
    'dataService',
    'constants',
    'helpers'
], function (Backbone, $, _, paginationTemplate, aphabeticTemplate, importForm, Pagination, AttachView, common, dataService, CONSTANTS, helpers) {
    'use strict';

    var ListViewBase = Pagination.extend({
        el      : '#content-holder',
        filter  : null,
        viewType: 'list',

        events: {
            'click #previousPage, #nextPage, #firstShowPage, #lastShowPage': 'checkPage',
            'click .itemsNumber'                                           : 'switchPageCounter',
            'click .showPage'                                              : 'showPage',
            'change #currentShowPage'                                      : 'showPage',
            'click .checkbox'                                              : 'checked',
            'click .list td:not(.notForm)'                                 : 'gotoForm',
            'mouseover .currentPageList'                                   : 'showPagesPopup'
        },

        // to remove zombies was needed for event after recieveInvoice on projectInfo
        remove: function () {
            this.$el.empty().off();
            this.stopListening();

            return this;
        },

        // triggered by collection, if {showMore: true} passed to collection
        showMoreContent: function (newModels) {
            var $holder = this.$el;
            var itemView;
            var pagenation;

            this.hideDeleteBtnAndUnSelectCheckAll();

            $holder.find('#listTable').empty();

            itemView = new this.ListItemView({
                collection : newModels,
                page       : this.collection.currentPage,
                itemsNumber: this.collection.pageSize
            });

            $holder.append(itemView.render());

            itemView.undelegateEvents();

            pagenation = $holder.find('.pagination');

            if (newModels.length !== 0) {
                pagenation.show();
            } else {
                pagenation.hide();
            }

            if (typeof (this.recalcTotal) === 'function') {
                this.recalcTotal();
            }

            $holder.find('#timeRecivingDataFromServer').remove();
            $holder.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');
        },

        // todo fixit
        alpabeticalRender: function (e) {
            var target;
            var itemsNumber = $('#itemsNumber').text();
            var selectedLetter;

            this.startTime = new Date();

            if (e && e.target) {
                target = $(e.target);
                selectedLetter = $(e.target).text();

                if (!this.filter) {
                    this.filter = {};
                }
                this.filter.letter = {
                    key  : 'letter',
                    value: selectedLetter,
                    type : null
                };

                target.parent().find('.current').removeClass('current');
                target.addClass('current');

                if ($(e.target).text() === 'All') {
                    delete this.filter;
                    delete App.filter.letter;
                } else {
                    App.filter.letter = this.filter.letter;
                }
            }

            this.filter = App.filter;

            this.filterView.renderFilterContent(this.filter);
            _.debounce(
                function () {
                    this.trigger('filter', App.filter);
                }, 10);

            $('#top-bar-deleteBtn').hide();
            $('#checkAll').prop('checked', false);

            this.changeLocationHash(1, itemsNumber, this.filter);
            this.collection.showMore({count: itemsNumber, page: 1, filter: this.filter});
            this.getTotalLength(null, itemsNumber, this.filter);
        },

        renderAlphabeticalFilter: function () {
            var self = this;
            var currentLetter;

            this.hasAlphabet = true;

            common.buildAphabeticArray(this.collection, function (arr) {
                self.$el.find('#startLetter').remove();
                self.alphabeticArray = arr;
                self.$el.find('#searchContainer').after(_.template(aphabeticTemplate, {
                    alphabeticArray   : self.alphabeticArray,
                    allAlphabeticArray: self.allAlphabeticArray
                }));

                currentLetter = (self.filter && self.filter.letter) ? self.filter.letter.value : 'All';

                if (currentLetter) {
                    $('#startLetter').find('a').each(function () {
                        var target = $(this);
                        if (target.text() === currentLetter) {
                            target.addClass('current');
                        }
                    });
                }
            });
        },

        renderPagination: function ($currentEl, _self) {
            var self = _self || this;
            var countNumber;
            var pagination;

            $currentEl.append(_.template(paginationTemplate));

            pagination = self.$el.find('.pagination');

            if (self.collection.length === 0) {
                pagination.hide();
            } else {
                pagination.show();
                // This is for counterPages at start
                countNumber = (CONSTANTS.PAGINATION_ARRAY.indexOf(self.collection.pageSize) !== -1) ? self.collection.pageSize : 'all';
                this.previouslySelected = $('.itemsNumber:contains(' + countNumber + ')');
                this.previouslySelected.addClass('selectedItemsNumber');
                // end
            }

            $(document).on('click', function (e) {
                self.hide(e);
            });
        },

        renderFilter: function (self, baseFilter) {
            self.filterView = new this.FilterView({
                contentType: self.contentType
            });

            self.filterView.bind('filter', function (filter) {
                if (baseFilter) {
                    filter[baseFilter.name] = baseFilter.value;
                }
                self.showFilteredPage(filter, self);
            });
            self.filterView.bind('defaultFilter', function (filter) {
                if (baseFilter) {
                    filter[baseFilter.name] = baseFilter.value;
                }
                self.showFilteredPage({}, self);
            });

            self.filterView.render();

        },

        deleteItemsRender: function (deleteCounter, deletePage) {
            var pagenation;

            $('#checkAll').prop('checked', false);
            dataService.getData(this.totalCollectionLengthUrl, {
                filter       : this.filter,
                newCollection: this.newCollection,
                contentType  : this.contentType,
                mid          : this.mId
            }, function (response, context) {
                context.listLength = response.count || 0;
            }, this);

            this.deleteRender(deleteCounter, deletePage, {
                filter       : this.filter,
                newCollection: this.newCollection
            });

            pagenation = this.$el.find('.pagination');

            if (this.collection.length === 0) {
                pagenation.hide();
            } else {
                pagenation.show();
            }
        },

        exportToCsv: function () {
            // todo change after routes refactoring
            var filterString = '';
            var tempExportToCsvUrl = '';

            if (this.exportToCsvUrl) {
                tempExportToCsvUrl = this.exportToCsvUrl;
                if (this.filter) {
                    tempExportToCsvUrl += '/' + encodeURIComponent(JSON.stringify(this.filter));
                }
                window.location = tempExportToCsvUrl;
            } else {
                if (this.collection) {
                    filterString += '/' + encodeURIComponent(JSON.stringify(this.filter));
                }
                window.location = this.collection.url + '/exportToCsv' + filterString;
            }
        },

        exportToXlsx: function () {
            var filterString = '';
            var tempExportToXlsxUrl = '';
            // todo change after routes refactoring
            if (this.exportToXlsxUrl) {
                tempExportToXlsxUrl = this.exportToXlsxUrl;
                if (this.filter) {
                    tempExportToXlsxUrl += '/' + encodeURIComponent(JSON.stringify(this.filter));
                }
                window.location = tempExportToXlsxUrl;
            } else {
                if (this.collection) {
                    if (this.filter) {
                        filterString += '/' + encodeURIComponent(JSON.stringify(this.filter));
                    }
                    window.location = this.collection.url + '/exportToXlsx' + filterString;
                }
            }
        },

        fileSizeIsAcceptable: function (file) {
            return !!file && file.size < App.File.MAXSIZE;
        },

        importFiles: function (context) {
            return new AttachView({
                modelName: context.contentType,
                import   : true
            });
        }

    });

    ListViewBase.extend = function (childView) {
        var view = Backbone.View.extend.apply(this, arguments);

        view.prototype.events = _.extend({}, this.prototype.events, childView.events);

        return view;
    };

    return ListViewBase;
});
