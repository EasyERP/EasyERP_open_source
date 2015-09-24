/**
 * Created by liliya on 17.09.15.
 */
define([
        'text!templates/Projects/form/FormTemplate.html',
        'text!templates/Bonus/DetailsTemplate.html',
        'views/Projects/EditView',
        'views/Notes/NoteView',
        'views/Notes/AttachView',
        'views/Assignees/AssigneesView',
        'views/Bonus/BonusView',
        'views/Bonus/wTrackView',
        'views/Bonus/paymentView',
        'views/Bonus/invoiceView',
        'collections/wTrack/filterCollection',
        'text!templates/Notes/AddAttachments.html',
        "common",
        'populate',
        'custom',
        'dataService',
        'async'
    ],

    function (ProjectsFormTemplate, DetailsTemplate, EditView, noteView, attachView, AssigneesView, BonusView, wTrackView, PaymentView, InvoiceView, wTrackCollection, addAttachTemplate, common, populate, custom, dataService, async) {
        var FormEmployeesView = Backbone.View.extend({
            el: '#content-holder',
            initialize: function (options) {
                this.formModel = options.model;
                this.formModel.urlRoot = '/Projects/';
                this.responseObj = {};
            },
            events: {
                'click .chart-tabs': 'changeTab',
                "click .deleteAttach": "deleteAttach",
                "change .inputAttach": "addAttach",
                'click': 'hideSelect',
                'keydown': 'keydownHandler',
                "click #health a:not(.disabled)": "showHealthDd",
                "click #health ul li div:not(.disabled)": "chooseHealthDd",
                "click .newSelectList li:not(.miniStylePagination):not(.disabled)": "chooseOption",
                "click .newSelectList li.miniStylePagination": "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
                "click .current-selected:not(.disabled)": "showNewSelect"
            },

            notHide: function () {
                return false;
            },
            showNewSelect: function (e, prev, next) {
                populate.showSelect(e, prev, next, this);
                return false;

            },

            disableEdit: function(){
                var self = this;
                var inputs = $(':input');
                var textArea = $('textArea');
                var selects = $('.current-selected');

                selects.addClass('disabled');
                inputs.attr('readonly', true);
                textArea.attr('readonly', false);

                $('#StartDate').datepicker( "option", "disabled", true );
                $('#EndDate').datepicker( "option", "disabled", true );
                $('#EndDateTarget').datepicker( "option", "disabled", true );

                $("#top-bar-saveBtn").hide();
                $("#createBonus").hide();
            },

            saveItem: function () {
                //event.preventDefault();

                var validation = true;
                var self = this;
                var viewType = custom.getCurrentVT();
                var mid = 39;
                var projectName = $.trim(this.$el.find("#projectName").val());
                var projectShortDesc = $.trim(this.$el.find("#projectShortDesc").val());
                var customer = {};

                customer._id = this.$el.find("#customerDd").data("id");
                customer.name = this.$el.find("#customerDd").text();

                var projectmanager = {};
                projectmanager._id = this.$el.find("#projectManagerDD").data("id");
                projectmanager.name = this.$el.find("#projectManagerDD").text();

                var workflow = {};
                workflow._id = this.$el.find("#workflowsDd").data("id");
                workflow.name = this.$el.find("#workflowsDd").text();


                var projecttype = this.$el.find("#projectTypeDD").data("id");
                var $userNodes = $("#usereditDd option:selected");
                var startDate = $.trim(this.$el.find("#StartDate").val());
                var endDate = $.trim(this.$el.find("#EndDate").val());
                var users = [];
                var bonusContainer = $('#bonusTable');
                var bonusRow = bonusContainer.find('tr');
                var bonus = [];
                $userNodes.each(function (key, val) {
                    users.push({
                        id: val.value,
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

                    var startD = $(val).find(".startDate>div").text().trim() || $(val).find(".startDate input").val() || null;
                    var endD = $(val).find(".endDate>div").text().trim() || $(val).find(".endDate input").val() || null;

                    bonus.push({
                        employeeId: employeeId,
                        bonusId: bonusId,
                        startDate: startD,
                        endDate: endD
                    });
                });

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
                var whoCanRW = this.$el.find("[name='whoCanRW']:checked").val();
                var health = this.$el.find('#health a').data('value');
                var _targetEndDate = $.trim(this.$el.find("#EndDateTarget").val());
                var description = $.trim(this.$el.find("#description").val());
                var currentTargetEndDate = this.formModel.get('TargetEndDate');
                //var TargetEndDate = _targetEndDate || currentTargetEndDate;
                var data = {
                    projectName: projectName,
                    projectShortDesc: projectShortDesc,
                    customer: customer ? customer : null,
                    projectmanager: projectmanager ? projectmanager : null,
                    workflow: workflow ? workflow : null,
                    projecttype: projecttype ? projecttype : "",
                    description: description,
                    teams: {
                        users: users
                    },
                    groups: {
                        owner: $("#allUsersSelect").data("id"),
                        users: usersId,
                        group: groupsId
                    },
                    whoCanRW: whoCanRW,
                    health: health,
                    StartDate: startDate,
                    EndDate: endDate,
                    TargetEndDate: _targetEndDate,
                    bonus: bonus
                };
                var workflowStart = this.formModel.get('workflow');

                if (validation) {
                    this.formModel.save(data, {
                        headers: {
                            mid: mid
                        },
                        success: function (model) {
                            $('.edit-project-dialog').remove();
                            $(".add-group-dialog").remove();
                            $(".add-user-dialog").remove();
                            self.disableEdit();
                            $("#top-bar-saveBtn").hide();
                            if (viewType == "list") {
                                var tr_holder = $("tr[data-id='" + self.formModel.toJSON()._id + "'] td");
                                $("a[data-id='" + self.formModel.toJSON()._id + "']").text(projectName);
                                tr_holder.eq(2).text(projectName);
                                tr_holder.eq(3).text(self.$el.find("#customerDd").text());
                                tr_holder.eq(4).text(self.$el.find("#StartDate").val());
                                tr_holder.eq(5).text(self.$el.find("#EndDate").val());
                                tr_holder.eq(6).text(self.$el.find("#EndDateTarget").val());
                                if (new Date(self.$el.find("#EndDate").val()) < new Date(self.$el.find("#EndDateTarget").val())) {
                                    tr_holder.eq(5).addClass("red-border");
                                } else {
                                    tr_holder.eq(5).removeClass("red-border");
                                }
                                tr_holder.eq(8).find(".stageSelect").text(self.$el.find("#workflowsDd").text());
                                tr_holder.eq(9).find(".health-container a").attr("class", "health" + health).attr("data-value", health);
                                tr_holder.eq(11).text(model.toJSON().editedBy.date + " (" + model.toJSON().editedBy.user.login + ")");
                            } else {
                                var currentModel_holder = $("#" + self.formModel.toJSON()._id);
                                currentModel_holder.find(".project-text span").eq(0).text(projectName);
                                currentModel_holder.find(".project-text span").eq(1).find("a").attr("class", "health" + health).attr("data-value", health);
                                if (customer)
                                    $("#" + self.formModel.toJSON()._id).find(".project-text span").eq(2).text(self.$el.find("#customerDd").text());
                                currentModel_holder.find(".bottom .stageSelect").text(self.$el.find("#workflowsDd").text()).attr("class", "stageSelect " + self.$el.find("#workflowsDd").text().toLowerCase().replace(" ", ''));
                                if (projectmanager)
                                    common.getImagesPM([projectmanager._id], "/getEmployeesImages", "#" + self.formModel.toJSON()._id);
                            }
                            if (data.workflow._id != workflowStart._id) {
                                var filter = window.location.hash.split('filter=')[1];
                                var url = "#easyErp/Projects/thumbnails";
                                if (filter)
                                    url += '/filter=' + filter;
                                Backbone.history.fragment = "";
                                Backbone.history.navigate(url, {trigger: true});

                            }
                        },
                        error: function (model, xhr) {
                            self.errorNotification(xhr);
                        }

                    });
                }
            },

            chooseOption: function (e) {
                $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
                $(".newSelectList").hide();
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
                target.closest(".chart-tabs").find("a.active").removeClass("active");
                target.addClass("active");
                var n = target.parents(".chart-tabs").find("li").index(target.parent());
                var dialog_holder = $(".dialog-tabs-items");
                dialog_holder.find(".dialog-tabs-item.active").removeClass("active");
                dialog_holder.find(".dialog-tabs-item").eq(n).addClass("active");
            },

            keydownHandler: function (e) {
                switch (e.which) {
                    case 27:
                        this.hideDialog();
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

            deleteItem: function (event) {
                var mid = 39;
                event.preventDefault();
                var self = this;
                var answer = confirm("Realy DELETE items ?!");
                if (answer) {
                    this.formModel.destroy({
                        headers: {
                            mid: mid
                        },
                        success: function (model) {
                            model = model.toJSON();
                            var viewType = custom.getCurrentVT();
                            switch (viewType) {
                                case 'list':
                                {
                                    $("tr[data-id='" + model._id + "'] td").remove();
                                }
                                    break;
                                case 'thumbnails':
                                {
                                    $("#" + model._id).remove();
                                    $('.edit-project-dialog').remove();
                                    $(".add-group-dialog").remove();
                                    $(".add-user-dialog").remove();
                                }
                            }
                            self.hideDialog();
                        },
                        error: function (model, xhr) {
                            self.errorNotification(xhr);
                        }
                    });
                }
            },

            fileSizeIsAcceptable: function (file) {
                if (!file) {
                    return false;
                }
                return file.size < App.File.MAXSIZE;
            },

            addAttach: function (event) {
                event.preventDefault();
                var currentModel = this.formModel;
                var currentModelID = currentModel.id;
                var addFrmAttach = $("#employeeForm");
                var addInptAttach = $("#employeeForm .input-file .inputAttach")[0].files[0];
                if (!this.fileSizeIsAcceptable(addInptAttach)) {
                    alert('File you are trying to attach is too big. MaxFileSize: ' + App.File.MaxFileSizeDisplay);
                    return;
                }
                addFrmAttach.submit(function (e) {
                    var bar = $('.bar');
                    var status = $('.status');
                    var formURL = "http://" + window.location.host + "/uploadProjectsFiles";
                    e.preventDefault();
                    addFrmAttach.ajaxSubmit({
                        url: formURL,
                        type: "POST",
                        processData: false,
                        contentType: false,
                        data: [addInptAttach],

                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("id", currentModelID);
                            status.show();
                            var statusVal = '0%';
                            bar.width(statusVal);
                            status.html(statusVal);
                        },

                        uploadProgress: function (event, position, total, statusComplete) {
                            var statusVal = statusComplete + '%';
                            bar.width(statusVal);
                            status.html(statusVal);
                        },

                        success: function (data) {
                            var attachments = currentModel.get('attachments');
                            attachments.length = 0;
                            $('.attachContainer').empty();
                            data.data.attachments.forEach(function (item) {
                                var date = common.utcDateToLocaleDate(item.uploadDate);
                                attachments.push(item);
                                $('.attachContainer').prepend(_.template(addAttachTemplate, {data: item, date: date}));
                            });
                            addFrmAttach[0].reset();
                            status.hide();
                        },
                        error: function () {
                            console.log("Attach file error");
                        }
                    });
                });
                addFrmAttach.submit();
                addFrmAttach.off('submit');
            },
            deleteAttach: function (e) {
                var target = $(e.target);
                if (target.closest("li").hasClass("attachFile")) {
                    target.closest(".attachFile").remove();
                } else {
                    var id = e.target.id;
                    var currentModel = this.formModel;
                    currentModel.urlRoot = "/Projects/";
                    var attachments = currentModel.get('attachments');
                    var new_attachments = _.filter(attachments, function (attach) {
                        if (attach._id != id) {
                            return attach;
                        }
                    });
                    currentModel.save({'attachments': new_attachments},
                        {
                            headers: {
                                mid: 39
                            },
                            patch: true,
                            success: function (model, response, options) {
                                $('.attachFile_' + id).remove();
                            }
                        });
                }
            },

            hideSelect: function () {
                $(".newSelectList").hide();
            },
            showEndContractSelect: function (e) {
                e.preventDefault();
                $(e.target).parent().find(".newSelectList").toggle();
                return false;
            },

            render: function () {
                var formModel = this.formModel.toJSON();
                var assignees;
                var bonus;
                var paralellTasks;
                var self = this;
                var templ = _.template(ProjectsFormTemplate);
                this.$el.html(templ({model: formModel}));

                populate.get("#projectTypeDD", "/projectType", {}, "name", this, false, true);
                populate.get2name("#projectManagerDD", "/getPersonsForDd", {}, this);
                populate.get2name("#customerDd", "/Customer", {}, this, false, false);
                populate.getWorkflow("#workflowsDd", "#workflowNamesDd", "/WorkflowsForDd", {id: "Projects"}, "name", this);

                var model = this.formModel.toJSON();

                var notDiv = this.$el.find('#divForNote');
                notDiv.html(
                    new noteView({
                        model: this.formModel
                    }).render().el);
                notDiv.append(
                    new attachView({
                        model: this.formModel,
                        url: "/uploadProjectsFiles"
                    }).render().el
                );
                assignees = this.$el.find('#assignees-container');
                assignees.html(
                    new AssigneesView({
                        model: this.formModel
                    }).render().el
                );
                bonus = this.$el.find('#bonus-container');
                var bonusView = new BonusView({
                    model: this.formModel
                });
                bonus.html(
                    bonusView.render().el
                );

                bonusView.bind('save', function () {
                    self.saveItem();
                });

                $('#createBonus').hide();
                $('#noteArea').attr('readonly', true);

                paralellTasks = [this.getWTrack, this.getInvoice];

                async.parallel(paralellTasks, function (err, result) {

                    self.getDataForDetails(result);
                });

                this.delegateEvents(this.events);

                return this;
            },

            getDataForDetails: function (result) {
                var projectTeam = [];
                var bonus = [];
                var budget = [];
                var projectValues = {};
                var budgetTotal = {};
                var wTRack = result[0]  ? result[0]['wTrack'] : [];
                var monthHours = result[0]  ? result[0]['monthHours'] : [];
                var payment = result[1] ? result[1]['payment'] : [];
                var invoice = result[1] ? result[1]['invoice'] : [];
                var bonuses = this.formModel.toJSON().bonus;
                var employees = [];
                var container = this.$el.find('#forInfo');
                var template = _.template(DetailsTemplate);
                var hoursByMonth = {};
                var self = this;

                budgetTotal.profitSum = 0;
                budgetTotal.costSum = 0;
                budgetTotal.rateSum = 0;
                budgetTotal.revenueSum = 0;
                budgetTotal.hoursSum = 0;

                wTRack.forEach(function (wTrack) {
                    if (!( wTrack.employee._id in employees)) {
                        employees[wTrack.employee._id] = wTrack.employee.name;
                    }

                    var key = wTrack.year * 100 + wTrack.month;
                    if (hoursByMonth[key]) {
                        hoursByMonth[key] += parseFloat(wTrack.worked);
                    } else {
                        hoursByMonth[key] = parseFloat(wTrack.worked);
                    }
                });

                var empKeys = Object.keys(employees);

                empKeys.forEach(function(empId){
                    wTRack.forEach(function (wTrack) {
                        var emp = wTrack.employee._id;

                        if (empId === emp){
                            if (projectTeam[empId]){
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


                var keys = Object.keys(projectTeam);
                keys.forEach(function (key) {
                    budgetTotal.profitSum += parseFloat(projectTeam[key].profit);
                    budgetTotal.costSum += parseFloat(projectTeam[key].cost);
                    budgetTotal.rateSum += parseFloat(projectTeam[key].rate);
                    budgetTotal.hoursSum += parseFloat(projectTeam[key].hours);
                    budgetTotal.revenueSum += parseFloat(projectTeam[key].revenue);
                });

                projectValues.revenue = budgetTotal.revenueSum;
                projectValues.profit = budgetTotal.profitSum;
                projectValues.markUp = ((budgetTotal.profitSum / budgetTotal.costSum) * 100).toFixed();
                projectValues.radio = ((budgetTotal.revenueSum / budgetTotal.costSum) * 100).toFixed();

                bonuses.forEach(function (element) {
                    var objToSave = {};
                    objToSave.bonus = 0;
                    objToSave.resource = element.employeeId.name.first + ' ' + element.employeeId.name.last;
                    objToSave.percentage = element.bonusId.name;
                    if (element.bonusId.isPercent){
                        objToSave.bonus = (budgetTotal.revenueSum / 100) * element.bonusId.value * 100;
                        bonus.push(objToSave);
                    } else {
                        monthHours.forEach(function(month){
                            objToSave.bonus += (hoursByMonth[month._id] / month.value[0]) * element.bonusId.value;
                        });
                        objToSave.bonus = objToSave.bonus * 100;
                        bonus.push(objToSave);
                    }

                });

                var keys = Object.keys(employees);

                dataService.getData('/employee/getForProjectDetails',
                    {
                        data: keys
                    }, function (response) {
                        dataService.getData('/employee/getForProjectDetails',
                            {
                                data: [self.formModel.toJSON().projectmanager._id]
                            }, function (resp) {
                                response.unshift(resp[0]);
                                container.html(template({
                                        projectTeam: response,
                                        bonus: bonus,
                                        budget: projectTeam,
                                        projectValues: projectValues,
                                        budgetTotal: budgetTotal
                                    })
                                );
                            }, this);

                    }, this);

            },

            getWTrack: function (cb) {
                var _id = window.location.hash.split('form/')[1];
                var filter = {
                    'projectName': {
                        key: 'project._id',
                        value: [_id]
                    }

                };

                dataService.getData('/wTrack/getForProjects',
                    {
                        filter: filter
                    }, function (response) {

                        if (response.error) {
                            return cb(response.error);
                        }

                        new wTrackView({
                            model: response.wTrack
                        });
                        cb(null, response);

                    }, this);

            },
            getInvoice: function (cb) {
                var _id = window.location.hash.split('form/')[1];
                var filter = {
                    'project': {
                        key: 'project._id',
                        value: [_id]
                    }
                };

                dataService.getData('/Invoice/list',
                    {
                        count: 100,
                        page: 1,
                        forSales: true,
                        contentType: 'salesInvoice',
                        filter: filter
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
                        if (res){
                            cb(null, {payment: res, invoice: response});
                        } else  {
                            cb(null, {payment: [], invoice: response});
                        }
                    }, this);

            },

            editItem: function () {
                //create editView in dialog here
                // new EditView({ model: this.formModel });
                var self = this;
                var inputs = $(':input[readonly="readonly"]');
                var textArea = $('.projectDescriptionEdit');
                var selects = $('.disabled');

                selects.removeClass('disabled');

                inputs.attr('readonly', false);
                textArea.attr('readonly', false);

                $('#StartDate').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true,
                    onSelect: function () {
                        //Setting minimum of endDate to picked startDate
                        var endDate = $('#StartDate').datepicker('getDate');
                        endDate.setDate(endDate.getDate());
                        $('#EndDateTarget').datepicker('option', 'minDate', endDate);
                    }
                });
                $('#EndDate').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true,
                    onSelect: function () {
                        //Setting minimum of endDate to picked startDate
                        var endDate = $('#StartDate').datepicker('getDate');
                        endDate.setDate(endDate.getDate());
                        $('#EndDateTarget').datepicker('option', 'minDate', endDate);
                    }
                });
                $('#EndDateTarget').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true,
                    minDate: (self.formModel.StartDate) ? self.formModel.StartDate : 0
                });
                $('#StartDate').datepicker( "option", "disabled", false );
                $('#EndDate').datepicker( "option", "disabled", false );
                $('#EndDateTarget').datepicker( "option", "disabled", false );

                $("#top-bar-saveBtn").show();
                $("#createBonus").show();
            },

            deleteItems: function () {
                var mid = 39;
                this.formModel.urlRoot = "/Projects";
                this.formModel.destroy({
                    headers: {
                        mid: mid
                    },
                    success: function () {
                        Backbone.history.navigate("#easyErp/Projects/list", {trigger: true});
                    }
                });

            }
        });

        return FormEmployeesView;
    });
