define([
    'Backbone',
    'jQuery',
    'Underscore',
    'models/UsersModel',
    'text!templates/Import/uploadTemplate.html',
    'text!templates/Notes/importTemplate.html',
    'views/Notes/AttachView',
    'constants'
], function (Backbone, $, _, UserModel, UploadTemplate, ImportTemplate, AttachView, CONSTANTS) {
    'use strict';

    var ContentView = Backbone.View.extend({
        import         : true,
        contentType    : CONSTANTS.IMPORT,
        contentTemplate: _.template(UploadTemplate),
        importTemplate : _.template(ImportTemplate),
        childView      : null,
        el             : '#contentBlock',
        importView     : null,

        events: {
            'click .importBtn'          : 'importFile',
            'change .inputAttach'       : 'importFiles',
            'change .changeTableBtn'    : 'changeCombobox',
            'click #changeTableCombobox': 'changeTableCombobox',
            'click .item'               : 'checkItem'
        },

        initialize: function (options) {
            var $thisEl = this.$el;
            this.fileName = options.fileName;
            this.entity = 'Customers';
            this.comparingField = 'email';
            this.checkedCombobox = App.currentUser.checkedComboImport || 'Persons';
            this.checkedItem = App.currentUser.checkedItemImport || 'email';

            this.mergeFields = {
                Quotation: {
                    names: [
                        'Number'
                    ],
                    items: [
                        'name'
                    ]
                },
                Invoice: {
                    names: [
                        'Invoice Number'
                    ],
                    items: [
                        'name'
                    ]
                } ,
                Opportunities: {
                    names: [
                        'First Name',
                        'Last Name',
                        'Full Name'
                    ],
                    items: [
                        'contactName.first',
                        'contactName.last',
                        'name'
                    ]
                } ,
                Customers    : {
                    names: [
                        'Email',
                        'Last Name',
                        'Site',
                        'Phone'
                    ],
                    items: [
                        'email',
                        'name.last',
                        'website',
                        'phones.phone'
                    ]
                },
                Employees    : {
                    names: [
                        'First Name',
                        'Last Name',
                        'Email'
                    ],
                    items: [
                        'name.first',
                        'name.last',
                        'workEmail'
                    ]
                }
            };

            this.render();

            this.changingStatus();
            $thisEl.find('#forImport').html(this.importTemplate);
        },

        checkItem: function (e) {
            var thisEl = this.$el;
            var $target = $(e.target);

            this.comparingField = $target.data('imp');
            App.currentUser.checkedItemImport = this.comparingField;

            thisEl.find('.item').removeClass('active');
            $target.addClass('active');
        },

        changeCombobox: function (e) {
            var thisEl = this.$el;
            var $target = $(e.target);
            var $combobox = $('#changeTableCombobox');
            var dropDownAttr = $target.data('table');

            App.currentUser.checkedComboImport = $target.val();
            this.entity = dropDownAttr;

            $combobox.html('');

            this.drowingCombobox($combobox ,dropDownAttr, this);

        },

        drowingCombobox: function($combobox, dropDownAttr, self) {
            var change = true;

            _.each(this.mergeFields[dropDownAttr].names, function (item, key) {
                $combobox.append('<div data-imp="' + self.mergeFields[dropDownAttr].items[key] + '" class="item">' + item + '</div>');
                if (change) {
                    self.comparingField = self.mergeFields[dropDownAttr].items[key];
                    change = false;
                }
            });

            $combobox.append('<span class="selectArrow"></span>');
        },

        importFile: function (e) {
            var $thisEl = this.$el;
            e.preventDefault();

            $thisEl.find('#inputAttach').click();

        },

        changeTableCombobox: function (e) {
            var $combobox = $('#changeTableCombobox');

            $combobox.toggleClass('open');
        },

        importFiles: function (e) {
            var $thisEl = this.$el;
            var timeStamp = +(new Date());

            if (this.importView) {
                this.importView.undelegateEvents();
            }

            this.fileName = $thisEl.find('#inputAttach')[0].files[0].name;
            this.timeStamp = +timeStamp;

            this.updateUser();

            this.importView = new AttachView({el: '#forImport', import   : true, timeStamp: timeStamp});

            this.importView.sendToServer(e, null, this);

            this.changingStatus();

            this.listenTo(this.importView, 'uploadCompleted', function () {
                this.trigger('uploadCompleted');
            });
        },

        updateUser: function() {
            var currentUser = App.currentUser;
            //var timeStamp = +(new Date());
            var userModel;
            var importObj;

            importObj = {
                fileName      : this.fileName,
                timeStamp     : +this.timeStamp,
                stage         : 1,
                type          : this.entity,
                comparingField: this.comparingField
            };

            //
            userModel = new UserModel(currentUser);

            userModel.save({
                imports: importObj
            }, {
                patch   : true,
                validate: false
            });

            App.currentUser.imports = importObj;

        },

        changingStatus: function() {
            var $attachFileName;
            var $importBtn = this.$el.find('.importBtn');
            var $thisEl = this.$el;

            if (App.currentUser && App.currentUser.imports && App.currentUser.imports.fileName) {
                $attachFileName = $thisEl.find('.attachFileName');
                $importBtn.text('Import another file');

                $attachFileName.html('You have uploaded file ' + '<span></span>');
                $attachFileName.find('span').html(App.currentUser.imports.fileName);
            } else {
                $('#fileName').text('');
            }
        },

        checkEntity: function () {
            switch (this.checkedCombobox) {
                case 'Opportunities': {
                    this.entity = 'Opportunities';
                    break;
                }
                case 'Employees': {
                    this.entity = 'Employees';
                    break;
                }
                case 'Leads': {
                    this.entity = 'Opportunities';
                    break;
                }
                case 'Invoice': {
                    this.entity = 'Invoice';
                    break;
                }
                default: {
                    this.entity = 'Customers';
                    break;
                }
            }
        },

        render: function () {
            var $thisEl = this.$el;
            var $combobox;

            //this.entity = 'Opportunities';

            /*if (this.checkedCombobox === 'Persons' || this.checkedCombobox === 'Companies') {
                this.entity = 'Customers';
            } else if (this.checkedCombobox === 'Employees') {
                this.entity = 'Employees';
            }*/

            this.checkEntity();

            $thisEl.html(this.contentTemplate({fileName: this.fileName}));

            $combobox = $('#changeTableCombobox');
            $thisEl.find('.changeTableBtn[value="' + this.checkedCombobox + '"]').click();
            this.drowingCombobox($combobox, this.entity, this);
            $thisEl.find('.item').removeClass('active');
            $thisEl.find('.item[data-imp="' + this.checkedItem + '"]').addClass('active');


            $thisEl.find('.importContainer').on('drop', function (e) {
                if (e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files.length) {
                    e.preventDefault();
                    e.stopPropagation();

                    $thisEl.find('#inputAttach').empty();
                    $thisEl.find('#inputAttach')[0].files = e.originalEvent.dataTransfer.files;
                }
            });


            $thisEl.find('.importContainer').on('dragover', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });

            $thisEl.find('.importContainer').on('dragenter', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });
        }
    });

    return ContentView;
});
