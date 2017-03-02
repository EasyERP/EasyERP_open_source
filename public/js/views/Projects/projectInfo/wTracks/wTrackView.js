define([
    'jQuery',
    'Underscore',
    'text!templates/Projects/projectInfo/wTrackTemplate.html',
    'text!templates/Projects/projectInfo/wTracks/wTrackHeader.html',
    'text!templates/Pagination/PaginationTemplate.html',
    'text!templates/wTrack/list/cancelEdit.html',
    'views/wTrack/CreateView',
    'views/wTrack/list/ListView',
    'views/wTrack/list/ListItemView',
    'models/wTrackModel',
    'collections/wTrack/editCollection',
    'collections/wTrack/filterCollection',
    'dataService',
    'populate',
    'async',
    'constants',
    'helpers/eventsBinder'
], function ($,
             _,
             wTrackTemplate,
             wTrackTopBar,
             paginationTemplate,
             cancelEdit,
             CreateView,
             listView,
             listItemView,
             CurrentModel,
             EditCollection,
             wTrackCollection,
             dataService,
             populate,
             async,
             CONSTANTS,
             eventsBinder) {
    var wTrackView = listView.extend({
        el                  : '#timesheet',
        templateHeader      : _.template(wTrackTopBar),
        ListItemView        : listItemView,
        template            : _.template(wTrackTemplate),
        preventChangLocation: true,
        cancelEdit          : cancelEdit,

        events: {
            'mouseover .currentPageList': 'showPagesPopup',
            'click .itemsNumber'        : 'switchPageCounter',
            'click .showPage'           : 'showPage',
            'change #currentShowPage'   : 'showPage',
            'click .checkbox'           : 'checked',
            'change .checkbox'          : 'setAllTotalVals',
            'click #top-bar-copyBtn'    : 'copyRow',
            'click #savewTrack'         : 'saveItem',
            'click #deletewTrack'       : 'deleteItems',
            'click #createBtn'          : 'createItem',
            click                       : 'removeInputs'
        },

        initialize: function (options) {
            this.remove();
            this.collection = options.collection;
            this.defaultItemsNumber = options.defaultItemsNumber || CONSTANTS.DEFAULT_ELEMENTS_PER_PAGE;
            this.filter = options.filter ? options.filter : {};
            this.project = options.project ? options.project : {};

            this.collection.url = CONSTANTS.URLS.WTRACK;

            this.changedModels = {};

            eventsBinder.subscribeCollectionEvents(this.collection, this);

            this.startNumber = (parseInt(this.collection.currentPage, 10) - 1) * this.collection.pageSize + 1;

            this.render();
        },

        deleteItems: function () {
            var self = this;
            var $thisEl = this.$el;
            var $table = $thisEl.find('#listTable');
            var collection = this.collection;
            var url = collection.url;
            var $checkedInputs;
            var ids = [];
            var answer;
            var edited = this.edited || $thisEl.find('tr.false, #false');

            if (!edited.length) { // ToDo refactor
                this.changed = false;
            }

            if (this.changed) {
                return this.cancelChanges();
            }

            answer = confirm('Really DELETE items ?!');

            if (answer === false) {
                return false;
            }

            $checkedInputs = $table.find('input:checked');

            $.each($checkedInputs, function () {
                var $el = $(this);

                ids.push($el.val());
            });

            ids = _.compact(ids);

            dataService.deleteData(url, {contentType: this.contentType, ids: ids}, function (err, response) {
                if (err) {
                    return App.render({
                        type   : 'error',
                        message: 'Can\'t remove items'
                    });
                }
                ids.forEach(function (id) {
                    $table.find('[data-id="' + id + '"]').remove();
                });
            });
        },

        hideDeleteBtnAndUnSelectCheckAll: function () {
            $('#deletewTrack').hide();
            $('#top-bar-generateBtn').hide();
            $('#top-bar-copyBtn').hide();
            $('#createBtn').show();

            this.$el.find('#checkAll').prop('checked', false);

            this.setAllTotalVals();
        },

        createItem: function (e) {
            var model;
            var projectModel = this.project.toJSON();
            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var week = now.getWeek();
            var startData = {
                year        : year,
                month       : month,
                week        : week,
                project     : projectModel._id,
                projectModel: projectModel
            };

            this.projectModel = projectModel;

            e.preventDefault();

            model = new CurrentModel(startData);

            startData.cid = model.cid;

            if (!this.isNewRow()) {
                this.showSaveCancelBtns();
                this.editCollection.add(model);

                new CreateView(startData);
            } else {
                App.render({
                    type   : 'notify',
                    message: 'Please confirm or discard changes before create a new item'
                });
            }

            this.createdCopied = true;
            this.changed = true;
        },

        stopDefaultEvents: function (e) {
            e.stopPropagation();
            e.preventDefault();
        },

        showMoreContent: function (newModels) {
            var self = this;
            var $holder = this.$el;
            var pagenation;

            this.hideDeleteBtnAndUnSelectCheckAll();
            this.startNumber = (parseInt(this.collection.currentPage, 10) - 1) * this.collection.pageSize + 1;

            if (newModels.length > 0) {
                $holder.find('#listTable').html(this.template({
                    project    : this.project.toJSON(),
                    wTracks    : newModels.toJSON(),
                    startNumber: self.startNumber - 1
                }));
            }

            pagenation = $holder.find('.pagination');

            if (newModels.length !== 0) {
                pagenation.show();
            } else {
                pagenation.hide();
            }

            if (typeof (this.recalcTotal) === 'function') {
                this.recalcTotal();
            }
        },

        rerenderNumbers: function () {
            var tableTr = $('#listTable').find('tr');

            tableTr.each(function (index) {
                $(this).find('[data-content="number"]').text(index + 1);
            });

        },

        hideSaveCancelBtns: function () {
            var saveBtnEl = $('#savewTrack');
            var cancelBtnEl = $('#deletewTrack');
            var createBtnEl = $('#createBtn');

            this.changed = false;

            saveBtnEl.hide();
            cancelBtnEl.hide();
            createBtnEl.show();

            return false;
        },

        saveItem: function (e) {
            var self = this;
            var model;
            var id;
            var errors = this.$el.find('.errorContent');
            var keys = Object.keys(this.changedModels);
            e.preventDefault();

            this.setChangedValueToModel();

            keys.forEach(function (id) {
                model = self.editCollection.get(id) || self.collection.get(id);
                model.changed = self.changedModels[id];

                delete model.changed.mainWtrackView;
            });

            if (errors.length) {
                return;
            }
            this.editCollection.save();

            this.$el.find('.edited').removeClass('edited');
            this.rerenderNumbers(); // added rerender after saving too
        },

        checked: function (e) {
            var el = this.$el;
            var checkLength;
            var rawRows;
            var $checkLength;

            e.stopPropagation();

            if (this.collection.length > 0) {
                $checkLength = el.find('input.checkbox:checked');

                checkLength = $checkLength.length;
                rawRows = $checkLength.closest('.false');

                if (el.find('input.checkbox:checked').length > 0) {
                    this.$createBtn.hide();
                    this.copyEl.show();
                    $('#deletewTrack').show();

                    el.find('#checkAll').prop('checked', false);

                    if (checkLength === this.collection.length) {
                        el.find('#checkAll').prop('checked', true);
                    }
                } else {
                    $('#deletewTrack').hide();
                    this.copyEl.hide();
                    this.$createBtn.show();
                    el.find('#checkAll').prop('checked', false);
                }
            }

            if (rawRows.length !== 0 && rawRows.length !== checkLength) {
                this.$saveBtn.hide();
            } else {
                this.$saveBtn.show();
            }

            this.setAllTotalVals();
        },

        setAllTotalVals: function () {
            this.getAutoCalcField('hours', 'worked');
            this.getAutoCalcField('monHours', '1');
            this.getAutoCalcField('tueHours', '2');
            this.getAutoCalcField('wedHours', '3');
            this.getAutoCalcField('thuHours', '4');
            this.getAutoCalcField('thuHours', '4');
            this.getAutoCalcField('friHours', '5');
            this.getAutoCalcField('satHours', '6');
            this.getAutoCalcField('sunHours', '7');
        },

        getAutoCalcField: function (idTotal, dataRow, money) {
            var footerRow = this.$el.find('#listFooter');

            var checkboxes = this.$el.find('.listCB:checked');

            var totalTd = $(footerRow).find('#' + idTotal);
            var rowTdVal = 0;
            var row;
            var rowTd;

            $(checkboxes).each(function (index, element) {
                row = $(element).closest('tr');
                rowTd = row.find('[data-content="' + dataRow + '"]');

                rowTdVal += parseFloat(rowTd.html() || 0) * 100;
            });

            if (money) {
                totalTd.text((rowTdVal / 100).toFixed(2));
            } else {
                totalTd.text(rowTdVal / 100);
            }
        },

        showSaveCancelBtns: function () {
            var saveBtnEl = $('#savewTrack');
            var cancelBtnEl = $('#deletewTrack');
            var createBtnEl = $('#createBtn');

            saveBtnEl.show();
            cancelBtnEl.show();
            createBtnEl.hide();

            return false;
        },

        copyRow: function (e) {

            var checkedRows = this.$el.find('input.listCB:checked:not(#checkAll)');
            var length = checkedRows.length;
            var self = this;
            var _model;
            var tdsArr;
            var cid;
            var i;
            var selectedWtrack;
            var target;
            var id;
            var row;
            var model;
            var projectWorkflow;

            this.createdCopied = true;
            this.changed = true;

            this.stopDefaultEvents(e);
            this.hideDeleteBtnAndUnSelectCheckAll(e);

            for (i = length - 1; i >= 0; i--) {
                selectedWtrack = checkedRows[i];
                target = $(selectedWtrack);
                id = target.val();
                row = target.closest('tr');
                model = self.collection.get(id) ? self.collection.get(id) : self.editCollection.get(id);
                hours = (model && model.changed && model.changed.worked) ? model.changed.worked : model.get('worked');
                $(selectedWtrack).attr('checked', false);
                projectWorkflow = $.trim(row.find('[data-content="workflow"]').text());

                if ((model.toJSON().workflow && model.toJSON().workflow.name !== 'Closed') || (projectWorkflow !== 'Closed')) {
                    model.set({
                        isPaid : false,
                        amount : 0,
                        cost   : 0,
                        revenue: 0
                    });
                    model = model.toJSON();

                    delete model._id;

                    _model = new CurrentModel(model);

                    this.showSaveCancelBtns();
                    this.editCollection.add(_model);

                    cid = _model.cid;

                    if (!this.changedModels[cid]) {
                        this.changedModels[cid] = model;
                    }

                    this.$el.find('#listTable').prepend('<tr class="false enableEdit" data-id="' + cid + '">' + row.html() + '</tr>');
                    row = this.$el.find('.false');

                    tdsArr = row.find('td');
                    $(tdsArr[0]).find('input').val(cid);
                    $(tdsArr[1]).text('New');
                } else {
                    message = "You can't copy tCard with closed project.";
                    App.render({
                        type   : 'error',
                        message: message
                    });
                }
            }
        },

        render: function () {
            var self = this;
            var $currentEl = this.$el;
            var wTracks = this.collection.toJSON();
            var allInputs;
            var checkedInputs;

            if (this.startNumber < 100) {
                $currentEl.html('');
                $currentEl.prepend(this.templateHeader);
            }

            $currentEl.find('#listTable').html(this.template({
                project    : this.project.toJSON(),
                wTracks    : wTracks,
                startNumber: self.startNumber - 1
            }));

            this.renderPagination($currentEl, self);

            this.genInvoiceEl = this.$el.find('#top-bar-generateBtn');
            this.copyEl = this.$el.find('#top-bar-copyBtn');
            this.$saveBtn = this.$el.find('#saveBtn');
            this.$createBtn = this.$el.find('#createBtn');
            this.$removeBtn = this.$el.find('#deletewTrack');
            this.genInvoiceEl.hide();
            this.copyEl.hide();

            if (this.project.toJSON().workflow.name === 'Closed') {
                this.$createBtn.remove();
                this.copyEl.remove();
                this.$removeBtn.remove();
            }

            $('#savewTrack').hide();
            $('#deletewTrack').hide();

            $('#checkAll').click(function () {
                var checkLength;

                allInputs = self.$el.find('.listCB');
                allInputs.prop('checked', this.checked);
                checkedInputs = $('input.listCB:checked');

                if (wTracks.length > 0) {
                    checkLength = checkedInputs.length;

                    if (checkLength > 0) {
                        $('#deletewTrack').show();
                        self.$createBtn.hide();

                        if (checkLength === allInputs.length) {  /*self.collection.length*/

                            $('#checkAll').prop('checked', true);
                        }
                    } else {
                        $('#deletewTrack').hide();
                        self.$createBtn.show();

                        $('#checkAll').prop('checked', false);
                        self.$el.find('#top-bar-copyBtn').hide();
                    }
                }

                self.setAllTotalVals();
            });

            setTimeout(function () {
                self.bindingEventsToEditedCollection(self);
                self.$listTable = $('#listTable');
            }, 10);

            return this;
        }
    });

    return wTrackView;
});
