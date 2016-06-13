define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Applications/EditTemplate.html',
    'views/selectView/selectView',
    'views/Notes/AttachView',
    'views/dialogViewBase',
    'common',
    'populate',
    'custom',
    'moment',
    'constants'
], function (Backbone, $, _, EditTemplate, SelectView, AttachView, ParentView, common, populate, custom, moment, CONSTANTS) {
    'use strict';
    var EditView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'Applications',
        imageSrc   : '',
        template   : _.template(EditTemplate),
        initialize : function (options) {
            var isSalary;

            _.bindAll(this, 'saveItem');
            _.bindAll(this, 'render', 'deleteItem');

            this.employeesCollection = options.collection;
            this.currentModel = options.model || options.collection.getElement();
            this.currentModel.urlRoot = '/Applications';
            this.responseObj = {};
            this.refuseId = 0;

            isSalary = this.currentModel.get('transfer')[0] || null;
            isSalary = isSalary && isSalary.salary;
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
            'click .breadcrumb a, #refuse'                     : 'changeWorkflow',
            'change #workflowNames'                            : 'changeWorkflows',
            'mouseenter .avatar'                               : 'showEdit',
            'mouseleave .avatar'                               : 'hideEdit',
            'click .current-selected'                          : 'showNewSelect',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption',
            'click .hireEmployee'                              : 'isEmployee',
            'click .refuseEmployee'                            : 'refuseEmployee',
            'click td.editable'                                : 'editJob',
            'click #update'                                    : 'addNewRow',
            'click #jobPosition,#department,#manager,#jobType' : 'showNotification',
            'click .fa-trash'                                  : 'deleteRow'
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

            this.renderRemoveBtn();
        },

        addNewRow: function () {
            var table = this.$el.find('#hireFireTable');
            var lastTr = table.find('tr').last();
            var newTr = lastTr.clone();
            var trId = newTr.attr('data-id');
            var now = moment();

            now = common.utcDateToLocaleDate(now);

            newTr.attr('data-id', ++trId);
            newTr.find('td').eq(2).text(now);
            newTr.attr('data-content', 'hired');
            newTr.find('td').eq(1).text('hired');
            newTr.find('td').last().text('');

            table.append(newTr);

            this.$el.find('#update').hide();

            this.renderRemoveBtn();
        },

        renderRemoveBtn: function () {
            var table = this.$el.find('#hireFireTable');
            var trs = table.find('tr');
            var removeBtn = CONSTANTS.TRASH_BIN;

            trs.find('td:first-child').text('');
            trs.last().find('td').first().html(removeBtn);
        },

        editJob: function (e) {
            var self = this;
            var $target = $(e.target);
            var dataId = $target.attr('data-id');
            // var tr = $target.closest('tr');
            var tempContainer;
            var $tr = $target.parent('tr');
            var trNum = $tr.attr('data-id');
            var minDate = new Date('1995-01-01');
            var maxDate = null;

            tempContainer = ($target.text()).trim();

            if (dataId === 'salary') {
                $target.html('<input class="editing statusInfo" type="text" value="' + tempContainer + '">');
                return false;
            }

            $target.html('<input class="editing statusInfo" type="text" value="' + tempContainer + '" ' + 'readonly' + '>');

            if (parseInt(trNum, 10) > 0) {
                minDate = $tr.prev().find('td.date').text();
            }

            if ($tr.next()) {
                maxDate = $tr.next().find('td.date').text();
            }

            $target.find('.editing').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                minDate    : minDate,
                maxDate    : maxDate,
                onSelect   : function () {
                    var editingDates = self.$el.find('.editing');

                    editingDates.each(function () {
                        $(this).parent().text($(this).val()).removeClass('changeContent');
                        $(this).remove();
                    });
                }
            }).removeClass('datepicker');

            return false;
        },

        refuseEmployee: function (e) {
            var self = this;
            var workflowStart = this.currentModel.get('workflow') && this.currentModel.get('workflow')._id ? this.currentModel.get('workflow')._id : this.currentModel.get('workflow');

            e.preventDefault();

            this.currentModel.save({
                workflow: self.refuseId
            }, {
                patch  : true,
                success: function (model) {
                    var viewType = custom.getCurrentVT();

                    model = model.toJSON();

                    switch (viewType) {
                        case 'list':
                            $('tr[data-id="' + model._id + '"] td').eq(6).find('a').text('Refused');
                            break;
                        case 'kanban':
                            $('.column[data-id="' + self.refuseId + '"]').find('.columnNameDiv').after($('#' + model._id));
                            if (self.refuseId) {
                                var counter = $('.column[data-id="' + self.refuseId + '"]').closest('.column').find('.totalCount');
                                counter.html(parseInt(counter.html(), 10) + 1);
                                counter = $('.column[data-id="' + workflowStart + '"]').closest('.column').find('.totalCount');
                                counter.html(parseInt(counter.html(), 10) - 1);

                            }
                            break;
                    }
                    self.hideDialog();
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
            return false;

        },

        isEmployee: function (e) {
            e.preventDefault();

            this.addNewRow();
            this.saveItem(null, true);
        },

        getWorkflowValue: function (value) {
            var workflows = [];
            var i;

            for (i = 0; i < value.length; i++) {
                workflows.push({name: value[i].name, status: value[i].status});
            }
            return workflows;
        },
        
        saveItem: function (e, toEmployyes) {
            var weeklyScheduler;
            var currentWorkflow;
            var proposedSalary;
            var expectedSalary;
            var transferArray;
            var self = this;
            var previousDep;
            var relatedUser;
            var dateBirthSt;
            var nationality;
            var homeAddress;
            var jobPosition;
            var nextAction;
            var isEmployee;
            var department;
            var workflowId;
            var $jobTable;
            var fireArray;
            var hireArray;
            var lastFire;
            var sourceId;
            var viewType;
            var workflow;
            var position;
            var whoCanRW;
            var groupsId;
            var usersId;
            var marital;
            var jobType;
            var manager;
            var $jobTrs;
            var gender;
            var salary;
            var coach;
            var event;
            var quit;
            var data;
            var date;
            var info;
            var flag;
            var $el;
            var $thisEl = this.$el;

            $thisEl.find('.required').each(function () {
                if (!$(this).attr('data-id')) {
                    App.render({
                        type   : 'error',
                        message: 'Please fill ' + $(this).attr('id')
                    });
                    flag = true;
                    return false;
                }
            });

            if (flag) {
                return;
            }

            self.hideNewSelect();

            relatedUser = $thisEl.find('#relatedUsersDd').attr('data-id') || null;
            coach = $.trim($thisEl.find('#coachDd').attr('data-id')) || null;
            whoCanRW = $thisEl.find('[name="whoCanRW"]:checked').val();
            dateBirthSt = $.trim($thisEl.find('#dateBirth').val());
            nextAction = $.trim($thisEl.find('#nextAction').val());
            $jobTable = $thisEl.find('#hireFireTable');
            marital =  $thisEl.find('#maritalDd').attr('data-id') || null;
            gender =  $thisEl.find('#genderDd').attr('data-id') || null;
            nationality = $('#nationality').attr('data-id');
            $jobTrs = $jobTable.find('tr.transfer');
            sourceId = $thisEl.find('#sourceDd').attr('data-id');
            viewType = custom.getCurrentVT();
            transferArray = [];
            homeAddress = {};
            fireArray = [];
            hireArray = [];
            groupsId = [];
            usersId = [];

            $thisEl.find('dd').find('.homeAddress').each(function (index, addressLine) {
                $el = $(addressLine);
                homeAddress[$el.attr('name')] = $.trim($el.val());
            });

            $.each($jobTrs, function (i, $tr) {
                var $previousTr;

                $tr = $($tr);
                event = $tr.attr('data-content');
                date = new Date($.trim($tr.find('td').eq(2).text()));
                jobPosition = $tr.find('#jobPositionDd').attr('data-id');
                department = $tr.find('#departmentsDd').attr('data-id');
                weeklyScheduler = $tr.find('#weeklySchedulerDd').attr('data-id');
                manager = $tr.find('#projectManagerDD').attr('data-id') || null;
                info = $tr.find('#statusInfoDd').val();
                jobType = $.trim($tr.find('#jobTypeDd').text());
                salary = self.isSalary ? parseInt($tr.find('[data-id="salary"] input').val() || $tr.find('[data-id="salary"]').text(), 10) : null;

                if (!previousDep) {
                    previousDep = department;
                }

                if (previousDep !== department) {
                    $previousTr = $($jobTrs[i - 1]);

                    transferArray.push({
                        status         : 'transfer',
                        date           : moment(date).subtract(1, 'day'),
                        department     : previousDep,
                        jobPosition    : $previousTr.find('#jobPositionDd').attr('data-id') || null,
                        manager        : $previousTr.find('#projectManagerDD').attr('data-id') || null,
                        jobType        : $.trim($previousTr.find('#jobTypeDd').text()),
                        salary         : salary,
                        info           : $previousTr.find('#statusInfoDd').val(),
                        weeklyScheduler: $previousTr.find('#weeklySchedulerDd').attr('data-id')
                    });

                    previousDep = department;
                }

                transferArray.push({
                    status         : event,
                    date           : date,
                    department     : department,
                    jobPosition    : jobPosition,
                    manager        : manager,
                    jobType        : jobType,
                    salary         : salary,
                    info           : info,
                    weeklyScheduler: weeklyScheduler
                });

                if ((salary == null) && self.isSalary) {
                    App.render({
                        type   : 'error',
                        message: 'Salary can`t be empty'
                    });
                    quit = true;
                    return false;
                }

                if (event === 'fired') {
                    date = moment(date);
                    fireArray.push(date);
                    lastFire = date.year() * 100 + date.isoWeek();
                }

                if (event === 'hired') {
                    hireArray.push(date);
                }
            });

            if (quit) {
                return;
            }

            transferArray = transferArray.sort(function (a, b) {
                return a.date - b.date;
            });

            if (!transferArray.length) {
                $el =  $thisEl.find('.edit-employee-info');
                position = $.trim($el.find('#jobPositionDd').text());
                jobType = $.trim($el.find('#jobTypeDd').text());
                jobPosition = $el.find('#jobPositionDd').attr('data-id');
                weeklyScheduler = $el.find('#weeklySchedulerDd').attr('data-id');
                department = $el.find('#departmentsDd').attr('data-id');
                manager = $el.find('#projectManagerDD').attr('data-id');
                expectedSalary = parseInt($.trim($el.find('#expectedSalary').val()), 10) || 0;
                salary = parseInt($.trim($el.find('#proposedSalary').val()), 10) || 0;
                proposedSalary = salary;

                if (toEmployyes) {
                    event = 'hired';
                    transferArray.push({
                        status         : 'hired',
                        date           : moment(),
                        department     : department,
                        jobPosition    : jobPosition,
                        weeklyScheduler: weeklyScheduler,
                        manager        : manager,
                        jobType        : jobType,
                        salary         : salary,
                        info           : ''
                    });
                }
            } else {
                position = $.trim($jobTrs.last().find('#jobPositionDd').text());
            }

            isEmployee = (event === 'hired') || (event === 'updated');

            $('.groupsAndUser tr').each(function () {
                if ($(this).data('type') === 'targetUsers') {
                    usersId.push($(this).attr('data-id'));
                }
                if ($(this).data('type') === 'targetGroups') {
                    groupsId.push($(this).attr('data-id'));
                }

            });

            data = {
                name: {
                    first: $.trim($thisEl.find('#first').val()),
                    last : $.trim($thisEl.find('#last').val())
                },

                gender     : gender,
                jobType    : jobType,
                marital    : marital,
                workAddress: {
                    street : $.trim($thisEl.find('#street').val()),
                    city   : $.trim($thisEl.find('#city').val()),
                    state  : $.trim($thisEl.find('#state').val()),
                    zip    : $.trim($thisEl.find('#zip').val()),
                    country: $.trim($thisEl.find('#country').val())
                },

                social: {
                    LI: $.trim($thisEl.find('#LI').val()),
                    FB: $.trim($thisEl.find('#FB').val())
                },

                tags         : $.trim($thisEl.find('#tags').val()).split(','),
                workEmail    : $.trim($thisEl.find('#workEmail').val()),
                personalEmail: $.trim($thisEl.find('#personalEmail').val()),
                skype        : $.trim($thisEl.find('#skype').val()),
                workPhones   : {
                    phone : $.trim($thisEl.find('#phone').val()),
                    mobile: $.trim($thisEl.find('#mobile').val())
                },

                officeLocation : $.trim($thisEl.find('#officeLocation').val()),
                bankAccountNo  : $.trim($('#bankAccountNo').val()),
                relatedUser    : relatedUser,
                department     : department,
                jobPosition    : jobPosition,
                manager        : manager,
                coach          : coach,
                weeklyScheduler: weeklyScheduler,
                identNo        : $.trim($('#identNo').val()),
                passportNo     : $.trim($thisEl.find('#passportNo').val()),
                otherId        : $.trim($thisEl.find('#otherId').val()),
                homeAddress    : homeAddress,
                dateBirth      : dateBirthSt,
                source         : sourceId,
                imageSrc       : this.imageSrc,
                nationality    : nationality,
                isEmployee     : isEmployee,
                lastFire       : lastFire,
                groups         : {
                    owner: $('#allUsersSelect').attr('data-id'),
                    users: usersId,
                    group: groupsId
                },

                whoCanRW      : whoCanRW,
                hire          : hireArray,
                fire          : fireArray,
                nextAction    : nextAction,
                transfer      : transferArray,
                expectedSalary: expectedSalary,
                proposedSalary: proposedSalary
            };

            $el = this.$el;
            workflowId = $el.find('#workflowsDd').attr('data-id');
            workflow = workflowId || null;
            currentWorkflow = this.currentModel.get('workflow');

            if (currentWorkflow && currentWorkflow._id && (currentWorkflow._id !== workflow)) {
                data.workflow = workflow;
                data.sequence = -1;
                data.sequenceStart = this.currentModel.toJSON().sequence;
                data.workflowStart = currentWorkflow._id;
            }

            if (!currentWorkflow && workflow) {
                data.workflow = workflow;
                data.sequence = -1;
            }

            this.currentModel.save(data, {
                headers: {
                    mid: 39
                },
                patch  : true,
                success: function (model, result) {
                    var trHolder;
                    var kanbanHolder;
                    var counter;

                    model = model.toJSON();
                    result = result.result;

                    switch (viewType) {
                        case 'list':
                            trHolder = $('tr[data-id="' + model._id + '""] td');
                            trHolder.eq(2).text(data.name.first + ' ' + data.name.last);
                            trHolder.eq(3).text(data.personalEmail);
                            trHolder.eq(4).find('a').text(data.workPhones.phone).attr('href', 'skype:' + data.workPhones.phone + '?call');
                            trHolder.eq(5).text(self.$el.find('#jobPositionDd').text());
                            trHolder.eq(6).find('a').text(self.$el.find('#workflowsDd').text());
                            trHolder.eq(7).text(data.jobType);
                            if (data.workflow) {
                                Backbone.history.fragment = '';
                                Backbone.history.navigate(window.location.hash.replace('#', ''), {trigger: true});
                            }
                            break;
                        case 'kanban':
                            kanbanHolder = $('#' + model._id);
                            kanbanHolder.find('.application-header .left').html(data.name.first + '<br/>' + data.name.last);
                            if (parseInt(data.proposedSalary, 10)) {
                                kanbanHolder.find('.application-header .right').text(data.proposedSalary + '$');
                            }
                            kanbanHolder.find('.application-content p.center').text(position);
                            kanbanHolder.find('.application-content p.right').text(nextAction);
                            if (new Date() > new Date(nextAction)) {
                                kanbanHolder.find('.application-content p.right').addClass('red');
                            } else {
                                kanbanHolder.find('.application-content p.right').removeClass('red');
                            }

                            if (result && result.sequence) {
                                $('#' + data.workflowStart).find('.item').each(function () {
                                    var seq = $(this).find('.inner').data('sequence');
                                    if (seq > data.sequenceStart) {
                                        $(this).find('.inner').attr('data-sequence', seq - 1);
                                    }
                                });
                                kanbanHolder.find('.inner').attr('data-sequence', result.sequence);
                            }
                            if (data.workflow) {
                                $('.column[data-id="' + data.workflow + '"]').find('.columnNameDiv').after(kanbanHolder);
                                counter = $('.column[data-id="' + data.workflow + '"]').closest('.column').find('.totalCount');
                                counter.html(parseInt(counter.html(), 10) + 1);
                                counter = $('.column[data-id="' + data.workflowStart + '"]').closest('.column').find('.totalCount');
                                counter.html(parseInt(counter.html(), 10) - 1);

                            }
                            $('.column[data-id="' + data.workflow + '"]').find('.columnNameDiv').after(kanbanHolder);
                            break;
                    }
                    self.hideDialog();

                    if (event === 'hired') {
                        Backbone.history.navigate('easyErp/Employees', {trigger: true});
                    }
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });

        },

       /* deleteItem: function (event) {
            var mid = 39;
            var self = this;
            var answer = confirm('Really DELETE items ?!');

            event.preventDefault();

            if (answer == true) {
                this.currentModel.destroy({
                    headers: {
                        mid: mid
                    },
                    success: function (model) {
                        var viewType = custom.getCurrentVT();
                        var wId;
                        var total$;
                        var newTotal;

                        model = model.toJSON();

                        switch (viewType) {
                            case 'list':
                                $('tr[data-id="' + model._id + '"] td').remove();
                                break;
                            case 'kanban':
                                $('#' + model._id).remove();
                                wId = model.workflow._id;
                                total$ = $('td[data-id="' + wId + '"] .totalCount');
                                newTotal = total$.html() - 1;
                                total$.html(newTotal);
                                break;
                        }
                        self.hideDialog();
                    },

                    error: function (model, xhr) {
                        self.errorNotification(xhr);
                    }
                });
            }
        },*/

       /* hideNewSelect: function () {
            var editingDates = this.$el.find('td.date');

            editingDates.each(function () {
                $(this).text($(this).find('input').val());
            });

            this.$el.find('.newSelectList').hide();

            if (this.SelectView) {
                this.SelectView.remove();
            }
        },*/

       /* showNewSelect: function (e) {
            var $target = $(e.target);
            e.stopPropagation();

            if ($target.attr('id') === 'selectInput') {
                return false;
            }

            if (this.SelectView) {
                this.SelectView.remove();
            }

            this.SelectView = new SelectView({
                e          : e,
                responseObj: this.responseObj
            });

            $target.append(this.SelectView.render().el);

            return false;
        },*/

        chooseOption: function (e) {
            var $target = $(e.target);
            var $parentUl = $target.parent();
            var $element = $target.closest('a') || $parentUl.closest('a');
            var id = $element.attr('id') || $parentUl.attr('id');
            var valueId = $target.attr('id');
            var managersIds = this.responseObj['#departmentManagers'];
            var managers = this.responseObj['#projectManagerDD'];
            var managerId;
            var manager;

            if (id === 'jobPositionDd' || 'departmentsDd' || 'projectManagerDD' || 'jobTypeDd' || 'hireFireDd') {
                $element.text($target.text());
                $element.attr('data-id', valueId);

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
                        $element = $element.closest('tr').find('a#projectManagerDD').length ?
                            $element.closest('tr').find('a#projectManagerDD') :
                            $element.parent().parent().find('a#projectManagerDD');

                        $element.text(manager);
                        $element.attr('data-id', managerId);
                    }
                }
            } else {
                $target.parents('dd').find('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));
            }
        },

        render: function () {
            var self = this;
            var notDiv;
            var formString = this.template({
                model: this.currentModel.toJSON()
            });
            var $thisEl;

            this.$el = $(formString).dialog({
                closeOnEscape: false,
                dialogClass  : 'edit-dialog',
                width        : 1000,
                title        : 'Edit Application',
                buttons      : {
                    save: {
                        text : 'Save',
                        class: 'btn',
                        click: self.saveItem
                    },

                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        click: self.hideDialog
                    },
                    delete: {
                        text : 'Delete',
                        class: 'btn',
                        click: self.deleteItem
                    }
                }
            });
            $thisEl = this.$el;

            notDiv = $thisEl.find('.attach-container');
            notDiv.append(
                new AttachView({
                    model: this.currentModel,
                    contentType: self.contentType
                }).render().el
            );

            this.renderAssignees(this.currentModel);

            populate.get('#departmentsDd', CONSTANTS.URLS.DEPARTMENTS_FORDD, {}, 'name', this);
            populate.get('#weeklySchedulerDd', '/weeklyScheduler/forDd', {}, 'name', this, true);
            populate.get('#departmentManagers', CONSTANTS.URLS.DEPARTMENTS_FORDD, {}, 'departmentManager', this);
            populate.get('#jobPositionDd', CONSTANTS.URLS.JOBPOSITIONS_JOBTYPE, {}, 'name', this);
            populate.get('#jobTypeDd', CONSTANTS.URLS.JOBPOSITIONS_JOBTYPE, {}, '_id', this);
            populate.get('#nationality', CONSTANTS.URLS.EMPLOYEES_NATIONALITY, {}, '_id', this);
            populate.get2name('#projectManagerDD', CONSTANTS.URLS.EMPLOYEES_PERSONSFORDD, {}, this);
            populate.get('#relatedUsersDd', CONSTANTS.URLS.USERS_FOR_DD, {}, 'login', this, false, true);

            common.canvasDraw({model: this.currentModel.toJSON()}, this);

            $thisEl.find('#nextAction').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                minDate    : this.currentModel.toJSON().creationDate
            });

            $thisEl.find('#dateBirth').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                yearRange  : '-100y:c+nn',
                maxDate    : '-18y',
                minDate    : null
            });

            $thisEl.find('.date').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true
            });

            // this.removeIcon = this.$el.find('.fa-trash');
            this.hireDate = this.currentModel.get('hire')[0];
            this.fireDate = $thisEl.find('[data-content="fire"]').last().find('.fireDate').text();

            this.renderRemoveBtn();

           /* if (model.groups) {
                if (model.groups.users.length > 0 || model.groups.group.length) {
                    $('.groupsAndUser').show();
                    model.groups.group.forEach(function (item) {
                        $('.groupsAndUser').append('<tr data-type="targetGroups" data-id="' + item._id + '"><td>' + item.name + '</td><td class="text-right"></td></tr>');
                        $('#targetGroups').append('<li id="' + item._id + '">' + item.name + '</li>');
                    });
                    model.groups.users.forEach(function (item) {
                        $('.groupsAndUser').append('<tr data-type="targetUsers" data-id="' + item._id + '"><td>' + item.login + '</td><td class="text-right"></td></tr>');
                        $('#targetUsers').append('<li id="' + item._id + '">' + item.login + '</li>');
                    });

                }
            }*/
            return this;
        }
    });
    return EditView;
});
