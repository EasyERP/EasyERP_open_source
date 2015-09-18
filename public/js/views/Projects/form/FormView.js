/**
 * Created by liliya on 17.09.15.
 */
define([
        'text!templates/Projects/form/FormTemplate.html',
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

    function (ProjectsFormTemplate, EditView, noteView, attachView, AssigneesView, BonusView, wTrackView, PaymentView, InvoiceView, wTrackCollection, addAttachTemplate, common, populate, custom, dataService, async) {
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
            saveItem: function (event) {
                event.preventDefault();

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

                    var startD = $(val).find(".startDate>div").text().trim() || $(val).find(".startDate input").val();
                    var endD = $(val).find(".endDate>div").text().trim() || $(val).find(".endDate input").val();

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
                bonus.html(
                    new BonusView({
                        model: this.formModel
                    }).render().el
                );

                $('#createBonus').hide();

                paralellTasks = [this.getWTrack, this.getInvoice];

                async.parallel(paralellTasks, function (err, result) {
                    var wTRack = result[0];
                    var payment = result[1]['payment'];
                    var invoice = result[1]['invoice'];

                    var container = self.$el.find('#forInfo');
                    container.html(
                        new DetailsView({
                            model: result
                        }).render().el
                    );


                });

                this.delegateEvents(this.events);

                return this;
            },

            getWTrack: function (cb) {
                var _id = window.location.hash.split('form/')[1];
                var filter = {
                    'projectName': {
                        key: 'project._id',
                        value: [_id]
                    }

                };

                dataService.getData('/wTrack/list',
                    {
                        count: 100,
                        page: 1,
                        filter: filter
                    }, function (response, context) {

                        if (response.error) {
                            return cb(response.error);
                        }

                        new wTrackView({
                            model: response
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
                    }, function (response, context) {
                        var payments = [];
                        if (response.error) {
                            return cb(response.error);
                        }
                        response.forEach(function(element){
                            element.payments.forEach(function(payment){
                                payments.push(payment);
                            });
                        });


                        dataService.getData('/payment/getForProject',
                            {
                                data: payments
                            }, function (result, context) {

                                if (result.error) {
                                    return cb(result.error);
                                }

                                new PaymentView({
                                    model: result
                                });
                                cb(null, {payment: result, invoice: response});

                            }, this);



                        new InvoiceView({
                            model: response
                        });

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
