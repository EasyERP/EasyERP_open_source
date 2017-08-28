define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Applications/EditTemplate.html',
    'views/selectView/selectView',
  'views/Editor/NoteView',
  'views/Editor/AttachView',
  'views/dialogViewBase',
    'models/TransferModel',
    'collections/transfer/editCollection',
    'services/employees',
    'common',
    'populate',
    'custom',
    'moment',
    'constants',
    'dataService',
    'helpers',
    'helpers/keyCodeHelper'
], function (Backbone,
             $,
             _,
             EditTemplate,
             SelectView,
             NoteView,
             AttachView,
             ParentView,
             TransferModel,
             EditCollection,
             employees,
             common,
             populate,
             custom,
             moment,
             CONSTANTS,
             dataService,
             helpers,
             keyCodes) {
    'use strict';
    var EditView = ParentView.extend({
        el            : '#content-holder',
        contentType   : 'Applications',
        editCollection: null,
        imageSrc      : '',
        template      : _.template(EditTemplate),
        removeTransfer: [],

        initialize: function (options) {
            var isSalary;
            var transfers;

            _.bindAll(this, 'saveItem');
            _.bindAll(this, 'render', 'deleteItem');

            this.employeesCollection = options.collection;
            this.currentModel = options.model || options.collection.getElement();
            this.currentModel.urlRoot = '/Applications';

            this.responseObj = {};
            this.refuseId = 0;

            transfers = this.currentModel.get('transfer');

            isSalary = transfers[0];
            isSalary = isSalary && isSalary.salary;
            isSalary = !!(isSalary || isSalary === 0);
            this.isSalary = isSalary;

            this.editCollection = new EditCollection(transfers);

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

            this.removeTransfer = [];
            this.changedModels = {};

            this.hireEmployee = false;

            this.render();
        },

        events: {
            'click .breadcrumb a, #refuse': 'changeWorkflow',
            'change #workflowNames'       : 'changeWorkflows',
            'mouseenter .avatar'          : 'showEdit',
            'mouseleave .avatar'          : 'hideEdit',
            'click .current-selected'     : 'showNewSelect',
            'click .hireEmployee'         : 'isEmployee',
            'click .refuseEmployee'       : 'refuseEmployee',
            'keydown input.editing'       : 'keyDown',
            'change .editable '           : 'setEditable',
            'keydown .salary'             : 'validateNumbers'
        },

        keyDown: function (e) {
            if (e.which === 13) {
                this.setChangedValueToModel();
            }
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
            var transferId = tr.attr('id');

            tr.remove();

            this.$el.find('#update').show();

            this.renderRemoveBtn();

            this.editCollection.remove(this.editCollection.get(transferId));
            delete this.changedModels[transferId];

            if (transferId && transferId.length >= 24) {
                this.removeTransfer.push(transferId);
            }
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

        setTransfer: function () {
            var $thisEl = this.$el;
            var table;
            var lastTr;
            var newTr;
            var trId;
            var now;
            var $tr;
            var salary;
            var manager;
            var dateText;
            var date;
            var jobPosition;
            var weeklyScheduler;
            var department;
            var jobType;
            var info;
            var event;
            var employeeId;
            var transfer;
            var model;
            var payrollStructureType;
            var scheduledPay;

            if (this.currentModel.get('transfer').length) {

                table = $thisEl.find('#hireFireTable');
                lastTr = table.find('tr').last();
                newTr = lastTr.clone();
                trId = newTr.attr('data-id');
                now = moment();

                now = common.utcDateToLocaleDate(now);

                newTr.attr('data-id', ++trId);
                newTr.find('td').eq(2).text(now);
                newTr.attr('data-content', 'hired');
                newTr.find('td').eq(1).text('hired');
                newTr.find('td').last().text('');

                table.append(newTr);

                $tr = newTr;
                salary = parseInt(helpers.spaceReplacer($tr.find('[data-id="salary"] input').val() || $tr.find('[data-id="salary"]').text()), 10) || 0;
                manager = $tr.find('[data-content="manager"]').attr('data-id') || null;
                date = helpers.setTimeToDate(new Date());
                jobPosition = $tr.find('[data-content="jobPosition"]').attr('data-id');
                weeklyScheduler = $tr.find('[data-content="weeklyScheduler"]').attr('data-id');
                payrollStructureType = $tr.find('[data-content="payrollStructureType"]').attr('data-id') || null;
                scheduledPay = $tr.find('[data-content="scheduledPay"]').attr('data-id') || null;
                department = $tr.find('[data-content="department"]').attr('data-id');
                jobType = $.trim($tr.find('[data-content="jobType"]').text()) || null;
                info = $tr.find('[data-content="status"]').val();
                event = $tr.attr('data-content');
                employeeId = this.currentModel.get('_id');

            } else {

                salary = parseInt(helpers.spaceReplacer($.trim($thisEl.find('#proposedSalary').val())), 10) || 0;
                manager = $thisEl.find('#projectManagerDD').attr('data-id') || null;
                date = helpers.setTimeToDate(new Date());
                jobPosition = $thisEl.find('#jobPositionDd').attr('data-id');
                weeklyScheduler = $thisEl.find('#weeklySchedulerDd').attr('data-id');
                payrollStructureType = $thisEl.find('#payrollStructureTypeDd').attr('data-id') || null;
                scheduledPay = $thisEl.find('#scheduledPayDd').attr('data-id') || null;
                department = $thisEl.find('#departmentDd').attr('data-id');
                jobType = $thisEl.find('#jobTypeDd').text();
                info = $thisEl.find('#statusInfoDd').val();
                event = 'hired';
                employeeId = this.currentModel.get('_id');
            }

            this.hireEmployee = true;

            transfer = {
                employee            : employeeId,
                status              : event,
                date                : date,
                department          : department,
                jobPosition         : jobPosition,
                manager             : manager,
                jobType             : jobType,
                salary              : salary,
                info                : info,
                weeklyScheduler     : weeklyScheduler,
                payrollStructureType: payrollStructureType,
                scheduledPay        : scheduledPay
            };

            model = new TransferModel(transfer);

            if (this.currentModel.get('transfer').length) {
                newTr.attr('id', model.cid);
            }

            this.changedModels[model.cid] = transfer;
            this.editCollection.add(model);
        },

        renderRemoveBtn: function () {
            var table = this.$el.find('#hireFireTable');
            var trs = table.find('tr');
            var removeBtn = CONSTANTS.TRASH_BIN;

            trs.find('td:first-child').text('');
            trs.last().find('td').first().html(removeBtn);
        },

        deleteEditable: function () {
            this.$el.find('.edited').removeClass('edited');
        },

        editJob: function (e) {
            var self = this;
            var $target = $(e.target);
            var dataContent = $target.attr('data-content');
            // var tr = $target.closest('tr');
            var tempContainer;
            var $tr = $target.parent('tr');
            var trNum = $tr.attr('data-id');
            var minDate = new Date('1995-01-01');
            var maxDate = null;
            var modelId = $tr.attr('id');
            var model = this.editCollection.get(modelId);

            tempContainer = ($target.text()).trim();

            if (dataContent === 'salary') {
                $target.html('<input class="editing statusInfo" type="text" value="' + tempContainer + '">');
                return false;
            }

            if (dataContent === 'info') {
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
                        var datacontent;
                        var changedAttr;

                        if (!self.changedModels[modelId]) {
                            if (!model.id) {
                                self.changedModels[modelId] = model.attributes;
                            } else {
                                self.changedModels[modelId] = {};
                            }
                        }

                        datacontent = target.closest('td').attr('data-content');

                        changedAttr = self.changedModels[modelId];
                        if (datacontent === 'date') {
                            changedAttr[datacontent] = helpers.setTimeToDate(new Date(target.val()));
                        } else {
                            changedAttr[datacontent] = target.val();
                        }

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
            var counter;

            e.preventDefault();

            this.currentModel.save({
                workflow: self.refuseId
            }, {
                patch  : true,
                success: function (model) {
                    var viewType = custom.getCurrentVT();
                    var url = window.location.hash;

                    model = model.toJSON();

                    switch (viewType) {
                        case 'list':
                            $('tr[data-id="' + model._id + '"] td').eq(6).find('a').text('Refused');
                            break;
                        case 'kanban':
                            $('.column[data-id="' + self.refuseId + '"]').find('.columnNameDiv').after($('#' + model._id));
                            if (self.refuseId) {
                                counter = $('.column[data-id="' + self.refuseId + '"]').closest('.column').find('.totalCount');
                                counter.html(parseInt(counter.html(), 10) + 1);
                                counter = $('.column[data-id="' + workflowStart + '"]').closest('.column').find('.totalCount');
                                counter.html(parseInt(counter.html(), 10) - 1);

                            }
                            break;
                        // skip default;
                    }

                    Backbone.history.fragment = '';
                    Backbone.history.navigate(url, {trigger: true});
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

            this.currentModel.set('isHire', true);
            this.setTransfer();
            this.saveItem(null, true);
        },

        setEditable: function (td) {
            var tr;

            if (!td.parents) {
                td = $(td.target).closest('td');
            }

            tr = td.parents('tr');

            tr.addClass('edited');

            return false;
        },

        setChangedValueToModel: function () {
            var editedElement = this.$el.find('#hireFireTable').find('.editing');
            var editedCol;
            var editedElementRowId;
            var editedElementContent;
            var editedElementValue;
            var editModel;
            var editValue;

            if (navigator.userAgent.indexOf('Firefox') > -1) {
                this.setEditable(editedElement);
            }

            if (editedElement.length) {
                editedCol = editedElement.closest('td');
                editedElementRowId = editedElement.closest('tr').attr('id');
                editedElementContent = editedCol.data('content');
                editedElementValue = editedElement.val();

                // editedElementValue = editedElementValue.replace(/\s+/g, '');

                if (editedElementRowId.length >= 24) {
                    editModel = this.editCollection.get(editedElementRowId);
                    editValue = editModel.get(editedElementContent);

                    if (editedElementValue !== editValue) {
                        if (!this.changedModels[editedElementRowId]) {
                            this.changedModels[editedElementRowId] = {};
                        }

                        if (editedElementContent === 'salary') {
                            editedElementValue = helpers.spaceReplacer(editedElementValue);
                        }

                        this.changedModels[editedElementRowId][editedElementContent] = editedElementValue;
                    }
                } else {
                    if (!this.changedModels[editedElementRowId]) {
                        this.changedModels[editedElementRowId] = {};
                    }

                    if (editedElementContent === 'salary') {
                        editedElementValue = helpers.spaceReplacer(editedElementValue);
                    }

                    this.changedModels[editedElementRowId][editedElementContent] = editedElementValue;
                }
                editedCol.text(editedElementValue);
                editedElement.remove();

                if (editedElementValue) {
                    editedCol.removeClass('errorContent');
                }
            }
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
            var $thisEl = this.$el;
            var self = this;

            var weeklyScheduler;
            var currentWorkflow;
            var employmentType;
            var proposedSalary;
            var expectedSalary;
            var transferArray;
            var relatedUser;
            var dateBirthSt;
            var retriveUserName;
            var nationality;
            var homeAddress;
            var jobPosition;
            var nextAction;
            var isEmployee;
            var department;
            var workflowId;
            var workEmail;
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
            var userName;
            var usersId;
            var marital;
            var jobType;
            var manager;
            var $jobTrs;
            var gender;
            var salary;
            var isHire;
            var coach;
            var event;
            var quit;
            var data;
            var date;
            var info;
            var flag;
            var $el;
            var $tr;
            var payrollStructureType;
            var scheduledPay;
            var lastTr;

            this.setChangedValueToModel();
            retriveUserName = employees.retriveUserName.bind(this);

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
            workEmail = $.trim($thisEl.find('#workEmail').val());
            coach = $.trim($thisEl.find('#coachDd').attr('data-id')) || null;
            whoCanRW = $thisEl.find('[name="whoCanRW"]:checked').val();
            dateBirthSt = $.trim($thisEl.find('#dateBirth').val());
            nextAction = $.trim($thisEl.find('#nextAction').val());
            $jobTable = $thisEl.find('#hireFireTable');
            marital = $thisEl.find('#maritalDd').attr('data-id') || null;
            employmentType = $thisEl.find('#employmentTypeDd').attr('data-id') || null;
            gender = $thisEl.find('#genderDd').attr('data-id') || null;
            nationality = $('#nationality').attr('data-id');
            $jobTrs = $jobTable.find('tr.transfer');
            sourceId = $thisEl.find('#sourceDd').attr('data-id');
            userName = retriveUserName(workEmail);
            isHire = !!this.currentModel.get('isHire');
            viewType = custom.getCurrentVT();
            transferArray = [];
            homeAddress = {};
            fireArray = [];
            hireArray = [];
            groupsId = [];
            usersId = [];

            $thisEl.find('dd').find('.homeAddress').each(function (index, addressLine) {
                $el = $(addressLine);
                homeAddress[$el.attr('name')] = $.trim($el.val()) || $el.attr('data-id');
            });

            $tr = $jobTrs;
            if (!this.currentModel.get('transfer').length) {
                $tr = $thisEl;
                if (this.hireEmployee) {
                    hireArray.push(helpers.setTimeToDate(new Date()));
                }
            } else {
                $.each($jobTrs, function (index, $tr) {
                    var _$tr = $tr;
                    var _date;
                    var _event;

                    _$tr = $thisEl.find(_$tr);
                    _date = $.trim(_$tr.find('td').eq(2).text());
                    _date = _date ? helpers.setTimeToDate(new Date(_date)) : helpers.setTimeToDate(new Date());
                    _event = _$tr.attr('data-content');

                    if (_event === 'fired') {
                        fireArray.push(_date);
                        _date = moment(_date);
                        lastFire = _date.year() * 100 + _date.isoWeek();
                    }

                    if (_event === 'hired') {
                        hireArray.push(_date);
                    }
                });
            }

            lastTr = $tr.last();
            manager = lastTr.find('[data-content="manager"]').attr('data-id') || lastTr.find('#projectManagerDD').attr('data-id') || null;
            jobPosition = lastTr.find('[data-content="jobPosition"]').attr('data-id') || lastTr.find('#jobPositionDd').attr('data-id') || null;
            department = lastTr.find('[data-content="department"]').attr('data-id') || lastTr.find('#departmentDd').last().attr('data-id') || null;
            weeklyScheduler = lastTr.find('[data-content="weeklyScheduler"]').attr('data-id') || lastTr.find('#weeklySchedulerDd').last().attr('data-id') || null;
            payrollStructureType = lastTr.find('[data-content="payrollStructureTypeDd"]').attr('data-id') || lastTr.find('#payrollStructureTypeDd').last().attr('data-id') || null;
            scheduledPay = lastTr.find('[data-content="scheduledPayDd"]').attr('data-id') || lastTr.find('#scheduledPayDd').last().attr('data-id') || null;
            event = lastTr.attr('data-content');
            if (this.hireEmployee) {
                event = 'hired';
                this.hireEmployee = false;
            }
            jobType = $.trim(lastTr.find('[data-content="jobType"]').text()) || $.trim(lastTr.find('#jobTypeDd').text());
            salary = self.isSalary ? parseInt(helpers.spaceReplacer(lastTr.find('[data-id="salary"] input').val() || lastTr.find('[data-id="salary"]').text()), 10) : null;
            date = $.trim(lastTr.find('td').eq(2).text());
            date = date ? helpers.setTimeToDate(new Date(date)) : helpers.setTimeToDate(new Date());

            if ((salary === null) && self.isSalary) {
                App.render({
                    type   : 'error',
                    message: 'Salary can`t be empty'
                });
                quit = true;
                return false;
            }

            if (quit) {
                return;
            }

            $el = $thisEl.find('.edit-employee-info');
            expectedSalary = parseInt(helpers.spaceReplacer($.trim($el.find('#expectedSalary').val())), 10) || 0;
            if (!this.currentModel.get('transfer').length) {
                salary = parseInt(helpers.spaceReplacer($.trim($el.find('#proposedSalary').val())), 10) || 0;
                proposedSalary = salary;
            } else {
                proposedSalary = parseInt(helpers.spaceReplacer($.trim($el.find('#proposedSalary').val())), 10) || 0;
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

                gender        : gender,
                jobType       : jobType,
                marital       : marital,
                employmentType: employmentType,
                workAddress   : {
                    street : $.trim($thisEl.find('#applicationsEditStreet').val()),
                    city   : $.trim($thisEl.find('#applicationsEditCity').val()),
                    state  : $.trim($thisEl.find('#applicationsEditState').val()),
                    zip    : $.trim($thisEl.find('#applicationsEditZip').val()),
                    country: $thisEl.find('#applicationsEditCountry').attr('data-id')
                },

                social: {
                    LI: $.trim($thisEl.find('#LI').val()),
                    FB: $.trim($thisEl.find('#FB').val())
                },

                tags         : $.trim($thisEl.find('#tags').val()).split(','),
                workEmail    : workEmail,
                personalEmail: $.trim($thisEl.find('#personalEmail').val()),
                skype        : $.trim($thisEl.find('#skype').val()),
                workPhones   : {
                    phone : $.trim($thisEl.find('#phone').val()),
                    mobile: $.trim($thisEl.find('#mobile').val())
                },

                officeLocation      : $.trim($thisEl.find('#officeLocation').val()),
                bankAccountNo       : $.trim($('#bankAccountNo').val()),
                relatedUser         : relatedUser,
                department          : department,
                jobPosition         : jobPosition,
                manager             : manager,
                coach               : coach,
                weeklyScheduler     : weeklyScheduler,
                payrollStructureType: payrollStructureType,
                scheduledPay        : scheduledPay,
                identNo             : $.trim($('#identNo').val()),
                passportNo          : $.trim($thisEl.find('#passportNo').val()),
                otherId             : $.trim($thisEl.find('#otherId').val()),
                homeAddress         : homeAddress,
                dateBirth           : dateBirthSt,
                source              : sourceId,
                imageSrc            : this.imageSrc,
                nationality         : nationality,
                isEmployee          : isEmployee,
                lastFire            : lastFire,
                groups              : {
                    owner: this.$el.find('#allUsersSelect').attr('data-id') || null,
                    users: usersId,
                    group: groupsId
                },

                whoCanRW      : whoCanRW,
                hire          : hireArray,
                fire          : fireArray,
                nextAction    : nextAction,
                expectedSalary: expectedSalary,
                proposedSalary: proposedSalary,
                userName      : userName,
                isHire        : isHire
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
                    var modelChanged;
                    var id;
                    var transferNewModel;
                    var keys;
                    var key;
                    var i;

                    for (id in self.changedModels) {

                        modelChanged = self.editCollection.get(id);
                        modelChanged.changed = self.changedModels[id];

                        if (self.changedModels[id].transfered) {
                            transferNewModel = new TransferModel(modelChanged.attributes);
                            keys = Object.keys(modelChanged.attributes);
                            for (i = keys.length - 1; i >= 0; i--) {
                                key = keys[i];
                                if (key !== '_id') {
                                    transferNewModel.changed[key] = modelChanged.attributes[key];
                                }
                            }
                            delete transferNewModel.attributes._id;
                            delete transferNewModel._id;
                            transferNewModel.changed.date = moment(modelChanged.changed.date).subtract(1, 'day');
                            transferNewModel.changed.status = 'transfer';
                            self.editCollection.add(transferNewModel);
                        }
                    }

                    self.editCollection.save();

                    if (self.removeTransfer.length) {
                        dataService.deleteData(CONSTANTS.URLS.TRANSFER, {removeTransfer: self.removeTransfer}, function (err, response) {
                            if (err) {
                                return App.render({
                                    type   : 'error',
                                    message: 'Can\'t remove items'
                                });
                            }
                        });
                    }

                    self.deleteEditable();
                    self.changedModels = {};

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
                        // skip default;
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

        chooseOption: function (e) {
            var $target = $(e.target);
            var $parentUl = $target.parent();
            var $element = $target.closest('a') || $parentUl.closest('a');
            var id = $element.attr('id') || $parentUl.attr('id');
            var valueId = $target.attr('id');
            var managersIds = this.responseObj['#departmentManagers'];
            var managers = this.responseObj['#projectManagerDD'];
            var modelId = $element.closest('tr').attr('id');
            var model = this.editCollection.get(modelId);
            var managerId;
            var manager;
            var datacontent;
            var changedAttr;

            if (id === 'jobPositionDd' || id === 'departmentDd' || id === 'projectManagerDD' || id === 'jobTypeDd' || id === 'hireFireDd') {

                this.setEditable($element);

                if (modelId && !this.changedModels[modelId]) {
                    if (!model.id) {
                        this.changedModels[modelId] = model.attributes;
                    } else {
                        this.changedModels[modelId] = {};
                    }
                }

                $element.text($target.text());
                $element.attr('data-id', valueId);
                datacontent = $element.attr('data-content');

                if (modelId && this.changedModels) {
                    changedAttr = this.changedModels[modelId];
                    changedAttr[datacontent] = valueId;
                }

                if (id === 'departmentDd') {

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
                    if (modelId && this.changedModels) {
                        changedAttr.transfered = true;
                    }
                }
            } else {
                $target.parents('ul').closest('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));
            }
        },

        render: function () {
            var self = this;
            var notDiv;
            var formString = this.template({
                model           : this.currentModel.toJSON(),
                currencySplitter: helpers.currencySplitter
            });
            var $thisEl;

            this.$el = $(formString).dialog({
                dialogClass: 'edit-dialog',
                width      : 1000,
                title      : 'Edit Application',
                buttons    : {
                    save: {
                        text : 'Save',
                        class: 'btn blue',
                        click: function () {
                            self.saveItem();
                            self.gaTrackingEditConfirm();
                        }

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

            notDiv = $thisEl.find('#attach-container');

          this.editorView = new NoteView({
            model      : this.currentModel,
            contentType: 'Employees',
            onlyNote: true
          });

          notDiv.append(
            this.editorView.render().el
          );

          $thisEl.find('.attachments').append(
            new AttachView({
              model      : this.currentModel,
              contentType: 'Employees',
              noteView   : this.editorView,
              forDoc: true
            }).render().el
          );

            this.renderAssignees(this.currentModel);

            populate.get('#departmentDd', CONSTANTS.URLS.DEPARTMENTS_FORDD, {}, 'name', this);
            populate.get('#weeklySchedulerDd', CONSTANTS.URLS.WEEKLYSCHEDULER, {}, 'name', this, true);
            populate.get('#departmentManagers', CONSTANTS.URLS.DEPARTMENTS_FORDD, {}, 'departmentManager', this);
            populate.get('#jobPositionDd', CONSTANTS.URLS.JOBPOSITIONS_FORDD, {}, 'name', this);
            populate.get('#jobTypeDd', CONSTANTS.URLS.JOBPOSITIONS_JOBTYPE, {}, '_id', this);
            populate.get('#nationality', CONSTANTS.URLS.EMPLOYEES_NATIONALITY, {}, '_id', this);
            populate.get2name('#projectManagerDD', CONSTANTS.URLS.EMPLOYEES_PERSONSFORDD, {}, this);
            populate.get('#relatedUsersDd', CONSTANTS.URLS.USERS_FOR_DD, {}, 'login', this, false, true);
            populate.get('#payrollStructureTypeDd', CONSTANTS.URLS.PAYROLLSTRUCTURETYPES_FORDD, {}, 'name', this, true);
            populate.get('#scheduledPayDd', CONSTANTS.URLS.SCHEDULEDPAY_FORDD, {}, 'name', this, true);
            populate.get('#applicationsEditCountry', CONSTANTS.URLS.COUNTRIES, {}, '_id', this);

            populate.getWorkflow('#workflowsDd', '#workflowNamesDd', CONSTANTS.URLS.WORKFLOWS_FORDD, {id: 'Applications'}, 'name', this);
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

            this.hireDate = this.currentModel.get('hire')[0];
            this.fireDate = $thisEl.find('[data-content="fire"]').last().find('.fireDate').text();

            // this.renderRemoveBtn();

            return this;
        }
    });
    return EditView;
});
