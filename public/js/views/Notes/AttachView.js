define([
    'text!templates/Notes/AttachTemplate.html',
    'text!templates/Notes/AddAttachments.html',
    'common'

], function (AttachTemplate, addAttachTemplate, common) {
    var AttachView = Backbone.View.extend({

        initialize: function (options) {
            this.url = options.url;
            this.isCreate = options.isCreate;
            this.elementId = options.elementId;
        },
        events    : {
            "change .inputAttach": "addAttach",
            "click .deleteAttach": "deleteAttach"
        },

        template: _.template(AttachTemplate),

        addAttach: function (event) {
            if (this.isCreate) {
                var s = this.$el.find(".inputAttach:last").val().split("\\")[this.$el.find(".inputAttach:last").val().split('\\').length - 1];
                this.$el.find(".attachContainer").append('<li class="attachFile">' +
                    '<span class="blue">' + s + '</span>' +
                    '<a href="javascript:;" class="deleteAttach">Delete</a></li>'
                );
                this.$el.find(".attachContainer .attachFile:last").append(this.$el.find(".input-file .inputAttach").attr("hidden", "hidden"));
                this.$el.find(".input-file").append('<input type="file" value="Choose File" class="inputAttach" name="attachfile">');
            } else {
                this.sendToServer(event, null, this);
            }
        },

        hideDialog: function () {
            $(".edit-dialog").remove();
            $(".add-group-dialog").remove();
            $(".add-user-dialog").remove();
        },

        sendToServer: function (event, model, self) {
            var currentModel = this.model;
            var elementId = this.elementId || 'addAttachments';
            var currentModelId = currentModel ? currentModel["id"] : null;
            var addFrmAttach = $("#" + elementId);
            var fileArr = [];
            var addInptAttach;

            if (!self) {
                self = this;
            }

            if (this.isCreate) {
                currentModel = model;
                currentModelId = currentModel["id"];

                this.$el.find("li .inputAttach").each(function () {
                    addInptAttach = $(this)[0].files[0];
                    fileArr.push(addInptAttach);

                    if (!self.fileSizeIsAcceptable(addInptAttach)) {
                        return App.render({
                            type   : 'error',
                            message: 'File you are trying to attach is too big. MaxFileSize: ' + App.File.MaxFileSizeDisplay
                        });
                    }
                });
                if (this.$el.find("li .inputAttach").length == 0) {
                    Backbone.history.fragment = '';
                    Backbone.history.navigate(window.location.hash, {trigger: true});

                    return;
                }
                addInptAttach = fileArr;
            } else {
                // event.preventDefault();
                addInptAttach = addFrmAttach.find("#inputAttach")[0].files[0];

                if (!this.fileSizeIsAcceptable(addInptAttach)) {
                    this.$el.find('#inputAttach').val('');
                    return App.render({
                        type   : 'error',
                        message: 'File you are trying to attach is too big. MaxFileSize: ' + App.File.MaxFileSizeDisplay
                    });
                }
            }

            addFrmAttach.submit(function (e) {
                $(".input-file-button").off("click");
                var bar = self.$el.find('.bar');
                var status = self.$el.find('.status');
                var formURL;

                if (self.import) {
                    formURL = "http://" + window.location.host + "/importFile";
                } else {
                    formURL = "http://" + window.location.host + ((self.url) ? self.url : "/uploadFiles");
                }

                e.preventDefault();
                addFrmAttach.ajaxSubmit({
                    url        : formURL,
                    type       : "POST",
                    processData: false,
                    contentType: false,
                    data       : [addInptAttach],

                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("id", currentModelId);
                        xhr.setRequestHeader("modelname", self.contentType);
                        status.show();
                        var statusVal = '0%';
                        bar.width(statusVal);
                        status.html(statusVal);
                    },

                    uploadProgress: function (event, position, total, statusComplete) {
                        var statusVal = statusComplete + '%';
                        bar.width(statusVal);
                        status.html(statusVal);
                    },

                    success: function (data) {
                        if (self.isCreate) {
                            status.hide();
                            self.hideDialog();
                            Backbone.history.fragment = '';
                            Backbone.history.navigate(window.location.hash, {trigger: true});
                        } else if (self.import) {
                            Backbone.history.fragment = '';
                            Backbone.history.navigate(window.location.hash, {trigger: true});
                        } else {
                            var attachments = currentModel.get('attachments');
                            attachments.length = 0;
                            $('.attachContainer').empty();
                            var res = (data.data) ? data.data : data.result;
                            if (!res) {
                                res = data;
                            }
                            res.attachments.forEach(function (item) {
                                var date = common.utcDateToLocaleDate(item.uploadDate);
                                attachments.push(item);
                                self.$el.find('.attachContainer').prepend(_.template(addAttachTemplate, {
                                    data: item,
                                    date: date
                                }));
                            });
                            addFrmAttach[0].reset();
                            status.hide();
                        }
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
            var self = this;
            if (confirm("You really want to remove this file?")) {
                var target = $(e.target);
                if (target.closest("li").hasClass("attachFile")) {
                    target.closest(".attachFile").remove();
                } else {
                    var id = e.target.id;
                    var currentModel = this.model;
                    var attachments = currentModel.get('attachments');
                    var newAttachments = _.filter(attachments, function (attach) {
                        if (attach._id != id) {
                            return attach;
                        }
                    });
                    var fileName = this.$el.find('.attachFile_' + id + ' a')[0].innerHTML;
                    currentModel.save({'attachments': newAttachments, fileName: fileName},
                        {
                            headers: {
                                mid: 39
                            },
                            patch  : true,//Send only changed attr(add Roma)
                            success: function () {
                                self.$el.find('.attachFile_' + id).remove();
                            }
                        });
                }
            }
        },

        render: function () {
            var attachments = null;
            if (this.model.toJSON() && this.model.toJSON().attachments) {
                attachments = this.model.toJSON().attachments;
            }

            this.$el.html(this.template({
                attachments: attachments,
                elementId  : this.elementId || 'addAttachments'
            }));
            return this;
        }
    });

    return AttachView;
});
