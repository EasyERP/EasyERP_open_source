/**
 * Created by liliya on 17.09.15.
 */
define([
        'text!templates/Projects/form/FormTemplate.html',
        'text!templates/Projects/projectInfo/DetailsTemplate.html',
        'text!templates/Projects/projectInfo/proformRevenue.html',
        'views/Projects/EditView',
        'views/Notes/NoteView',
        'views/Notes/AttachView',
        'views/Assignees/AssigneesView',
        'views/Bonus/BonusView',
        'views/Projects/projectInfo/wTrackView',
        'views/Projects/projectInfo/paymentView',
        'views/Projects/projectInfo/invoiceView',
        'views/Projects/projectInfo/quotationView',
        'views/Projects/projectInfo/wTracks/generateWTrack',
        'views/Projects/projectInfo/orderView',
        'collections/wTrack/filterCollection',
        'collections/Quotation/filterCollection',
        'text!templates/Notes/AddAttachments.html',
        "common",
        'populate',
        'custom',
        'dataService',
        'async',
        'helpers'
    ],

    function (ProjectsFormTemplate, DetailsTemplate, ProformRevenueTemplate, EditView, noteView, attachView, AssigneesView, BonusView, wTrackView, PaymentView, InvoiceView, QuotationView, GenerateWTrack, oredrView, wTrackCollection, quotationCollection, addAttachTemplate, common, populate, custom, dataService, async, helpers) {
        var FormEmployeesView = Backbone.View.extend({
            el            : '#content-holder',
            contentType   : 'Projects',
            proformRevenue: _.template(ProformRevenueTemplate),

            events: {
                'click .chart-tabs'                                               : 'changeTab',
                "click .deleteAttach"                                             : "deleteAttach",
                'click'                                                           : 'hideSelect',
                'keydown'                                                         : 'keydownHandler',
                "click #health a:not(.disabled)"                                  : "showHealthDd",
                "click #health ul li div:not(.disabled)"                          : "chooseHealthDd",
                "click .newSelectList li:not(.miniStylePagination):not(.disabled)": "chooseOption",
                "click .newSelectList li.miniStylePagination"                     : "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
                "click .current-selected:not(.disabled)"                          : "showNewSelect",
                "click #createItem"                                               : "createDialog",
                "click #createJOb"                                               : "createJob",
                "change input:not(.checkbox)": "showSaveButton"
            },

            initialize: function (options) {
                this.formModel = options.model;
                this.id = this.formModel.id;
                this.formModel.urlRoot = '/Projects/';
                this.responseObj = {};
                this.proformValues = {};
            },

            createDialog: function (e) {
                var jobs = {};

                jobs._id = $(e.target).attr('data-id');
                jobs.name = $(e.target).attr('data-name');

                new GenerateWTrack({
                    model           : this.formModel,
                    wTrackCollection: this.wCollection,
                    jobs: jobs
                });
            },

            createJob: function () {
                new GenerateWTrack({
                    model           : this.formModel,
                    wTrackCollection: this.wCollection,
                    createJob: true
                });
            },

            notHide: function () {
                return false;
            },

            showNewSelect: function (e, prev, next) {
                populate.showSelect(e, prev, next, this);

                return false;
            },

            disableEdit: function () {
                var thisEl = this.$el;
                var inputs = thisEl.find(':input');
                var textArea = thisEl.find('textArea');
                var selects = thisEl.find('.current-selected');

                selects.addClass('disabled');
                inputs.attr('readonly', true);
                textArea.attr('readonly', false);

                thisEl.find('#StartDate').datepicker("option", "disabled", true);
                thisEl.find('#EndDate').datepicker("option", "disabled", true);
                thisEl.find('#EndDateTarget').datepicker("option", "disabled", true);

                $("#top-bar-saveBtn").hide();
                thisEl.find("#createBonus").hide();
            },

            saveItem: function () {
                var thisEl = this.$el;
                var validation = true;
                var self = this;
                var mid = 39;
                var projectName = $.trim(thisEl.find("#projectName").val());
                var projectShortDesc = $.trim(thisEl.find("#projectShortDesc").val());
                var customer = {};

                customer._id = thisEl.find("#customerDd").data("id");
                customer.name = thisEl.find("#customerDd").text();

                var projectmanager = {};
                projectmanager._id = thisEl.find("#projectManagerDD").data("id");
                projectmanager.name = thisEl.find("#projectManagerDD").text();

                var workflow = {};
                workflow._id = thisEl.find("#workflowsDd").data("id");
                workflow.name = thisEl.find("#workflowsDd").text();


                var projecttype = thisEl.find("#projectTypeDD").data("id");
                var $userNodes = $("#usereditDd option:selected");
                var startDate = $.trim(thisEl.find("#StartDate").val());
                var endDate = $.trim(thisEl.find("#EndDate").val());
                var users = [];
                var bonusContainer = $('#bonusTable');
                var bonusRow = bonusContainer.find('tr');
                var bonus = [];

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

                    var startD = $(val).find(".startDate input").val() || null;
                    var endD = $(val).find(".endDate input").val() || null;

                    bonus.push({
                        employeeId: employeeId,
                        bonusId   : bonusId,
                        startDate : startD,
                        endDate   : endD
                    });
                });

                var budget = this.formModel.get('budget');

                var usersId = [];
                var groupsId = [];
                $(".groupsAndUser tr").each(function () {
                    if ($(this).data("type") == "targetUsers") {
                        usersId.push($(this).data("id"));
                    }
                    if ($(this).data("type") == "targetGroups") {
                        groupsId.push($(this).data("id"));
                    }

                });
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

                if (validation) {
                    this.formModel.save(data, {
                        headers: {
                            mid: mid
                        },
                        success: function (model) {
                           // self.disableEdit();
                            self.hideSaveButton();

                            var url = window.location.hash;
                            Backbone.history.fragment = "";
                            setTimeout(function () {
                                Backbone.history.navigate(url, {trigger: true});
                            }, 500);
                        },
                        error  : function (model, xhr) {
                            self.errorNotification(xhr);
                        }

                    });
                }
            },

            chooseOption: function (e) {

                $(".newSelectList").hide();

                if ($(e.target).parents("dd").find(".current-selected").length){
                    $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
                } else {
                    $(e.target).parents("td").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id"));

                    var id = $(e.target).parents("td").closest('tr').attr('data-id');

                    var data ={_id: id, workflowId: $(e.target).attr("id"), workflowName: $(e.target).text()};

                    dataService.postData("/jobs/update", data,  function(err, result){
                        if (err){
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

            showSaveButton: function(){
                $("#top-bar-saveBtn").show();
            },

            hideSaveButton: function(){
                $("#top-bar-saveBtn").hide();
            },

            renderProjectInfo: function(){
                var self = this;
                var template = _.template(DetailsTemplate);
                var formModel = this.formModel.toJSON();
                var projectTeam = formModel.budget.projectTeam;
                var container = this.$el.find('#forInfo');
                var jobs = projectTeam;

                this.projectValues = {
                    revenue: 0,
                    profit: 0,
                    cost: 0
                };

                projectTeam.forEach(function(projectTeam){
                    var budgetTotal = projectTeam.budget.budgetTotal;

                    self.projectValues.revenue += budgetTotal ? budgetTotal.revenueSum : 0;
                    self.projectValues.profit += budgetTotal ? budgetTotal.profitSum : 0;
                    self.projectValues.cost += budgetTotal ? budgetTotal.costSum : 0;

                });

                this.projectValues.markUp = ((this.projectValues.profit /this.projectValues.cost) * 100);
                if (!isFinite(this.projectValues.markUp)) {
                    self.projectValues.markUp = 0;
                }
                this.projectValues.radio = ((this.projectValues.profit / this.projectValues.revenue) * 100);
                if (!isFinite(this.projectValues.radio)) {
                    this.projectValues.radio = 0;
                }


                container.html(template({
                        jobs: jobs,
                        bonus           : formModel.budget.bonus,
                        projectValues   : self.projectValues,
                        currencySplitter: helpers.currencySplitter,
                        contentType     : self.contentType
                    })
                );
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




                thisEl.html(templ({model: formModel}));

                populate.get("#projectTypeDD", "/projectType", {}, "name", this, false, true);
                populate.get2name("#projectManagerDD", "/getPersonsForDd", {}, this);
                populate.get2name("#customerDd", "/Customer", {}, this, false, false);
                populate.getWorkflow("#workflowsDd", "#workflowNamesDd", "/WorkflowsForDd", {id: "Projects"}, "name", this);
                populate.getWorkflow("#workflow", "#workflowNames", "/WorkflowsForDd", {id: "Jobs"}, "name", this);


                notDiv = this.$el.find('#divForNote');
                notDiv.html(
                    new noteView({
                        model: this.formModel
                    }).render().el);
                notDiv.append(
                    new attachView({
                        model: this.formModel,
                        url  : "/uploadProjectsFiles"
                    }).render().el
                );

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

               this.renderProjectInfo();

                thisEl.find('#createBonus').hide();
                _.bindAll(this, 'getQuotations');
                _.bindAll(this, 'getOrders');
                _.bindAll(this, 'getWTrack');
                _.bindAll(this, 'renderProformRevenue');


                paralellTasks = [this.getInvoice, this.getWTrack, this.getQuotations, this.getOrders];

                async.parallel(paralellTasks, function (err, result) {
                    self.renderProformRevenue();
                    //self.getDataForDetails(result);
                });

                $("#top-bar-deleteBtn").hide();
                $("#createQuotation").show();
                $("#createBonus").show();

                return this;

            },

            getDataForDetails: function (result) {
                var projectTeam = [];
                var bonus = [];
                var projectValues = {};
                var budgetTotal = {};
                var wTRack = result[0] ? result[0]['wTrack'] : [];
                var monthHours = result[0] ? result[0]['monthHours'] : [];
                var payment = result[1] ? result[1]['payment'] : [];
                var invoice = result[1] ? result[1]['invoice'] : [];
                var bonuses = this.formModel.toJSON().bonus;
                var employees = [];
                var container = this.$el.find('#forInfo');
                var template = _.template(DetailsTemplate);
                var hoursByMonth = {};
                var self = this;
                var empKeys;
                var keys;
                var pMId = this.formModel.toJSON().projectmanager._id;

                budgetTotal.profitSum = 0;
                budgetTotal.costSum = 0;
                budgetTotal.rateSum = 0;
                budgetTotal.revenueSum = 0;
                budgetTotal.hoursSum = 0;

                wTRack.forEach(function (wTrack) {
                    var key;
                    var employee = wTrack.employee;

                    if (!( employee._id in employees)) {
                        employees[employee._id] = employee.name;
                    }

                    key = wTrack.year * 100 + wTrack.month;

                    if (hoursByMonth[key]) {
                        hoursByMonth[key] += parseFloat(wTrack.worked);
                    } else {
                        hoursByMonth[key] = parseFloat(wTrack.worked);
                    }
                });

                empKeys = Object.keys(employees);

                empKeys.forEach(function (empId) {
                    wTRack.forEach(function (wTrack) {
                        var emp = wTrack.employee._id;

                        if (empId === emp) {
                            if (projectTeam[empId]) {
                                projectTeam[empId].profit += parseFloat(((wTrack.revenue - wTrack.cost) / 100).toFixed(2));
                                projectTeam[empId].cost += parseFloat((wTrack.cost / 100).toFixed(2));
                                projectTeam[empId].rate += parseFloat(wTrack.rate);
                                projectTeam[empId].hours += parseFloat(wTrack.worked);
                                projectTeam[empId].revenue += parseFloat((wTrack.revenue / 100).toFixed(2));
                            } else {
                                projectTeam[empId] = {};
                                projectTeam[empId].profit = parseFloat(((wTrack.revenue - wTrack.cost) / 100).toFixed(2));
                                projectTeam[empId].cost = parseFloat((wTrack.cost / 100).toFixed(2));
                                projectTeam[empId].rate = parseFloat(wTrack.rate);
                                projectTeam[empId].hours = parseFloat(wTrack.worked);
                                projectTeam[empId].revenue = parseFloat((wTrack.revenue / 100).toFixed(2));
                            }
                        }
                    });
                });


                keys = Object.keys(projectTeam);
                if (keys.length > 0) {

                    keys.forEach(function (key) {
                        budgetTotal.profitSum += parseFloat(projectTeam[key].profit);
                        budgetTotal.costSum += parseFloat(projectTeam[key].cost);
                        //budgetTotal.rateSum += parseFloat(projectTeam[key].rate);
                        budgetTotal.hoursSum += parseFloat(projectTeam[key].hours);
                        budgetTotal.revenueSum += parseFloat(projectTeam[key].revenue);
                    });
                    budgetTotal.rateSum = parseFloat(budgetTotal.revenueSum) / parseInt(budgetTotal.hoursSum);

                    projectValues.revenue = budgetTotal.revenueSum;
                    projectValues.profit = budgetTotal.profitSum;
                    projectValues.markUp = ((budgetTotal.profitSum / budgetTotal.costSum) * 100).toFixed();
                    projectValues.radio = ((budgetTotal.revenueSum / budgetTotal.costSum) * 100).toFixed();

                    dataService.getData('/employee/getForProjectDetails',
                        {
                            data: keys
                        }, function (response) {
                            if (response.error) {
                                validation = false;
                                return false;
                            }
                            bonuses.forEach(function (element) {
                                var objToSave = {};

                                objToSave.bonus = 0;
                                objToSave.resource = element.employeeId.name.first + ' ' + element.employeeId.name.last;
                                objToSave.percentage = element.bonusId.name;

                                if (element.bonusId.isPercent) {
                                    objToSave.bonus = (budgetTotal.revenueSum / 100) * element.bonusId.value * 100;
                                    bonus.push(objToSave);
                                } else {
                                    monthHours.forEach(function (month) {
                                        objToSave.bonus += (hoursByMonth[month._id] / month.value[0]) * element.bonusId.value;
                                    });

                                    objToSave.bonus = objToSave.bonus * 100;
                                    bonus.push(objToSave);
                                }

                            });
                            var keysForPT = Object.keys(projectTeam);
                            var sortBudget = [];
                            response.forEach(function (employee) {
                                keysForPT.forEach(function (id) {
                                    if (employee._id === id) {
                                        sortBudget.push(projectTeam[employee._id]);
                                    }
                                })
                            });
                            container.html(template({
                                    projectTeam     : response,
                                    bonus           : bonus,
                                    budget          : sortBudget,
                                    projectValues   : projectValues,
                                    budgetTotal     : budgetTotal,
                                    currencySplitter: helpers.currencySplitter
                                })
                            );
                        }, this);
                }

            },

            getWTrack: function (cb) {
                //var _id = this.formModel.id;
                var self = this;

                var filter = {
                    'projectName': {
                        key  : 'project._id',
                        value: [this.id]
                    }
                };

                this.wCollection = new wTrackCollection({
                    viewType: 'list',
                    filter  : filter,
                    count: 50
                });

                var collectionLength = this.wCollection.length;

                var callback = _.once(cb);


                function createView() {
                    callback();

                    var startNumber = $('#grid-start').text() ? parseInt($('#grid-start').text()) : 1;

                    new wTrackView({
                        model: self.wCollection,
                        filter: filter,
                        startNumber: startNumber
                    }).render();
                };

                function showMoreContent(newModels) {
                    self.wCollection.reset(newModels.toJSON());
                };

                this.wCollection.unbind();
                this.wCollection.bind('reset', createView);
                this.wCollection.bind('showmore', showMoreContent);
            },

            getInvoice: function (cb) {
                var _id = window.location.hash.split('form/')[1];
                var filter = {
                    'project': {
                        key  : 'project._id',
                        value: [_id]
                    }
                };

                dataService.getData('/Invoice/list',
                    {
                        count      : 100,
                        page       : 1,
                        forSales   : true,
                        contentType: 'salesInvoice',
                        filter     : filter
                    }, function (response) {
                        var payments = [];
                        var res;
                        if (response.error) {
                            return cb(response.error);
                        }
                        response.forEach(function (element) {
                            element.payments.forEach(function (payment) {
                                payments.push(payment);
                            });
                        });


                        if (payments.length > 0) {
                            dataService.getData('/payment/getForProject',
                                {
                                    data: payments
                                }, function (result) {

                                    if (result.error) {
                                        return cb(result.error);
                                    }

                                    new PaymentView({
                                        model: result
                                    });


                                    res = result;
                                }, this);


                            new InvoiceView({
                                model: response
                            });

                        }
                        if (res) {
                            cb(null, {payment: res, invoice: response});
                        } else {
                            cb(null, {payment: [], invoice: response});
                        }
                    }, this);

            },

            getQuotations: function (cb) {
                //var _id = this.formModel.id;
                var self = this;

                var filter = {
                    'projectName': {
                        key  : 'project._id',
                        value: [this.id]
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
                        collection: self.qCollection,
                        projectId : self.id,
                        customerId: self.formModel.toJSON().customer._id,
                        projectManager: self.formModel.toJSON().projectmanager
                    }).render();


                   // self.renderProformRevenue();
                };
                this.qCollection.bind('reset', createView);
                this.qCollection.bind('add', self.renderProformRevenue);
                this.qCollection.bind('remove', self.renderProformRevenue);
            },

            getOrders: function (cb) {
                var self = this;

                var filter = {
                    'projectName': {
                        key  : 'project._id',
                        value: [this.id]
                    },
                    'isOrder': {
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
                        collection: self.ordersCollection,
                        projectId : self.id,
                        customerId: self.formModel.toJSON().customer._id,
                        projectManager: self.formModel.toJSON().projectmanager
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

                ordersCollectionJSON.forEach(function(element) {
                    orderSum += element.paymentInfo.total;
                });

                qCollectionJSON.forEach(function(element) {
                    sum += element.paymentInfo.total;
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
                       // self.disableEdit();
                        Backbone.history.navigate("#easyErp/Projects/thumbnails", {trigger: true});
                    }
                });

            }
        });

        return FormEmployeesView;
    });
