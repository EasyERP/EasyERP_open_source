define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/reports/CreateTemplate.html',
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
    'constants/googleAnalytics',
    'constants',
    'moment',
    'helpers/ga'
], function (Backbone, $, _, CreateTemplate, FakePreviewTemplate, model, DateFilterView, ParentView, LeadModel, common, populate, dataService, AttachView, CONSTANTREPORTS, GA, CONSTANTS, moment, ga) {

    var CreateView = ParentView.extend({
        el                 : '#content-holder',
        contentType        : 'reports',
        template           : _.template(CreateTemplate),
        fakePreviewTemplate: _.template(FakePreviewTemplate),

        initialize: function () {
            _.bindAll(this, 'saveItem', 'render');
            this.model = new model();
            this.responseObj = {};

            this.render();
        },

        events: {
            'click .reportsBtn' : 'showTabs',
            'click .reportsTab' : 'activateTab',
            'click .reportCheck': 'checkCol',
            'click #checkAll'   : 'checkAllColumns'
        },

        checkCol: function (e, th, check) {
            var $thisEl = this.$el;
            var $target = e ? $(e.target).closest('th') : th;

            e && e.stopPropagation();

            var hoverClass = $target.attr('data-reportType');
            var dataHover = $target.attr('data-hover');

            if (dataHover && !check) {
                $thisEl.find('.' + hoverClass).removeAttr('data-hover');
                $thisEl.find('.' + hoverClass).removeClass('selected');
                return;
            }

            $thisEl.find('.' + hoverClass).attr('data-hover', hoverClass);
            $thisEl.find('.' + hoverClass).addClass('selected');
        },

        checkAllColumns: function (e) {
            var self = this;
            var $target = $(e.target);

            if ($target.hasClass('checked')) {
                $target.removeClass('checked');

                $target.text('Check All');

                this.$el.find('.stripedList th').each(function () {

                    $(this).find('.reportCheck').prop('checked', false);

                    self.checkCol(null, $(this));
                });

                return;
            }

            $target.addClass('checked');

            this.$el.find('.stripedList th').each(function () {
                self.checkCol(null, $(this), true);

                $target.text('Uncheck All');

                $(this).find('.reportCheck').prop('checked', true);
            });
        },

        activateTab: function (e) {
            var $thisEl = this.$el;
            var constants = CONSTANTREPORTS.reports;
            var template = this.fakePreviewTemplate;
            var data = {};
            var header;
            var $target;
            var id;

            $target = $thisEl.find(e.target);
            id = $target.attr('id');

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

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventAction  : GA.EVENT_ACTIONS.REPORT_BY,
                eventLabel   : id,
                eventValue   : GA.EVENTS_VALUES[1],
                fieldsObject : {}
            });
        },

        showTabs: function (e) {
            var $target = $(e.target).closest('li');
            var $thisEl = this.$el;

            $thisEl.find('._tabItem').removeClass('active');
            $target.addClass('active');

            $thisEl.find('.reportsTabs').stop(true, false).hide(350);
            $thisEl.find('.' + $target.attr('data-ids')).stop(true, false).toggle(350);
            //  $thisEl.find('#previewForCreate').html('');

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventAction  : GA.EVENT_ACTIONS.CREATE_REPORT_TABS,
                eventLabel   : $target.attr('data-ids'),
                eventValue   : GA.EVENTS_VALUES[0],
                fieldsObject : {}
            });
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

        saveItem: function () {
            var self = this;
            var $thisEl = this.$el;
            var name = $.trim($thisEl.find('#nameReport').val());
            var reportType = $($thisEl.find('.active.reportsTab')[0]).attr('id');
            var reportCategory = $thisEl.find('.reportCategory.active').data('ids');
            var description = $.trim($thisEl.find('#description').val());
            var isPrivate = $thisEl.find('#isPrivate').is(':checked');
            var selectedHeaders = $('.headTable.selected');
            var columnOrder = [];

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
                reportCategory: reportCategory,
                publicAccess  : !isPrivate,
                description   : description,
                rows          : columnOrder,
                dateRange     : {
                    from: this.startDate,
                    to  : this.lastDate
                }
            };

            this.model.save(sendObj, {
                wait   : true,
                success: function (model) {
                    self.hideDialog();
                    Backbone.history.fragment = '';
                    Backbone.history.navigate('#easyErp/reports', {trigger: true});
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        changeDateRange: function (dateArray) {
            this.startDate = dateArray[0];
            this.lastDate = dateArray[1];
        },

        render: function () {
            var self = this;
            var formString = this.template({
                fields      : CONSTANTREPORTS.reports,
                typesReports: CONSTANTREPORTS.typesReports
            });
            var $thisEl;

            this.startDate = moment().format('D MMM, YYYY');
            this.lastDate = moment().format('D MMM, YYYY');

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Edit Company',
                width      : '800',
                buttons    : [
                    {
                        text : 'Create',
                        class: 'btn blue',
                        click: function () {
                            self.saveItem();
                        }
                    }, {
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
                el         : $thisEl.find('#dateFilter')
            });

            this.dateFilterView.checkElement('custom', [this.startDate, this.lastDate]);

            this.dateFilterView.on('dateChecked', function () {
                self.changeDateRange(self.dateFilterView.dateArray);
            });

            this.delegateEvents(this.events);

            $thisEl.find('[data-ids="salesReports"] .reportsBtn').first().click();
            $thisEl.find('#salesByProductReport').first().click();

            this.$el.find('.stripedList').dragtable({dragHandle: '.dragHandle'});

            return this;
        }

    });

    return CreateView;
});
