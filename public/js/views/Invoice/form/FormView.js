define([
        'text!templates/Invoice/form/FormTemplate.html',
        'views/Invoice/EditView',
        //'views/Notes/NoteView',
        'common'
    ],

    function (invoiceFormTemplate, editView /*attachView,*/, common) {
        var invoiceTasksView = Backbone.View.extend({
            el: '#content-holder',

            initialize: function (options) {
                this.formModel = options.model;
                this.formModel.on("change", this.render, this);
                this.formModel.urlRoot = "/Invoice";
                this.pageMini = 1;
                this.pageCount = 4;
                this.allMiniOpp = 0;
                this.allPages = 2;
                var self = this;
                var formModel = this.formModel.toJSON();

            },

            events      : {
                "click .checkbox"                                                         : "checked",
                //"click .person-checkbox:not(.disabled)": "personsSalesChecked",
                "click .details"                                                          : "toggle",
                "click .company"                                                          : "gotoCompanyForm",
                "mouseenter .editable:not(.quickEdit), .editable .no-long:not(.quickEdit)": "quickEdit",
                "mouseleave .editable"                                                    : "removeEdit",
                "click #editSpan"                                                         : "editClick",
                "click #cancelSpan"                                                       : "cancelClick",
                "click #saveSpan"                                                         : "saveClick",
                //"click .btnHolder .add.opportunities": "addOpportunities",
                //"change .sale-purchase input": "saveCheckboxChange",
                "click .miniPagination .next:not(.not-active)"                            : "nextMiniPage",
                "click .miniPagination .prev:not(.not-active)"                            : "prevMiniPage",
                "click .miniPagination .first:not(.not-active)"                           : "firstMiniPage",
                "click .miniPagination .last:not(.not-active)"                            : "lastMiniPage",
                'click .dialog-tabs a'                                                    : 'changeTab'
            },
            nextMiniPage: function () {
                this.pageMini += 1;
                //this.renderMiniOpp();
            },
            prevMiniPage: function () {
                this.pageMini -= 1;
                this.renderMiniOpp();
            },

            firstMiniPage: function () {
                this.pageMini = 1;
                this.renderMiniOpp();
            },

            lastMiniPage: function () {
                this.pageMini = this.allPages;
                this.renderMiniOpp();
            },

            changeTab: function (e) {
                var holder = $(e.target);
                holder.closest(".dialog-tabs").find("a.active").removeClass("active");
                holder.addClass("active");
                var n = holder.parents(".dialog-tabs").find("li").index(holder.parent());
                var dialog_holder = $(".dialog-tabs-items");
                dialog_holder.find(".dialog-tabs-item.active").removeClass("active");
                dialog_holder.find(".dialog-tabs-item").eq(n).addClass("active");
            },

            /*renderMiniOpp: function () {
             var self = this;
             var formModel = this.formModel.toJSON();
             common.populateOpportunitiesForMiniView("/OpportunitiesForMiniView", formModel._id, formModel.company ? formModel.company._id : null, this.pageMini, this.pageCount, false, function (collection) {
             var oppElem = self.$el.find('#opportunities');
             oppElem.empty();
             var isLast = self.pageMini == self.allPages ? true : false;
             oppElem.append(
             new opportunitiesCompactContentView({
             collection: collection.data
             }).render({ first: self.pageMini == 1 ? true : false, last: isLast, all: self.allPages }).el
             );

             });

             },*/

            /*addOpportunities: function (e) {
             e.preventDefault();
             var model = this.formModel.toJSON();
             new createViewOpportunities({ model: model });
             },*/

            quickEdit: function (e) {
                var trId = $(e.target).closest("dd");
                if ($("#" + trId.attr("id")).find("#editSpan").length === 0) {
                    $("#" + trId.attr("id")).append('<span id="editSpan" class=""><a href="#">e</a></span>');
                    if ($("#" + trId.attr("id")).width() - 30 < $("#" + trId.attr("id")).find(".no-long").width()) {
                        $("#" + trId.attr("id")).find(".no-long").width($("#" + trId.attr("id")).width() - 30);
                    }
                }
            },

            removeEdit: function (e) {
                $('#editSpan').remove();
                $("dd .no-long").css({width: "auto"});
            },

            cancelClick: function (e) {
                e.preventDefault();

                Backbone.history.fragment = "";
                Backbone.history.navigate("#easyErp/Invoice/form/" + this.formModel.id, {trigger: true});
            },

            editClick: function (e) {
                var maxlength = $("#" + $(e.target).parent().parent()[0].id).find(".no-long").attr("data-maxlength") || 32;

                e.preventDefault();
                $('.quickEdit #editInput').remove();
                $('.quickEdit #cancelSpan').remove();
                $('.quickEdit #saveSpan').remove();
                if (this.prevQuickEdit) {
                    if ($('#' + this.prevQuickEdit.id).hasClass('quickEdit')) {
                        if ($('#' + this.prevQuickEdit.id).hasClass('with-checkbox')) {
                            $('#' + this.prevQuickEdit.id + ' input').prop('disabled', true).prop('checked', ($('#' + this.prevQuickEdit.id + ' input').prop('checked') ? 'checked' : ''));
                            $('.quickEdit').removeClass('quickEdit');
                        } else if (this.prevQuickEdit.id == 'email') {
                            $("#" + this.prevQuickEdit.id).append('<a href="mailto:' + this.text + '">' + this.text + '</a>');
                            $('.quickEdit').removeClass('quickEdit');
                        } else {
                            $('.quickEdit').text(this.text ? this.text : "").removeClass('quickEdit');
                        }
                    }
                }
                var parent = $(e.target).parent().parent();
                $("#" + parent[0].id).addClass('quickEdit');
                $('#editSpan').remove();
                var objIndex = parent[0].id.split('_');
                if (objIndex.length > 1) {
                    this.text = this.formModel.get(objIndex[0])[objIndex[1]];
                } else {
                    this.text = this.formModel.get(objIndex[0]);
                }

                if (parent[0].id == 'invoiceDate') {
                    $("#" + parent[0].id).text('');
                    $("#" + parent[0].id).append('<input id="editInput" maxlength="48" type="text" readonly class="left has-datepicker"/>');
                    $('.has-datepicker').datepicker({
                        dateFormat : "d M, yy",
                        changeMonth: true,
                        changeYear : true,
                        yearRange  : '-100y:c+nn',
                        maxDate    : '-18y'
                    });
                } else if ($("#" + parent[0].id).hasClass('with-checkbox')) {
                    $("#" + parent[0].id + " input").removeAttr('disabled');
                } else {
                    $("#" + parent[0].id).text('');
                    $("#" + parent[0].id).append('<input id="editInput" maxlength="' + maxlength + '" type="text" class="left"/>');
                }
                $('#editInput').val(this.text);
                this.prevQuickEdit = parent[0];
                $("#" + parent[0].id).append('<span id="saveSpan"><a href="#">c</a></span>');
                $("#" + parent[0].id).append('<span id="cancelSpan"><a href="#">x</a></span>');
                $("#" + parent[0].id).find("#editInput").width($("#" + parent[0].id).find("#editInput").width() - 50);
            },

            saveCheckboxChange: function (e) {
                var parent = $(e.target).parent();
                var objIndex = parent[0].id.replace('_', '.');
                currentModel = this.model;
                currentModel[objIndex] = ($("#" + parent[0].id + " input").prop("checked"));
                this.formModel.save(currentModel, {
                    headers: {
                        mid: 56
                    },
                    patch  : true
                });
            },

            saveClick: function (e) {
                e.preventDefault();
                var self = this;
                var parent = $(e.target).parent().parent();
                var objIndex = parent[0].id.split('_'); //replace change to split;
                var currentModel = this.model;
                var newModel = {};
                var oldvalue = {};
                if (objIndex.length > 1) {
                    for (var i in this.formModel.toJSON()[objIndex[0]]) {
                        oldvalue[i] = this.formModel.toJSON()[objIndex[0]][i];

                    }

                    var param = currentModel.get(objIndex[0]) || {};
                    param[objIndex[1]] = $('#editInput').val();
                    newModel[objIndex[0]] = param;
                } else {
                    oldvalue = this.formModel.toJSON()[objIndex[0]];
                    newModel[objIndex[0]] = $('#editInput').val();
                }
                var valid = this.formModel.save(newModel, {
                    headers: {
                        mid: 39
                    },
                    patch  : true,
                    success: function (model) {
                        Backbone.history.fragment = "";
                        Backbone.history.navigate("#easyErp/Invoice/form/" + model.id, {trigger: true});
                    },
                    error  : function (model, response) {
                        if (response) {
                            alert(response.error);
                        }
                    }
                });
                if (!valid) {
                    newModel[objIndex[0]] = oldvalue;
                    this.formModel.set(newModel);
                }
            },

            /*editItem: function () {
             //create editView in dialog here
             new editView({ collection: this.collection });
             },*/

            /*personsSalesChecked: function (e) {
             if ($(e.target).get(0).tagName.toLowerCase() == "span") {
             $(e.target).parent().toggleClass("active");
             } else {
             $(e.target).toggleClass("active");
             }
             },*/

            /*gotoCompanyForm: function (e) {
             e.preventDefault();
             var id = $(e.target).closest("a").attr("data-id");
             window.location.hash = "#easyErp/Companies/form/" + id;
             },*/

            toggle: function () {
                this.$('#details').animate({
                    height: "toggle"
                }, 250, function () {

                });
            },

            render: function () {
                var formModel = this.formModel.toJSON();
                var el = this.$el;
                el.html(_.template(invoiceFormTemplate, formModel));
                //this.renderMiniOpp();
                //el.find('.formLeftColumn').append(
                //    new noteView({
                //        model: this.formModel
                //    }).render().el
                //);
                /*el.find('.formLeftColumn').append(
                 new attachView({
                 model: this.formModel
                 }).render().el
                 );*/
                $(window).on("resize", function () {
                    $("#editInput").width($("#editInput").parent().width() - 55);

                });
                return this;
            },

            editItem: function () {
                //create editView in dialog here
                new editView({model: this.formModel});
            },

            deleteItems: function () {
                //var mid = 39;
                this.formModel.destroy({
                    //headers: {
                    //    mid: mid
                    //},
                    success: function () {
                        Backbone.history.navigate("#easyErp/Invoice/list", {trigger: true});
                    },
                    error  : function (model, err) {
                        if (err.status === 403) {
                            alert("You do not have permission to perform this action");
                        }
                    }
                });

            }
        });

        return invoiceTasksView;
    });
