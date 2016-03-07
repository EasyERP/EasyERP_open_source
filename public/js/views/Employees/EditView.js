define([
        "Backbone",
        "jQuery",
        "Underscore",
        "text!templates/Employees/EditTemplate.html",
        'views/Notes/AttachView',
        'views/selectView/selectView',
        "collections/Employees/EmployeesCollection",
        "collections/JobPositions/JobPositionsCollection",
        "collections/Departments/DepartmentsCollection",
        "collections/Customers/AccountsDdCollection",
        "collections/Users/UsersCollection",
        'views/Assignees/AssigneesView',
        "common",
        "populate",
        "moment",
        'helpers/keyCodeHelper'
    ],
    function (Backbone, $, _, EditTemplate, attachView, selectView, EmployeesCollection, JobPositionsCollection, DepartmentsCollection, AccountsDdCollection, UsersCollection, AssigneesView, common, populate, moment, keyCodes) {
        'use strict';
        var EditView = Backbone.View.extend({
            el         : "#content-holder",
            contentType: "Employees",
            imageSrc   : '',
            template   : _.template(EditTemplate),
            responseObj: {},

            initialize: function (options) {
                var isSalary;

                _.bindAll(this, "saveItem");
                _.bindAll(this, "render", "deleteItem");

                if (options.collection) {
                    this.employeesCollection = options.collection;
                    this.currentModel = this.employeesCollection.getElement();
                } else {
                    this.currentModel = options.model;
                }
                this.currentModel.urlRoot = '/Employees';

                isSalary = this.currentModel.get('transfer')[0];
                isSalary = isSalary.salary;
                isSalary = !!(isSalary || isSalary === 0);
                this.isSalary = isSalary;

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
                "click #tabList a"                                               : "switchTab",
                "mouseenter .avatar"                                             : "showEdit",
                "mouseleave .avatar"                                             : "hideEdit",
                'click .dialog-tabs a'                                           : 'changeTab',
                'click .endContractReasonList, .withEndContract .arrow'          : 'showEndContractSelect',
                'click .withEndContract .newSelectList li'                       : 'endContract',
                "click .current-selected"                                        : "showNewSelect",
                "click .newSelectList li:not(.miniStylePagination, #selectInput)": "chooseOption",
                "click"                                                          : "hideNewSelect",
                "click td.editable"                                              : "editJob",
                "click #update"                                                  : "addNewRow",
                "keyup .editing"                                                 : "validateNumbers",
                "click .fa-trash"                                                : "deleteRow",
                "click #jobPosition,#department,#manager,#jobType"               : "showNotification",
            },

            showNotification: function (e) {
                var msg = 'You can edit ';

                e.preventDefault();
                msg += e.currentTarget.id;
                msg += ' at "Job" tab';

                App.render({
                    type   : 'notify',
                    message: msg
                });
            },

            deleteRow: function (e) {
                var target = $(e.target);
                var tr = target.closest('tr');

                tr.remove();

                this.$el.find('#update').show();
                this.$el.find('.withEndContract').show();

                this.renderRemoveBtn();
            },

            validateNumbers: function (e) {
                var $target = $(e.target);
                var code = e.keyCode;
                var inputValue = $target.val();

                if (!keyCodes.isDigitOrDecimalDot(code) && !keyCodes.isBspaceAndDelete(code)) {
                    $target.val(parseFloat(inputValue) || "");
                    return false;
                }
            },

            addNewRow: function (e, contractEndReason) {
                var table = this.$el.find('#hireFireTable');
                var lastTr = table.find('tr').last();
                var newTr = lastTr.clone();
                var trId = newTr.attr('data-id');
                var now = moment();

                now = common.utcDateToLocaleDate(now);

                newTr.attr('data-id', ++trId);
                newTr.find('td').eq(2).text(now);

                if (contractEndReason) {
                    newTr.attr('data-content', 'fired');
                    newTr.find('td').eq(1).text('fired');
                    newTr.find('td').last().find('input').val(contractEndReason);
                } else {
                    newTr.attr('data-content', 'updated');
                    newTr.find('td').eq(1).text('updated');
                }

                table.append(newTr);

                this.$el.find('#update').hide();
                this.$el.find('.withEndContract').hide();

                this.renderRemoveBtn();
            },


            renderRemoveBtn: function() {
                var table = this.$el.find('#hireFireTable');
                var trs = table.find('tr');
                var removeBtn = '<a class="fa fa-trash"></a>';

                trs.find('td:first-child').text('');
                trs.last().find('td').first().html(removeBtn);
            },


            editJob: function (e) {
                var self = this;
                var $target = $(e.target);
                var dataId = $target.attr('data-id');
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

            chooseOption: function (e) {
                var $target = $(e.target);
                var parentUl = $target.parent();
                var element = $target.closest('a') || parentUl.closest('a');
                var id = element.attr('id') || parentUl.attr('id');
                var valueId = $target.attr('id');
                var managersIds = this.responseObj['#departmentManagers'];
                var managers = this.responseObj['#projectManagerDD'];
                var managerId;
                var manager;

                if (id === 'jobPositionDd' || 'departmentsDd' || 'projectManagerDD' || 'jobTypeDd' || 'hireFireDd') {
                    element.text($target.text());
                    element.attr('data-id', valueId);

                    if (id === 'departmentsDd') {

                        managersIds.forEach(function(managerObj) {
                            if (managerObj._id === valueId) {
                                managerId = managerObj.name;
                            }
                        });

                        managers.forEach(function(managerObj) {
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
                var editingDates = this.$el.find('.editing');

                editingDates.each(function () {
                    $(this).parent().text($(this).val());
                    $(this).remove();
                });

                this.$el.find('.newSelectList').hide();

                if (this.selectView) {
                    this.selectView.remove();
                }
            },

            showEndContractSelect: function (e) {
                e.preventDefault();
                $(e.target).parent().find(".newSelectList").toggle();

                return false;
            },

            activeTab: function () {
                var tabs;
                var activeTab;
                var activeTab;
                var dialogHolder;
                var tabId;

                tabId = 'job';
                tabs = $(".dialog-tabs");
                activeTab = tabs.find('.active');

                activeTab.removeClass('active');
                tabs.find('#' + tabId + 'Tab').addClass("active");

                dialogHolder = $(".dialog-tabs-items");
                dialogHolder.find(".dialog-tabs-item.active").removeClass("active");
                dialogHolder.find('#' + tabId).closest('.dialog-tabs-item').addClass("active");

            },

            endContract: function (e) {
                var contractEndReason = $(e.target).text();

                this.activeTab();

                this.addNewRow(null, contractEndReason);
            },

            changeTab: function (e) {
                var n;
                var dialog_holder;
                var holder = $(e.target);

                holder.closest(".dialog-tabs").find("a.active").removeClass("active");
                holder.addClass("active");
                n = holder.parents(".dialog-tabs").find("li").index(holder.parent());
                dialog_holder = holder.closest(".dialog-tabs").parent().find(".dialog-tabs-items");
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

            switchTab: function (e) {
                var index;
                var link;

                e.preventDefault();
                link = this.$("#tabList a");

                if (link.hasClass("selected")) {
                    link.removeClass("selected");
                }

                index = link.index($(e.target).addClass("selected"));
                this.$(".tab").hide().eq(index).show();
            },

            saveItem  : function () {
                /*this.hideNewSelect();

                var jobType;
                var department;
                var jobPosition;
                var manager;
                var empThumb;
                var self = this;
                var redirect = false;
                var $tableFire = this.$el.find('#hireFireTable');
                var lastRow = $tableFire.find('tr').last();
                var firedDate;
                var fireReason;
                var gender = $("#genderDd").data("id") || null;
                var marital = $("#maritalDd").data("id") || null;
                var relatedUser = this.$el.find("#relatedUsersDd").data("id") || null;
                var coach = $.trim(this.$el.find("#coachDd").data("id")) || null;
                var homeAddress = {};

                $("dd").find(".homeAddress").each(function () {
                    var el = $(this);
                    homeAddress[el.attr("name")] = $.trim(el.val());
                });

                var dateBirthSt = $.trim(this.$el.find("#dateBirth").val());
                var transferArray = $tableFire.find('[data-content="transfer"]');
                var newHireArray = [];
                var newTransferArray = [];
                var lengthHire = transferArray.length - 1;
                var fireArray = this.currentModel.get('fire');
                var hireModelArray = this.currentModel.get('hire');
                var newFire = _.clone(fireArray);
                var newFireArray = [];

                _.each(transferArray, function (hire, key) {
                    var tr = self.$el.find("#hire" + key);
                    var date = new Date($.trim(tr.find("[data-id='hiredDate']").text()));
                    var jobPosition = tr.find('#jobPositionDd').attr('data-id');
                    var department = tr.find('#departmentsDd').attr('data-id');
                    var manager = tr.find('#projectManagerDD').attr('data-id') || null;
                    var salary = parseInt(tr.find('[data-id="salary"]').text()) || (hireModelArray[key] ? hireModelArray[key].salary : hireModelArray[key - 1].salary);
                    var info = tr.find('#statusInfoDd').val();
                    var jobType = $.trim(tr.find('#jobTypeDd').text());

                    var trFire = $(self.$el.find("#fire" + key));

                    newTransferArray.push({
                        date       : date,
                        department : department,
                        jobPosition: jobPosition,
                        manager    : manager,
                        jobType    : jobType,
                        salary     : salary,
                        info       : info
                    });

                    if (lengthHire === key && !lastRow.hasClass('fired')) {
                        newHireArray.push(date);
                        return newHireArray;
                    }

                    if (trFire && trFire.length) {
                        newFire[key] = _.clone(newHireArray[key]);

                        newFire[key].date = new Date($.trim(trFire.find("[data-id='firedDate']").text()));
                        newFire[key].info = trFire.find('#statusInfoDd').val();

                        newFireArray.push(newFire[key]);
                    } else {
                        newFire[key] = _.clone(newHireArray[key]);

                        newFire[key].date = date;
                        newFire[key].info = 'Update';

                        newFireArray.push(newFire[key]);
                    }
                    return newHireArray;
                });

                lengthHire = newHireArray.length;
                jobPosition = newHireArray[lengthHire - 1].jobPosition;
                department = newHireArray[lengthHire - 1].department;
                manager = newHireArray[lengthHire - 1].manager;
                jobType = newHireArray[lengthHire - 1].jobType;

                if (lastRow.hasClass('fired')) {
                    redirect = true;
                    firedDate = newFireArray[newFireArray.length - 1].date;
                    fireReason = newFireArray[newFireArray.length - 1].info;
                }

                var sourceId = $("#sourceDd").data("id");

                var usersId = [];
                var groupsId = [];

                $(".groupsAndUser tr").each(function () {
                    if ($(this).data("type") === "targetUsers") {
                        usersId.push($(this).data("id"));
                    }
                    if ($(this).data("type") === "targetGroups") {
                        groupsId.push($(this).data("id"));
                    }

                });
                var whoCanRW = this.$el.find("[name='whoCanRW']:checked").val();
                var nationality = $("#nationality").data("id");
                var data = {
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
                    imageSrc      : this.imageSrc,
                    nationality   : nationality,
                    groups        : {
                        owner: $("#allUsersSelect").data("id"),
                        users: usersId,
                        group: groupsId
                    },
                    whoCanRW      : whoCanRW,
                    hire          : newHireArray,
                    fire          : newFireArray
                };

                if (redirect) {
                    data.isEmployee = false;
                    data.lastFire = moment(firedDate).year() * 100 + moment(firedDate).isoWeek();
                    data.contractEnd = {
                        "date"  : new Date(firedDate),
                        "reason": fireReason
                    };
                }

                this.currentModel.set(data);
                this.currentModel.save(this.currentModel.changed, {
                    headers: {
                        mid: 39
                    },
                    patch  : true,
                    success: function (model) {
                        if (redirect) {
                            return Backbone.history.navigate("easyErp/Applications/kanban", {trigger: true});
                        }

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

                            model = model.toJSON();
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

                });*/
                this.hideNewSelect();

                var relatedUser = this.$el.find("#relatedUsersDd").data("id") || null;
                var coach = $.trim(this.$el.find("#coachDd").data("id")) || null;
                var whoCanRW = this.$el.find("[name='whoCanRW']:checked").val();
                var dateBirthSt = $.trim(this.$el.find("#dateBirth").val());
                var $tableFire = this.$el.find('#hireFireTable');
                var marital = $("#maritalDd").data("id") || null;
                var gender = $("#genderDd").data("id") || null;
                var nationality = $("#nationality").data("id");
                var $trs = $tableFire.find('tr.transfer');
                var sourceId = $("#sourceDd").data("id");
                var transferArray = [];
                var redirect = false;
                var homeAddress = {};
                var fireArray = [];
                var hireArray = [];
                var groupsId = [];
                var usersId = [];
                var self = this;
                var jobPosition;
                var isEmployee;
                var department;
                var empThumb;
                var lastFire;
                var manager;
                var jobType;
                var salary;
                var event;
                var data;
                var date;
                var info;
                var el;


                $("dd").find(".homeAddress").each(function () {
                    el = $(this);
                    homeAddress[el.attr("name")] = $.trim(el.val());
                });

                $.each($trs, function (i, $tr) {
                    $tr = $($tr);
                    event = $tr.attr('data-content');
                    date = new Date($.trim($tr.find("td").eq(2).text()));
                    jobPosition = $tr.find('#jobPositionDd').attr('data-id');
                    department = $tr.find('#departmentsDd').attr('data-id');
                    manager = $tr.find('#projectManagerDD').attr('data-id') || null;
                    info = $tr.find('#statusInfoDd').val();
                    jobType = $.trim($tr.find('#jobTypeDd').text());
                    salary = self.isSalary ? parseInt($tr.find('[data-id="salary"]').text()) : null;

                    transferArray.push({
                        status     : event,
                        date       : date,
                        department : department,
                        jobPosition: jobPosition,
                        manager    : manager,
                        jobType    : jobType,
                        salary     : salary,
                        info       : info
                    });

                    if (event === 'fired') {
                        fireArray.push(date);
                        lastFire = moment(date).year() * 100 + moment(date).isoWeek();
                    }

                    if (event === 'hired') {
                        hireArray.push(date);
                    }
                });

                isEmployee = event !== 'fired';

                $(".groupsAndUser tr").each(function () {
                    if ($(this).data("type") === "targetUsers") {
                        usersId.push($(this).data("id"));
                    }
                    if ($(this).data("type") === "targetGroups") {
                        groupsId.push($(this).data("id"));
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
                    imageSrc      : this.imageSrc,
                    nationality   : nationality,
                    isEmployee    : isEmployee,
                    lastFire      : lastFire,

                    groups        : {
                        owner: $("#allUsersSelect").data("id"),
                        users: usersId,
                        group: groupsId
                    },
                    whoCanRW      : whoCanRW,
                    hire          : hireArray,
                    fire          : fireArray,
                    transfer      : transferArray
                };

                if (!isEmployee) {
                    data.workflow = "52d2c1369b57890814000005";
                }

                this.currentModel.set(data);
                this.currentModel.save(this.currentModel.changed, {
                    headers: {
                        mid: 39
                    },
                    patch  : true,
                    success: function (model) {
                        if (!isEmployee) {
                            return Backbone.history.navigate("easyErp/Applications/kanban", {trigger: true});
                        }

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

                            model = model.toJSON();
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

            deleteItem: function (event) {
                event.preventDefault();
                var mid = 39;
                var self = this;
                var answer = confirm("Really DELETE items ?!");

                if (answer == true) {
                    this.currentModel.urlRoot = "/Employees";
                    this.currentModel.destroy({
                        headers: {
                            mid: mid
                        },
                        success: function () {
                            $('.edit-dialog').remove();
                            Backbone.history.navigate("easyErp/" + self.contentType, {trigger: true});
                        },
                        error  : function (model, xhr) {
                            self.errorNotification(xhr);
                        }
                    });
                }
            },

            render: function () {
                var lastElement;
                var firstElement;
                var jobPosElement;
                var departmentElement;
                var projectManagerElement;

                if (this.currentModel.get('dateBirth')) {
                    this.currentModel.set({
                        dateBirth: this.currentModel.get('dateBirth').split('T')[0].replace(/-/g, '/')
                    }, {
                        silent: true
                    });
                }



                var formString = this.template({
                    model: this.currentModel.toJSON()
                });
                var self = this;
                this.$el = $(formString).dialog({
                    closeOnEscape: false,
                    dialogClass  : "edit-dialog",
                    width        : 1000,
                    buttons      : {
                        save  : {
                            text : "Save",
                            class: "btn",
                            click: self.saveItem
                        },
                        cancel: {
                            text : "Cancel",
                            class: "btn",
                            click: self.hideDialog
                        },
                        delete: {
                            text : "Delete",
                            class: "btn",
                            click: self.deleteItem
                        }
                    }
                });
                var notDiv = this.$el.find('.attach-container');
                notDiv.append(
                    new attachView({
                        model: this.currentModel,
                        url  : "/uploadEmployeesFiles"
                    }).render().el
                );
                notDiv = this.$el.find('.assignees-container');
                notDiv.append(
                    new AssigneesView({
                        model: this.currentModel
                    }).render().el
                );
                common.getWorkflowContractEnd("Applications", null, null, "/Workflows", null, "Contract End", function (workflow) {
                    $('.endContractReasonList').attr('data-id', workflow[0]._id);
                });
                populate.get("#jobTypeDd", "/jobType", {}, "name", this);
                populate.get("#departmentManagers", "/DepartmentsForDd", {}, "departmentManager", this);
                populate.get("#nationality", "/nationality", {}, "_id", this);
                populate.get2name("#projectManagerDD", "/getPersonsForDd", {}, this);
                populate.get("#jobPositionDd", "/JobPositionForDd", {}, "name", this, false, false);
                populate.get("#relatedUsersDd", "/UsersForDd", {}, "login", this, false, true);
                populate.get("#departmentsDd", "/DepartmentsForDd", {}, "departmentName", this);
                common.canvasDraw({model: this.currentModel.toJSON()}, this);

                $('#dateBirth').datepicker({
                    dateFormat : "d M, yy",
                    changeMonth: true,
                    changeYear : true,
                    yearRange  : '-100y:c+nn',
                    maxDate    : '-18y'
                });

                $('.date').datepicker({
                    dateFormat : "d M, yy",
                    changeMonth: true,
                    changeYear : true
                });

                this.removeIcon = this.$el.find('.fa-trash');
                this.hiredDate = this.currentModel.get('hire')[0];

                var model = this.currentModel.toJSON();
                if (model.groups) {
                    if (model.groups.users.length > 0 || model.groups.group.length) {
                        $(".groupsAndUser").show();
                        model.groups.group.forEach(function (item) {
                            $(".groupsAndUser").append("<tr data-type='targetGroups' data-id='" + item._id + "'><td>" + item.departmentName + "</td><td class='text-right'></td></tr>");
                            $("#targetGroups").append("<li id='" + item._id + "'>" + item.departmentName + "</li>");
                        });
                        model.groups.users.forEach(function (item) {
                            $(".groupsAndUser").append("<tr data-type='targetUsers' data-id='" + item._id + "'><td>" + item.login + "</td><td class='text-right'></td></tr>");
                            $("#targetUsers").append("<li id='" + item._id + "'>" + item.login + "</li>");
                        });

                    }
                }
                this.delegateEvents(this.events);

                lastElement = this.$el.find("#last");
                firstElement = this.$el.find("#first");
                jobPosElement = this.$el.find("#jobPosition");
                departmentElement = this.$el.find("#department");
                projectManagerElement = this.$el.find("#manager");

                this.lastData = $.trim(lastElement.val());
                this.firstData = $.trim(firstElement.val());
                this.jobPositionData = $.trim(jobPosElement.attr('data-id'));
                this.departmentData = $.trim(departmentElement.attr('data-id'));
                this.projectManagerData = $.trim(projectManagerElement.attr('data-id'));

                return this;
            }

        });

        return EditView;
    });
