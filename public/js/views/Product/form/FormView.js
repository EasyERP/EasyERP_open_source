/**
 * Created by soundstorm on 07.05.15.
 */
define([
        'text!templates/Product/form/FormTemplate.html',
        'views/Product/EditView',
        'text!templates/Notes/AddAttachments.html',
        "common",
        "jqueryBarcode"
    ],

    function (ProductFormTemplate, EditView, addAttachTemplate, common, jqueryBarcode) {
        var FormProductView = Backbone.View.extend({
            el: '#content-holder',
            initialize: function (options) {
                this.formModel = options.model;
            },
            events: {
                'click .endContractReasonList, .withEndContract .arrow': 'showEndContractSelect',
                'click .withEndContract .newSelectList li': 'endContract',
                "click .deleteAttach": "deleteAttach",
                "change .inputAttach": "addAttach",
                'click': 'hideSelect'
            },
            fileSizeIsAcceptable: function (file) {
                if (!file) { return false; }
                return file.size < App.File.MAXSIZE;
            },

            addAttach: function (event) {
                event.preventDefault();
                var currentModel = this.formModel;
                var currentModelID = currentModel.id;
                var addFrmAttach = $("#productForm");
                var addInptAttach = $("#productForm .input-file .inputAttach")[0].files[0];
                if (!this.fileSizeIsAcceptable(addInptAttach)) {
                    alert('File you are trying to attach is too big. MaxFileSize: ' + App.File.MaxFileSizeDisplay);
                    return;
                }
                addFrmAttach.submit(function (e) {
                    var bar = $('.bar');
                    var status = $('.status');
                    var formURL = "http://" + window.location.host + "/uploadProductFiles";
                    e.preventDefault();
                    addFrmAttach.ajaxSubmit({
                        url: formURL,
                        type: "POST",
                        processData: false,
                        contentType: false,
                        data: [addInptAttach],

                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("id", currentModelID);
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
                            var attachments = currentModel.get('attachments');
                            attachments.length = 0;
                            $('.attachContainer').empty();
                            data.data.attachments.forEach(function (item) {
                                var date = common.utcDateToLocaleDate(item.uploadDate);
                                attachments.push(item);
                                $('.attachContainer').prepend(_.template(addAttachTemplate, { data: item, date: date }));
                            });
                            addFrmAttach[0].reset();
                            status.hide();
                        },
                        error: function () {
                            console.log("Attach file error");
                        }
                    });
                });
                addFrmAttach.submit();
                addFrmAttach.off('submit');
            },
            deleteAttach: function (e) {
                var target = $(e.target);
                if (target.closest("li").hasClass("attachFile")) {
                    target.closest(".attachFile").remove();
                } else {
                    var id = e.target.id;
                    var currentModel = this.formModel;
                    currentModel.urlRoot = "/Product/";
                    var attachments = currentModel.get('attachments');
                    var new_attachments = _.filter(attachments, function (attach) {
                        if (attach._id != id) {
                            return attach;
                        }
                    });
                    currentModel.save({ 'attachments': new_attachments },
                        {
                            headers: {
                                mid: 86
                            },
                            patch: true,
                            success: function (model, response, options) {
                                $('.attachFile_' + id).remove();
                            }
                        });
                }
            },

            hideSelect: function () {
                $(".newSelectList").hide();
            },
            render: function () {
                var formModel = this.formModel.toJSON();
                var el = this.$el;
                el.html(_.template(ProductFormTemplate, formModel));
                el.find("#bcTarget").barcode(formModel.info.barcode, "code128");
                return this;
            },

            editItem: function () {
                //create editView in dialog here
                new EditView({ model: this.formModel });
            },

            deleteItems: function () {
                var mid = 58;
                this.formModel.urlRoot = "/Product";
                this.formModel.destroy({
                    headers: {
                        mid: mid
                    },
                    success: function () {
                        Backbone.history.navigate("#easyErp/Product/thumbnails", { trigger: true });
                    }
                });

            }
        });
        return FormProductView;
    });
