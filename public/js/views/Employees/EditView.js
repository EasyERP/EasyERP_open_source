define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Employees/EditTemplate.html',
    'views/Notes/AttachView',
    'views/dialogViewBase',
    /* 'collections/Employees/EmployeesCollection',
     'collections/JobPositions/JobPositionsCollection',
     'collections/Departments/DepartmentsCollection',
     'collections/Customers/AccountsDdCollection',
     'collections/Users/UsersCollection',*/
    'common',
    'populate',
    'moment',
    'helpers/keyCodeHelper',
    'constants',
    'helpers'
], function (Backbone,
             $,
             _,
             EditTemplate,
             AttachView,
             ParentView,
             /* EmployeesCollection,
              JobPositionsCollection,
              DepartmentsCollection,
              AccountsDdCollection,
              UsersCollection,*/
             common,
             populate,
             moment,
             keyCodes,
             constants,
             helpers) {
    'use strict';
    var EditView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'Employees',
        imageSrc   : '',
        template   : _.template(EditTemplate),
        responseObj: {},

        initialize: function (options) {
            var isSalary;

            _.bindAll(this, 'saveItem');
            _.bindAll(this, 'render', 'deleteItem');

            if (options.collection) {
                this.employeesCollection = options.collection;
                this.currentModel = this.employeesCollection.getElement();
            } else {
                this.currentModel = options.model;
            }
            this.currentModel.urlRoot = '/employees';

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
            /* 'click #tabList a'                                               : 'switchTab',*/
            'mouseenter .avatar'                                             : 'showEdit',
            'mouseleave .avatar'                                             : 'hideEdit',
            'click .endContractReasonList, .withEndContract .arrow'          : 'showEndContractSelect',
            'click .withEndContract .newSelectList li'                       : 'endContract',
           /* 'click .current-selected'                                        : 'showNewSelect',*/
            'click .newSelectList li:not(.miniStylePagination, #selectInput)': 'chooseOption',
            /* click                                                            : 'hideNewSelect',*/
            'click td.editable'                                              : 'editJob',
            'click #update'                                                  : 'addNewRow',
            'keyup .editing'                                                 : 'validateNumbers',
            'click .fa-trash'                                                : 'deleteRow',
            'click #jobPosition,#department,#manager,#jobType'               : 'showNotification'
        },

        showNotification: function (e) {
            var msg;

            e.preventDefault();

            msg = 'You can edit ';
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

            // this.$el.find('#update').show(); // commented by Pasha
            this.$el.find('.withEndContract').show();

            this.renderRemoveBtn();
        },

        validateNumbers: function (e) {
            var $target = $(e.target);
            var code = e.keyCode;
            var inputValue = $target.val();

            if (!keyCodes.isDigitOrDecimalDot(code) && !keyCodes.isBspaceAndDelete(code)) {
                $target.val(parseFloat(inputValue) || '');
                return false;
            }
        },

        addNewRow: function (e, contractEndReason) {
            var $thisEl = this.$el;
            var table = $thisEl.find('#hireFireTable');
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

            //  this.$el.find('#update').hide(); // commented by Pasha:  possibility to put few jobPositions
            $thisEl.find('.withEndContract').hide();

            this.renderRemoveBtn();
        },

        renderRemoveBtn: function () {
            var table = this.$el.find('#hireFireTable');
            var trs = table.find('tr');
            var removeBtn = constants.TRASH_BIN;

            trs.find('td:first-child').text('');
            trs.last().find('td').first().html(removeBtn);
        },

        editJob: function (e) {
            var self = this;
            var $target = $(e.target);
            var dataId = $target.attr('data-id');
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
                        var target = $(this);
                        target.parent().text(target.val()).removeClass('changeContent');
                        target.remove();
                    });
                }
            }).addClass('datepicker');

            return false;
        },

       /* showNewSelect: function (e) {
            var $target = $(e.target);
            e.stopPropagation();

            if ($target.attr('id') === 'selectInput') {
                return false;
            }

            if (this.selectView) {
                this.selectView.remove();
            }

            this.selectView = new SelectView({
                e          : e,
                responseObj: this.responseObj
            });

            $target.append(this.selectView.render().el);

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
                        $element = $element.closest('tr').find('a#projectManagerDD');

                        $element.text(manager);
                        $element.attr('data-id', managerId);
                    }
                }

            } else {
                $target.parents('dd').find('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));
            }
        },

        /* hideNewSelect: function () {
         var self = this;
         var editingDates = this.$el.find('td.date');

         editingDates.each(function () {
         var target = $(this);
         target.text(target.find('input').val());
         });

         this.$el.find('.newSelectList').hide();

         if (this.selectView) {
         this.selectView.remove();
         }
         },*/

        showEndContractSelect: function (e) {
            e.preventDefault();
            $(e.target).parent().find('.newSelectList').toggle();

            return false;
        },

        activeTab: function () {
            var $tabs;
            var $activeTab;
            var $dialogHolder;
            var tabId;

            tabId = 'job';
            $tabs = this.$el.find('.dialog-tabs');
            $activeTab = $tabs.find('.active');

            $activeTab.removeClass('active');
            $tabs.find('#' + tabId + 'Tab').addClass('active');

            $dialogHolder = this.$el.find('.dialog-tabs-items');
            $dialogHolder.find('.dialog-tabs-item.active').removeClass('active');
            $dialogHolder.find('#' + tabId).closest('.dialog-tabs-item').addClass('active');
        },

        endContract: function (e) {
            var contractEndReason = $(e.target).text();

            this.activeTab();

            this.addNewRow(null, contractEndReason);
        },

        showEdit: function () {
            this.$el.find('.upload').animate({
                height : '20px',
                display: 'block'
            }, 250);

        },

        hideEdit: function () {
            this.$el.find('.upload').animate({
                height : '0px',
                display: 'block'
            }, 250);
        },

        saveItem: function () {
            var weeklyScheduler;
            var transferArray;
            var homeAddress;
            var dateBirthSt;
            var self = this;
            var previousDep;
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
            var $jobTrs;
            var salary;
            var gender;
            var coach;
            var event;
            var quit;
            var data;
            var date;
            var info;
            var $thisEl = this.$el;

           // self.hideNewSelect();

            relatedUser = $thisEl.find('#relatedUsersDd').attr('data-id') || null;
            coach = $.trim($thisEl.find('#coachDd').attr('data-id')) || null;
            whoCanRW = $thisEl.find("[name='whoCanRW']:checked").val();
            dateBirthSt = $.trim(self.$el.find('#dateBirth').val());
            $jobTable = $thisEl.find('#hireFireTable');
            marital = $thisEl.find('#maritalDd').attr('data-id') || null;
            nationality = $thisEl.find('#nationality').attr('data-id');
            gender = $thisEl.find('#genderDd').attr('data-id') || null;
            $jobTrs = $jobTable.find('tr.transfer');
            sourceId = $thisEl.find('#sourceDd').attr('data-id');
            homeAddress = {};
            transferArray = [];
            fireArray = [];
            hireArray = [];
            groupsId = [];
            usersId = [];

            $thisEl.find('dd').find('.homeAddress').each(function (index, addressLine) {
                var $el = $thisEl.find(addressLine);
                homeAddress[$el.attr('name')] = $.trim($el.val());
            });

            $.each($jobTrs, function (index, $tr) {
                var $previousTr;

                $tr = $thisEl.find($tr);
                salary = self.isSalary ? parseInt($tr.find('[data-id="salary"] input').val() || $tr.find('[data-id="salary"]').text(), 10) : null;
                manager = $tr.find('#projectManagerDD').attr('data-id') || null;
                date = $.trim($tr.find('td').eq(2).text());
                date = date ? new Date(date) : new Date();
                jobPosition = $tr.find('#jobPositionDd').attr('data-id');
                department = $tr.find('#departmentsDd').attr('data-id');
                weeklyScheduler = $tr.find('#weeklySchedulerDd').attr('data-id');
                jobType = $.trim($tr.find('#jobTypeDd').text());
                info = $tr.find('#statusInfoDd').val();
                event = $tr.attr('data-content');

                if (!previousDep) {
                    previousDep = department;
                }

                if (previousDep !== department) {
                    $previousTr = self.$el.find($jobTrs[index - 1]);

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

                if (!salary && self.isSalary) {
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

            transferArray = transferArray.sort(function (a, b) {
                return a.date - b.date;
            });

            if (quit) {
                return;
            }

            isEmployee = (event === 'hired') || (event === 'updated');

            $thisEl.find('.groupsAndUser tr').each(function (index, element) {
                dataType = self.$el.find(element).attr('data-type');

                if (dataType === 'targetUsers') {
                    usersId.push(self.$el.find(element).attr('data-id'));
                }

                if (dataType === 'targetGroups') {
                    groupsId.push(self.$el.find(element).attr('data-id'));
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
                bankAccountNo  : $.trim($thisEl.find('#bankAccountNo').val()),
                relatedUser    : relatedUser,
                department     : department,
                jobPosition    : jobPosition,
                weeklyScheduler: weeklyScheduler,
                manager        : manager,
                coach          : coach,
                identNo        : $.trim($thisEl.find('#identNo').val()),
                passportNo     : $.trim($thisEl.find('#passportNo').val()),
                otherId        : $.trim($thisEl.find('#otherId').val()),
                homeAddress    : homeAddress,
                dateBirth      : dateBirthSt,
                source         : sourceId,
                imageSrc       : self.imageSrc,
                nationality    : nationality,
                isEmployee     : isEmployee,
                lastFire       : lastFire,
                groups         : {
                    owner: self.$el.find('#allUsersSelect').attr('data-id'),
                    users: usersId,
                    group: groupsId
                },

                whoCanRW: whoCanRW,
                hire    : hireArray,
                fire    : fireArray,
                transfer: transferArray
            };

            if (!isEmployee) {
                data.workflow = constants.END_CONTRACT_WORKFLOW_ID;
            }

            this.currentModel.set(data);
            this.currentModel.save(this.currentModel.changed, {
                headers: {
                    mid: 39
                },
                wait   : true,
                patch  : true,
                success: function (model) {
                    if (!isEmployee) {
                        return Backbone.history.navigate('easyErp/Applications/kanban', {trigger: true});
                    }

                    if (model.get('relatedUser') === App.currentUser._id) {
                        App.currentUser.imageSrc = self.imageSrc;

                        $('#loginPanel .iconEmployee').attr('src', self.imageSrc);
                        $('#loginPanel #userName').text(model.toJSON().fullName);
                    }

                    if (self.firstData === data.name.first &&
                        self.lastData === data.name.last &&
                        self.departmentData === department &&
                        self.jobPositionData === jobPosition &&
                        self.projectManagerData === manager) {

                        model = model.toJSON();
                        empThumb = $('#' + model._id);

                        empThumb.find('.age').html(model.age);
                        empThumb.find('.empDateBirth').html('(' + model.dateBirth + ')');
                        empThumb.find('.telephone a').html(model.workPhones.mobile);
                        empThumb.find('.telephone a').attr('href', 'skype:' + model.workPhones.mobile + '?call');

                        if (model.relatedUser) {
                            empThumb.find('.relUser').html(model.relatedUser.login);
                        }

                    } else {
                        Backbone.history.fragment = '';
                        Backbone.history.navigate(window.location.hash, {trigger: true, replace: true});
                    }
                    self.hideDialog();
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }

            });

        },

        render: function () {
            var $lastElement;
            var $firstElement;
            var $jobPosElement;
            var $departmentElement;
            var $projectManagerElement;
            var formString = this.template({
                model           : this.currentModel.toJSON(),
                currencySplitter: helpers.currencySplitter
            });
            var self = this;
            var model = this.currentModel.toJSON();
            var notDiv;
            var $thisEl;

            if (this.currentModel.get('dateBirth')) {
                this.currentModel.set({
                    dateBirth: this.currentModel.get('dateBirth').split('T')[0].replace(/-/g, '/')
                }, {
                    silent: true
                });
            }

            this.$el = $(formString).dialog({
                closeOnEscape: false,
                dialogClass  : 'edit-dialog',
                width        : 1000,
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
                    url  : '/employees/uploadEmployeesFiles'
                }).render().el
            );
           /* notDiv = this.$el.find('.assignees-container');
            notDiv.append(
                new AssigneesView({
                    model: this.currentModel
                }).render().el
            );*/
            this.renderAssignees(this.currentModel);
            common.getWorkflowContractEnd('Applications', null, null, constants.URLS.WORKFLOWS, null, 'Contract End', function (workflow) {
                self.$el.find('.endContractReasonList').attr('data-id', workflow[0]._id);
            });
            populate.get('#departmentManagers', constants.URLS.DEPARTMENTS_FORDD, {}, 'departmentManager', this);
            populate.get('#weeklySchedulerDd', '/weeklyScheduler/forDd', {}, 'name', this);
            populate.get('#jobTypeDd', constants.URLS.JOBPOSITIONS_JOBTYPE, {}, 'name', this);
            populate.get('#nationality', constants.URLS.EMPLOYEES_NATIONALITY, {}, '_id', this);
            populate.get2name('#projectManagerDD', constants.URLS.EMPLOYEES_PERSONSFORDD, {}, this);
            populate.get('#jobPositionDd', constants.URLS.JOBPOSITIONS_FORDD, {}, 'name', this, false, false);
            populate.get('#relatedUsersDd', constants.URLS.USERS_FOR_DD, {}, 'login', this, false, true);
            populate.get('#departmentsDd', constants.URLS.DEPARTMENTS_FORDD, {}, 'name', this);
            common.canvasDraw({model: this.currentModel.toJSON()}, this);

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

           // this.removeIcon = $thisEl.find('.fa-trash');
            this.hiredDate = this.currentModel.get('hire')[0];

/*
            if (model.groups) {
                if (model.groups.users.length > 0 || model.groups.group.length) {
                    this.$el.find('.groupsAndUser').show();
                    model.groups.group.forEach(function (item) {
                        $thisEl.find('.groupsAndUser').append('<tr data-type="targetGroups" data-id="' + item._id + '"><td>' + item.name + '</td><td class="text-right"></td></tr>');
                        $thisEl.find('#targetGroups').append('<li id="' + item._id + '">' + item.name + '</li>');
                    });
                    model.groups.users.forEach(function (item) {
                        $thisEl.find('.groupsAndUser').append('<tr data-type="targetUsers" data-id="' + item._id + '"><td>' + item.login + '</td><td class="text-right"></td></tr>');
                        $thisEl.find('#targetUsers').append('<li id="' + item._id + '">' + item.login + '</li>');
                    });

                }
            }*/
            this.delegateEvents(this.events);

            $lastElement = $thisEl.find('#last');
            $firstElement = $thisEl.find('#first');
            $jobPosElement = $thisEl.find('#jobPosition');
            $departmentElement = $thisEl.find('#department');
            $projectManagerElement = $thisEl.find('#manager');

            this.lastData = $.trim($lastElement.val());
            this.firstData = $.trim($firstElement.val());
            this.jobPositionData = $.trim($jobPosElement.attr('data-id'));
            this.departmentData = $.trim($departmentElement.attr('data-id'));
            this.projectManagerData = $.trim($projectManagerElement.attr('data-id'));

            return this;
        }

    });

    return EditView;
});
