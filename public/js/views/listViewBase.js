define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Pagination/PaginationTemplate.html',
    'text!templates/Alpabet/AphabeticTemplate.html',
    'text!templates/Notes/importTemplate.html',
    'views/pagination',
    'views/selectView/selectView',
    'views/Filter/FilterView',
    'views/Notes/AttachView',
    'common',
    'dataService',
    'constants'
], function (Backbone, $, _, paginationTemplate, aphabeticTemplate, importForm, Pagination, SelectView, FilterView, AttachView, common, dataService, CONSTANTS) {
    'use strict';

    var ListViewBase = Pagination.extend({
        viewType  : 'list',
        SelectView: SelectView,
        FilterView: FilterView,

        events: {
            'click #previousPage, #nextPage, #firstShowPage, #lastShowPage': 'checkPage',
            'click .itemsNumber'                                           : 'switchPageCounter',
            'click .showPage'                                              : 'showPage',
            'change #currentShowPage'                                      : 'showPage',
            'click .checkbox'                                              : 'checked',
            'click .list td:not(.notForm, .checkbox)'                      : 'gotoForm',
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

        // added methods for edit in listView

        savedNewModel: function (modelObject) {
            var savedRow = this.$listTable.find('#false');
            var modelId;
            var checkbox = savedRow.find('input[type=checkbox]');

            modelObject = modelObject.success;

            if (modelObject) {
                modelId = modelObject._id;
                savedRow.attr('data-id', modelId);
                checkbox.val(modelId);
                savedRow.removeAttr('id');
            }

            this.hideSaveCancelBtns();
            this.resetCollection(modelObject);
        },

        updatedOptions: function () {
            this.hideSaveCancelBtns();
            this.resetCollection();
        },

        resetCollection: function (model) {
            if (model && model._id) {
                model = new this.CurrentModel(model);

                this.collection.add(model);
            } else {
                this.collection.set(this.EditCollection.models, {remove: false});
            }
        },

        bindingEventsToEditedCollection: function (context) {
            if (context.EditCollection) {
                context.EditCollection.unbind();
            }
            context.EditCollection = new this.EditCollection(context.collection.toJSON());
            context.EditCollection.on('saved', context.savedNewModel, context);
            context.EditCollection.on('updated', context.updatedOptions, context);
        },

        keyDown: function (e) {
            if (e.which === 13) {
                this.setChangedValueToModel();
            }
        },

        isNewRow: function () {
            var newRow = $('#false');

            return !!newRow.length;
        },

        editRow: function (e) {
            var el = $(e.target);
            var tr = $(e.target).closest('tr');
            var trId = tr.data('id');
            var colType = el.data('type');
            var isSelect = colType !== 'input' && el.prop('tagName') !== 'INPUT';
            var tempContainer;
            var width;

            e.stopPropagation();

            if (el.attr('id') === 'selectInput') {
                return false;
            }

            if (trId && el.prop('tagName') !== 'INPUT') {
                this.modelId = trId;
                this.setChangedValueToModel();
            }

            if (isSelect) {
                this.showNewSelect(e);
            } else {
                tempContainer = el.text();
                width = el.width() - 6;
                el.html("<input class='editing' type='text' value='" + tempContainer + " ' style='width:'" + width + "px'>");
            }

            return false;
        },

        setEditable: function (td) {

            if (!td.parents) {
                td = $(td.target).closest('td');
            }

            td.addClass('edited');

            if (this.isEditRows()) {
                this.setChangedValue();
            }

            return false;
        },

        setChangedValue: function () {
            if (!this.changed) {
                this.changed = true;
                this.showSaveCancelBtns();
            }
        },

        isEditRows: function () {
            var edited = this.$el.find('.edited');

            this.edited = edited;

            return !!edited.length;
        },

        saveItem: function () {
            var model;
            var id;
            var errors = this.$el.find('.errorContent');

            for (id in this.changedModels) {
                model = this.EditCollection.get(id) || this.collection.get(id);
                model.changed = this.changedModels[id];
            }

            if (errors.length) {
                return;
            }

            this.EditCollection.save();
            this.changedModels = {};

            this.deleteEditable();
        },

        deleteEditable: function () {
            this.$el.find('.edited').removeClass('edited');
        },

        errorFunction: function () {
            App.render({
                type   : 'error',
                message: 'Some error'
            });
        },

        showNewSelect: function (e) {
            var $target = $(e.target);
            e.stopPropagation();

            if ($target.attr('id') === 'selectInput') {
                return false;
            }

            if (this.selectView) {
                this.selectView.remove();
            }

            this.selectView = new this.SelectView({
                e          : e,
                responseObj: this.responseObj
            });

            $target.append(this.selectView.render().el);

            return false;
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
