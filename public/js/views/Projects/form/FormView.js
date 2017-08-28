define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Projects/form/FormTemplate.html',
    'text!templates/Projects/projectInfo/DetailsTemplate.html',
    'text!templates/Projects/projectInfo/proformRevenue.html',
    'text!templates/Projects/projectInfo/jobsWTracksTemplate.html',
    'text!templates/Projects/projectInfo/invoiceStats.html',
    'views/Projects/projectInfo/journalEntriesForJob/dialogView',
    'views/selectView/selectView',
    'views/order/EditView',
    'views/invoice/EditView',
    'views/Projects/EditView',
    'views/Notes/NoteView',
    'views/Notes/AttachView',
    'views/Assignees/AssigneesView',
    'views/Projects/projectInfo/wTracks/wTrackView',
    'views/Projects/projectInfo/projectMembers/projectMembersList',
    'views/Projects/projectInfo/payments/paymentView',
    'views/Projects/projectInfo/invoices/invoiceView',
    'views/Projects/projectInfo/wTracks/generateWTrack',
    'views/Projects/projectInfo/orders/orderView',
    'views/projectCharts/index',
    'views/Projects/CreateView',
    'collections/wTrack/filterCollection',
    'collections/order/filterCollection',
    'collections/invoice/filterCollection',
    'collections/customerPayments/filterCollection',
    'collections/Jobs/filterCollection',
    'collections/projectMembers/editCollection',
    'models/orderModel',
    'models/InvoicesModel',
    'text!templates/Notes/AddAttachments.html',
    'common',
    'populate',
    'custom',
    'dataService',
    'async',
    'helpers',
    'constants'
], function (Backbone,
             $,
             _,
             ProjectsFormTemplate,
             DetailsTemplate,
             ProformRevenueTemplate,
             jobsWTracksTemplate,
             invoiceStats,
             ReportView,
             selectView,
             EditViewOrder,
             EditViewInvoice,
             EditView,
             NoteView,
             AttachView,
             AssigneesView,
             WTrackView,
             ProjectMembersView,
             PaymentView,
             InvoiceView,
             GenerateWTrack,
             OrderView,
             ProjectChartsView,
             CreateView,
             WTrackCollection,
             OrderCollection,
             InvoiceCollection,
             PaymentCollection,
             JobsCollection,
             ProjectMembersCol,
             OrderModel,
             InvoiceModel,
             addAttachTemplate,
             common,
             populate,
             custom,
             dataService,
             async,
             helpers,
             CONSTANTS) {
    'use strict';

    var View = Backbone.View.extend({
        el              : '#content-holder',
        contentType     : 'Projects',
        proformRevenue  : _.template(ProformRevenueTemplate),
        invoiceStatsTmpl: _.template(invoiceStats),

        events: {
            'click .chart-tabs'                                                                    : 'changeTab',
            'click .deleteAttach'                                                                  : 'deleteAttach',
            'click #health a'                                                                      : 'showHealthDd',
            'click #health ul li div:not(.disabled)'                                               : 'chooseHealthDd',
            'click .newSelectList li:not(.miniStylePagination):not(.disabled)'                     : 'chooseOption',
            'click .current-selected:not(.disabled)'                                               : 'showNewSelect',
            'click #createItem'                                                                    : 'createDialog',
            'click #createJob'                                                                     : 'createJob',
            'change input:not(.checkbox, .checkAll, .statusCheckbox, #inputAttach, #noteTitleArea)': 'showSaveButton',  // added id for noteView
            'change #description'                                                                  : 'showSaveButton',
            'click #jobsItem td:not(.selects, .remove, a.invoice, .report)'                        : 'renderJobWTracks',
            'mouseover #jobsItem'                                                                  : 'showRemoveButton',
            'mouseleave #jobsItem'                                                                 : 'hideRemoveButton',
            'click .icon-trash'                                                                    : 'removeJobAndWTracks',
            'dblclick td.editableJobs'                                                             : 'editRow',
            'click #saveName'                                                                      : 'saveNewJobName',
            'keydown input.editing '                                                               : 'keyDown',
            click                                                                                  : 'hideSelect',
            keydown                                                                                : 'keydownHandler',
            'click a.invoice'                                                                      : 'viewInvoice',
            'click a.order'                                                                        : 'viewOrder',
            'click .report'                                                                        : 'showReport'
        },

        initialize: function (options) {
            var eventChannel = {};

            _.extend(eventChannel, Backbone.Events);
            App.projectInfo = App.projectInfo || {};
            App.projectInfo.projectId = options.model.get('_id');
            this.CreateView = CreateView;

            this.eventChannel = eventChannel;
            this.formModel = options.model;
            this.id = this.formModel.id;
            this.formModel.urlRoot = '/projects/';
            this.salesManager = this.formModel.get('salesManager');
            this.responseObj = {};
            this.proformValues = {};

            this.listenTo(eventChannel, 'newPayment paymentRemoved', this.newPayment);
            this.listenTo(eventChannel, 'elemCountChanged', this.renderTabCounter);
            this.listenTo(eventChannel, 'orderCreate orderRemove orderUpdate invoiceRemove', this.getOrders);
            this.listenTo(eventChannel, 'invoiceUpdated', this.updateInvoiceProforma);
            this.listenTo(eventChannel, 'invoiceReceive', this.newInvoice);
            this.listenTo(eventChannel, 'generatedTcards', this.getWTrack);
            this.listenTo(eventChannel, 'updateJobs', this.renderProjectInfo);
        },

        createItem: function () {
          return new this.CreateView({});
        },

        editRow: function (e) {
            var el = $(e.target);
            var tr = $(e.target).closest('tr');
            var tempContainer;
            var editedElement;
            var editedCol;
            var editedElementValue;
            var insertedInput;

            if (el.prop('tagName') !== 'INPUT') {
                editedElement = $('#projectTeam').find('.editing');

                if (editedElement.length) {
                    editedCol = editedElement.closest('td');
                    editedElementValue = editedElement.val();

                    editedCol.text(editedElementValue);
                    editedElement.remove();
                }
            }

            tempContainer = el.text();
            el.html('<input class="editing" type="text" maxlength="32" value="' + tempContainer + '">' + "<a href='javascript;' class='icon-checked' title='Save' id='saveName'></a>");

            insertedInput = el.find('input');
            insertedInput.focus();
            insertedInput[0].setSelectionRange(0, insertedInput.val().length);

            return false;
        },

        viewOrder: function (e) {
            var self = this;
            var $target = $(e.target);
            var id = $target.attr('data-id');
            var model;
            var type = $target.closest('tr').find('#type').text();
            var onlyView = false;

            e.stopPropagation();

            model = new OrderModel({validate: false});

            model.urlRoot = '/order/';
            model.fetch({
                data   : {
                    id      : id,
                    viewType: 'form'
                },
                success: function (model) {

                    if (type === 'Invoiced') {
                        onlyView = true;
                    }

                    return new EditViewOrder({
                        model         : model,
                        redirect      : true,
                        onlyView      : onlyView,
                        projectManager: self.salesManager
                    });
                },

                error: function () {
                    App.render({
                        type   : 'error',
                        message: 'Please refresh browser'
                    });
                }
            });
        },

        viewInvoice: function (e) {
            var self = this;
            var target = e.target;
            var id = $(target).attr('data-id');
            var model = new InvoiceModel({validate: false});

            e.stopPropagation();

            model.urlRoot = '/invoice/';
            model.fetch({
                data: {
                    id       : id,
                    currentDb: App.currentDb,
                    viewType : 'form'
                },

                success: function (model) {
                    return new EditViewInvoice({
                        model       : model,
                        notCreate   : true,
                        redirect    : true,
                        eventChannel: self.eventChannel
                    });
                },

                error: function () {
                    App.render({
                        type   : 'error',
                        message: 'Please refresh browser'
                    });
                }
            });
        },

        keyDown: function (e) {
            if (e.which === 13) {
                this.saveNewJobName(e);
            }
        },

        showReport: function (e) {
            var tr = $(e.target).closest('tr');
            var id = tr.attr('data-id');

            App.startPreload();

            return new ReportView({_id: id});
        },

        saveNewJobName: function (e) {
            var nameRegExp = /^[a-zA-Z0-9\s][a-zA-Z0-9-,\s\.\/\s]+$/;
            var self = this;
            var $target = $(e.target);
            var _id = window.location.hash.split('form/')[1];
            var id = $target.parents('td').closest('tr').attr('data-id');
            var name = $target.prev('input').val() ? $target.prev('input').val() : $target.val();
            var data = {_id: id, name: name};

            e.preventDefault();

            if (nameRegExp.test(name)) {
                dataService.postData('/jobs/update', data, function (err, result) {
                    var filter;

                    if (err) {
                        return console.log(err);
                    }

                    self.$el.find('#saveName').hide();

                    $target.parents('td').text(name);

                    $target.prev('input').remove();

                    filter = {
                        project: {
                            key  : 'project._id',
                            value: [_id],
                            type : 'ObjectId'
                        }
                    };

                    self.wCollection.getFirstPage({page: 1, filter: filter});

                });
            } else {
                App.render({
                    type   : 'error',
                    message: 'Please, enter Job name!'
                });
            }
        },

        recalcTotal: function (id) {
            var jobsItems = this.jobsCollection.toJSON();
            var rate;

            var job = _.find(jobsItems, function (element) {
                return element._id === id;
            });

            var budgetTotal = job.budget.budgetTotal;

            var totalHours = this.$el.find('#totalHours');
            var totalCost = this.$el.find('#totalCost');
            var totalRevenue = this.$el.find('#totalRevenue');
            var totalProfit = this.$el.find('#totalProfit');
            var totalRate = this.$el.find('#totalRate');

            var newHours = totalHours.attr('data-value') - budgetTotal.hoursSum;
            var newCost = totalCost.attr('data-value') - budgetTotal.costSum;
            var newRevenue = totalRevenue.attr('data-value') - budgetTotal.revenueSum;
            var newProfit = totalProfit.attr('data-value') - budgetTotal.profitSum;

            totalHours.text(helpers.currencySplitter(newHours.toFixed()));
            totalCost.text(helpers.currencySplitter(newCost.toFixed()));
            totalRevenue.text(helpers.currencySplitter(newRevenue.toFixed()));
            totalProfit.text(helpers.currencySplitter(newProfit.toFixed()));

            rate = isNaN((totalRevenue.attr('data-value') / totalHours.attr('data-value'))) ? 0 : (totalRevenue.attr('data-value') / totalHours.attr('data-value'));

            totalRate.text(helpers.currencySplitter(rate.toFixed(2)));

            totalHours.attr('data-value', newHours);
            totalCost.attr('data-value', newCost);
            totalRevenue.attr('data-value', newRevenue);
            totalProfit.attr('data-value', newProfit);
            totalRate.attr('data-value', rate);
        },

        removeJobAndWTracks: function (e) {
            var self = this;
            var $target = $(e.target);
            var _id = window.location.hash.split('form/')[1];
            var id = $target.attr('id');
            var tr = $target.closest('tr');

            var data = {_id: id};

            var answer = confirm('Really delete Job ?!');

            if (answer === true) {
                dataService.deleteData('/jobs/' + id, data, function (err) {
                    var filter;

                    if (err) {
                        return console.log(err);
                    }

                    self.eventChannel.trigger('updateJob');

                    tr.remove();

                    self.renderJobWTracks(e);

                    self.recalcTotal(id);

                    filter = {
                        project: {
                            key  : 'project._id',
                            value: [_id],
                            type : 'ObjectId'
                        }
                    };

                    self.wCollection.getFirstPage({page: 1, filter: filter});

                });
            }
        },

        hideRemoveButton: function (e) {
            var target = e.target;
            var tr = $(target).parents('tr');
            var removeItem = tr.find('.icon-trash');

            removeItem.addClass('hidden');
        },

        showRemoveButton: function (e) {
            var target = e.target;
            var tr = $(target).parents('tr');
            var removeItem = tr.find('.icon-trash').not('.notRemovable');

            removeItem.removeClass('hidden');
        },

        renderJobWTracks: function (e) {
            var $target = $(e.target);
            var jobId = $target.parents('tr').attr('data-id');
            var jobContainer = $target.parents('tr');
            var template = _.template(jobsWTracksTemplate);
            var jobsItems = this.jobsCollection.toJSON();
            var icon = $(jobContainer).find('.expand');
            var subId = 'subRow-row' + jobId;
            var subRowCheck = $('#' + subId);
            var name = $target.parents('tr').find('#jobsName').text();

            var job = _.find(jobsItems, function (element) {
                return element._id === jobId;
            });

            if (icon.html() === '-') {
                icon.html('+');
                $(subRowCheck).hide();
            } else {
                icon.html('-');
                $('<tr id=' + subId + ' class="subRow">' +
                    '<td colspan="13" id="subRow-holder' + jobId + '"></td>' +
                    '</tr>').insertAfter(jobContainer);
                $('#subRow-holder' + jobId).append(template({
                    jobStatus       : job.type,
                    jobItem         : job,
                    currencySplitter: helpers.currencySplitter,
                    currencyClass   : helpers.currencyClass
                }));

            }
            this.$el.find('#createItem').attr('data-value', name);

        },

        createDialog: function (e) {
            var jobs = {};
            var self = this;
            var $target = $(e.target);
            var job;

            jobs._id = $target.attr('data-id');
            jobs.name = $target.attr('data-value');
            job = this.jobsCollection.get(jobs._id);
            jobs.description = job.get('description');

            if (this.generatedView) {
                this.generatedView.undelegateEvents();
            }

            this.generatedView = new GenerateWTrack({
                model           : this.formModel,
                wTrackCollection: this.wCollection,
                jobs            : jobs,
                eventChannel    : self.eventChannel

            });
        },

        createJob: function () {
            var self = this;
            this.wCollection.unbind();
            this.wCollection.bind('reset', this.renderContent, this);

            if (this.generatedView) {
                this.generatedView.undelegateEvents();
            }

            this.generatedView = new GenerateWTrack({
                reset           : true,
                model           : this.formModel,
                wTrackCollection: this.wCollection,
                createJob       : true,
                eventChannel    : self.eventChannel
            });

            App.projectInfo.currentTab = 'timesheet';
        },

        notHide: function () {
            return false;
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

            this.selectView = new selectView({
                e          : e,
                responseObj: this.responseObj
            });

            $target.append(this.selectView.render().el);

            return false;
        },

        saveItem: function () {
            var $thisEl = this.$el;
            var validation = true;
            var self = this;
            var mid = 39;
            var projectName = $.trim($thisEl.find('#projectName').val());
            var projectShortDesc = $.trim($thisEl.find('#projectShortDesc').val());
            var customer = {};
            var workflow = {};

            var projecttype = $thisEl.find('#projectTypeDD').data('id');
            var paymentTerm = $thisEl.find('#payment_terms').data('id');
            var paymentMethod = $thisEl.find('#payment_method').data('id');
            var $userNodes = $('#usereditDd option:selected');
            var users = [];

            var budget = this.formModel.get('budget');

            var usersId = [];
            var groupsId = [];

            var whoCanRW = $thisEl.find("[name='whoCanRW']:checked").val();
            var health = $thisEl.find('#health a').data('value');
            var customerName;
            var description = $.trim($thisEl.find('#description').val());
            var data = {
                name            : projectName,
                projectShortDesc: projectShortDesc,
                customer        : customer || null,
                workflow        : workflow || null,
                projecttype     : projecttype || '',
                description     : description,
                paymentTerms    : paymentTerm,
                paymentMethod   : paymentMethod,
                teams           : {
                    users: users
                },

                groups: {
                    owner: $thisEl.find('#allUsersSelect').attr('data-id') || null,
                    users: usersId,
                    group: groupsId
                },

                whoCanRW: whoCanRW,
                health  : health,
                budget  : budget
            };

            customer._id = $thisEl.find('#customerDd').data('id');
            customerName = $thisEl.find('#customerDd').text();
            customerName = customerName.split(' ');

            if (customerName.length) {
                customer.name = {
                    first: customerName[0] || '',
                    last : customerName[1] || ''
                };
            } else {
                customer.name = {
                    first: '',
                    last : ''
                };
            }

            workflow._id = $thisEl.find('#workflowsDd').data('id');
            workflow.name = $thisEl.find('#workflowsDd').text();

            $userNodes.each(function (key, val) {
                users.push({
                    id  : val.value,
                    name: val.innerHTML
                });
            });

            $('.groupsAndUser tr').each(function () {
                if ($(this).data('type') === 'targetUsers') {
                    usersId.push($(this).data('id'));
                }
                if ($(this).data('type') === 'targetGroups') {
                    groupsId.push($(this).data('id'));
                }

            });

            if (validation) {
                this.formModel.save(data, {
                    patch  : true,
                    headers: {
                        mid: mid
                    },

                    success: function () {

                        self.hideSaveButton();

                        App.render({
                            type   : 'notify',
                            message: 'Data was changed, please refresh browser'
                        });
                    },

                    error: function (model, xhr) {
                        self.errorNotification(xhr);
                    }

                });
            }
        },

        chooseOption: function (e) {
            var self = this;
            var id;
            var data;
            var $target = $(e.target);
            var attrId = $target.closest('.current-selected').attr('id');

            $('.newSelectList').hide();

            if ($target.closest('.current-selected').length) {
                $target.closest('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));
            } else {
                id = $target.parents('td').closest('tr').attr('data-id');

                if (attrId === 'workflow') {
                    data = {_id: id, workflowId: $target.attr('id')};
                } else if (attrId === 'type') {
                    data = {_id: id, type: $target.text()};
                }

                $target.parents('td').find('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));

                dataService.postData('/jobs/update', data, function (err) {
                    if (err) {
                        return console.log(err);
                    }

                });

                return false;
            }

            this.showSaveButton();
        },

        hideNewSelect: function () {
            $('.newSelectList').hide();
            $('#health ul').hide();
        },

        nextSelect: function (e) {
            this.showNewSelect(e, false, true);
        },

        prevSelect: function (e) {
            this.showNewSelect(e, true, false);
        },

        chooseHealthDd: function (e) {
            var target = $(e.target);

            target.parents('#health').find('a').attr('class', $(e.target).attr('class')).attr('data-value', $(e.target).attr('class').replace('health', '')).closest('.health-wrapper').toggleClass('open');

            this.showSaveButton();
        },

        showHealthDd: function (e) {
            $(e.target).closest('.health-wrapper').toggleClass('open');
            return false;
        },

        changeTab: function (e) {
            var target = $(e.target);
            var $aEllement = target.closest('a');
            var n;
            var dialogHolder;

            App.projectInfo = App.projectInfo || {};

            App.projectInfo.currentTab = $aEllement.attr('id').slice(0, -3);  // todo id

            target.closest('.chart-tabs').find('a.active').removeClass('active');
            $aEllement.addClass('active');
            n = target.parents('.chart-tabs').find('li').index($aEllement.parent());
            dialogHolder = $('.dialog-tabs-items');
            dialogHolder.find('.dialog-tabs-item.active').removeClass('active');
            dialogHolder.find('.dialog-tabs-item').eq(n).addClass('active');
        },

        keydownHandler: function (e) {
            switch (e.which) {
                case 13:
                    this.showSaveButton();
                    break;
                default:
                    break;
            }
        },

        hideDialog: function () {
            $('.edit-project-dialog').remove();
            $('.add-group-dialog').remove();
            $('.add-user-dialog').remove();
        },

        fileSizeIsAcceptable: function (file) {
            if (!file) {
                return false;
            }
            return file.size < App.File.MAXSIZE;
        },

        hideSelect: function () {
            // this.$el.find('#health').find('ul').hide(); // edited by Pogorilyak
            this.$el.find('#health').removeClass('open'); // added for hiding list if element in isnt chosen

            if (this.selectView) {
                this.selectView.remove();
            }
        },

        showSaveButton: function () {
            $('#top-bar-saveBtn').show();
        },

        hideSaveButton: function () {
            $('#top-bar-saveBtn').hide();
        },

        renderProjectInfo: function (cb) {
            var self = this;
            var _id = this.id;
            var filter = {
                project: {
                    key  : 'project._id',
                    value: [_id]
                }
            };

            this.jobsCollection = new JobsCollection({
                reset    : true,
                viewType : 'list',
                filter   : filter,
                projectId: _id,
                url      : CONSTANTS.URLS.PROJECTS + _id + '/info'
            });

            this.jobsCollection.unbind();
            this.jobsCollection.bind('reset add remove', self.renderJobs, self);

            if (!cb) {
                cb = function () {

                };
            }

            cb();
        },

        renderJobs: function () {
            var template = _.template(DetailsTemplate);
            var container = this.$el.find('#forInfo');
            var self = this;

            var projectTeam = this.jobsCollection.toJSON();
            var firstJob = projectTeam[0];
            var cost = firstJob ? firstJob.costTotal : 0;
            var revenue = firstJob ? firstJob.revenueTotal : 0;

            this.projectValues = {
                cost   : cost || 0,
                revenue: revenue || 0
            };

            container.html(template({
                jobs            : projectTeam,
                currencySplitter: helpers.currencySplitter,
                contentType     : self.contentType,
                currencyClass   : helpers.currencyClass
            }));

            this.getInvoiceStats();
            this.showProjectCharts();
        },

        getWTrack: function (cb) {
            var self = this;
            var _id = this.id;

            var filter = {
                project: {
                    key  : 'project._id',
                    value: [_id],
                    type : 'ObjectId'
                }
            };

            this.wCollection = new WTrackCollection({
                showMore: false,
                reset   : true,
                viewType: 'list',
                url     : CONSTANTS.URLS.PROJECTS + _id + '/weTracks'
            });

            function createView() {
                var gridStart = $('#grid-start').text();
                var selectedDefaultItemNumber = self.$el.find('.selectedItemsNumber').text();
                var startNumber;
                var itemsNumber;
                var defaultItemsNumber;

                startNumber = parseInt(gridStart, 10);
                startNumber = !isNaN(startNumber) && startNumber > 1 ? startNumber : 1;
                itemsNumber = parseInt(selectedDefaultItemNumber, 10);
                itemsNumber = !isNaN(itemsNumber) ? itemsNumber : CONSTANTS.DEFAULT_ELEMENTS_PER_PAGE;
                defaultItemsNumber = itemsNumber || self.wCollection.namberToShow;

                if (typeof cb === 'function') {
                    cb();
                }

                self.wTrackView = new WTrackView({
                    collection        : self.wCollection,
                    defaultItemsNumber: defaultItemsNumber,
                    filter            : filter,
                    startNumber       : startNumber,
                    project           : self.formModel
                });

                self.wCollection.trigger('fetchFinished', {
                    totalRecords: self.wCollection.totalRecords,
                    currentPage : self.wCollection.currentPage,
                    pageSize    : self.wCollection.pageSize
                });
            }

            /*if (this.eventChannel) {
             this.eventChannel.trigger('updateJobs');
             }*/

            this.wCollection.unbind();
            this.wCollection.bind('reset', createView);
        },

        getInvoiceStats: function (cb) {
            // ToDo optimize
            var _id = window.location.hash.split('form/')[1];
            var self = this;
            var filter = {
                project: {
                    key  : 'project._id',
                    value: [_id],
                    type : 'ObjectId'
                }
            };
            dataService.getData('invoices/stats/project', {filter: filter}, function (response) {
                if (response && response.success) {
                    self.renderInvoiceStats(response.success);
                } else {
                    App.stopPreload();
                }

                if (typeof cb === 'function') {
                    cb();
                }
            });
        },

        renderInvoiceStats: function (data) {
            var statsContainer = this.$el.find('#invoiceStatsContainer');

            statsContainer.html(this.invoiceStatsTmpl({
                invoceStats     : data.invoices,
                invoceStat      : data,
                currencySplitter: helpers.currencySplitter,
                currencyClass   : helpers.currencyClass
            }));
        },

        createView: function () {
            var gridStart = $('#grid-start').text();
            var startNumber = gridStart || 1;

            if (this.wTrackView) {
                this.wTrackView.undelegateEvents();
            }

            this.wTrackView = new WTrackView({
                collection : this.wCollection,
                startNumber: startNumber
            }).render();
        },

        getInvoice: function (cb, invoiceId, activate) {
            var self = this;
            var _id = this.id;
            var callback;

            self.iCollection = new InvoiceCollection({
                showMore   : false,
                reset      : true,
                viewType   : 'list',
                contentType: 'invoice',
                url        : CONSTANTS.URLS.PROJECTS + _id + '/invoices'
            });

            function createView() {

                var invoiceView = new InvoiceView({
                    collection  : self.iCollection,
                    activeTab   : activate,
                    eventChannel: self.eventChannel
                });

                self.renderTabCounter();

                if (invoiceId) {
                    invoiceView.showDialog(invoiceId);
                }

                self.iCollection.trigger('fetchFinished', {
                    totalRecords: self.iCollection.totalRecords,
                    currentPage : self.iCollection.currentPage,
                    pageSize    : self.iCollection.pageSize
                });

                if (typeof(cb) === 'function') {
                    callback();
                }
            }

            callback = _.once(cb);

            self.iCollection.unbind();
            self.iCollection.bind('reset', createView);
        },

        getPayments: function (cb, activate) {
            var self = this;
            var _id = this.id;
            var callback;

            self.payCollection = new PaymentCollection({
                showMore   : false,
                reset      : true,
                viewType   : 'list',
                contentType: 'customerPayments',
                url        : CONSTANTS.URLS.PROJECTS + _id + '/payments'

            });

            function createPayment() {
                var data = {
                    collection  : self.payCollection,
                    activate    : activate,
                    eventChannel: self.eventChannel
                };

                var payView = new PaymentView(data);

                self.payCollection.trigger('fetchFinished', {
                    totalRecords: self.payCollection.totalRecords,
                    currentPage : self.payCollection.currentPage,
                    pageSize    : self.payCollection.pageSize
                });

                if (typeof(cb) === 'function') {
                    callback();
                }

                self.renderTabCounter();
            }

            callback = _.once(cb);

            self.payCollection.unbind();
            self.payCollection.bind('reset', createPayment);
        },

        getProjectMembers: function (cb) {
            var self = this;

            self.pMCollection = new ProjectMembersCol({
                showMore: false,
                reset   : true,
                project : self.formModel.id
            });

            function createPM() {

                var data = {
                    collection: self.pMCollection,
                    project   : self.formModel
                };

                if (cb) {
                    cb();
                }

                new ProjectMembersView(data).render();
            }

            self.pMCollection.unbind();
            self.pMCollection.bind('reset', createPM);
        },

        getOrders: function (cb, orderId, activate) {
            var self = this;
            var _id = this.id;

            var filter = {
                project: {
                    key  : 'project._id',
                    value: [_id]
                },
                isOrder: {
                    key  : 'isOrder',
                    value: ['true']
                }
            };

            this.ordersCollection = new OrderCollection({
                showMore   : false,
                reset      : true,
                viewType   : 'list',
                contentType: 'salesOrders',
                url        : CONSTANTS.URLS.PROJECTS + _id + '/orders'
            });

            function createView() {
                var orderView;

                if (cb) {
                    cb();
                }

                orderView = new OrderView({
                    collection    : self.ordersCollection,
                    projectId     : _id,
                    customerId    : self.formModel.toJSON().customer._id,
                    projectManager: self.salesManager,
                    filter        : filter,
                    eventChannel  : self.eventChannel,
                    activeTab     : activate
                });

                self.renderTabCounter();

                if (orderId) {
                    orderView.showOrderDialog(orderId);
                }

                self.ordersCollection.trigger('fetchFinished', {
                    totalRecords: self.ordersCollection.totalRecords,
                    currentPage : self.ordersCollection.currentPage,
                    pageSize    : self.ordersCollection.pageSize
                });

            }

            /* if (this.eventChannel) {
             this.eventChannel.trigger('updateJobs');
             }*/

            this.ordersCollection.unbind();
            this.ordersCollection.bind('reset', createView);
            this.ordersCollection.bind('add', self.renderProformRevenue);
        },

        renderProformRevenue: function (cb) {
            var self = this;
            var proformContainer = this.$el.find('#proformRevenueContainer');

            var ordersCollectionJSON = this.ordersCollection.toJSON();
            var jobsCollection = this.jobsCollection.toJSON();

            var sum = 0;
            var orderSum = 0;
            var jobSum = 0;
            var jobsCount = 0;
            var tempSum = 0;
            var classCurrency = 'dollar';

            jobsCollection.forEach(function (element) {
                if (element.type === 'Not Ordered') {
                    if (element.quotation && element.quotation.currency._id) {
                        classCurrency = element.quotation.currency._id;
                    }
                    if (element.budget.budgetTotal && (element.budget.budgetTotal.revenueSum !== 0)) {
                        jobSum += parseFloat(element.budget.budgetTotal.revenueSum);
                        jobSum /= 100;
                        jobsCount++;
                    }
                } else if (element.type === 'Ordered') {
                    tempSum = parseFloat(element.revenueTotal);
                    if (element.quotation && element.quotation.currency._id) {
                        classCurrency = element.quotation.currency._id;
                    }
                    orderSum = tempSum / 100;
                } else if (element.type === 'Invoiced') {
                    tempSum = parseFloat(element.revenueTotal);
                    if (element.quotation && element.quotation.currency._id) {
                        classCurrency = element.quotation.currency._id;
                    }
                    orderSum = tempSum / 100;
                }
            });

            this.proformValues.orders = {
                count: ordersCollectionJSON.length,
                sum  : orderSum
            };

            this.proformValues.jobs = {
                count: jobsCount,
                sum  : jobSum
            };

            proformContainer.html(this.proformRevenue({
                proformValues   : self.proformValues,
                currencySplitter: helpers.currencySplitter,
                currencyClass   : helpers.currencyClass,
                classCurrency   : classCurrency
            }));

            if (typeof cb === 'function') {
                cb();
            }
        },

        renderTabCounter: function () {
            var self = this;
            var $tabs = this.$el.find('.countable');
            var $table;
            var count;
            var id;

            $tabs.each(function () {
                var $tab = $(this);

                id = $tab.attr('id');
                id = id.replace('Tab', '');
                $table = self.$el.find('#' + id).find('tbody tr');
                count = $table.length;
                $tab.find('span').text(' (' + count + ')');
            });
        },

        editItem: function () {
            var self = this;
            var inputs = this.$el.find(':input[readonly="readonly"]');
            var textArea = this.$el.find('.projectDescriptionEdit');
            var selects = this.$el.find('.disabled');

            selects.removeClass('disabled');

            inputs.attr('readonly', false);
            textArea.attr('readonly', false);

            this.$el.find('#StartDate').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                onSelect   : function () {
                    var endDate = $('#StartDate').datepicker('getDate');
                    endDate.setDate(endDate.getDate());
                    $('#EndDateTarget').datepicker('option', 'minDate', endDate);
                }
            });
            this.$el.find('#EndDate').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                onSelect   : function () {
                    var endDate = $('#StartDate').datepicker('getDate');
                    endDate.setDate(endDate.getDate());
                    $('#EndDateTarget').datepicker('option', 'minDate', endDate);
                }
            });
            this.$el.find('#EndDateTarget').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                minDate    : (self.formModel.StartDate) ? self.formModel.StartDate : 0
            });
            this.$el.find('#StartDate').datepicker('option', 'disabled', false);
            this.$el.find('#EndDate').datepicker('option', 'disabled', false);
            this.$el.find('#EndDateTarget').datepicker('option', 'disabled', false);

            $('#top-bar-saveBtn').show();
            $('#createQuotation').show();
        },

        deleteItems: function () {
            var mid = 39;

            this.formModel.urlRoot = '/Projects';
            this.formModel.destroy({
                headers: {
                    mid: mid
                },
                success: function () {
                    Backbone.history.navigate('#easyErp/Projects/thumbnails', {trigger: true});
                }
            });

        },

        newPayment: function () {
            var self = this;
            var paralellTasks;

            paralellTasks = [
                self.getInvoice,
                self.renderProformRevenue,
                self.getInvoiceStats,
                self.getOrders
            ];

            App.startPreload();

            async.parallel(paralellTasks, function () {
                self.getPayments(null, true);
                App.stopPreload();
            });

        },

        updateInvoiceProforma: function () {
            var self = this;
            var paralellTasks;

            paralellTasks = [
                self.getInvoice,
                self.getPayments
            ];

            App.startPreload();

            async.parallel(paralellTasks, function () {
                App.stopPreload();
            });

        },

        newInvoice: function (invoiceId, activate) {
            var self = this;
            var paralellTasks;

            var getInvoiceWithParams = function (cb) {
                self.getInvoice(cb, invoiceId, activate);
            };

            paralellTasks = [
                self.getInvoiceStats,
                getInvoiceWithParams,
                self.getOrders
            ];

            App.startPreload();

            async.parallel(paralellTasks, function () {
                App.stopPreload();
            });

        },

        showProjectCharts: function () {
            var data = {
                data: this.projectValues
            };

            return new ProjectChartsView(data);
        },

        render: function () {
            var formModel = this.formModel.toJSON();
            var templ = _.template(ProjectsFormTemplate);
            var assignees;
            var paralellTasks;
            var self = this;
            var $thisEl = this.$el;
            var notesEl;
            var atachEl;
            var notDiv;
            var container;
            var accessData = App.currentUser && App.currentUser.profile && App.currentUser.profile.profileAccess || [];

            App.startPreload();

            notesEl = new NoteView({
                model      : this.formModel,
                contentType: self.contentType
            }).render().el;

            $thisEl.html(templ({
                model        : formModel,
                currencyClass: helpers.currencyClass
            }));

            App.projectInfo = App.projectInfo || {};
            App.projectInfo.currentTab = App.projectInfo.currentTab ? App.projectInfo.currentTab : 'overview';

            populate.get('#projectTypeDD', CONSTANTS.URLS.PROJECT_TYPE, {}, 'name', this, false, true);
            populate.get2name('#customerDd', CONSTANTS.URLS.CUSTOMERS, {}, this, false, false);
            populate.getWorkflow('#workflowsDd', '#workflowNamesDd', CONSTANTS.URLS.WORKFLOWS_FORDD, {id: 'Projects'}, 'name', this);
            populate.getWorkflow('#workflow', '#workflowNames', CONSTANTS.URLS.WORKFLOWS_FORDD, {id: 'Jobs'}, 'name', this);
            populate.get('#payment_terms', '/paymentTerm', {}, 'name', this, true, true);
            populate.get('#payment_method', '/paymentMethod', {}, 'name', this, true, true);

            notDiv = this.$el.find('#divForNote');
            notDiv.html(notesEl);
            notDiv.append(atachEl);

            this.formModel.bind('chooseAssignee', this.showSaveButton);

            assignees = $thisEl.find('#assignees-container');
            assignees.html(
                new AssigneesView({
                    model: this.formModel
                }).render().el
            );

            _.bindAll(this, 'getProjectMembers', 'getOrders', 'getWTrack', 'renderProformRevenue', 'renderProjectInfo', 'renderJobs', 'getInvoice', 'getInvoiceStats', 'getPayments');

            paralellTasks = [this.renderProjectInfo, this.getOrders, self.getProjectMembers];

            accessData.forEach(function (accessElement) {
                if (accessElement.module === 64) {
                    if (accessElement.access.read) {
                        paralellTasks.push(self.getInvoice);
                        paralellTasks.push(self.getPayments);
                    } else {
                        $thisEl.find('#invoicesTab').parent().remove();
                        $thisEl.find('div#invoices').parent().remove();
                        $thisEl.find('#paymentsTab').parent().remove();
                        $thisEl.find('div#payments').parent().remove();

                        self.getPayments = function () {
                        };
                        self.getInvoiceStats = function () {
                        };
                    }
                }

                if (accessElement.module === 75) {
                    if (accessElement.access.read) {
                        paralellTasks.push(self.getWTrack);
                    } else {
                        $thisEl.find('#timesheetTab').parent().remove();
                        $thisEl.find('div#timesheet').parent().remove();
                    }
                }

            });

            if (!accessData.length) {
                paralellTasks.push(self.getInvoice);
                paralellTasks.push(self.getWTrack);
                paralellTasks.push(self.getProjectMembers);
            }

            async.parallel(paralellTasks, function (err, result) {
                App.stopPreload();
                self.renderProformRevenue();
               // $('#top-bar-createBtn').remove();
                $('#top-bar-deleteBtn').remove();

                if (!$('._jobsItem').length) {
                    $('#createOrder').hide();
                }
            });

            $('ul.export').hide();
            $('#top-bar-deleteBtn').hide();
            $('#top-bar-exportToCsvBtn').parent('.btn').hide();
            $('#top-bar-exportToXlsxBtn').parent('.btn').hide();
            $('#createQuotation').show();

            $thisEl.find('#StartDate').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                onSelect   : function () {
                    var endDate = $('#StartDate').datepicker('getDate');
                    endDate.setDate(endDate.getDate());
                    $thisEl.find('#EndDateTarget').datepicker('option', 'minDate', endDate);
                    $thisEl.find('#EndDate').datepicker('option', 'minDate', endDate); // added minDate after selecting new startDate

                    self.showSaveButton();
                }
            });

            $thisEl.find('#EndDate').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                minDate    : $thisEl.find('#StartDate').datepicker('getDate'), // added minDate at start
                onSelect   : function () {
                    var endDate = $('#StartDate').datepicker('getDate');
                    endDate.setDate(endDate.getDate());
                    $thisEl.find('#EndDateTarget').datepicker('option', 'minDate', endDate);

                    self.showSaveButton();
                }
            });

            $thisEl.find('#EndDateTarget').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                minDate    : (self.formModel.StartDate) ? self.formModel.StartDate : 0
            });



            return this;

        }
    });

    return View;
});
