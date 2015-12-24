define([
        "text!templates/Profiles/ProfileListTemplate.html",
        "views/Profiles/ModulesAccessView",
        "views/Profiles/CreateView"
    ],
    function (ProfileListTemplate, ModulesAccessView, CreateView) {
        var ContentView = Backbone.View.extend({
            el                : '#content-holder',
            contentType       : "Profiles",
            actionType        : "Content",
            initialize        : function (options) {
                this.startTime = options.startTime;
                this.profilesCollection = options.collection;
                this.profilesCollection.bind('add', _.bind(this.render, this));
                this.profilesCollection.bind('reset', _.bind(this.render, this));
                this.render();
            },
            events            : {
                "click .profile-list li a"                    : "viewProfileDetails",
                "click .editProfile"                          : "editProfile",
                "click #newProfileBtn"                        : "createProfile",
                "click #modulesAccessTable tr th input"       : "checkUncheck",
                "click #modulesAccessTable tr.parent"         : "showChild",
                "click #modulesAccessTable tr.parent td input": "checkUncheckChild",
                "click #modulesAccessTable tr.child td input" : "checkUncheckParent"
            },
            checkUncheckParent: function (e) {
                var td = $(e.target).parent();
                if ($(e.target).prop("checked")) {
                    var n = $(e.target).parent().parent().find("td").index($(e.target).parent());
                    var cur = $(e.target).closest(".child");
                    while (cur.prev().hasClass("child")) {
                        cur = cur.prev();
                    }
                    cur = cur.prev();
                    cur.find("td").eq(n).find("input").prop("checked", true);
                    while (td && td.prev() && td.prev().get(0) && td.prev().get(0).tagName == "TD") {
                        td.prev().find("input").prop("checked", true);
                        td = td.prev();
                    }

                } else {
                    while (td && td.next() && td.next().get(0) && td.next().get(0).tagName == "TD") {
                        td.next().find("input").prop("checked", false);
                        td = td.next();
                    }
                }
            },
            checkUncheckChild : function (e) {
                var n = $(e.target).parent().parent().find("td").index($(e.target).parent());
                var cur = $(e.target).closest(".parent");
                while (cur.next().hasClass("child")) {
                    cur.next().find("td").eq(n).find("input").prop("checked", $(e.target).prop("checked"));
                    cur = cur.next();
                }
                var td = $(e.target).parent();
                if ($(e.target).prop("checked")) {
                    while (td && td.prev() && td.prev().get(0) && td.prev().get(0).tagName == "TD") {
                        td.prev().find("input").prop("checked", true);
                        n = $(e.target).parent().parent().find("td").index(td.prev());
                        cur = td.prev().closest(".parent");
                        while (cur.next().hasClass("child")) {
                            cur.next().find("td").eq(n).find("input").prop("checked", td.prev().find("input").prop("checked"));
                            cur = cur.next();
                        }
                        td = td.prev();
                    }

                } else {
                    while (td && td.next() && td.next().get(0) && td.next().get(0).tagName == "TD") {
                        td.next().find("input").prop("checked", false);
                        n = $(e.target).parent().parent().find("td").index(td.next());
                        cur = td.next().closest(".parent");
                        while (cur.next().hasClass("child")) {
                            cur.next().find("td").eq(n).find("input").prop("checked", td.next().find("input").prop("checked"));
                            cur = cur.next();
                        }
                        td = td.next();
                    }
                }
            },

            showChild         : function (e) {
                if (!$(e.target).is("input")) {
                    var cur = $(e.target).closest(".parent");
                    while (cur.next().hasClass("child")) {
                        cur.next().toggleClass("visible");
                        cur = cur.next();
                    }
                }
            },
            checkUncheck      : function (e) {
                var n = $("#modulesAccessTable tr th").index($(e.target).parent());
                $("#modulesAccessTable tr").each(function () {
                    $(this).find("td").eq(n).find("input").prop("checked", $(e.target).prop("checked"));
                });

            },
            createItem        : function () {
                new CreateView({collection: this.profilesCollection});
            },
            editProfileDetails: function () {
                var selectedProfileId = $('#profilesList > li.active > a').data('id');
                if (selectedProfileId == "1387275598000" || selectedProfileId == "1387275504000") {
                    App.render({
                        type: 'error',
                        message: "You cannot edit this Profile!"
                    });
                    return;
                }
                $('#profilesList li.active a').hide();
                $('#profilesList li.active').append("<div class='editProfileContainer'><input type='text' class='editProfileName' maxlength='12' value='" + $('#profilesList > li.active > a').text().replace(" Profile", "") + "'/></div>");

                $('#top-bar-saveBtn').show();
                $('#top-bar-editBtn').hide();
                $("#modulesAccessTable tr input").prop("disabled", false);
            },

            viewProfileDetails: function (e) {
                $('#top-bar-editBtn').show();
                $('#top-bar-deleteBtn').show();

                //Hide Save Button and disable inputs
                $('#top-bar-saveBtn').hide();
                $("#modulesAccessTable tr input").prop("disabled", true);
                if ($('#profilesList li.active .editProfileContainer').length > 0) {
                    $('#profilesList li.active .editProfileContainer').remove();
                    $('#profilesList li.active a').show();

                }
                e.preventDefault();
                $("#modulesAccessTable").hide();
                var currentLi = $(e.target).closest("li");
                $(currentLi).parent().find(".active").removeClass("active");
                $(currentLi).addClass("active");
                var id = $(currentLi).find("a").data("id");
                this.profileId = id;
                this.profile = this.profilesCollection.get(this.profileId);
                $("#modulesAccessTable").find("tbody").empty();
                var pr = this.profile.toJSON().profileAccess;
                var b1 = true;
                var b2 = true;
                var b3 = true;
                for (var i = 0; i < pr.length; i++) {
                    if (!pr[i].module.parrent) {

                        var c1 = "";
                        var c2 = "";
                        var c3 = "";
                        if (pr[i].access.read) {
                            c1 = 'checked="checked"';
                        } else {
                            b1 = false;
                        }
                        if (pr[i].access.editWrite) {
                            c2 = 'checked="checked"';
                        } else {
                            b2 = false;
                        }
                        if (pr[i].access.del) {
                            c3 = 'checked="checked"';
                        } else {
                            b3 = false;
                        }
                        $("#modulesAccessTable").find("tbody").append('<tr class="parent" data-i="' + i + '"><td class="mname">' + pr[i].module.mname + '</td><td><input type="checkbox" class="read" ' + c1 + ' disabled/></td><td><input type="checkbox" class="write" ' + c2 + ' disabled/></td><td><input type="checkbox" class="delete" ' + c3 + ' disabled/></td></tr>');
                        for (var j = 0; j < pr.length; j++) {
                            if (pr[i].module._id == pr[j].module.parrent) {
                                c1 = "";
                                c2 = "";
                                c3 = "";
                                if (pr[j].access.read) {
                                    c1 = 'checked="checked"';
                                } else {
                                    b1 = false;
                                }
                                if (pr[j].access.editWrite) {
                                    c2 = 'checked="checked"';
                                } else {
                                    b2 = false;
                                }
                                if (pr[j].access.del) {
                                    c3 = 'checked="checked"';
                                } else {
                                    b3 = false;
                                }
                                $("#modulesAccessTable").find("tbody").append('<tr class="child" data-i="' + j + '"><td class="mname">' + pr[j].module.mname + '</td><td><input type="checkbox" class="read" ' + c1 + '  disabled/></td><td><input type="checkbox" class="write" ' + c2 + ' disabled/></td><td><input type="checkbox" class="delete" ' + c3 + ' disabled/></td></tr>');
                            }
                        }
                    }
                }
                $("#modulesAccessTable tr th").eq(1).find("input").prop("checked", b1);
                $("#modulesAccessTable tr th").eq(2).find("input").prop("checked", b2);
                $("#modulesAccessTable tr th").eq(3).find("input").prop("checked", b3);
                $("#modulesAccessTable").show();

                return false;
            },

            editItem: function () {
                $('#saveDiscardHolder').show();
                $('#createBtnHolder').hide();
                var selectedProfile = $('.profile li.active a').text().replace(' Profile', '');
                if (selectedProfile) {
                    this.modulesView = new ModulesAccessView({
                        action            : "edit",
                        profileName       : selectedProfile,
                        profilesCollection: this.profilesCollection
                    });
                }
                this.modulesView.render();
            },

            saveProfile: function () {
                var self = this;
                var selectedProfileId = $('#profilesList > li.active > a').data('id');
                var profile = this.profilesCollection.get(selectedProfileId);
                var jsonProfile = profile.toJSON();
                var tableContent = $('#modulesAccessTable tbody');
                var readAccess = tableContent.find('input.read:checkbox').map(function () {
                    return {checked: this.checked, index: $(this).closest("tr").attr("data-i")};
                }).get();
                var writeAccess = tableContent.find('input.write:checkbox').map(function () {
                    return {checked: this.checked, index: $(this).closest("tr").attr("data-i")};
                }).get();
                var deleteAccess = tableContent.find('input.delete:checkbox').map(function () {
                    return {checked: this.checked, index: $(this).closest("tr").attr("data-i")};
                }).get();
                $("#modulesAccessTable tr th input").prop("disabled", true);
                for (var i = 0, len = readAccess.length; i < len; i++) {
                    jsonProfile.profileAccess[readAccess[i].index].access.read = readAccess[i].checked;
                    jsonProfile.profileAccess[writeAccess[i].index].access.editWrite = writeAccess[i].checked;
                    jsonProfile.profileAccess[deleteAccess[i].index].access.del = deleteAccess[i].checked;
                }
                jsonProfile.profileName = $('#profilesList li.active .editProfileContainer input').val();
                profile.save(jsonProfile,
                    {
                        headers: {
                            mid: 39
                        },
                        wait   : true,
                        success: function () {
                            $('#top-bar-saveBtn').hide();
                            $('#top-bar-editBtn').show();
                            var tableRows = $('#modulesAccessTable tbody tr');
                            for (var i = 0, len = tableRows.length; i < len; i++) {
                                $(tableRows[i]).find('.read').prop('disabled', true);
                                $(tableRows[i]).find('.write').prop('disabled', true);
                                $(tableRows[i]).find('.delete').prop('disabled', true);
                            }
                            $("#modulesAccessTable").show();
                            if ($('#profilesList li.active .editProfileContainer').length > 0) {
                                $('#profilesList li.active a').text($('#profilesList li.active .editProfileContainer input').val() + " Profile");
                                $('#profilesList li.active .editProfileContainer').remove();
                                $('#profilesList li.active a').show();

                            }

                        },
                        error  : function (model, xhr) {
                            self.errorNotification(xhr);
                        }

                    });
            },

            deleteItems: function () {
                var self = this;
                var selectedProfileId = $('#profilesList > li.active > a').data('id');
                if (!selectedProfileId) {
                    throw new Error("Could not delete profile. Id is undefined");
                }
                var model = this.profilesCollection.get(selectedProfileId);
                if (model) {
                    model.destroy({
                        headers: {
                            mid: 39
                        },
                        wait   : true,
                        success: function () {
                            self.profilesCollection.trigger('reset');
                            Backbone.history.fragment = "";
                            Backbone.history.navigate("#easyErp/Profiles", {trigger: true});
                        },
                        error  : function (model, xhr) {
                            self.errorNotification(xhr);
                        }
                    });
                }
                //Navigate to page to hide the edit and delete buttons

            },

            render: function () {
                this.$el.html(_.template(ProfileListTemplate,
                    {
                        profilesCollection: this.profilesCollection.toJSON(),
                        contentType       : this.contentType
                    }));
                this.$el.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
                return this;
            }
        });

        return ContentView;
    });
