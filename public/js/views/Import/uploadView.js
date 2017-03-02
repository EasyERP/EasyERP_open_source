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
            'click .importBtn'              : 'importFile',
            'change .inputAttach'           : 'importFiles',
            'change .changeTableBtn'        : 'changeCombobox',
            'click #changeTableCombobox'    : 'changeTableCombobox',
            'click #changeDelimeterCombobox': 'changeDelimeterCombobox',
            'click .item'                   : 'checkItem',
            click                           : 'closeSelectView'
        },

        initialize: function (options) {
            var $thisEl = this.$el;
            this.fileName = options.fileName;
            this.entity = 'Department';
            this.delimeter = ',';
            this.comparingField = 'email';
            this.checkedCombobox = App.currentUser.checkedComboImport || 'Department';
            this.checkedItem = App.currentUser.checkedItemImport || 'email';
            this.delimeter = App.currentUser.delimiter || ',';

            this.mergeFields = {
                Workflow        : {
                    names: [
                        'Name'
                    ],
                    items: [
                        'name'
                    ]
                },
                JobPosition     : {
                    names: [
                        'Name'
                    ],
                    items: [
                        'name'
                    ]
                },
                ProductCategory : {
                    names: [
                        'Name'
                    ],
                    items: [
                        'name'
                    ]
                },
                InvoicePayments : {
                    names: [
                        'Number'
                    ],
                    items: [
                        'name'
                    ]
                },
                PurchasePayments: {
                    names: [
                        'Number'
                    ],
                    items: [
                        'name'
                    ]
                },
                Orders          : {
                    names: [
                        'Number'
                    ],
                    items: [
                        'name'
                    ]
                },
                Quotation       : {
                    names: [
                        'Number'
                    ],
                    items: [
                        'name'
                    ]
                },
                Invoice         : {
                    names: [
                        'Invoice Number'
                    ],
                    items: [
                        'name'
                    ]
                },
                Leads           : {
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
                },
                Opportunities   : {
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
                },
                Persons         : {
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
                Companies       : {
                    names: [
                        'Email',
                        'First Name',
                        'Site',
                        'Phone'
                    ],
                    items: [
                        'email',
                        'name.first',
                        'website',
                        'phones.phone'
                    ]
                },
                Employees       : {
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
                },
                Department      : {
                    names: [
                        'Name'
                    ],
                    items: [
                        'name'
                    ]
                },
                Products        : {
                    names: [
                        'Name'
                    ],
                    items: [
                        'name'
                    ]
                }
            };

            this.render();

            this.changingStatus();
            $thisEl.find('#forImport').html(this.importTemplate);
        },

        closeSelectView: function () {
            var $thisEl = this.$el;

            $thisEl.find('#changeDelimeterCombobox').removeClass('open');
            $thisEl.find('#changeTableCombobox').removeClass('open');
        },

        checkItem: function (e) {
            var thisEl = this.$el;
            var $target = $(e.target);

            if ($target.data('imp')) {
                this.comparingField = $target.data('imp');
                App.currentUser.checkedItemImport = this.comparingField;
            } else {
                this.delimeter = $target.data('delimeter');
                App.currentUser.delimiter = this.delimeter;
            }

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

            this.comparingField = $target.data('check');
            App.currentUser.comparingField = this.comparingField;
            App.currentUser.checkedItemImport = this.comparingField;

            $combobox.html('');

            this.drowingCombobox($combobox, dropDownAttr, this);

        },

        drowingCombobox: function ($combobox, dropDownAttr, self) {
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

        changeDelimeterCombobox: function (e) {
            var $combobox = $('#changeDelimeterCombobox');

            $combobox.toggleClass('open');
            e.stopPropagation();
        },

        changeTableCombobox: function (e) {
            var $combobox = $('#changeTableCombobox');

            $combobox.toggleClass('open');
            e.stopPropagation();
        },

        importFiles: function (e) {
            var $thisEl = this.$el;
            var timeStamp = +(new Date());

            if (this.importView) {
                this.importView.undelegateEvents();
            }

            this.fileName = $thisEl.find('#inputAttach')[0].files[0].name;
            this.timeStamp = +timeStamp;

            this.updateUser(timeStamp);

            this.importView = new AttachView({el: '#forImport', import: true, timeStamp: timeStamp});

            this.importView.sendToServer(e, null, this);

            this.changingStatus();

            this.listenTo(this.importView, 'uploadCompleted', function () {
                this.trigger('uploadCompleted');
            });
        },

        updateUser: function (timeStamp) {
            var currentUser = App.currentUser;
            //var timeStamp = +(new Date());
            var userModel;
            var importObj;

            this.comparingField = App.currentUser.checkedItemImport || 'email';
            this.delimeter = App.currentUser.delimiter || ',';

            importObj = {
                fileName      : this.fileName,
                timeStamp     : +timeStamp,
                stage         : 1,
                type          : this.entity,
                comparingField: this.comparingField,
                delimiter     : this.delimeter
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

        changingStatus: function () {
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

        render: function () {
            var $thisEl = this.$el;
            var $combobox;

            this.entity = this.checkedCombobox;
            //this.checkEntity();

            $thisEl.html(this.contentTemplate({fileName: this.fileName}));
            $combobox = $('#changeTableCombobox');
            $thisEl.find('.changeTableBtn[value="' + this.checkedCombobox + '"]').click();
            this.drowingCombobox($combobox, this.entity, this);
            $thisEl.find('.item').removeClass('active');
            $thisEl.find('.item[data-imp="' + this.checkedItem + '"]').addClass('active');
            $thisEl.find('.item[data-delimeter="' + this.delimeter + '"]').addClass('active');

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
