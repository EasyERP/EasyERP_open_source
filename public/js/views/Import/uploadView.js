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

            this.mergeFields = {
                Opportunities: [
                    'contactName.first',
                    'contactName.last',
                    'name'
                ],
                Customers    : [
                    'email',
                    'name.first',
                    'website',
                    'phones.phone'
                ],
                Employees    : [
                    'name.first',
                    'name.last',
                    'workEmail'
                ]
            };

            this.render();

            $thisEl.find('#forImport').html(this.importTemplate);
        },

        checkItem: function (e) {
            var thisEl = this.$el;
            var $target = $(e.target);

            this.comparingField = $target.text();

            thisEl.find('.item').removeClass('active');
            $target.addClass('active');
        },

        changeCombobox: function (e) {
            var thisEl = this.$el;
            var $target = $(e.target);
            var $combobox = $('#changeTableCombobox');
            var dropDownAttr = $target.data('table');

            this.entity = $target.val();

            $combobox.html('');

            _.each(this.mergeFields[dropDownAttr], function (item) {
                $combobox.append('<div class="item">' + item + '</div>');
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
            var timeStamp = +(new Date());
            var currentUser = App.currentUser;
            var $thisEl = this.$el;
            var fileName;
            var userModel;
            var importObj;

            if (this.importView) {
                this.importView.undelegateEvents();
            }

            fileName = $thisEl.find('#inputAttach')[0].files[0].name;

            importObj = {
                fileName      : fileName,
                timeStamp     : +timeStamp,
                stage         : 1,
                type          : this.entity,
                comparingField: this.comparingField
            };

            this.timeStamp = +timeStamp;
            userModel = new UserModel(currentUser);

            userModel.save({
                imports: importObj
            }, {
                patch   : true,
                validate: false
            });

            App.currentUser.imports = importObj;

            this.importView = new AttachView({el: '#forImport', timeStamp: timeStamp});

            this.importView.sendToServer(e, null, this);

            $thisEl.find('.attachFileName span').html($thisEl.find('#inputAttach')[0].files[0].name);

            this.listenTo(this.importView, 'uploadCompleted', function () {
                this.trigger('uploadCompleted');
            });


        },

        render: function () {
            var $thisEl = this.$el;
            $thisEl.html(this.contentTemplate({fileName: this.fileName}));

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
