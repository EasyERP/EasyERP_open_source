define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/documentationHelper/mailTemplate.html'
], function (Backbone, $, _, indexTemplate) {
    var View = Backbone.View.extend({
        el: '#helpContainer',

        btnHelp    : '#btnHelp',
        content    : '#contentContainer',
        contactUs  : '#mailContainer',
        inputId    : '#searchInput',
        searchId   : '#search',
        chat       : '#live',
        search     : '#searchTab',
        searchFrame: '#searchFrame',

        events: {
            'click #btnHelp'     : 'showContent',
            'click #contactUs'   : 'showContactUs',
            'click #cancel'      : 'showContent',
            'click #send'        : 'sendToServer',
            'change .inputAttach': 'addAttach',
            'click .deleteAttach': 'deleteAttach',
            'click .docCloseBtn' : 'closeHelpDialog',
            'click #back'        : 'showContent',
            'click #backToSearch': 'showSearchBlock',
            'click .attach_file' : 'clickInput',
            'click #chatBtn'     : 'openChat',
            'keyup #email'       : 'checkEmail'
        },

        initialize: function (options) {
            var self = this;
            this.elements = [];
            this.currentModule = options.currentModule;

            setTimeout(function () {
                self.render();

                setTimeout(function () {
                    self.openChat();
                }, 10000);
            }, 10000);
        },

        searchAction: function (value) {
            var url = 'https://easyerp.com/mini-search/';
            var farme = this.$el.find(this.searchFrame);

            if (value) {
                url += '?search=' + value;
            }

            farme.attr('src', url);
        },

        openChat: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }

            this.showHideMethod(this.chat);
        },

        clickInput: function () {
            $('.input-file .inputAttach').click();
        },

        getData: function () {
            var currentModule;
            var windowHash = window.location.hash;
            var array = windowHash.split('/');

            this.showHideMethod(this.btnHelp);

            currentModule = array && array.length ? array[1] : '';

            this.currentModule = currentModule;

            this.searchAction(currentModule);
        },

        closeHelpDialog: function (e) {
            e.preventDefault();
            e.stopPropagation();

            this.showHideMethod(this.btnHelp);
        },

        clearMessage: function () {
            this.$el.find('#name').val('');
            this.$el.find('#email').val('');
            this.$el.find('#message').val('');

            this.$el.find('.attachContainer').empty();

            this.$el.find('.attach-container').addClass('hidden');
        },

        addAttach: function (e) {
            var $thisEl = this.$el;
            var s;

            this.$el.find('.attach-container').removeClass('hidden');

            e.stopPropagation();
            e.preventDefault();

            s = $thisEl.find('.inputAttach:last').val().split('\\')[$thisEl.find('.inputAttach:last').val().split('\\').length - 1];
            $thisEl.find('.attachContainer').append('<li class="attachFile">' +
                '<span class="blue">' + s + '</span>' +
                '<a href="javascript:;" class="deleteAttach">Delete</a></li>'
            );
            $thisEl.find('.attachContainer .attachFile:last').append($thisEl.find('.input-file .inputAttach').attr('hidden', 'hidden'));
            $thisEl.find('.input-file').append('<input type="file" value="Choose File" class="inputAttach" name="attachfile">');
        },

        checkEmail: function (e, email) {
            var $target = e ? $(e.target) : null;
            var emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var value = $target ? $target.val() : email;
            var emailEl = this.$el.find('#email');

            if (!emailRegExp.test(value)) {
                emailEl.addClass('errorContent');
            } else {
                emailEl.removeClass('errorContent');
            }

            return emailRegExp.test(value);
        },

        showSearchBlock: function (e) {
            e.preventDefault();
            e.stopPropagation();

            this.searchAction();
        },

        checkClasses: function () {
            var $thisEl = this.$el;
            var name = $thisEl.find('#name');
            var email = $thisEl.find('#email');
            var message = $thisEl.find('#message');

            var nameVal = $.trim(name.val());
            var emailVal = $.trim(email.val());
            var messageVal = $.trim(message.val());
            var notSend = 1;

            if (!nameVal) {
                name.addClass('errorContent');
                notSend = 0;
            } else {
                name.removeClass('errorContent');
            }

            if (!emailVal) {
                email.addClass('errorContent');
                notSend = 0;
            } else {
                email.removeClass('errorContent');

                if (!this.checkEmail(null, emailVal)) {
                    notSend = 0;
                }
            }

            if (!messageVal) {
                message.addClass('errorContent');
                notSend = 0;
            } else {
                message.removeClass('errorContent');
            }

            return notSend;
        },

        sendToServer: function (e) {
            var self = this;
            var addFrmAttach = this.$el.find('#formAttach');
            var fileArr = [];
            var $thisEl = this.$el;
            var addInptAttach;
            var name = $.trim($thisEl.find('#name').val());
            var email = $.trim($thisEl.find('#email').val());
            var message = $.trim($thisEl.find('#message').val());

            if (!this.checkClasses()) {
                return false;
            }

            e.preventDefault();

            $thisEl.find('li .inputAttach').each(function () {
                addInptAttach = $(this)[0].files[0];
                fileArr.push(addInptAttach);

                if (!self.fileSizeIsAcceptable(addInptAttach)) {
                    return App.render({
                        type   : 'error',
                        message: 'File you are trying to attach is too big. MaxFileSize: ' + App.File.MaxFileSizeDisplay
                    });
                }
            });

            addInptAttach = fileArr;

            addFrmAttach.submit(function (e) {
                var bar = $thisEl.find('.bar');
                var status = $thisEl.find('.status');
                var formURL;

                e.preventDefault();

                $('.input-file').off('click');

                formURL = '/organizationSettings/sendMailFromHelp';

                addFrmAttach.ajaxSubmit({
                    url        : formURL,
                    type       : 'POST',
                    processData: false,
                    contentType: false,
                    data       : [addInptAttach],

                    beforeSend: function (xhr) {
                        var statusVal = '0%';

                        xhr.setRequestHeader('name', name);
                        xhr.setRequestHeader('email', email);
                        xhr.setRequestHeader('message', message);

                        status.show();
                        bar.width(statusVal);
                        status.html(statusVal);
                    },

                    uploadProgress: function (event, position, total, statusComplete) {
                        var statusVal = statusComplete + '%';

                        bar.width(statusVal);
                        status.html(statusVal);
                    },

                    success: function () {

                        self.clearMessage(e);
                        self.showContent(e);
                    },

                    error: function (xhr) {
                        $('.attachContainer').empty();
                        $('.bar .status').empty();

                        if (self) {
                            self.errorNotification(xhr);
                        }
                    }
                });
            });

            addFrmAttach.submit();
            addFrmAttach.off('submit');
        },

        fileSizeIsAcceptable: function (file) {
            if (!file) {
                return false;
            }
            return file.size < App.File.MAXSIZE;
        },

        deleteAttach: function (e) {
            var $target = $(e.target);
            var ulContainer = this.$el.find('.attachContainer');

            $target.closest('.attachFile').remove();

            if (!ulContainer.find('li.attachFile').length) {
                this.$el.find('.attach-container').addClass('hidden');
            }
        },

        showContent: function (e) {
            var $openArticleFrame = this.$el.find('#openArticleFrame');
            var $searchFrame = this.$el.find('#searchFrame');

            e.preventDefault();
            e.stopPropagation();

            this.showHideMethod(this.search);

            $openArticleFrame.hide();
            $searchFrame.show();
        },

        showContactUs: function (e) {
            e.preventDefault();
            e.stopPropagation();

            this.showHideMethod(this.contactUs);
        },

        showHideMethod: function (id) {
            this.elements.forEach(function ($el) {
                $el.removeClass('show');
            });

            this.$el.find(id).addClass('show');
        },

        render: function () {
            var $this = this.$el;
            $this.html(_.template(indexTemplate));

            $this.find(this.btnHelp).addClass('show');

            this.elements.push($this.find(this.btnHelp));
            this.elements.push($this.find(this.content));
            this.elements.push($this.find(this.contactUs));
            this.elements.push($this.find(this.search));
            this.elements.push($this.find(this.chat));

            this.searchAction(this.currentModule);

            return this;
        }
    });

    return View;
});
