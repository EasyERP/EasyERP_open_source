define([
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
        "populate"
    ],
    function (EditTemplate, attachView, selectView, EmployeesCollection, JobPositionsCollection, DepartmentsCollection, AccountsDdCollection, UsersCollection, AssigneesView, common, populate) {

        var EditView = Backbone.View.extend({
            el         : "#content-holder",
            contentType: "Employees",
            imageSrc   : '',
            template   : _.template(EditTemplate),
            responseObj: {},

            initialize: function (options) {
                _.bindAll(this, "saveItem");
                _.bindAll(this, "render", "deleteItem");

                if (options.collection) {
                    this.employeesCollection = options.collection;
                    this.currentModel = this.employeesCollection.getElement();
                } else {
                    this.currentModel = options.model;
                }
                this.currentModel.urlRoot = '/Employees';

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
                "click td.editable"                                              : "editDate"
            },

            editDate: function (e) {
                var self = this;
                var $target = $(e.target);
                var tempContainer;

                tempContainer = ($target.text()).trim();
                $target.html('<input class="editing" type="text" value="' + tempContainer + '">');
                $target.find('.editing').datepicker({
                    dateFormat : "d M, yy",
                    changeMonth: true,
                    changeYear : true,
                    onSelect   : function () {
                        var editingDates = self.$el.find('.editing');

                        editingDates.each(function () {
                            $(this).parent().text($(this).val());
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
                $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id"));

               // this.selectView.remove();
            },

            //nextSelect: function (e) {
            //    this.showNewSelect(e, false, true);
            //},
            //
            //prevSelect: function (e) {
            //    this.showNewSelect(e, true, false);
            //},

            hideNewSelect: function () {
                if (this.selectView) {
                    this.selectView.remove();
                }
            },

            showEndContractSelect: function (e) {
                e.preventDefault();
                $(e.target).parent().find(".newSelectList").toggle();

                return false;
            },

            endContract: function (e) {
                var fired = {};
                var wfId = $('.endContractReasonList').attr('data-id');
                var contractEndReason = $(e.target).text();

                fired.date = new Date();
                fired.department = this.$el.find("#departmentsDd").attr("data-id") ? this.$el.find("#departmentsDd").attr("data-id") : null;
                fired.jobPosition = this.$el.find("#jobPositionDd").attr("data-id") ? this.$el.find("#jobPositionDd").attr("data-id") : null;

                this.currentModel.set({workflow: wfId, contractEndReason: contractEndReason, fired: fired});
                this.currentModel.save(this.currentModel.changed, {
                    patch  : true,
                    success: function () {
                        Backbone.history.navigate("easyErp/Applications/kanban", {trigger: true});
                    },
                    error  : function () {
                        Backbone.history.navigate("home", {trigger: true});
                    }
                });
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
                var empThumb;
                var self = this;
                var depForTransfer = this.currentModel.get('department');
                var gender = $("#genderDd").data("id");
                gender = gender ? gender : null;

                var jobType = $("#jobTypeDd").data("id");
                jobType = jobType ? jobType : null;

                var marital = $("#maritalDd").data("id");
                marital = marital ? marital : null;

                var relatedUser = this.$el.find("#relatedUsersDd").data("id");
                relatedUser = relatedUser ? relatedUser : null;

                var department = this.$el.find("#departmentsDd").data("id") ? this.$el.find("#departmentsDd").data("id") : null;

                var jobPosition = this.$el.find("#jobPositionDd").data("id") ? this.$el.find("#jobPositionDd").data("id") : null;

                var manager = this.$el.find("#projectManagerDD").data("id") ? this.$el.find("#projectManagerDD").data("id") : null;

                var coach = $.trim(this.$el.find("#coachDd").data("id"));
                coach = coach ? coach : null;

                var homeAddress = {};

                $("dd").find(".homeAddress").each(function () {
                    var el = $(this);
                    homeAddress[el.attr("name")] = $.trim(el.val());
                });
                // date parse 
                var dateBirthSt = $.trim(this.$el.find("#dateBirth").val());
                var hireArray = this.currentModel.get('hire');
                var newHireArray = [];

                _.each(hireArray, function (hire, key) {
                    var date = new Date($.trim(self.$el.find("#hire" + key).text()));
                    newHireArray.push({
                        date       : date,
                        department : department,
                        jobPosition: jobPosition
                    });
                    return newHireArray;
                });

                var fireArray = this.currentModel.get('fire');
                var newFireArray = [];

                _.each(fireArray, function (hire, key) {
                    var date = new Date($.trim(self.$el.find("#fire" + key).text()));
                    newFireArray.push({
                        date       : date,
                        department : department,
                        jobPosition: jobPosition
                    });
                    return newFireArray;
                });

                var transferArray = this.currentModel.get('transferred');
                var newTransfer = [];

                _.each(transferArray, function (obj, key) {
                    var date = $.trim(self.$el.find("#date" + key).val());
                    var dep = obj.department;
                    var result = {};

                    result.department = dep;
                    result.date = new Date(date);

                    newTransfer.push(result);
                    return newTransfer;
                });

                var active = (this.$el.find("#active").is(":checked")) ? true : false;
                var sourceId = $("#sourceDd").data("id");

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
                    active        : active,
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
                    fire          : newFireArray,
                    transferred   : newTransfer,
                    // depForTransfer: depForTransfer
                };
                if (department._id !== depForTransfer._id) {
                    data.depForTransfer = depForTransfer.name;
                }
                //if (!relatedUser){
                //    data['currentUser']= App.currentUser._id;
                //}
                this.currentModel.set(data);
                this.currentModel.save(this.currentModel.changed, {
                    headers: {
                        mid: 39
                    },
                    patch  : true,
                    success: function (model) {
                        //App.currentUser.imageSrc =  self.imageSrc;
                        //if (relatedUser){
                        //    $("#loginPanel .iconEmployee").attr("src", self.imageSrc);
                        //    $("#loginPanel #userName").text(model.toJSON().fullName);
                        //} else {
                        //    $("#loginPanel .iconEmployee").attr("src", App.currentUser.imageSrc);
                        //    $("#loginPanel  #userName").text(App.currentUser.login);
                        //}

                        if (self.firstData === data.name.first &&
                            self.lastData === data.name.last &&
                            self.departmentData === $.trim(self.$el.find("#departmentsDd").text()) &&
                            self.jobPositionData === $.trim(self.$el.find("#jobPositionDd").text()) &&
                            self.projectManagerData === $.trim(this.$el.find("#projectManagerDD").text())) {

                            model = model.toJSON();
                            empThumb = $('#' + model._id);

                            //empThumb.find('.fullName').html(model.name.first + ' ' + model.name.last);
                            //empThumb.find('.jobPos').html(model.jobPosition.name);
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
                var hireArray;
                var fireArray;

                if (this.currentModel.get('dateBirth')) {
                    this.currentModel.set({
                        dateBirth: this.currentModel.get('dateBirth').split('T')[0].replace(/-/g, '/')
                    }, {
                        silent: true
                    });
                }
                this.currentModel.set({
                    hire: this.currentModel.get('hire')
                }, {
                    silent: true
                });

                this.currentModel.set({
                    fire: this.currentModel.get('fire')
                }, {
                    silent: true
                });

                this.currentModel.set({
                    transferred: this.currentModel.get('transferred')
                }, {
                    silent: true
                });

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
                populate.get("#nationality", "/nationality", {}, "_id", this);
                populate.get2name("#projectManagerDD", "/getPersonsForDd", {}, this);
                populate.get("#jobPositionDd", "/JobPositionForDd", {}, "name", this, false, true);
                populate.get("#relatedUsersDd", "/UsersForDd", {}, "login", this, false, true);
                populate.get("#departmentsDd", "/DepartmentsForDd", {}, "departmentName", this);
                common.canvasDraw({model: this.currentModel.toJSON()}, this);

                $('#dateBirth').datepicker({
                    dateFormat : "d M, yy",
                    changeMonth: true,
                    changeYear : true,
                    yearRange  : '-100y:c+nn',
                    maxDate    : '-18y'
                    //onChangeMonthYear: function (year, month) {
                    //    var target = $(this);
                    //    var day = target.val().split('/')[0];
                    //    target.val(day + '/' + month + '/' + year);
                    //}
                });

                $('.date').datepicker({
                    dateFormat : "d M, yy",
                    changeMonth: true,
                    changeYear : true
                });

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
                jobPosElement = this.$el.find("#jobPositionDd");
                departmentElement = this.$el.find("#departmentsDd");
                projectManagerElement = this.$el.find("#projectManagerDD");

                this.lastData = $.trim(lastElement.val());
                this.firstData = $.trim(firstElement.val());
                this.jobPositionData = $.trim(jobPosElement.val());
                this.departmentData = $.trim(departmentElement.val());
                this.projectManagerData = $.trim(projectManagerElement.val());

                return this;
            }

        });

        return EditView;
    });
