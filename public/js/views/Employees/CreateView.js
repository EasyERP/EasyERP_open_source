define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Employees/CreateTemplate.html',
    'models/EmployeesModel',
    'models/TransferModel',
    'common',
    'populate',
    'views/Editor/NoteView',
    'views/Editor/AttachView',
    'views/Assignees/AssigneesView',
    'views/dialogViewBase',
    'services/employees',
    'constants',
    'moment',
    'helpers',
    'dataService'
], function (Backbone,
             $,
             _,
             CreateTemplate,
             EmployeeModel,
             TransferModel,
             common,
             populate,
             NoteView,
             AttachView,
             AssigneesView,
             ParentView,
             employees,
             CONSTANTS,
             moment,
             helpers,
             dataService) {
    'use strict';

    var CreateView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'Employees',
        template   : _.template(CreateTemplate),
        imageSrc   : '',
        responseObj: {},

        initialize: function () {
            this.mId = CONSTANTS.MID[this.contentType];
            _.bindAll(this, 'saveItem');
            this.model = new EmployeeModel();

            this.responseObj['#employmentTypeDd'] = [
                {
                    _id : 'Employees',
                    name: 'Employees'
                }, {
                    _id : 'FOP',
                    name: 'FOP'
                }, {
                    _id : 'Un Employees',
                    name: 'Un Employees'
                }
            ];

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
            'mouseenter .avatar': 'showEdit',
            'mouseleave .avatar': 'hideEdit',
            'click td.editable' : 'editJob',
            'keyup #workEmail'  : employees.onEmailEdit,
            'change #workEmail' : employees.onEmailEdit,
            'paste #workEmail'  : employees.onEmailEdit,
            'cut #workEmail'    : employees.onEmailEdit
        },

        clickInput: function () {
            this.$el.find('.input-file .inputAttach').click();
        },

        editJob: function (e) {
            var self = this;
            var $thisEl = this.$el;
            var $target = $(e.target);
            var dataId = $target.attr('data-id');
            var tempContainer;

            tempContainer = ($target.text()).trim();

            if (dataId === 'salary') {
                $target.html('<input class="editing statusInfo" type="text" value="' + tempContainer + '">');
                return false;
            }

            $target.html('<input class="editing statusInfo" type="text" value="' + tempContainer + '" ' + 'readonly' + '>');

            $target.find('.editing').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                minDate    : self.hiredDate,
                onSelect   : function () {
                    var editingDates = $thisEl.find('.editing');

                    editingDates.each(function () {
                        var target = $(this);
                        target.parent().text(target.val()).removeClass('changeContent');
                        target.remove();
                    });
                }
            }).addClass('datepicker');

            return false;
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            var $td = $target.closest('td');
            var parentUl = $target.parent();
            var $element = $target.closest('a') || parentUl.closest('a');
            var id = $element.attr('id') || parentUl.attr('id');
            var valueId = $target.attr('id');
            var managersIds = this.responseObj['#departmentManagers'];
            var managers = this.responseObj['#projectManagerDD'];
            var managerId;
            var manager;
            var $departmentsDd = $('#departmentsDd');
            var jobPositions = this.responseObj['#jobPositionDd'];
            var jobPosition;
            var departments = this.responseObj['#departmentsDd'];
            var department;

            $td.removeClass('errorContent');

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

                        $element.closest('td').removeClass('errorContent');
                    }
                }

                if (id === 'jobPositionDd') {

                    jobPosition = _.find(jobPositions, function (el) {
                        return el._id === valueId;
                    });

                    department = _.find(departments, function (el) {
                        return el._id === jobPosition.department;
                    });

                    $departmentsDd.text(department.name);
                    $departmentsDd.attr('data-id', department._id);

                    $departmentsDd.closest('td').removeClass('errorContent');
                }

            } else {
                $target.parents('ul').closest('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));
            }
        },

        addAttach: function () {
            var $thisEl = this.$el;
            var s = $thisEl.find('.inputAttach:last').val().split('\\')[$thisEl.find('.inputAttach:last').val().split('\\').length - 1];

            $thisEl.find('.attachContainer').append('<li class="attachFile">' +
                '<a href="javascript:;">' + s + '</a>' +
                '<a href="javascript:;" class="deleteAttach">Delete</a></li>'
            );
            $thisEl.find('.attachContainer .attachFile:last').append($thisEl.find('.input-file .inputAttach').attr('hidden', 'hidden'));
            $thisEl.find('.input-file').append('<input type="file" value="Choose File" class="inputAttach" name="attachfile">');
        },

        deleteAttach: function (e) {
            $(e.target).closest('.attachFile').remove();
        },

        fileSizeIsAcceptable: function (file) {
            if (!file) {
                return false;
            }
            return file.size < App.File.MAXSIZE;
        },

        saveItem: function () {
            var self = this;
            var $thisEl = this.$el;
            var notes = [];
            var internalNotes = $.trim(this.$el.find('#internalNotes').val());
            var weeklyScheduler;
            var transfer;
            var employeeModel;
            var transferModel;
            var homeAddress;
            var dateBirthSt;
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
            var dataType;
            var userName;
            var manager;
            var marital;
            var employmentType;
            var jobType;
            var usersId;
            var salary;
            var gender;
            var coach;
            var event;
            var data;
            var dateText;
            var date;
            var info;
            var $tr;
            var el;
            var payrollStructureType;
            var scheduledPay;
            var note;

            if ($thisEl.find('.errorContent').length) {
                return App.render({
                    type   : 'error',
                    message: 'Please fill Job tab'
                });
            }

            employeeModel = new EmployeeModel();

            // relatedUser = $thisEl.find('#relatedUsersDd').attr('data-id') || null;
            coach = $.trim($thisEl.find('#coachDd').attr('id')) || null;
            whoCanRW = $thisEl.find('[name="whoCanRW"]:checked').val();
            dateBirthSt = $.trim($thisEl.find('#dateBirth').val());
            $jobTable = $thisEl.find('#hireFireTable');
            marital = $thisEl.find('#maritalDd').attr('data-id') || null;
            employmentType = $thisEl.find('#employmentTypeDd').attr('data-id') || null;
            nationality = $thisEl.find('#nationality').attr('data-id');
            gender = $thisEl.find('#genderDd').attr('data-id') || null;
            $tr = $jobTable.find('tr.transfer');
            sourceId = $thisEl.find('#sourceDd').attr('data-id');
            userName = $.trim($thisEl.find('#userName').text());
            homeAddress = {};
            fireArray = [];
            hireArray = [];
            groupsId = [];
            usersId = [];

            /*if (internalNotes) {
             note = {
             title: '',
             note : internalNotes
             };
             notes.push(note);
             }*/

            notes = this.model.get('notes');

            $thisEl.find('.homeAddress').each(function (index, addressLine) {
                el = $thisEl.find(addressLine);
                homeAddress[el.attr('name')] = $.trim(el.val()) || el.attr('data-id');
            });

            salary = parseInt(helpers.spaceReplacer($tr.find('[data-id="salary"] input').val()) || helpers.spaceReplacer($tr.find('[data-id="salary"]').text()), 10) || 0;
            manager = $tr.find('#projectManagerDD').attr('data-id') || null;
            dateText = $.trim($tr.find('.date').text());
            date = dateText ? helpers.setTimeToDate(new Date(dateText)) : helpers.setTimeToDate(new Date());
            jobPosition = $tr.find('#jobPositionDd').attr('data-id');
            weeklyScheduler = $tr.find('#weeklySchedulerDd').attr('data-id');
            payrollStructureType = $tr.find('#payrollStructureTypeDd').attr('data-id') || null;
            scheduledPay = $tr.find('#scheduledPayDd').attr('data-id') || null;
            department = $tr.find('#departmentsDd').attr('data-id');
            jobType = $.trim($tr.find('#jobTypeDd').text());
            info = $tr.find('#statusInfoDd').val();
            event = $tr.attr('data-content');

            hireArray.push(date);

            isEmployee = true;

            $thisEl.find('.groupsAndUser tr').each(function (index, element) {
                dataType = $thisEl.find(element).attr('data-type');

                if (dataType === 'targetUsers') {
                    usersId.push($thisEl.find(element).attr('data-id'));
                }

                if (dataType === 'targetGroups') {
                    groupsId.push($thisEl.find(element).attr('data-id'));
                }

            });

            data = {
                name: {
                    first: $.trim($thisEl.find('#first').val()),
                    last : $.trim($thisEl.find('#last').val())
                },

                gender        : gender,
                jobType       : jobType,
                marital       : marital,
                employmentType: employmentType,
                workAddress   : {
                    street : $.trim($thisEl.find('#street').val()),
                    city   : $.trim($thisEl.find('#city').val()),
                    state  : $.trim($thisEl.find('#state').val()),
                    zip    : $.trim($thisEl.find('#zip').val()),
                    country: $.trim($thisEl.find('#country').val())
                },

                social: {
                    LI: $.trim($thisEl.find('#LI').val()).replace('linkedin', '[]'),
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

                notes          : notes,
                officeLocation : $.trim($thisEl.find('#officeLocation').val()),
                bankAccountNo  : $.trim($thisEl.find('#bankAccountNo').val()),
                // relatedUser    : relatedUser,
                department     : department,
                jobPosition    : jobPosition,
                manager        : manager,
                coach          : coach,
                weeklyScheduler: weeklyScheduler,
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
                userName       : userName,
                groups         : {
                    owner: $thisEl.find('#allUsersSelect').attr('data-id') || null,
                    users: usersId,
                    group: groupsId
                },

                whoCanRW: whoCanRW,
                hire    : hireArray,
                fire    : fireArray
            };

            employeeModel.save(data, {
                headers: {
                    mid: 39
                },

                success: function (model) {
                    if (model.get('relatedUser') === App.currentUser._id) {
                        App.currentUser.imageSrc = self.imageSrc;

                        $('#loginPanel .iconEmployee').attr('src', self.imageSrc);
                        $('#loginPanel #userName').text(model.toJSON().fullName);
                    }

                    self.attachView.sendToServer(null, model.changed);

                    // Backbone.history.fragment = '';
                    // Backbone.history.navigate(window.location.hash, {trigger: true, replace: true});
                    self.hideDialog();

                    transfer = {
                        status              : event,
                        date                : date,
                        department          : department,
                        jobPosition         : jobPosition,
                        manager             : manager,
                        jobType             : jobType,
                        salary              : salary,
                        info                : info,
                        weeklyScheduler     : weeklyScheduler,
                        employee            : model.get('id'),
                        scheduledPay        : scheduledPay,
                        payrollStructureType: payrollStructureType
                    };

                    transferModel = new TransferModel();
                    transferModel.save(transfer, {
                        error: function (model, xhr) {
                            self.errorNotification(xhr);
                        }
                    });
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }

            });

        },

        render: function () {
            var formString = this.template({
                moment: moment
            });
            var $notDiv;
            var self = this;
            var $thisEl;

            this.$el = $(formString).dialog({
                dialogClass: 'edit-dialog',
                width      : 900,
                title      : 'Create Employee',
                buttons    : {
                    save: {
                        text : 'Create',
                        class: 'btn blue',
                        id   : 'createBtnDialog',
                        click: function () {
                            self.saveItem();
                            self.gaTrackingConfirmEvents();
                        }
                    },

                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        click: function () {
                            self.hideDialog();
                        }
                    }
                }
            });

            $thisEl = this.$el;

            $notDiv = $thisEl.find('#attach-container');

            this.model = new EmployeeModel();

            this.editorView = new NoteView({
                model      : this.model,
                contentType: self.contentType,
                onlyNote   : true,
                isCreate   : true
            });

            $notDiv.append(
                this.editorView.render().el
            );

            this.attachView = new AttachView({
                model      : this.model,
                contentType: self.contentType,
                noteView   : this.editorView,
                forDoc     : true,
                isCreate   : true
            });

            $thisEl.find('.attachments').append(
                this.attachView.render().el
            );

            $notDiv = this.$el.find('.assignees-container');
            $notDiv.append(
                new AssigneesView({
                    model      : this.currentModel,
                    contentType: self.contentType
                }).render().el
            );

            populate.get('#departmentManagers', 'departments/getForDd', {}, 'departmentManager', this);
            populate.get('#jobTypeDd', CONSTANTS.URLS.JOBPOSITIONS_JOBTYPE, {}, 'name', this, false);
            populate.get('#nationality', CONSTANTS.URLS.EMPLOYEES_NATIONALITY, {}, '_id', this, true);
            populate.get2name('#projectManagerDD', CONSTANTS.URLS.EMPLOYEES_PERSONSFORDD, {}, this, false);
            populate.get('#relatedUsersDd', CONSTANTS.URLS.USERS_FOR_DD, {}, 'login', this, true, true);
            populate.get('#departmentsDd', CONSTANTS.URLS.DEPARTMENTS_FORDD, {}, 'name', this, true, true);
            populate.get('#weeklySchedulerDd', CONSTANTS.URLS.WEEKLYSCHEDULER, {}, 'name', this, true);
            populate.get('#payrollStructureTypeDd', CONSTANTS.URLS.PAYROLLSTRUCTURETYPES_FORDD, {}, 'name', this, true);
            populate.get('#scheduledPayDd', CONSTANTS.URLS.SCHEDULEDPAY_FORDD, {}, 'name', this, true);
            populate.get('#employeeCreateCountry', CONSTANTS.URLS.COUNTRIES, {}, '_id', this);

            dataService.getData(CONSTANTS.URLS.JOBPOSITIONS_FORDD, {}, function (jobPositions) {
                self.responseObj['#jobPositionDd'] = jobPositions.data;
            });

            $thisEl.find('#dateBirth').datepicker({
                changeMonth: true,
                changeYear : true,
                yearRange  : '-100y:c+nn',
                maxDate    : '-18y',
                minDate    : null
            });

            $thisEl.find('#hire').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true
            });

            common.canvasDraw({
                model: this.model.toJSON()
            }, this);

            this.delegateEvents(this.events);

            return this;
        }

    });

    return CreateView;
});
