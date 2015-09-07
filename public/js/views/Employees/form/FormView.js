define([
    'text!templates/Employees/form/FormTemplate.html',
    'views/Employees/EditView',
    'text!templates/Notes/AddAttachments.html',
    "common"
],

    function (EmployeesFormTemplate, EditView, addAttachTemplate, common) {
        var FormEmployeesView = Backbone.View.extend({
            el: '#content-holder',
            initialize: function (options) {
                this.formModel = options.model;
                this.formModel.urlRoot = "/Employees";
            },
            events: {
                'click .chart-tabs a': 'changeTab',
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
                var addFrmAttach = $("#employeeForm");
                var addInptAttach = $("#employeeForm .input-file .inputAttach")[0].files[0];
                if (!this.fileSizeIsAcceptable(addInptAttach)) {
                    alert('File you are trying to attach is too big. MaxFileSize: ' + App.File.MaxFileSizeDisplay);
                    return;
                }
                addFrmAttach.submit(function (e) {
                    var bar = $('.bar');
                    var status = $('.status');
                    var formURL = "http://" + window.location.host + "/uploadEmployeesFiles";
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
                    currentModel.urlRoot = "/Employees/";
                    var attachments = currentModel.get('attachments');
                    var new_attachments = _.filter(attachments, function (attach) {
                        if (attach._id != id) {
                            return attach;
                        }
                    });
                    currentModel.save({ 'attachments': new_attachments },
                                      {
                                          headers: {
                                              mid: 39
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
            showEndContractSelect: function (e) {
                e.preventDefault();
                $(e.target).parent().find(".newSelectList").toggle();
                return false;
            },
            endContract: function (e) {
                var wfId = $('.endContractReasonList').attr('data-id');
                var contractEndReason = $(e.target).text();
                this.formModel.set({ workflow: wfId, contractEndReason: contractEndReason, fired: true});
                this.formModel.save(this.formModel.changed, {
                    patch: true,
                    success: function () {
                        Backbone.history.navigate("easyErp/Applications/kanban", { trigger: true });
                    },
                    error: function () {
                        Backbone.history.navigate("home", { trigger: true });
                    }
                });
            },
            changeTab: function (e) {
                $(e.target).closest(".chart-tabs").find("a.active").removeClass("active");
                $(e.target).addClass("active");
                var n = $(e.target).parents(".chart-tabs").find("li").index($(e.target).parent());
                $(".chart-tabs-items").find(".chart-tabs-item.active").removeClass("active");
                $(".chart-tabs-items").find(".chart-tabs-item").eq(n).addClass("active");
            },

            render: function () {
                var formModel = this.formModel.toJSON();
                common.getWorkflowContractEnd("Applications", null, null, "/Workflows", null, "Contract End", function (workflow) {
                    $('.endContractReasonList').attr('data-id', workflow[0]._id);
                });
                this.$el.html(_.template(EmployeesFormTemplate, formModel));
                return this;
            },

            editItem: function () {
                //create editView in dialog here
                new EditView({ model: this.formModel });
            },

            deleteItems: function () {
                var mid = 39;
                this.formModel.urlRoot = "/Employees";
                this.formModel.destroy({
                    headers: {
                        mid: mid
                    },
                    success: function () {
                        Backbone.history.navigate("#easyErp/Employees/list", { trigger: true });
                    }
                });

            }
        });

        return FormEmployeesView;
    });
