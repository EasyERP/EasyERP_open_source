define([
    'text!templates/Companies/form/FormTemplate.html',
    'views/Companies/EditView',
    'views/Opportunities/compactContent',
    'views/Persons/compactContent',
    'custom',
    'common',
    "dataService",
    'views/Notes/NoteView',
    'views/Notes/AttachView',
    'views/Opportunities/CreateView',
    'views/Persons/CreateView'
],

    function (CompaniesFormTemplate, EditView, opportunitiesCompactContentView, personsCompactContentView, Custom, common, dataService, noteView, attachView, CreateViewOpportunities, CreateViewPersons) {
        var FormCompaniesView = Backbone.View.extend({
            el: '#content-holder',
            initialize: function (options) {
                _.bindAll(this, 'render');
                this.formModel = options.model;
                this.formModel.urlRoot = "/Companies";
                this.pageMini = 1;
                this.pageCount = 4;
                this.allMiniOpp = 0;
                this.allPages = 0;

                this.pageMiniPersons = 1;
                this.pageCountPersons = 4;
                this.allMiniPersons = 0;
                this.allPagesPersons = 0;

                var self = this;
                var formModel = this.formModel.toJSON();
                common.populateOpportunitiesForMiniView("/OpportunitiesForMiniView", null, formModel._id, this.pageMini, this.pageCount, true, function (count) {
                    self.allMiniOpp = count.listLength;
                    self.allPages = Math.ceil(self.allMiniOpp / self.pageCount);
                    if (self.allPages == self.pageMini) {
                        $(".miniPagination .next").addClass("not-active");
                        $(".miniPagination .last").addClass("not-active");
                    }
                    if (self.allPages === 1) {
                        $(".miniPagination").hide();
                    }
                });
                this.populatePersonsForMiniView("/getPersonsForMiniView", formModel._id, this.pageMiniPersons, this.pageCountPersons, true, function (count) {
                    self.allMiniPersons = count.listLength;
                    self.allPagesPersons = Math.ceil(self.allMiniPersons / self.pageCountPersons);
                    if (self.allPagesPersons == self.pageMiniPersons) {
                        $(".miniPaginationPersons .next").addClass("not-active");
                        $(".miniPaginationPersons .last").addClass("not-active");
                    }
                    if (self.allPagesPersons === 1) {
                        $(".miniPaginationPersons").hide();
                    }
                });
            },
            flag: true,
            events: {
                "click #tabList a": "switchTab",
                "click .details": "toggle",
                "mouseover .social a": "socialActive",
                "mouseout .social a": "socialNotActive",
                "mouseenter .editable:not(.quickEdit)": "quickEdit",
                "mouseleave .editable": "removeEdit",
                "click #editSpan": "editClick",
                "click #cancelSpan": "cancelClick",
                "click #saveSpan": "saveClick",
                "click .btnHolder .add.opportunities": "addOpportunities",
                "click .btnHolder .add.persons": "addPersons",
                "click .miniPagination .next:not(.not-active)": "nextMiniPage",
                "click .miniPagination .prev:not(.not-active)": "prevMiniPage",
                "click .miniPagination .first:not(.not-active)": "firstMiniPage",
                "click .miniPagination .last:not(.not-active)": "lastMiniPage",
                "click .miniPaginationPersons .nextPersons:not(.not-active)": "nextMiniPagePersons",
                "click .miniPaginationPersons .prevPersons:not(.not-active)": "prevMiniPagePersons",
                "click .miniPaginationPersons .firstPersons:not(.not-active)": "firstMiniPagePersons",
                "click .miniPaginationPersons .lastPersons:not(.not-active)": "lastMiniPagePersons"

            },
            nextMiniPagePersons: function () {
                this.pageMiniPersons += 1;
                this.renderMiniPersons();
            },
            prevMiniPagePersons: function () {
                this.pageMiniPersons -= 1;
                this.renderMiniPersons();
            },
            firstMiniPagePersons: function () {
                this.pageMiniPersons = 1;
                this.renderMiniPersons();
            },
            lastMiniPagePersons: function () {
                this.pageMiniPersons = this.allPagesPersons;
                this.renderMiniPersons();
            },

            nextMiniPage: function () {
                this.pageMini += 1;
                this.renderMiniOpp();
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
            populatePersonsForMiniView: function (url, companyId, page, count, onlyCount, callback) {
                var self = this;
                dataService.getData(url, { companyId: companyId, page: page, count: count, onlyCount: onlyCount }, function (response) {
                    if (callback) callback(response);
                });
            },
            renderMiniPersons: function () {
                var self = this;
                var formModel = this.formModel.toJSON();
                this.populatePersonsForMiniView("/getPersonsForMiniView", formModel._id, this.pageMiniPersons, this.pageCountPersons, false, function (collection) {
                    var isLast = self.pageMiniPersons == self.allPagesPersons ? true : false;
                    var perElem = self.$el.find('#persons');
                    perElem.empty();
                    perElem.append(
                        new personsCompactContentView({
                            collection: collection.data
                        }).render({ first: self.pageMiniPersons == 1 ? true : false, last: isLast, all: self.allPagesPersons }).el
                    );
                });
            },
            renderMiniOpp: function () {
                var self = this;
                var formModel = this.formModel.toJSON();
                common.populateOpportunitiesForMiniView("/OpportunitiesForMiniView", null, formModel._id, this.pageMini, this.pageCount, false, function (collection) {
                    var isLast = self.pageMini == self.allPages ? true : false;
                    var oppElem = self.$el.find('#opportunities');
                    oppElem.empty();
                    oppElem.prepend(
                        new opportunitiesCompactContentView({
                            collection: collection.data
                        }).render({ first: self.pageMini == 1 ? true : false, last: isLast, all: self.allPages }).el
                    );
                });
            },
            render: function () {
                var formModel = this.formModel.toJSON();
                this.$el.html(_.template(CompaniesFormTemplate, formModel));
                this.renderMiniOpp();
                this.renderMiniPersons();
                this.$el.find('.formLeftColumn').append(
                        new noteView({
                            model: this.formModel
                        }).render().el
                    );
                this.$el.find('.formLeftColumn').append(
                    new attachView({
                        model: this.formModel
                    }).render().el
                );

				$(window).on("resize",function(){
					$("#editInput").width($("#editInput").parent().width() - 55);

				});
                return this;
            },

            editItem: function () {
                new EditView({ model: this.formModel });
            },

            quickEdit: function (e) {
                var trId = $(e.target).closest("dd");
                if ($("#" + trId.attr("id")).find("#editSpan").length === 0) {
                    $("#" + trId.attr("id")).append('<span id="editSpan" class=""><a href="#">e</a></span>');
                    if ($("#" + trId.attr("id")).width() - 40 < $("#" + trId.attr("id")).find(".no-long").width()) {
                        $("#" + trId.attr("id")).find(".no-long").width($("#" + trId.attr("id")).width() - 40);
                    }
                }
            },

            addOpportunities: function (e) {
                var model;

                e.preventDefault();

                model = this.formModel.toJSON();

                new CreateViewOpportunities({
                    model: model,
                    elementId: 'companyAttach'
                });
            },

            addPersons: function (e) {
                e.preventDefault();
                var model = this.formModel.toJSON();
                new CreateViewPersons({ model: model });
            },

            removeEdit: function (e) {
                $('#editSpan').remove();
                $("dd .no-long").css({ width: "auto" });
            },

            cancelClick: function (e) {
                e.preventDefault();
                Backbone.history.fragment = "";
                Backbone.history.navigate("#easyErp/Companies/form/" + this.formModel.id, { trigger: true });
            },

            editClick: function (e) {
                e.preventDefault();
                var maxlength = $("#" + $(e.target).parent().parent()[0].id).find(".no-long").attr("data-maxlength") || 32;
                $('.quickEdit #editInput').remove();
                $('.quickEdit #cancelSpan').remove();
                $('.quickEdit #saveSpan').remove();
                $('.quickEdit').text(this.text).removeClass('quickEdit');
                var parent = $(e.target).parent().parent();
                $("#" + parent[0].id).addClass('quickEdit');
                $('#editSpan').remove();
                this.text = $('#' + parent[0].id).text();
                $("#" + parent[0].id).text('');
                $("#" + parent[0].id).append('<input id="editInput" maxlength="' + maxlength + '" type="text" class="left"/>');
                $('#editInput').val(this.text);
                $("#" + parent[0].id).append('<span id="saveSpan"><a href="#">c</a></span>');
                $("#" + parent[0].id).append('<span id="cancelSpan"><a href="#">x</a></span>');
                $("#" + parent[0].id).find("#editInput").width($("#" + parent[0].id).find("#editInput").width() - 50);
            },

            saveClick: function (e) {
                e.preventDefault();
                var parent = $(e.target).parent().parent();
                var objIndex = parent[0].id.split('_');
                var currentModel = this.formModel;
                var newModel = {};
				var oldvalue = {};
                if (objIndex.length > 1) {
					for (var i in this.formModel.toJSON()[objIndex[0]]){
						oldvalue[i] = this.formModel.toJSON()[objIndex[0]][i];
					}
                    var param = currentModel.get(objIndex[0]) || {};
                    param[objIndex[1]] = $('#editInput').val().replace('http://', '');
                    newModel[objIndex[0]] = param;
                } else {
					oldvalue = this.formModel.toJSON()[objIndex[0]];
                    newModel[objIndex[0]] = $('#editInput').val().replace('http://', '');
                }
                var valid = this.formModel.save(newModel, {
                    headers: {
                        mid: 39
                    },
                    patch: true,
                    success: function (model) {
                        Backbone.history.fragment = "";
                        Backbone.history.navigate("#easyErp/Companies/form/" + model.id, { trigger: true });
                    },
                    error: function (model, response) {
                        if (response)
                            alert(response.error);
                    }
                });
				if (!valid){
					newModel[objIndex[0]] = oldvalue;
					this.formModel.set(newModel);
				}
            },

            toggle: function () {
                this.$('#details').animate({
                    height: "toggle"
                }, 250, function () {
                });
            },
            socialActive: function (e) {
                e.preventDefault();
                $(e.target).stop().animate({
                    'background-position-y': '-38px'
                }, 300, function () { });
            },
            socialNotActive: function (e) {
                e.preventDefault();
                $(e.target).stop().animate({
                    'background-position-y': '0px'

                }, 300, function () { });
            },
            switchTab: function (e) {
                e.preventDefault();
                var link = this.$("#tabList a");
                if (link.hasClass("selected")) {
                    link.removeClass("selected");
                }
                var index = link.index($(e.target).addClass("selected"));
                this.$(".tab").hide().eq(index).show();
            },

            deleteItems: function () {
                var mid = 39;
                this.formModel.destroy({
                    headers: {
                        mid: mid
                    },
                    success: function () {
                        Backbone.history.navigate("#easyErp/Companies/thumbnails", { trigger: true });
                    },
                    error: function (model, err) {
                        if (err.status === 403) {
                            alert("You do not have permission to perform this action");
                        }
                    }

                });

            }
        });
        return FormCompaniesView;
    });