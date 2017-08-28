define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/reports/EditTemplate.html',
    'text!templates/reports/fakePreviews/FakePreview.html',
    'models/CustomReportsModel',
    'views/Filter/dateFilter',
    'views/dialogViewBase',
    'models/LeadsModel',
    'common',
    'populate',
    'dataService',
    'views/Notes/AttachView',
    'constants/customReports',
    'constants',
    'moment'
], function (Backbone,
             $,
             _,
             CreateTemplate,
             FakePreviewTemplate,
             model,
             DateFilterView,
             ParentView,
             LeadModel,
             common,
             populate,
             dataService,
             AttachView,
             CONSTANTREPORTS,
             CONSTANTS,
             moment) {

    var EditView = ParentView.extend({
        el                 : '#content-holder',
        contentType        : 'reports',
        template           : _.template(CreateTemplate),
        fakePreviewTemplate: _.template(FakePreviewTemplate),

        initialize: function (options) {
            _.bindAll(this, 'saveItem', 'render');
            this.model = new model(options.model);
            this.copyReport = options.copyReport;
            this.responseObj = {};

            if (this.copyReport) {
                this.model.unset('_id', {silent: true});
                delete this.model.id;
            }

            this.render();
        },

        events: {
            'click .reportsBtn' : 'showTabs',
            'click .reportsTab' : 'activateTab',
            'click .reportCheck': 'checkCol'
        },

        checkCol: function (e) {
            var $thisEl = this.$el;
            var $target = $(e.target).closest('th');
            e.stopPropagation();

            var hoverClass = $target.attr('data-reportType');
            var dataHover = $target.attr('data-hover');

            if (dataHover) {
                $thisEl.find('.' + hoverClass).removeAttr('data-hover');
                $thisEl.find('.' + hoverClass).removeClass('selected');
                return;
            }

            $thisEl.find('.' + hoverClass).attr('data-hover', hoverClass);
            $thisEl.find('.' + hoverClass).addClass('selected');
        },

        clickRows: function () {
            var model = this.model.toJSON();
            var $thisEl = this.$el;
            var rows = model.rows;

            if (!rows || !rows.length) {
                return;
            }

            rows.forEach(function (row) {
                $thisEl.find('.' + row + 'Class').attr('data-hover', row + 'Class');
                $thisEl.find('.' + row + 'Class').addClass('selected');
                $thisEl.find('.' + row + 'Class').find('[type="checkbox"]').prop('checked', true);
            });
        },

        activateTab: function (e) {
            var self = this;
            var $thisEl = this.$el;
            var model = this.model.toJSON();
            var constants = CONSTANTREPORTS.reports;
            var template = this.fakePreviewTemplate;
            var data = {};
            var header;
            var $target;
            var id;

            if (e) {
                $target = $thisEl.find(e.target);
                id = $target.attr('id');
            } else {
                $target = $thisEl.find('#' + model.reportType);
                id = model.reportType;
            }

            Object.keys(constants).forEach(function (item) {
                if (Object.keys(constants[item]).indexOf(id) >= 0) {
                    data = constants[item][id].slice();
                    header = data.shift();
                }
            });

            if (!$target || !$target.length) {
                return;
            }

            $thisEl.find('.reportsTab').removeClass('active');
            $target.addClass('active');

            if (template) {
                $thisEl.find('#previewForCreate').html(template({info: data, header: header}));

                this.$el.find('.stripedList').dragtable({dragHandle: '.dragHandle'});
            }
        },

        showTabs: function (e) {
            var $thisEl = this.$el;
            var $target = $thisEl.find(e.target).closest('li');

            $thisEl.find('._tabItem').removeClass('active');
            $target.addClass('active');

            $thisEl.find('.reportsTabs').stop(true, false).hide('slow');
            $thisEl.find('.' + $target.attr('data-ids')).stop(true, false).toggle('slow');
            // $thisEl.find('#previewForCreate').html('');
        },

        chooseOption: function (e) {
            var holder = $(e.target).parents('._newSelectListWrap').find('.current-selected');
            holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));
            if (holder.attr('id') === 'customerDd') {
                this.selectCustomer($(e.target).attr('id'));
            }
            if (holder.attr('id') === 'companyDd') {
                this.selectCompany($(e.target).attr('id'));
            }
        },

        checkOption: function () {
            var self = this;
            var $thisEl = this.$el;
            var model = this.model.toJSON();

            $thisEl.find('#' + model.reportType).closest('.reportsTabs').show().addClass('active');
        },

        saveItem: function () {
            var self = this;
            var $thisEl = this.$el;
            var name = $.trim($thisEl.find('#nameReport').val());
            var reportType = $thisEl.find($thisEl.find('.active.reportsTab')[0]).attr('id');
            var reportCategory = $thisEl.find($thisEl.find('.active._tabItem ')[0]).attr('data-ids');
            var description = $.trim($thisEl.find('#description').val());
            var isPrivate = $thisEl.find('#isPrivate').is(':checked');
            var selectedHeaders = $('.headTable.selected');
            var columnOrder = [];
            var options;
            var data;

            selectedHeaders && selectedHeaders.length && _.map(selectedHeaders, function (item) {
                return columnOrder.push($(item).attr('data-name'));
            });

            if (!columnOrder.length) {
                return App.render({type: 'error', message: 'Please, check at least 1 column'});
            }

            if (!name) {
                return App.render({type: 'error', message: 'Report name can\'t be empty'});
            }

            var sendObj = {
                name          : name,
                reportType    : reportType,
                publicAccess  : !isPrivate,
                description   : description,
                rows          : columnOrder,
                reportCategory: reportCategory,
                dateRange     : {
                    from: this.startDate,
                    to  : this.lastDate
                }
            };
            var url;

            options = {
                patch  : true,
                success: function () {
                    self.hideDialog();
                    url = Backbone.history.fragment;
                    Backbone.history.fragment = '';
                    Backbone.history.navigate(url, {trigger: true});
                },
                error  : function (model, xhr) {
                    self.errorNotification(xhr);
                }
            };

            if (this.copyReport) {
                options = {
                    success: function () {
                        self.hideDialog();
                        url = Backbone.history.fragment;
                        Backbone.history.fragment = '';
                        Backbone.history.navigate(url, {trigger: true});
                    },
                    error  : function (model, xhr) {
                        self.errorNotification(xhr);
                    }
                };
            }

            this.model.set(sendObj);

            data = this.copyReport ? sendObj : this.model.changed;

            this.model.save(data, options);
        },

        changeDateRange: function (dateArray) {
            this.startDate = dateArray[0];
            this.lastDate = dateArray[1];
        },

        render: function () {
            var self = this;
            var model = this.model.toJSON();
            var constantsReports = CONSTANTREPORTS.reports;
            var formString = this.template({
                fields      : constantsReports,
                typesReports: CONSTANTREPORTS.typesReports,
                model       : model,
                copyReport  : this.copyReport
            });
            var $thisEl;

            this.startDate = model.dateRange && model.dateRange.from;
            this.lastDate = model.dateRange && model.dateRange.to;

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Edit Company',
                width      : '1000',
                buttons    : [
                    {
                        text : 'Save',
                        class: 'btn blue',
                        click: function () {
                            self.saveItem();
                        }
                    },

                    {
                        text : 'Cancel',
                        class: 'btn',
                        click: function () {
                            self.hideDialog();
                        }
                    }
                ]
            });

            $thisEl = this.$el;

            $thisEl.find('.reportsTabs').hide();
            $thisEl.find('#salesReports').show();

            this.dateFilterView = new DateFilterView({
                contentType: 'reports',
                el         : $thisEl.find('#dateFilter'),
                startDate  : this.startDate || '',
                lastDate   : this.lastDate || ''
            });

            this.dateFilterView.checkElement('custom', [this.startDate, this.lastDate]);

            this.dateFilterView.on('dateChecked', function () {
                self.changeDateRange(self.dateFilterView.dateArray);
            });

            this.activateTab();
            this.checkOption();
            this.clickRows();
            this.delegateEvents(this.events);

            $thisEl.find('#checkAll').hide();

            this.$el.find('.stripedList').dragtable({dragHandle: '.dragHandle'});

            return this;
        }
    });
    return EditView;
});
