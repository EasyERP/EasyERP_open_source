define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Pagination/PaginationTemplate.html',
    'text!templates/Notes/importTemplate.html',
    'views/pagination',
    'views/selectView/selectView',
    'views/Notes/AttachView',
    'common',
    'dataService',
    'constants',
    'helpers',
    'constants/guideTours',
    'text!templates/guideTours/notificationTemplate.html',
    'views/guideTours/guideNotificationView'
], function (Backbone, $, _, paginationTemplate, importForm, Pagination, SelectView, AttachView, common, dataService, CONSTANTS, helpers, GUIDES, notifyTemplate, GuideNotify) {
    'use strict';

    var ListViewBase = Pagination.extend({
        viewType      : 'list',
        SelectView    : SelectView,
        notifyTemplate: _.template(notifyTemplate),

        events: {
            'click #previousPage, #nextPage, #firstShowPage, #lastShowPage': 'checkPage',
            'click .itemsNumber'                                           : 'switchPageCounter',
            'click .showPage'                                              : 'showPage',
            'change #currentShowPage'                                      : 'showPage',
            'click .checkbox'                                              : 'checked',
            'click .list td:not(.notForm, .checkbox)'                      : 'gotoForm',
            // 'click .list > tbody > tr > td:not(.notForm, .checkbox)'       : 'gotoForm'
        },

        initialize: function (options) {
            var self = this;

            this.startTime = options.startTime;
            this.collection = options.collection || Backbone.Collection.extend();
            this.responseObj = {};
            this.filter = options.filter;

            options.contentType = this.contentType;

            if (this.paginationEl) {
                options.paginationEl = this.paginationEl;
            }

            this.makeRender(options);
            this.render();

            if (App.guide) {
                if (App.notifyView) {
                    App.notifyView.undelegateEvents();
                    App.notifyView.stopListening();
                }
                App.notifyView = new GuideNotify({e: null, data: App.guide});
            }
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

            if (!isNaN(parseFloat(newModels.totalDebit))) {
                $holder.find('#totalDebit').text(helpers.currencySplitter((newModels.totalDebit / 100).toFixed(2)));
                $holder.find('#totalCredit').text(helpers.currencySplitter((newModels.totalCredit / 100).toFixed(2)));
            }

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

        // added methods for edit in listView
        savedNewModel: function (modelObject) {
            var savedRow = this.$el.find('#false');
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
            this.changedModels = {};
        },

        updatedOptions: function () {
            this.hideSaveCancelBtns();
            this.resetCollection();
            this.changedModels = {};
        },

        resetCollection: function (model) {
            if (model && model._id) {
                model = new this.CurrentModel(model);

                this.collection.add(model);
            } else {
                this.collection.set(this.editCollection.models, {remove: false});
            }
        },

        resetEditCollection: function () {
            if (!this.collection || !this.editCollection) {
                return false;
            }
            this.editCollection.reset(this.collection.models);
        },

        keyDown: function (e) {
            if (e.which === 13) {
                this.setChangedValueToModel();
            }
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
            var tr;

            if (!td.parents) {
                td = $(td.target).closest('td');
            }

            tr = td.parents('tr');

            tr.addClass('edited');

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

        setChangedValueToModel: function () {
            var editedElement = this.$el.find('.editing');
            var editedCol;
            var editedElementRowId;
            var editedElementContent;
            var editedElementValue;
            var editModel;
            var editValue;

            if (navigator.userAgent.indexOf('Firefox') > -1) {
                this.setEditable(editedElement);
            }

            if (editedElement.length) {
                editedCol = editedElement.closest('td');
                editedElementRowId = editedElement.closest('tr').attr('data-id');
                editedElementContent = editedCol.data('content');
                editedElementValue = editedElement.val();

                // editedElementValue = editedElementValue.replace(/\s+/g, '');

                if (editedElementRowId.length >= 24) {
                    editModel = this.collection.get(editedElementRowId) || this.editCollection.get(editedElementRowId);
                    editValue = editModel.get(editedElementContent);

                    if (editedElementValue !== editValue) {
                        if (!this.changedModels[editedElementRowId]) {
                            this.changedModels[editedElementRowId] = {};
                        }
                        this.changedModels[editedElementRowId][editedElementContent] = editedElementValue;
                    }
                } else {
                    if (!this.changedModels[editedElementRowId]) {
                        this.changedModels[editedElementRowId] = {};
                    }
                    this.changedModels[editedElementRowId][editedElementContent] = editedElementValue;
                }
                editedCol.text(editedElementValue);
                editedElement.remove();

                if (editedElementValue) {
                    editedCol.removeClass('errorContent');
                }
            }
        },

        saveItem: function () {
            var model;
            var id;
            var errors = this.$el.find('.errorContent');

            for (id in this.changedModels) {
                model = this.editCollection.get(id) || this.collection.get(id);
                model.changed = this.changedModels[id];
            }

            if (errors.length) {
                return;
            }

            this.editCollection.save();
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
            var tempExportToCsvUrl = '';
            var hasSlash;

            if (this.exportToCsvUrl) {
                tempExportToCsvUrl = this.exportToCsvUrl;

                tempExportToCsvUrl += helpers.makeFilterString(this.filter, this.type);

                window.location = tempExportToCsvUrl;
            } else {
                if (this.collection) {
                    hasSlash = this.collection.url.substr(-1) === '/';

                    if (hasSlash) {
                        window.location = this.collection.url + 'exportToCsv' + helpers.makeFilterString(this.filter, this.type);
                    } else {
                        window.location = this.collection.url + '/exportToCsv' + helpers.makeFilterString(this.filter, this.type);
                    }
                }
            }
        },

        exportToXlsx: function () {
            var tempExportToXlsxUrl = '';
            var hasSlash;

            if (this.exportToXlsxUrl) {
                tempExportToXlsxUrl = this.exportToXlsxUrl;

                tempExportToXlsxUrl += helpers.makeFilterString(this.filter, this.type);

                window.location = tempExportToXlsxUrl;
            } else {
                if (this.collection) {
                    hasSlash = this.collection.url.substr(-1) === '/';

                    if (hasSlash) {
                        window.location = this.collection.url + 'exportToXlsx' + helpers.makeFilterString(this.filter, this.type);
                    } else {
                        window.location = this.collection.url + '/exportToXlsx' + helpers.makeFilterString(this.filter, this.type);
                    }
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
        },

        gotoForm: function (e) {
            var id = $(e.target).closest('tr').data('id');

            if (!this.formUrl || $(e.target).closest('tfoot').length) {
                return;
            }

            App.ownContentType = true;
            Backbone.history.navigate(this.formUrl + id, {trigger: true});
        }

    });

    ListViewBase.extend = function (childView) {
        var view = Backbone.View.extend.apply(this, arguments);

        view.prototype.events = _.extend({}, this.prototype.events, childView.events);

        return view;
    };

    return ListViewBase;
});
