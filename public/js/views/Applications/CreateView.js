define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Applications/CreateTemplate.html',
    'models/ApplicationsModel',
    'common',
    'populate',
  'views/Editor/NoteView',
  'views/Editor/AttachView',
  'views/dialogViewBase',
    'constants',
    'helpers'
], function (Backbone, $, _, CreateTemplate, ApplicationModel, common, populate, NoteView, AttachView, ParentView, CONSTANTS, helpers) {
    'use strict';
    var CreateView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'Applications',
        template   : _.template(CreateTemplate),
        imageSrc   : '',

        initialize: function () {
            _.bindAll(this, 'saveItem', 'render');
            this.model = new ApplicationModel();
            this.responseObj = {};

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

            this.render();
        },

        events: {
            'mouseenter .avatar'                               : 'showEdit',
            'mouseleave .avatar'                               : 'hideEdit',
            'click .dialog-tabs a'                             : 'changeTab',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption'
        },

        clickInput: function () {
            this.$el.find('.input-file .inputAttach').click();
        },

        getWorkflowValue: function (value) {
            var workflows = [];
            var i;

            for (i = 0; i < value.length; i++) {
                workflows.push({name: value[i].name, status: value[i].status});
            }
            return workflows;
        },

        isEmployee: function (e) {
            $(e.target).addClass('pressed');
            this.saveItem();
        },

        saveItem: function () {
            var self = this;
            var mid = this.mId;
            var $thisEl = this.$el;
            var name = {
                first: $.trim($thisEl.find('#first').val()),
                last : $.trim($thisEl.find('#last').val())
            };

            var gender = $thisEl.find('#genderDd').attr('data-id');

            var jobType = $thisEl.find('#jobTypeDd').attr('data-id') || null;

            var marital = $thisEl.find('#maritalDd').attr('data-id');

            var employmentType = $thisEl.find('#employmentTypeDd').attr('data-id') || null;

            var workAddress = {
                street : $.trim($thisEl.find('#applicationsCreateStreet').val()),
                city   : $.trim($thisEl.find('#applicationsCreateCity').val()),
                state  : $.trim($thisEl.find('#applicationsCreateState').val()),
                zip    : $.trim($thisEl.find('#applicationsCreateZip').val()),
                country: $thisEl.find('#applicationsCreateCountry').attr('data-id')
            };

            var social = {
                LI: $.trim($thisEl.find('#LI').val()),
                FB: $.trim($thisEl.find('#FB').val())
            };

            var tags = $.trim($thisEl.find('#tags').val()).split(',');

            var workEmail = $.trim($thisEl.find('#workEmail').val());

            var personalEmail = $.trim($thisEl.find('#personalEmail').val());

            var skype = $.trim($thisEl.find('#skype').val());

            var workPhones = {
                phone : $.trim($thisEl.find('#phone').val()),
                mobile: $.trim($thisEl.find('#mobile').val())
            };

            var bankAccountNo = $.trim($thisEl.find('#bankAccountNo').val());

            var relatedUser = $thisEl.find('#relatedUsersDd').attr('data-id') || null;

            var departmentDd = $thisEl.find('#departmentDd');

            var department = departmentDd.attr('data-id') || null;

            var jobPositionDd = $thisEl.find('#jobPositionDd');
            var jobPosition = jobPositionDd.attr('data-id') || null;

            var weeklySchedulerDd = $thisEl.find('#weeklySchedulerDd');

            var weeklyScheduler = weeklySchedulerDd.attr('data-id');

            var payrollStructureTypeDd = $thisEl.find('#payrollStructureTypeDd');
            var payrollStructureType = payrollStructureTypeDd.attr('data-id') || null;

            var scheduledPayDd = $thisEl.find('#scheduledPayDd');
            var scheduledPay = scheduledPayDd.attr('data-id') || null;

            var projectManagerDD = $thisEl.find('#projectManagerDD');
            var manager = projectManagerDD.attr('data-id') || null;

            var identNo = $.trim($thisEl.find('#identNo').val());

            var passportNo = $.trim($thisEl.find('#passportNo').val());

            var otherId = $.trim($thisEl.find('#otherId').val());

            var homeAddress = {};

            var dateBirthSt = $thisEl.find('#dateBirth').val() ? helpers.setTimeToDate($.trim($thisEl.find('#dateBirth').val())) : null;

            var sourceId = $thisEl.find('#sourceDd').attr('data-id');

            var nationality = $thisEl.find('#nationality').attr('data-id');

            var usersId = [];
            var groupsId = [];

            var groups;

            var whoCanRW = $thisEl.find('[name="whoCanRW"]:checked').val();

            var referredBy = $.trim($thisEl.find('#referredBy').val());

            var expectedSalary = parseInt(helpers.spaceReplacer($.trim($thisEl.find('#expectedSalary').val())), 10);

            var proposedSalary = parseInt(helpers.spaceReplacer($.trim($thisEl.find('#proposedSalary').val())), 10);

            var workflow = $thisEl.find('#workflowsDd').attr('data-id') || null;

            var nextAction = $.trim($thisEl.find('#nextAction').val());

            var notes = [];
            var note;
            var internalNotes = $.trim(this.$el.find('#internalNotes').val());

           /* if (internalNotes) {
                note = {
                    title: '',
                    note : internalNotes
                };
                notes.push(note);
            }*/

          notes = this.model.get('notes');

          $thisEl.find('dd').find('.homeAddress').each(function () {
                var elem = $(this);
                homeAddress[elem.attr('name')] = $.trim(elem.val()) || elem.attr('data-id');
            });

            $thisEl.find('.groupsAndUser tr').each(function () {
                if ($(this).data('type') === 'targetUsers') {
                    usersId.push($(this).attr('data-id'));
                }
                if ($(this).data('type') === 'targetGroups') {
                    groupsId.push($(this).attr('data-id'));
                }

            });

            groups = {
                owner: $thisEl.find('#allUsersSelect').attr('data-id') || null,
                users: usersId,
                group: groupsId
            };

            this.model.save({
                name                : name,
                gender              : gender,
                jobType             : jobType,
                marital             : marital,
                employmentType      : employmentType,
                workAddress         : workAddress,
                social              : social,
                tags                : tags,
                workEmail           : workEmail,
                personalEmail       : personalEmail,
                skype               : skype,
                workPhones          : workPhones,
                bankAccountNo       : bankAccountNo,
                relatedUser         : relatedUser,
                department          : department,
                jobPosition         : jobPosition,
                weeklyScheduler     : weeklyScheduler,
                notes               : notes,
                payrollStructureType: payrollStructureType,
                scheduledPay        : scheduledPay,
                manager             : manager,
                identNo             : identNo,
                passportNo          : passportNo,
                otherId             : otherId,
                homeAddress         : homeAddress,
                dateBirth           : dateBirthSt,
                source              : sourceId,
                imageSrc            : this.imageSrc,
                nationality         : nationality,
                groups              : groups,
                whoCanRW            : whoCanRW,
                nextAction          : nextAction,
                referredBy          : referredBy,
                expectedSalary      : expectedSalary,
                proposedSalary      : proposedSalary,
                workflow            : workflow
            }, {
                headers: {
                    mid: mid
                },
                wait   : true,
                success: function (model) {
                    var currentModel = model.changed;
                    self.attachView.sendToServer(null, currentModel);
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            $target.parents('ul').closest('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));
        },

        render: function () {
            var formString = this.template();
            var self = this;
            var $thisEl;
            var notDiv;
            this.$el = $(formString).dialog({
                dialogClass: 'edit-dialog create-app-dialog',
                width      : 800,
                title      : 'Create Application',
                buttons    : {
                    save: {
                        text : 'Create',
                        class: 'btn blue',
                        click: function () {
                            self.saveItem();
                            self.gaTrackingConfirmEvents();
                        }
                    },

                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        click: self.hideDialog
                    }
                }
            });

            $thisEl = this.$el;

            this.attachView = new AttachView({
                model      : new ApplicationModel(),
                contentType: self.contentType,
                isCreate   : true
            });

            notDiv = $thisEl.find('#attach-container');

          this.model = new ApplicationModel();

          this.editorView = new NoteView({
            model      : this.model,
            contentType: self.contentType,
            onlyNote: true,
            isCreate: true
          });

          notDiv.append(
            this.editorView.render().el
          );

          this.attachView =  new AttachView({
            model      : this.model,
            contentType: self.contentType,
            noteView   : this.editorView,
            forDoc: true,
            isCreate: true
          });

          $thisEl.find('.attachments').append(
            this.attachView.render().el
          );
            this.renderAssignees(this.currentModel);
            populate.getWorkflow('#workflowsDd', '#workflowNamesDd', CONSTANTS.URLS.WORKFLOWS_FORDD, {id: 'Applications'}, 'name', this, true, function (data) {
                var i;

                for (i = 0; i < data.length; i++) {
                    if (data[i].name === 'Refused') {
                        self.refuseId = data[i]._id;
                        if (self.currentModel && self.currentModel.toJSON().workflow && self.currentModel.toJSON().workflow._id === data[i]._id) {
                            $thisEl.find('.refuseEmployee').hide();
                        }
                        break;
                    }
                }
            });
            populate.get('#departmentDd', CONSTANTS.URLS.DEPARTMENTS_FORDD, {}, 'name', this);
            populate.get('#jobPositionDd', CONSTANTS.URLS.JOBPOSITIONS_FORDD, {}, 'name', this);
            populate.get('#jobTypeDd', CONSTANTS.URLS.JOBPOSITIONS_JOBTYPE, {}, '_id', this);
            populate.get('#nationality', CONSTANTS.URLS.EMPLOYEES_NATIONALITY, {}, '_id', this);
            populate.get('#applicationsCreateCountry', CONSTANTS.URLS.COUNTRIES, {}, '_id', this);
            populate.get2name('#projectManagerDD', CONSTANTS.URLS.EMPLOYEES_PERSONSFORDD, {}, this);
            populate.get('#relatedUsersDd', CONSTANTS.URLS.USERS_FOR_DD, {}, 'login', this, false, true);
            populate.get('#weeklySchedulerDd', '/weeklyScheduler/forDd', {}, 'name', this, true);
            populate.get('#payrollStructureTypeDd', CONSTANTS.URLS.PAYROLLSTRUCTURETYPES_FORDD, {}, 'name', this, true);
            populate.get('#scheduledPayDd', CONSTANTS.URLS.SCHEDULEDPAY_FORDD, {}, 'name', this, true);

            common.canvasDraw({model: this.model.toJSON()}, this);
            $thisEl.find('#nextAction').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                minDate    : new Date()
            });

            $thisEl.find('#dateBirth').datepicker({
                changeMonth: true,
                changeYear : true,
                yearRange  : '-100y:c+nn',
                maxDate    : '-18y',
                minDate    : null
            });
            this.delegateEvents(this.events);
            return this;
        }
    });
    return CreateView;
});
