/**
 * Created by liliya on 17.09.15.
 */
define([
        'text!templates/Projects/form/FormTemplate.html',
        'text!templates/Projects/projectInfo/DetailsTemplate.html',
        'text!templates/Projects/projectInfo/proformRevenue.html',
        'text!templates/Projects/projectInfo/jobsWTracksTemplate.html',
        'views/salesOrder/EditView',
        'views/salesInvoice/EditView',
        'views/Projects/EditView',
        'views/Notes/NoteView',
        'views/Notes/AttachView',
        'views/Assignees/AssigneesView',
        'views/Bonus/BonusView',
        'views/Projects/projectInfo/wTracks/wTrackView',
        'views/Projects/projectInfo/payments/paymentView',
        'views/Projects/projectInfo/invoices/invoiceView',
        'views/Projects/projectInfo/quotations/quotationView',
        'views/Projects/projectInfo/wTracks/generateWTrack',
        'views/Projects/projectInfo/orders/orderView',
        'collections/wTrack/filterCollection',
        'collections/Quotation/filterCollection',
        'collections/salesInvoice/filterCollection',
        'collections/customerPayments/filterCollection',
        'collections/Jobs/filterCollection',
        'models/QuotationModel',
        'models/InvoiceModel',
        'text!templates/Notes/AddAttachments.html',
        "common",
        'populate',
        'custom',
        'dataService',
        'async',
        'helpers'
    ],

    function (ProjectsFormTemplate, DetailsTemplate, ProformRevenueTemplate, jobsWTracksTemplate, EditViewOrder, editViewInvoice, EditView, noteView, attachView, AssigneesView, BonusView, wTrackView, PaymentView, InvoiceView, QuotationView, GenerateWTrack, oredrView, wTrackCollection, quotationCollection, invoiceCollection, paymentCollection, jobsCollection, quotationModel, invoiceModel, addAttachTemplate, common, populate, custom, dataService, async, helpers) {
        var View = Backbone.View.extend({
            el            : '#content-holder',
            contentType   : 'Projects',
            proformRevenue: _.template(ProformRevenueTemplate),

            events: {
                'click .chart-tabs'                                               : 'changeTab',
                'click .deleteAttach'                                             : 'deleteAttach',
                "click #health a:not(.disabled)"                                  : "showHealthDd",
                "click #health ul li div:not(.disabled)"                          : "chooseHealthDd",
                "click .newSelectList li:not(.miniStylePagination):not(.disabled)": "chooseOption",
                "click .newSelectList li.miniStylePagination"                     : "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
                "click .current-selected:not(.disabled)"                          : "showNewSelect",
                "click #createItem"                                               : "createDialog",
                "click #createJob"                                                : "createJob",
                "change input:not(.checkbox, .check_all, .statusCheckbox)"        : "showSaveButton",
                "click #jobsItem td:not(.selects, .remove, a.quotation, a.invoice)" : "renderJobWTracks",
                "mouseover #jobsItem"                                             : "showRemoveButton",
                "mouseleave #jobsItem"                                            : "hideRemoveButton",
                "click .fa.fa-trash"                                              : "removeJobAndWTracks",
                "dblclick td.editableJobs"                                        : "editRow",
                "click #saveName"                                                 : "saveNewJobName",
                "keydown input.editing "                                          : "keyDown",
                'click'                                                           : 'hideSelect',
                'keydown'                                                         : 'keydownHandler',
                "click a.quotation"                                              : "viewQuotation",
                "click a.invoice"                                                : "viewInvoice"
            },

            initialize: function (options) {
                this.formModel = options.model;
                this.id = this.formModel.id;
                this.formModel.urlRoot = '/Projects/';
                this.responseObj = {};
                this.proformValues = {};
            },

            viewQuotation: function(e){
                e.stopPropagation();

                var target = e.target;
                var id = $(target).attr('data-id');
                var model = new quotationModel({validate: false});

                model.urlRoot = '/Order/form/' + id;
                model.fetch({
                    success: function (model) {
                        new EditViewOrder({
                            model     : model,
                            onlyView: true
                        });
                    },
                    error  : function (xhr) {
                        alert('Please refresh browser');
                    }
                });
            },

            viewInvoice: function(e){
                e.stopPropagation();

                var target = e.target;
                var id = $(target).attr('data-id');
                var model = new invoiceModel({validate: false});

                model.urlRoot = '/Invoice/form';
                model.fetch({
                    data   : {
                        id       : id,
                        currentDb: App.currentDb
                    },
                    success: function (model) {
                        new editViewInvoice({
                            model: model,
                            notCreate: true,
                            redirect: true
                        });
                    },
                    error  : function () {
                        alert('Please refresh browser');
                    }
                });
            },

            keyDown: function (e) {
                if (e.which === 13) {
                    this.saveNewJobName(e);
                }
            },

            editRow: function (e, prev, next) {
                var el = $(e.target);
                var tr = $(e.target).closest('tr');
                var tempContainer;
                var width;
                var editedElement;
                var editedCol;
                var editedElementValue;
                var insertedInput;

                if (el.prop('tagName') !== 'INPUT') {
                    editedElement = $("#projectTeam").find('.editing');

                    if (editedElement.length) {
                        editedCol = editedElement.closest('td');
                        editedElementValue = editedElement.val();

                        editedCol.text(editedElementValue);
                        editedElement.remove();
                    }
                }

                tempContainer = el.text();
                // width = el.width() - 31;
                el.html('<input class="editing" type="text" maxlength="32" value="' + tempContainer + '">' + "<a href='javascript;' class='fa fa-check' title='Save' id='saveName'></a>");

                insertedInput = el.find('input');
                insertedInput.focus();
                insertedInput[0].setSelectionRange(0, insertedInput.val().length);

                return false;
            },

            saveNewJobName: function (e) {
                e.preventDefault();

                // var nameRegExp = /^[\w\.@]{3,100}$/;
                var nameRegExp = /^[a-zA-Z0-9\s][a-zA-Z0-9-,\s\.\/\s]+$/;
                var self = this;
                var _id = window.location.hash.split('form/')[1];
                var id = $(e.target).parents("td").closest('tr').attr('data-id');
                var name = $(e.target).prev('input').val() ? $(e.target).prev('input').val() : $(e.target).val();

                var data = {_id: id, name: name};
                if (nameRegExp.test(name)) {
                    dataService.postData("/jobs/update", data, function (err, result) {
                        if (err) {
                            return console.log(err);
                        }

                        $('#saveName').hide();

                        $(e.target).parents("td").text(name);

                        $(e.target).prev('input').remove();

                        var filter = {
                            'projectName': {
                                key  : 'project._id',
                                value: [_id]
                            }
                        };

                        self.wCollection.showMore({count: 50, page: 1, filter: filter});

                    });
                } else {
                    alert("Please, enter Job name!");
                }
            },

            recalcTotal: function (id) {
                var formModel = this.formModel.toJSON();
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
                var _id = window.location.hash.split('form/')[1];
                var id = $(e.target).attr('id');
                var tr = $(e.target).closest('tr');

                var data = {_id: id};

                var answer = confirm("Really delete Job ?!");

                if (answer === true) {
                    dataService.postData("/jobs/remove", data, function (err, result) {
                        if (err) {
                            return console.log(err);
                        }

                        tr.remove();

                        self.renderJobWTracks(e);

                        self.recalcTotal(id);

                        var filter = {
                            'projectName': {
                                key  : 'project._id',
                                value: [_id]
                            }
                        };

                        //self.wCollection.unbind();
                        //self.wCollection.bind('showmore', self.showMoreContent);
                        self.wCollection.showMore({count: 50, page: 1, filter: filter});

                    });
                }
            },

            hideRemoveButton: function (e) {
                var target = e.target;
                var tr = $(target).parents("tr");
                var removeItem = tr.find(".fa.fa-trash");

                removeItem.addClass('hidden');
            },

            showRemoveButton: function (e) {
                var target = e.target;
                var tr = $(target).parents("tr");
                var removeItem = tr.find(".fa.fa-trash");

                removeItem.removeClass('hidden');
            },

            renderJobWTracks: function (e) {
                var target = e.target;
                var jobId = $(target).parents("tr").attr("data-id");
                var jobContainer = $(target).parents("tr");
                var template = _.template(jobsWTracksTemplate);
                var formModel = this.formModel.toJSON();
                //var jobsItems = formModel.budget.projectTeam;
                var jobsItems = this.jobsCollection.toJSON();
                var icon = $(jobContainer).find('.expand');
                var subId = "subRow-row" + jobId;
                var subRowCheck = $('#' + subId);
                var name = $(target).parents("tr").find("#jobsName").text();

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
                        currencySplitter: helpers.currencySplitter
                    }));

                }
                $('#createItem').attr('data-value', name);

            },

            createDialog: function (e) {
                var jobs = {};

                jobs._id = $(e.target).attr('data-id');
                jobs.name = $(e.target).attr('data-value');

                if (this.generatedView) {
                    this.generatedView.undelegateEvents();
                }

                this.generatedView = new GenerateWTrack({
                    model           : this.formModel,
                    wTrackCollection: this.wCollection,
                    jobs            : jobs
                });
            },

            createJob: function () {
                this.wCollection.unbind();
                this.wCollection.bind('reset', this.renderContent, this);
                this.wCollection.bind('showmore', this.showMoreContent, this);

                if (this.generatedView) {
                    this.generatedView.undelegateEvents();
                }

                this.generatedView = new GenerateWTrack({
                    model           : this.formModel,
                    wTrackCollection: this.wCollection,
                    createJob       : true
                });
            },

            notHide: function () {
                return false;
            },

            showNewSelect: function (e, prev, next) {
                populate.showSelect(e, prev, next, this);

                return false;
            },

            saveItem: function () {
                var thisEl = this.$el;
                var validation = true;
                var self = this;
                var mid = 39;
                var projectName = $.trim(thisEl.find("#projectName").val());
                var projectShortDesc = $.trim(thisEl.find("#projectShortDesc").val());
                var customer = {};
                var projectmanager = {};
                var workflow = {};

                var projecttype = thisEl.find("#projectTypeDD").data("id");
                var $userNodes = $("#usereditDd option:selected");
                var startDate = $.trim(thisEl.find("#StartDate").val());
                var endDate = $.trim(thisEl.find("#EndDate").val());
                var users = [];
                var bonusContainer = $('#bonusTable');
                var bonusRow = bonusContainer.find('tr');
                var bonus = [];

                var budget = this.formModel.get('budget');

                var usersId = [];
                var groupsId = [];

                var whoCanRW = thisEl.find("[name='whoCanRW']:checked").val();
                var health = thisEl.find('#health a').data('value');
                var _targetEndDate = $.trim(thisEl.find("#EndDateTarget").val());
                var description = $.trim(thisEl.find("#description").val());
                var data = {
                    projectName     : projectName,
                    projectShortDesc: projectShortDesc,
                    customer        : customer ? customer : null,
                    projectmanager  : projectmanager ? projectmanager : null,
                    workflow        : workflow ? workflow : null,
                    projecttype     : projecttype ? projecttype : "",
                    description     : description,
                    teams           : {
                        users: users
                    },
                    groups          : {
                        owner: $("#allUsersSelect").data("id"),
                        users: usersId,
                        group: groupsId
                    },
                    whoCanRW        : whoCanRW,
                    health          : health,
                    StartDate       : startDate,
                    EndDate         : endDate,
                    TargetEndDate   : _targetEndDate,
                    bonus           : bonus,
                    budget          : budget
                };

                customer._id = thisEl.find("#customerDd").data("id");
                customer.name = thisEl.find("#customerDd").text();

                projectmanager._id = thisEl.find("#projectManagerDD").data("id");
                projectmanager.name = thisEl.find("#projectManagerDD").text();

                workflow._id = thisEl.find("#workflowsDd").data("id");
                workflow.name = thisEl.find("#workflowsDd").text();

                $userNodes.each(function (key, val) {
                    users.push({
                        id  : val.value,
                        name: val.innerHTML
                    });
                });

                bonusRow.each(function (key, val) {
                    var employeeId = $(val).find("[data-content='employee']").attr('data-id');
                    var bonusId = $(val).find("[data-content='bonus']").attr('data-id');
                    var value;

                    var startD = $(val).find(".startDate input").val() || null;
                    var endD = $(val).find(".endDate input").val() || null;

                    if (!employeeId || !bonusId) {
                        if (!employeeId) {
                            value = 'Employee';
                            alert('Please, choose ' + value + ' first.');
                        } else if (!bonusId) {
                            value = 'Bonus';
                            alert('Please, choose ' + value + ' first.');
                        }
                        validation = false;
                    }

                    bonus.push({
                        employeeId: employeeId,
                        bonusId   : bonusId,
                        startDate : startD,
                        endDate   : endD
                    });
                });

                $(".groupsAndUser tr").each(function () {
                    if ($(this).data("type") == "targetUsers") {
                        usersId.push($(this).data("id"));
                    }
                    if ($(this).data("type") == "targetGroups") {
                        groupsId.push($(this).data("id"));
                    }

                });

                if (validation) {
                    this.formModel.save(data, {
                        headers: {
                            mid: mid
                        },
                        success: function (model) {
                            var url = window.location.hash;

                            self.hideSaveButton();

                            Backbone.history.fragment = "";
                            Backbone.history.navigate(url, {trigger: true});
                        },
                        error  : function (model, xhr) {
                            self.errorNotification(xhr);
                        }

                    });
                }
            },

            chooseOption: function (e) {
                var data;
                var attrId = $(e.target).parents("td").find(".current-selected").attr('id');

                $(".newSelectList").hide();

                if ($(e.target).parents("dd").find(".current-selected").length) {
                    $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
                } else {
                    $(e.target).parents("td").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id"));

                    var id = $(e.target).parents("td").closest('tr').attr('data-id');

                    if (attrId === 'workflow') {
                        data = {_id: id, workflowId: $(e.target).attr("id"), workflowName: $(e.target).text()};
                    } else if (attrId === 'type') {
                        data = {_id: id, type: $(e.target).text()};
                    }

                    dataService.postData("/jobs/update", data, function (err, result) {
                        if (err) {
                            return console.log(err);
                        }

                    });
                }

                this.showSaveButton();
            },

            hideNewSelect: function () {
                $(".newSelectList").hide();
                $("#health ul").hide();

            },

            nextSelect: function (e) {
                this.showNewSelect(e, false, true);
            },

            prevSelect: function (e) {
                this.showNewSelect(e, true, false);
            },

            chooseHealthDd: function (e) {
                var target = $(e.target);

                target.parents("#health").find("a").attr("class", target.attr("class")).attr("data-value", target.attr("class").replace("health", "")).parent().find("ul").toggle();
            },

            showHealthDd: function (e) {
                $(e.target).parent().find("ul").toggle();
                return false;
            },

            changeTab: function (e) {
                var target = $(e.target);
                var n;
                var dialogHolder;

                target.closest(".chart-tabs").find("a.active").removeClass("active");
                target.addClass("active");
                n = target.parents(".chart-tabs").find("li").index(target.parent());
                dialogHolder = $(".dialog-tabs-items");
                dialogHolder.find(".dialog-tabs-item.active").removeClass("active");
                dialogHolder.find(".dialog-tabs-item").eq(n).addClass("active");
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
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
            },

            fileSizeIsAcceptable: function (file) {
                if (!file) {
                    return false;
                }
                return file.size < App.File.MAXSIZE;
            },

            hideSelect: function () {
                $(".newSelectList").hide();
            },

            showEndContractSelect: function (e) {
                e.preventDefault();
                $(e.target).parent().find(".newSelectList").toggle();
                return false;
            },

            showSaveButton: function () {
                $("#top-bar-saveBtn").show();
            },

            hideSaveButton: function () {
                $("#top-bar-saveBtn").hide();
            },

            renderProjectInfo: function (cb) {
                var self = this;
                var _id = window.location.hash.split('form/')[1];
                var filter = {
                    "project": {
                        key  : "project",
                        value: [_id]
                    }
                };

                this.jobsCollection = new jobsCollection({
                    viewType: 'list',
                    filter  : filter,
                    count   : 50
                });

                this.jobsCollection.bind('reset add remove', self.renderJobs);

                cb();
            },

            renderJobs: function () {
                var template = _.template(DetailsTemplate);
                var container = this.$el.find('#forInfo');
                var formModel = this.formModel.toJSON();
                var self = this;

                var projectTeam = this.jobsCollection.toJSON();

                App.currectCollection = this.jobsCollection;

                this.projectValues = {
                    revenue: 0,
                    profit : 0,
                    cost   : 0
                };

                projectTeam.forEach(function (projectTeam) {
                    var budgetTotal = projectTeam.budget.budgetTotal;

                    self.projectValues.revenue += budgetTotal ? budgetTotal.revenueSum : 0;
                    self.projectValues.profit += budgetTotal ? budgetTotal.profitSum : 0;
                    self.projectValues.cost += budgetTotal ? budgetTotal.costSum : 0;

                });

                this.projectValues.markUp = ((this.projectValues.profit / this.projectValues.cost) * 100);

                if (!isFinite(this.projectValues.markUp)) {
                    self.projectValues.markUp = 0;
                }

                this.projectValues.radio = ((this.projectValues.profit / this.projectValues.revenue) * 100);

                if (!isFinite(this.projectValues.radio)) {
                    this.projectValues.radio = 0;
                }

                container.html(template({
                        jobs            : projectTeam,
                        bonus           : formModel.budget.bonus,
                        projectValues   : self.projectValues,
                        currencySplitter: helpers.currencySplitter,
                        contentType     : self.contentType
                    })
                );

                this.renderProformRevenue();
            },

            getWTrack: function (cb) {
                //var _id = this.formModel.id;
                var self = this;
                var _id = window.location.hash.split('form/')[1];

                var filter = {
                    'projectName': {
                        key  : 'project._id',
                        value: [_id]
                    }
                };

                this.wCollection = new wTrackCollection({
                    viewType: 'list',
                    filter  : filter,
                    count   : 50
                });

                var callback = _.once(cb);

                function createView() {
                    callback();

                    var startNumber = $('#grid-start').text() ? (parseInt($('#grid-start').text()) < 1 ) ? 1 : parseInt($('#grid-start').text()) : 1;

                    if (self.wTrackView) {
                        self.wTrackView.undelegateEvents();
                    }

                    this.wTrackView = new wTrackView({
                        model      : self.wCollection,
                        filter     : filter,
                        startNumber: startNumber
                    }).render();
                };

                function showMoreContent(newModels) {
                    self.wCollection.reset(newModels.toJSON());
                };

                //this.wCollection.unbind();
                this.wCollection.bind('reset', createView);
                this.wCollection.bind('showmore', showMoreContent);
            },

            showMoreContent: function (newModels) {
                var self = this;
                var _id = window.location.hash.split('form/')[1];

                var startNumber = $('#grid-start').text() ? (parseInt($('#grid-start').text()) < 1 ) ? 1 : parseInt($('#grid-start').text()) : 1;

                var filter = {
                    'projectName': {
                        key  : 'project._id',
                        value: [_id]
                    }
                };

                if (self.wTrackView) {
                    self.wTrackView.undelegateEvents();
                }

                this.wTrackView = new wTrackView({
                    model      : self.wCollection,
                    filter     : filter,
                    startNumber: startNumber
                }).render();

                this.wCollection.bind('reset', this.createView);
            },

            createView: function () {

                var startNumber = $('#grid-start').text() ? (parseInt($('#grid-start').text()) < 1 ) ? 1 : parseInt($('#grid-start').text()) : 1;

                if (this.wTrackView) {
                    this.wTrackView.undelegateEvents();
                }

                this.wTrackView = new wTrackView({
                    model      : this.wCollection,
                    filter     : filter,
                    startNumber: startNumber
                }).render();
            },

            getInvoice: function (cb) {
                var self = this;
                var _id = window.location.hash.split('form/')[1];
                var filter = {
                    'project': {
                        key  : 'project._id',
                        value: [_id]
                    }
                };
                var callback;

                self.iCollection = new invoiceCollection({
                    count      : 50,
                    viewType   : 'list',
                    contentType: 'salesInvoice',
                    filter     : filter
                });

                function createView() {
                    var payments = [];

                    callback();

                    App.invoiceCollection = self.iCollection;

                    new InvoiceView({
                        model : self.iCollection,
                        filter: filter
                    }).render();

                    self.iCollection.toJSON().forEach(function (element) {
                        element.payments.forEach(function (payment) {
                            payments.push(payment);
                        });
                    });

                    var filterPayment = {
                        'name': {
                            key  : '_id',
                            value: payments
                        }
                    };

                    self.pCollection = new paymentCollection({
                        count      : 50,
                        viewType   : 'list',
                        contentType: 'customerPayments',
                        filter     : filterPayment
                    });

                    self.pCollection.unbind();
                    self.pCollection.bind('reset', createPayment);

                    function createPayment() {
                        new PaymentView({
                            model : self.pCollection,
                            filter: filterPayment
                        });
                    }

                };

                callback = _.once(cb);

                self.iCollection.unbind();
                self.iCollection.bind('reset', createView);

            },

            getQuotations: function (cb) {
                var _id = window.location.hash.split('form/')[1];
                var self = this;

                var filter = {
                    'projectName': {
                        key  : 'project._id',
                        value: [_id]
                    }
                };

                this.qCollection = new quotationCollection({
                    count      : 50,
                    viewType   : 'list',
                    contentType: 'salesQuotation',
                    filter     : filter
                });

                function createView() {

                    cb();
                    new QuotationView({
                        collection      : self.qCollection,
                        projectId       : _id,
                        customerId      : self.formModel.toJSON().customer._id,
                        projectManager  : self.formModel.toJSON().projectmanager,
                        filter          : filter,
                        model           : self.formModel,
                        wTrackCollection: self.wCollection,
                        createJob       : true
                    }).render();

                    // self.renderProformRevenue();
                };
                this.qCollection.bind('reset', createView);
                this.qCollection.bind('add', self.renderProformRevenue);
                this.qCollection.bind('remove', self.renderProformRevenue);
            },

            getOrders: function (cb) {
                var self = this;
                var _id = window.location.hash.split('form/')[1];

                var filter = {
                    'projectName': {
                        key  : 'project._id',
                        value: [_id]
                    },
                    'isOrder'    : {
                        key  : 'isOrder',
                        value: ['true']
                    }
                };

                this.ordersCollection = new quotationCollection({
                    count      : 50,
                    viewType   : 'list',
                    contentType: 'salesOrder',
                    filter     : filter
                });

                function createView() {
                    cb();
                    new oredrView({
                        collection    : self.ordersCollection,
                        projectId     : _id,
                        customerId    : self.formModel.toJSON().customer._id,
                        projectManager: self.formModel.toJSON().projectmanager,
                        filter        : filter
                    }).render();

                };

                function showMoreContent(newModels) {
                    self.ordersCollection.reset(newModels.toJSON());
                };

                this.ordersCollection.bind('reset', createView);
                this.ordersCollection.bind('add', self.renderProformRevenue);
                this.ordersCollection.bind('showmore', showMoreContent);
            },

            renderProformRevenue: function () {
                var self = this;
                var proformContainer = this.$el.find('#proformRevenueContainer');

                var qCollectionJSON = this.qCollection.toJSON();
                var ordersCollectionJSON = this.ordersCollection.toJSON();

                var sum = 0;
                var orderSum = 0;

                ordersCollectionJSON.forEach(function (element) {
                    if (element.paymentInfo) {
                        orderSum += element.paymentInfo.total;
                    }
                });

                qCollectionJSON.forEach(function (element) {
                    if (element.paymentInfo) {
                        sum += element.paymentInfo.total;
                    }
                });

                this.proformValues.quotations = {
                    count: qCollectionJSON.length,
                    sum  : sum
                };

                this.proformValues.orders = {
                    count: ordersCollectionJSON.length,
                    sum  : orderSum
                };

                proformContainer.html(this.proformRevenue({
                        proformValues   : self.proformValues,
                        currencySplitter: helpers.currencySplitter
                    })
                );
            },

            editItem: function () {
                var self = this;
                var inputs = $(':input[readonly="readonly"]');
                var textArea = $('.projectDescriptionEdit');
                var selects = $('.disabled');

                selects.removeClass('disabled');

                inputs.attr('readonly', false);
                textArea.attr('readonly', false);

                $('#StartDate').datepicker({
                    dateFormat : "d M, yy",
                    changeMonth: true,
                    changeYear : true,
                    onSelect   : function () {
                        var endDate = $('#StartDate').datepicker('getDate');
                        endDate.setDate(endDate.getDate());
                        $('#EndDateTarget').datepicker('option', 'minDate', endDate);
                    }
                });
                $('#EndDate').datepicker({
                    dateFormat : "d M, yy",
                    changeMonth: true,
                    changeYear : true,
                    onSelect   : function () {
                        var endDate = $('#StartDate').datepicker('getDate');
                        endDate.setDate(endDate.getDate());
                        $('#EndDateTarget').datepicker('option', 'minDate', endDate);
                    }
                });
                $('#EndDateTarget').datepicker({
                    dateFormat : "d M, yy",
                    changeMonth: true,
                    changeYear : true,
                    minDate    : (self.formModel.StartDate) ? self.formModel.StartDate : 0
                });
                $('#StartDate').datepicker("option", "disabled", false);
                $('#EndDate').datepicker("option", "disabled", false);
                $('#EndDateTarget').datepicker("option", "disabled", false);

                $("#top-bar-saveBtn").show();
                $("#createQuotation").show();
                $("#createBonus").show();
            },

            deleteItems: function () {
                var mid = 39;
                var self = this;
                this.formModel.urlRoot = "/Projects";
                this.formModel.destroy({
                    headers: {
                        mid: mid
                    },
                    success: function () {
                        Backbone.history.navigate("#easyErp/Projects/thumbnails", {trigger: true});
                    }
                });

            },

            render: function () {
                var formModel = this.formModel.toJSON();
                var assignees;
                var bonus;
                var paralellTasks;
                var self = this;
                var templ = _.template(ProjectsFormTemplate);
                var thisEl = this.$el;
                var notDiv;
                var bonusView;
                var container;

                var notesEl = new noteView({
                    model: this.formModel
                }).render().el;

                var atachEl = new attachView({
                    model: this.formModel,
                    url  : "/uploadProjectsFiles"
                }).render().el;

                thisEl.html(templ({
                    model: formModel
                }));

                populate.get("#projectTypeDD", "/projectType", {}, "name", this, false, true);
                populate.get2name("#projectManagerDD", "/getPersonsForDd", {}, this);
                populate.get2name("#customerDd", "/Customer", {}, this, false, false);
                populate.getWorkflow("#workflowsDd", "#workflowNamesDd", "/WorkflowsForDd", {id: "Projects"}, "name", this);
                populate.getWorkflow("#workflow", "#workflowNames", "/WorkflowsForDd", {id: "Jobs"}, "name", this);

                notDiv = this.$el.find('#divForNote');
                notDiv.html(notesEl);
                notDiv.append(atachEl);

                assignees = thisEl.find('#assignees-container');
                assignees.html(
                    new AssigneesView({
                        model: this.formModel
                    }).render().el
                );

                bonus = this.$el.find('#bonus-container');
                bonusView = new BonusView({
                    model: this.formModel
                });
                bonus.html(
                    bonusView.render().el
                );

                bonusView.bind('save', function () {
                    self.saveItem();
                });

                thisEl.find('#createBonus').hide();
                _.bindAll(this, 'getQuotations', 'getOrders', 'getWTrack', 'renderProformRevenue', 'renderProjectInfo', 'renderJobs');
                /*_.bindAll(this, 'getOrders');
                 _.bindAll(this, 'getWTrack');
                 _.bindAll(this, 'renderProformRevenue');
                 _.bindAll(this, 'renderProjectInfo');
                 _.bindAll(this, 'renderJobs');*/

                paralellTasks = [this.renderProjectInfo, this.getInvoice, this.getWTrack, this.getQuotations, this.getOrders];

                async.parallel(paralellTasks, function (err, result) {
                    self.renderProformRevenue();
                    //self.getDataForDetails(result);
                });

                $("#top-bar-deleteBtn").hide();
                $("#createQuotation").show();
                $("#createBonus").show();

                $('#StartDate').datepicker({
                    dateFormat : "d M, yy",
                    changeMonth: true,
                    changeYear : true,
                    onSelect   : function () {
                        var endDate = $('#StartDate').datepicker('getDate');
                        endDate.setDate(endDate.getDate());
                        $('#EndDateTarget').datepicker('option', 'minDate', endDate);
                    }
                });
                $('#EndDate').datepicker({
                    dateFormat : "d M, yy",
                    changeMonth: true,
                    changeYear : true,
                    onSelect   : function () {
                        var endDate = $('#StartDate').datepicker('getDate');
                        endDate.setDate(endDate.getDate());
                        $('#EndDateTarget').datepicker('option', 'minDate', endDate);
                    }
                });
                $('#EndDateTarget').datepicker({
                    dateFormat : "d M, yy",
                    changeMonth: true,
                    changeYear : true,
                    minDate    : (self.formModel.StartDate) ? self.formModel.StartDate : 0
                });

                return this;

            },
        });

        return View;
    });
