define([
        "text!templates/Employees/CreateTemplate.html",
        "models/EmployeesModel",
        "common",
        "populate",
        'views/Notes/AttachView',
        'views/Assignees/AssigneesView',
        'views/selectView/selectView',
        'moment'
    ],
    function (CreateTemplate, EmployeeModel, common, populate, attachView, AssigneesView, selectView, moment) {

        var CreateView = Backbone.View.extend({
            el         : "#content-holder",
            contentType: "Employees",
            template   : _.template(CreateTemplate),
            imageSrc   : '',
            responseObj: {},

            initialize: function () {
                _.bindAll(this, "saveItem");
                this.model = new EmployeeModel();
                this.responseObj['#sourceDd'] = [
                    {
                        _id : 'www.rabota.ua',
                        name: 'www.rabota.ua'
                    }, {
                        _id : 'www.work.ua',
                        name: 'www.work.ua'
                    }, {
                        _id : 'www.ain.net',
                        name: 'www.ain.net'
                    }, {
                        _id : 'other',
                        name: 'other'
                    }
                ];

                this.responseObj['#genderDd'] = [
                    {
                        _id : 'male',
                        name: 'male'
                    }, {
                        _id : 'female',
                        name: 'female'
                    }
                ];
                this.responseObj['#maritalDd'] = [
                    {
                        _id : 'married',
                        name: 'married'
                    }, {
                        _id : 'unmarried',
                        name: 'unmarried'
                    }
                ];

                this.render();
            },

            events: {
                "click #tabList a"                                 : "switchTab",
                "mouseenter .avatar"                               : "showEdit",
                "mouseleave .avatar"                               : "hideEdit",
                'keydown'                                          : 'keydownHandler',
                'click .dialog-tabs a'                             : 'changeTab',
                "click .current-selected"                          : "showNewSelect",
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click"                                            : "hideNewSelect",
                "click td.editable"                                : "editJob"
            },

            showNewSelect: function (e, prev, next) {
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

            editJob: function (e) {
                var self    = this;
                var $target = $(e.target);
                var dataId  = $target.attr('data-id');
                var tempContainer;

                tempContainer = ($target.text()).trim();
                $target.html('<input class="editing statusInfo" type="text" value="' + tempContainer + '">');

                if (dataId === 'salary') {
                    return false;
                }

                $target.find('.editing').datepicker({
                    dateFormat : "d M, yy",
                    changeMonth: true,
                    changeYear : true,
                    minDate    : self.hiredDate,
                    onSelect   : function () {
                        var editingDates = self.$el.find('.editing');

                        editingDates.each(function () {
                            $(this).parent().text($(this).val()).removeClass('changeContent');
                            $(this).remove();
                        });
                    }
                }).addClass('datepicker');

                return false;
            },

            chooseOption: function (e) {
                //$(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id"));

                var $target     = $(e.target);
                var $td          = $target.closest('td');
                var parentUl    = $target.parent();
                var element     = $target.closest('a') || parentUl.closest('a');
                var id          = element.attr('id') || parentUl.attr('id');
                var valueId     = $target.attr('id');
                var managersIds = this.responseObj['#departmentManagers'];
                var managers    = this.responseObj['#projectManagerDD'];
                var managerId;
                var manager;

                $td.removeClass('errorContent');

                if (id === 'jobPositionDd' || 'departmentsDd' || 'projectManagerDD' || 'jobTypeDd' || 'hireFireDd') {
                    element.text($target.text());
                    element.attr('data-id', valueId);

                    if (id === 'departmentsDd') {

                        managersIds.forEach(function (managerObj) {
                            if (managerObj._id === valueId) {
                                managerId = managerObj.name;
                            }
                        });

                        managers.forEach(function (managerObj) {
                            if (managerObj._id === managerId) {
                                manager = managerObj.name;
                            }
                        });

                        if (manager) {
                            element = element.closest('tr').find('a#projectManagerDD');

                            element.text(manager);
                            element.attr('data-id', managerId);
                        }
                    }

                } else {
                    $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
                }
            },

            hideNewSelect: function () {
                $(".newSelectList").hide();

                if (this.selectView) {
                    this.selectView.remove();
                }
            },

            addAttach: function (event) {
                var s = $(".inputAttach:last").val().split("\\")[$(".inputAttach:last").val().split('\\').length - 1];
                $(".attachContainer").append('<li class="attachFile">' +
                    '<a href="javascript:;">' + s + '</a>' +
                    '<a href="javascript:;" class="deleteAttach">Delete</a></li>'
                );
                $(".attachContainer .attachFile:last").append($(".input-file .inputAttach").attr("hidden", "hidden"));
                $(".input-file").append('<input type="file" value="Choose File" class="inputAttach" name="attachfile">');
            },

            deleteAttach: function (e) {
                $(e.target).closest(".attachFile").remove();
            },

            updateAssigneesPagination: function (el) {
                var pag = el.find(".userPagination .text");
                el.find(".userPagination .nextUserList").remove();
                el.find(".userPagination .prevUserList").remove();
                el.find(".userPagination .nextGroupList").remove();
                el.find(".userPagination .prevGroupList").remove();

                var list = el.find("ul");
                var count = list.find("li").length;
                var s = "";
                var page = parseInt(list.attr("data-page"));
                if (page > 1) {
                    el.find(".userPagination").prepend("<a class='prevUserList' href='javascript:;'>« prev</a>");
                }
                if (count === 0) {
                    s += "0-0 of 0";
                } else {
                    if ((page) * 20 - 1 < count) {
                        s += ((page - 1) * 20 + 1) + "-" + ((page) * 20) + " of " + count;
                    } else {
                        s += ((page - 1) * 20 + 1) + "-" + (count) + " of " + count;
                    }
                }

                if (page < count / 20) {
                    el.find(".userPagination").append("<a class='nextUserList' href='javascript:;'>next »</a>");
                }
                el.find("ul li").hide();
                for (var i = (page - 1) * 20; i < 20 * page; i++) {
                    el.find("ul li").eq(i).show();
                }

                pag.text(s);
            },

            changeTab: function (e) {
                var holder = $(e.target);
                holder.closest(".dialog-tabs").find("a.active").removeClass("active");
                holder.addClass("active");
                var n = holder.parents(".dialog-tabs").find("li").index(holder.parent());
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
                $(".edit-dialog").remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
                $(".crop-images-dialog").remove();
            },

            showEdit: function () {
                $(".upload").animate({
                    height : "20px",
                    display: "block"
                }, 250);

            },

            hideEdit: function () {
                $(".upload").animate({
                    height : "0px",
                    display: "block"
                }, 250);

            },

            fileSizeIsAcceptable: function (file) {
                if (!file) {
                    return false;
                }
                return file.size < App.File.MAXSIZE;
            },

            switchTab: function (e) {
                e.preventDefault();
                var link = this.$("#tabList a");
                if (link.hasClass("selected")) {
                    link.removeClass("selected");
                }
                var index = link.index($(e.target).addClass("selected"));
                this.$(".tab").hide().eq(index).show();
            },

            /*saveItem: function () {
                var self = this;
                var mid = 39;
                var thisEl = this.$el;
                var employeeModel = new EmployeeModel();
                var name = {
                    first: $.trim(thisEl.find("#first").val()),
                    last : $.trim(thisEl.find("#last").val())
                };
                thisEl.find("#createBtnDialog").attr("disabled", "disabled");
                var workAddress = {};
                $("dd").find(".workAddress").each(function () {
                    var el = $(this);
                    workAddress[el.attr("name")] = $.trim(el.val());
                });
                var tags = $.trim(thisEl.find("#tags").val()).split(',');
                var workEmail = $.trim(thisEl.find("#workEmail").val());
                var personalEmail = $.trim(thisEl.find("#personalEmail").val());
                var skype = $.trim(thisEl.find("#skype").val());

                var phone = $.trim(thisEl.find("#phone").val());
                var mobile = $.trim(thisEl.find("#mobile").val());
                var workPhones = {
                    phone : phone,
                    mobile: mobile
                };

                var gender = thisEl.find("#genderDd").attr("data-id");
                var jobType = thisEl.find("#jobTypeDd").attr("data-id");
                var marital = thisEl.find("#maritalDd").attr("data-id");
                var officeLocation = $.trim(thisEl.find("#officeLocation").val());
                var relatedUser = thisEl.find("#relatedUsersDd").attr("data-id");

                var dep = thisEl.find("#departmentsDd");
                var department = dep.attr("data-id");

                var jobPos = thisEl.find("#jobPositionDd");
                var jobPosition = jobPos.attr("data-id");

                var manag = thisEl.find("#projectManagerDD");
                var manager = manag.attr("data-id");
                var coach = thisEl.find("#coachDd").attr("data-id");
                var identNo = $.trim($("#identNo").val());
                var nationality = thisEl.find("#nationality").attr("data-id");
                var passportNo = $.trim($("#passportNo").val());
                var bankAccountNo = $.trim($("#bankAccountNo").val());
                var otherId = $.trim(thisEl.find("#otherId").val());
                var LI = $.trim(thisEl.find('#LI').val());
                var FB = $.trim(thisEl.find('#FB').val());

                var homeAddress = {};
                $("dd").find(".homeAddress").each(function () {
                    var el = $(this);
                    homeAddress[el.attr("name")] = el.val();
                });
                // date parse 
                var dateBirthSt = $.trim(thisEl.find("#dateBirth").val());
                var hire = $.trim(thisEl.find("#hire").val());

                var active = (thisEl.find("#active").is(":checked")) ? true : false;
                var sourceId = thisEl.find("#sourceDd").attr("data-id");
                var usersId = [];
                var groupsId = [];
                $(".groupsAndUser tr").each(function () {
                    if ($(this).data("type") == "targetUsers") {
                        usersId.push($(this).attr("data-id"));
                    }
                    if ($(this).data("type") == "targetGroups") {
                        groupsId.push($(this).attr("data-id"));
                    }

                });
                var whoCanRW = thisEl.find("[name='whoCanRW']:checked").val();
                var valid = employeeModel.save({
                        name          : name,
                        gender        : gender ? gender : "",
                        jobType       : jobType ? jobType : "",
                        marital       : marital ? marital : "",
                        imageSrc      : this.imageSrc,
                        workAddress   : workAddress,
                        workEmail     : workEmail,
                        personalEmail : personalEmail,
                        skype         : skype,
                        workPhones    : workPhones,
                        officeLocation: officeLocation,
                        relatedUser   : relatedUser ? relatedUser : "",
                        department    : department,
                        jobPosition   : jobPosition ? jobPosition : "",
                        bankAccountNo : bankAccountNo,
                        manager       : manager ? manager : "",
                        coach         : coach ? coach : "",
                        identNo       : identNo,
                        passportNo    : passportNo,
                        otherId       : otherId,
                        homeAddress   : homeAddress,
                        dateBirth     : dateBirthSt,
                        active        : active,
                        source        : sourceId,
                        nationality   : nationality,
                        social        : {
                            LI: LI,
                            FB: FB
                        },
                        groups        : {
                            owner: thisEl.find("#allUsersSelect").attr("data-id"),
                            users: usersId,
                            group: groupsId
                        },
                        whoCanRW      : whoCanRW,
                        hire          : hire
                    },
                    {
                        headers: {
                            mid: mid
                        },
                        wait   : true,
                        success: function (model, response) {
                            self.attachView.sendToServer(null, model.changed);
                        },
                        error  : function (model, xhr) {
                            self.errorNotification(xhr);
                        }
                    });
                if (!valid) {
                    $("#createBtnDialog").removeAttr("disabled");
                }
            },*/

            saveItem: function () {
                var transferArray;
                var employeeModel;
                var homeAddress;
                var dateBirthSt;
                var self = this;
                var nationality;
                var jobPosition;
                var relatedUser;
                var isEmployee;
                var $jobTable;
                var department;
                var hireArray;
                var fireArray;
                var lastFire;
                var whoCanRW;
                var sourceId;
                var groupsId;
                var empThumb;
                var dataType;
                var manager;
                var marital;
                var jobType;
                var usersId;
                var salary;
                var gender;
                var coach;
                var event;
                var data;
                var date;
                var info;
                var $tr;
                var el;


                if ($('.errorContent').length) {
                    return App.render({
                        type: 'error',
                        message: 'Please fill Job tab'
                    });
                }

                self.hideNewSelect();

                employeeModel = new EmployeeModel();

                relatedUser   = self.$el.find("#relatedUsersDd").data("id") || null;
                coach         = $.trim(self.$el.find("#coachDd").data("id")) || null;
                whoCanRW      = self.$el.find("[name='whoCanRW']:checked").val();
                dateBirthSt   = $.trim(self.$el.find("#dateBirth").val());
                $jobTable     = self.$el.find('#hireFireTable');
                marital       = $("#maritalDd").data("id") || null;
                nationality   = $("#nationality").data("id");
                gender        = $("#genderDd").data("id") || null;
                $tr       = $jobTable.find('tr.transfer');
                sourceId      = $("#sourceDd").data("id");
                homeAddress   = {};
                fireArray     = [];
                hireArray     = [];
                groupsId      = [];
                usersId       = [];


                $("dd").find(".homeAddress").each(function (index, addressLine) {
                    el                           = $(addressLine);
                    homeAddress[el.attr("name")] = $.trim(el.val());
                });

                salary      = self.isSalary ? parseInt($tr.find('[data-id="salary"]').text()) : null;
                manager     = $tr.find('#projectManagerDD').attr('data-id') || null;
                date        = new Date($.trim($tr.find("td").eq(2).text()));
                jobPosition = $tr.find('#jobPositionDd').attr('data-id');
                department  = $tr.find('#departmentsDd').attr('data-id');
                jobType     = $.trim($tr.find('#jobTypeDd').text());
                info        = $tr.find('#statusInfoDd').val();
                event       = $tr.attr('data-content');

                transferArray = [{
                    status     : event,
                    date       : date,
                    department : department,
                    jobPosition: jobPosition,
                    manager    : manager,
                    jobType    : jobType,
                    salary     : salary,
                    info       : info
                }];

                hireArray.push(date);

                date = moment(date);
                fireArray.push(date);
                lastFire = date.year() * 100 + date.isoWeek();
                isEmployee = true;

                $(".groupsAndUser tr").each(function (index, element) {
                    dataType = $(element).data("type");

                    if (dataType === "targetUsers") {
                        usersId.push($(element).data("id"));
                    }

                    if (dataType === "targetGroups") {
                        groupsId.push($(element).data("id"));
                    }

                });

                data = {
                    name          : {
                        first: $.trim(this.$el.find("#first").val()),
                        last : $.trim(this.$el.find("#last").val())
                    },
                    gender        : gender,
                    jobType       : jobType,
                    marital       : marital,
                    workAddress   : {
                        street : $.trim(this.$el.find('#street').val()),
                        city   : $.trim(this.$el.find('#city').val()),
                        state  : $.trim(this.$el.find('#state').val()),
                        zip    : $.trim(this.$el.find('#zip').val()),
                        country: $.trim(this.$el.find('#country').val())
                    },
                    social        : {
                        LI: $.trim(this.$el.find('#LI').val()),
                        FB: $.trim(this.$el.find('#FB').val())
                    },
                    tags          : $.trim(this.$el.find("#tags").val()).split(','),
                    workEmail     : $.trim(this.$el.find("#workEmail").val()),
                    personalEmail : $.trim(this.$el.find("#personalEmail").val()),
                    skype         : $.trim(this.$el.find("#skype").val()),
                    workPhones    : {
                        phone : $.trim(this.$el.find("#phone").val()),
                        mobile: $.trim(this.$el.find("#mobile").val())
                    },
                    officeLocation: $.trim(this.$el.find("#officeLocation").val()),
                    bankAccountNo : $.trim($("#bankAccountNo").val()),
                    relatedUser   : relatedUser,
                    department    : department,
                    jobPosition   : jobPosition,
                    manager       : manager,
                    coach         : coach,
                    identNo       : $.trim($("#identNo").val()),
                    passportNo    : $.trim(this.$el.find("#passportNo").val()),
                    otherId       : $.trim(this.$el.find("#otherId").val()),
                    homeAddress   : homeAddress,
                    dateBirth     : dateBirthSt,
                    source        : sourceId,
                    imageSrc      : self.imageSrc,
                    nationality   : nationality,
                    isEmployee    : isEmployee,
                    lastFire      : lastFire,

                    groups  : {
                        owner: $("#allUsersSelect").data("id"),
                        users: usersId,
                        group: groupsId
                    },
                    whoCanRW: whoCanRW,
                    hire    : hireArray,
                    fire    : fireArray,
                    transfer: transferArray
                };

                employeeModel.save(data, {
                    headers: {
                        mid: 39
                    },
                    success: function (model) {

                        if (model.get('relatedUser') === App.currentUser._id) {
                            App.currentUser.imageSrc = self.imageSrc;

                            $("#loginPanel .iconEmployee").attr("src", self.imageSrc);
                            $("#loginPanel #userName").text(model.toJSON().fullName);
                        }

                        if (self.firstData === data.name.first &&
                            self.lastData === data.name.last &&
                            self.departmentData === department &&
                            self.jobPositionData === jobPosition &&
                            self.projectManagerData === manager) {

                            model    = model.toJSON();
                            empThumb = $('#' + model._id);

                            empThumb.find('.age').html(model.result.age);
                            empThumb.find('.empDateBirth').html("(" + model.dateBirth + ")");
                            empThumb.find('.telephone a').html(model.workPhones.mobile);
                            empThumb.find('.telephone a').attr('href', "skype:" + model.workPhones.mobile + "?call");

                            if (model.relatedUser) {
                                empThumb.find('.relUser').html(model.relatedUser.login);
                            }

                        } else {
                            Backbone.history.fragment = '';
                            Backbone.history.navigate(window.location.hash, {trigger: true, replace: true});
                        }
                        self.hideDialog();
                    },
                    error  : function (model, xhr) {
                        self.errorNotification(xhr);
                    }

                });


            },

            render: function () {
                var formString = this.template();
                var self = this;
                this.$el = $(formString).dialog({
                    dialogClass: "edit-dialog",
                    width      : 800,
                    title      : "Create Employee",
                    buttons    : {
                        save  : {
                            text : "Create",
                            class: "btn",
                            id   : "createBtnDialog",
                            click: self.saveItem
                        },
                        cancel: {
                            text : "Cancel",
                            class: "btn",
                            click: function () {
                                self.hideDialog();
                            }
                        }
                    }
                });
                var notDiv = this.$el.find('.attach-container');
                this.attachView = new attachView({
                    model   : new EmployeeModel(),
                    url     : "/uploadEmployeesFiles",
                    isCreate: true
                });
                notDiv.append(this.attachView.render().el);
                notDiv = this.$el.find('.assignees-container');
                notDiv.append(
                    new AssigneesView({
                        model: this.currentModel
                    }).render().el
                );

                populate.get("#jobTypeDd", "/jobType", {}, "name", this, true);
                populate.get("#departmentManagers", "/DepartmentsForDd", {}, "departmentManager", this);
                populate.get("#nationality", "/nationality", {}, "_id", this, true);
                populate.get2name("#projectManagerDD", "/getPersonsForDd", {}, this, true);
                populate.get("#jobPositionDd", "/JobPositionForDd", {}, "name", this, true, true);
                populate.get("#relatedUsersDd", "/UsersForDd", {}, "login", this, true, true);
                populate.get("#departmentsDd", "/DepartmentsForDd", {}, "departmentName", this, true);

                common.canvasDraw({model: this.model.toJSON()}, this);

                $('#dateBirth').datepicker({
                    changeMonth: true,
                    changeYear : true,
                    yearRange  : '-100y:c+nn',
                    maxDate    : '-18y'
                });

                $('#hire').datepicker({
                    dateFormat : "d M, yy",
                    changeMonth: true,
                    changeYear : true
                });

                this.delegateEvents(this.events);

                return this;
            }

        });

        return CreateView;
    });
