define([
        "text!templates/projectDashboard/DashboardTemplate.html",
        "text!templates/projectDashboard/ProjectDashboard.html",
        'collections/Projects/projectInfoCollection',
        "custom",
        "dataService",
        "helpers"
    ],
    function (DashboardTemplate, projectTemplate, contentCollection, custom, dataService, helpers) {
        var ContentView = Backbone.View.extend({
            contentType: "Dashboard",
            actionType : "Content",
            template   : _.template(DashboardTemplate),
            el         : '#content-holder',
            initialize : function (options) {
                this.startTime = options.startTime;
                this.render();
            },
            events     : {
                "click .choseDateRange .item": "newRange",
                "click .oe_sortable"         : "goSort"
            },

            goSort: function (e) {
                var target$;
                var currentParrentSortClass;
                var sortClass;
                var sortConst;
                var sortBy;
                var sortObject;

                this.collection.unbind('reset');

                target$ = $(e.target).closest('th');
                currentParrentSortClass = target$.attr('class');
                sortClass = currentParrentSortClass.split(' ')[1];
                sortConst = 1;
                sortBy = target$.data('sort');
                sortObject = {};

                if (!sortClass) {
                    target$.addClass('sortDn');
                    sortClass = "sortDn";
                }
                switch (sortClass) {
                    case "sortDn":
                    {
                        target$.parent().find("th").removeClass('sortDn').removeClass('sortUp');
                        target$.removeClass('sortDn').addClass('sortUp');
                        sortConst = 1;
                    }
                        break;
                    case "sortUp":
                    {
                        target$.parent().find("th").removeClass('sortDn').removeClass('sortUp');
                        target$.removeClass('sortUp').addClass('sortDn');
                        sortConst = -1;
                    }
                        break;
                }
                sortObject[sortBy] = sortConst;

                this.fetchSortCollection(sortObject);
            },

            fetchSortCollection: function (sortObject) {
                this.sort = sortObject;
                this.collection = new contentCollection({
                    sort: sortObject
                });
                this.collection.bind('reset', this.renderContent, this);
            },

            populateProjectForDashboard: function (url, callback) {
                dataService.getData(url, {}, function (response) {
                    if (callback) {
                        callback(response);
                    }
                });
            },

            renderProjectPM: function () {
                var template = _.template(projectTemplate);

                if (App.cashedData && App.cashedData.projectInfo) {
                    this.collection = custom.retriveFromCash('projectInfo');

                    $("#ProjectPMContent").html(template({
                        collection      : this.collection.toJSON(),
                        startNumber     : 0,
                        currencySplitter: helpers.currencySplitter,
                        weekSplitter    : helpers.weekSplitter
                    }));
                    if (this.collection.length == 0) {
                        $(".projectInProgress").hide();
                    }
                    else {
                        $(".projectInProgress").show();
                    }
                } else {
                    this.collection = new contentCollection({});

                    custom.cacheToApp('projectInfo', this.collection);
                }

                this.collection.bind('reset', this.renderContent, this);
            },

            renderContent: function () {
                var template = _.template(projectTemplate);

                custom.cacheToApp('projectInfo', this.collection);

                $("#ProjectPMContent").html(template({
                    collection      : this.collection.toJSON(),
                    startNumber     : 0,
                    currencySplitter: helpers.currencySplitter,
                    weekSplitter    : helpers.weekSplitter
                }));
                if (this.collection.length == 0) {
                    $(".projectInProgress").hide();
                }
                else {
                    $(".projectInProgress").show();
                }
            },

            renderProjectStatus: function () {
                var self = this;
                this.populateProjectForDashboard("/getProjectStatusCountForDashboard", function (collection) {
                    var n = collection.workflow.length;
                    var k = collection.data.length;
                    $("#projectStatus").append("<tr></tr>");
                    for (var i = 0; i < n; i++) {
                        $("#projectStatus tr").append("<th>" + collection.workflow[i].name + "</th>");
                    }
                    $("#projectStatus").append("<tr></tr>");
                    for (var i = 0; i < n; i++) {
                        var s = 0;
                        for (var j = 0; j < k; j++) {
                            if (collection.workflow[i]._id == collection.data[j]._id) {
                                s = collection.data[j].count;
                                break;
                            }
                        }
                        $("#projectStatus tr").eq(1).append("<td>" + s + "</td>");
                    }

                });
            },
            renderProjectEnd   : function () {
                var self = this;
                this.populateProjectForDashboard("/getProjectByEndDateForDashboard", function (data) {
                    data = data.data;
                    var k = 0;
                    data.This.forEach(function (item) {
                        k++;
                        if (item.projectmanager) {
                            $("#projectEndTW").find("tr").eq(0).after("<tr><td>" + k + "</td><td><a href='#easyErp/Employees/form/" + item.projectmanager._id + "'>" + item.projectmanager.name + "</a></td><td><a href='#easyErp/Tasks/list/pId=" + item._id + "'>" + item.projectName + "</a></td><td class='health-wrapper'><a href='javascript:;' class='center health" + item.health + "'></a></td></tr>");
                        }
                    });
                    if (data.This.length === 0) {
                        $("#projectEndTW").hide();
                    }
                    else {
                        $("#projectEndTW").show();
                    }

                    k = 0;
                    data.Next.forEach(function (item) {
                        k++;
                        $("#projectEndNW").find("tr").eq(0).after("<tr><td>" + k + "</td><td><a href='#easyErp/Employees/form/" + item.projectmanager._id + "'>" + item.projectmanager.name + "</a></td><td><a href='#easyErp/Tasks/list/pId=" + item._id + "'>" + item.projectName + "</a></td><td class='health-wrapper'><a href='javascript:;' class='center health" + item.health + "'></a></td></tr>");
                    });
                    if (data.Next.length === 0) {
                        $("#projectEndNW").hide();
                    }
                    else {
                        $("#projectEndNW").show();
                    }

                    k = 0;
                    data.Next2.forEach(function (item) {
                        k++;
                        $("#projectEndN2W").find("tr").eq(0).after("<tr><td>" + k + "</td><td><a href='#easyErp/Employees/form/" + item.projectmanager._id + "'>" + item.projectmanager.name + "</a></td><td><a href='#easyErp/Tasks/list/pId=" + item._id + "'>" + item.projectName + "</a></td><td class='health-wrapper'><a href='javascript:;' class='center health" + item.health + "'></a></td></tr>");
                    });
                    if (data.Next2.length === 0) {
                        $("#projectEndN2W").hide();
                    }
                    else {
                        $("#projectEndN2W").show();
                    }

                });
            },

            render: function () {
                this.$el.html(this.template());
                this.renderProjectPM();
                //this.renderProjectStatus();
                //this.renderProjectEnd();
                this.$el.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
            }
        });
        return ContentView;
    }
);
