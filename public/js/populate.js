define([
        "dataService",
        'text!templates/main/selectTemplate.html'
    ],
    function (dataService, selectTemplate) {
        var dataFormServer = {};

        var get = function (id, url, data, field, content, isCreate, canBeEmpty, parrrentContentId) {
            dataService.getData(url, data, function (response) {
                content.responseObj[id] = [];
                if (canBeEmpty) {
                    content.responseObj[id].push({_id: "", name: "Select"});
                }
                content.responseObj[id] = content.responseObj[id].concat(_.map(response.data, function (item) {
                    return {_id: item._id, name: item[field], level: item.projectShortDesc || ""};
                }));

                if (isCreate) {
                    $(id).text(content.responseObj[id][0].name).attr("data-id", content.responseObj[id][0]._id);
                }
                if (parrrentContentId && parrrentContentId.split("=").length === 2) {
                    parrrentContentId = parrrentContentId.split("=")[1]
                }
                if (parrrentContentId) {
                    var current = _.filter(response.data, function (item) {
                        return item._id === parrrentContentId;
                    });
                    $(id).text(current[0][field]).attr("data-id", current[0]._id);
                }
            });
        };

        var getParrentDepartment = function (id, url, data, content, isCreate, canBeEmpty) {
            dataService.getData(url, data, function (response) {
                content.responseObj[id] = [];
                if (canBeEmpty) {
                    content.responseObj[id].push({_id: "", name: "Select"});
                }
                content.responseObj[id] = content.responseObj[id].concat(_.map(response.data, function (item) {
                    return {
                        _id: item._id,
                        name: item.departmentName,
                        level: item.nestingLevel,
                        parentDepartment: item.parentDepartment
                    };
                }));
                if (isCreate) {
                    $(id).text(content.responseObj[id][0].name).attr("data-id", content.responseObj[id][0]._id);
                }
            });
        };

        var getPriority = function (id, content, isCreate) {
            dataService.getData("/Priority", {}, function (response) {
                content.responseObj[id] = _.map(response.data, function (item) {
                    return {_id: item.priority, name: item.priority};
                });
                if (isCreate) {
                    $(id).text(content.responseObj[id][2].name).attr("data-id", content.responseObj[id][2]._id);
                }

            });
        };

        var getWorkflow = function (nameId, statusId, url, data, field, content, isCreate, callback) {
            dataService.getData(url, data, function (response) {
                content.responseObj[nameId] = _.map(response.data, function (item) {
                    return {_id: item._id, name: item[field], status: item.status};
                });
                var wNames = $.map(response.data, function (item) {
                    return item.wName;
                });
                wNames = _.uniq(wNames);
                content.responseObj[statusId] = $.map(wNames, function (wName) {
                    return {_id: wName, name: wName};
                });

                if (isCreate) {
                    $(nameId).text(content.responseObj[nameId][0].name).attr("data-id", content.responseObj[nameId][0]._id);
                    $(statusId).text(content.responseObj[statusId][0].name).attr("data-id", content.responseObj[statusId][0]._id);
                }
                if (callback)callback(content.responseObj[nameId]);
            });
        };

        var get2name = function (id, url, data, content, isCreate, canBeEmpty, parrrentContentId) {
            dataService.getData(url, data, function (response) {
                content.responseObj[id] = [];
                if (canBeEmpty) {
                    content.responseObj[id].push({_id: "", name: "Select"});
                }
                content.responseObj[id] = content.responseObj[id].concat(_.map(response.data, function (item) {
                    return {_id: item._id, name: item.name.first + " " + item.name.last};
                }));

                if (isCreate) {
                    $(id).text(content.responseObj[id][0].name).attr("data-id", content.responseObj[id][0]._id);
                }
                if (parrrentContentId) {
                    var current = _.filter(response.data, function (item) {
                        return item._id == parrrentContentId;
                    });
                    $(id).text(current[0].name.first + " " + current[0].name.last).attr("data-id", current[0]._id);
                }
            });
        };
        var getCompanies = function (id, url, data, content, isCreate, canBeEmpty, parrrentContentId) {
            dataService.getData(url, data, function (response) {
                content.responseObj[id] = [];
                if (canBeEmpty) {
                    content.responseObj[id].push({_id: "", name: "Select"});
                }
                content.responseObj[id] = content.responseObj[id].concat(_.map(response.data, function (item) {
                    return {_id: item._id, name: item.name.first};
                }));

                if (isCreate) {
                    $(id).text(content.responseObj[id][0].name).attr("data-id", content.responseObj[id][0]._id);
                }
                if (parrrentContentId) {
                    var current = _.filter(response.data, function (item) {
                        return item._id == parrrentContentId;
                    });
                    $(id).text(current[0].name.first).attr("data-id", current[0]._id);
                }
            });
        };

        var showSelect = function (e, prev, next, context) {
            var data = context.responseObj["#" + $(e.target).attr("id")];
            var elementVisible = 10;
            var newSel = $(e.target).parent().find(".newSelectList");
            if (prev || next) {
                newSel = $(e.target).closest(".newSelectList");
                data = context.responseObj["#" + newSel.parent().find(".current-selected").attr("id")];
            }
            var parent = newSel.length > 0 ? newSel.parent() : $(e.target).parent();
            var currentPage = 1;
            if (newSel.length && newSel.is(":visible") && !prev && !next) {
                newSel.hide();
                return;
            }
            $(".newSelectList").hide();
            if ((prev || next) && newSel.length) {
                currentPage = newSel.data("page");
                newSel.remove();
            }
            else if (newSel.length) {
                newSel.show();
                return;
            }
            if (prev) currentPage--;
            if (next) currentPage++;
            var s = "<ul class='newSelectList' data-page='" + currentPage + "'>";
            var start = (currentPage - 1) * elementVisible;
            var end = Math.min(currentPage * elementVisible, data.length);
            var allPages = Math.ceil(data.length / elementVisible);
            parent.append(_.template(selectTemplate, {
                collection: data.slice(start, end),
                currentPage: currentPage,
                allPages: allPages,
                start: start,
                end: end,
                dataLength: data.length,
                elementVisible: elementVisible,
            }));
        };

        var showProductsSelect = function (e, prev, next, context) {
            var data = context.responseObj[".productsDd"];
            var elementVisible = 10;
            var newSel = $(e.target).parent().find(".newSelectList");
            if (prev || next) {
                newSel = $(e.target).closest(".newSelectList");
                data = context.responseObj["#" + newSel.parent().find(".current-selected").attr("id")];
            }
            var parent = newSel.length > 0 ? newSel.parent() : $(e.target).parent();
            var currentPage = 1;
            if (newSel.length && newSel.is(":visible") && !prev && !next) {
                newSel.hide();
                return;
            }
            $(".newSelectList").hide();
            if ((prev || next) && newSel.length) {
                currentPage = newSel.data("page");
                newSel.remove();
            }
            else if (newSel.length) {
                newSel.show();
                return;
            }
            if (prev) currentPage--;
            if (next) currentPage++;
            var s = "<ul class='newSelectList' data-page='" + currentPage + "'>";
            var start = (currentPage - 1) * elementVisible;
            var end = Math.min(currentPage * elementVisible, data.length);
            var allPages = Math.ceil(data.length / elementVisible);

            parent.append(_.template(selectTemplate, {
                collection: data.slice(start, end),
                currentPage: currentPage,
                allPages: allPages,
                start: start,
                end: end,
                dataLength: data.length,
                elementVisible: elementVisible,
            }));
        };

        var showSelectPriority = function (e, prev, next, context) {
            var data = context.responseObj["#priority"];
            var elementVisible = 25;
            var newSel = $(e.target).parent().find(".newSelectList");
            if (prev || next) {
                newSel = $(e.target).closest(".newSelectList");
                data = context.responseObj["#" + newSel.parent().find(".current-selected").attr("id")];
            }
            var parent = newSel.length > 0 ? newSel.parent() : $(e.target).parent();
            var currentPage = 1;
            if (newSel.length && newSel.is(":visible") && !prev && !next) {
                newSel.hide();
                return;
            }
            $(".newSelectList").hide();
            if ((prev || next) && newSel.length) {
                currentPage = newSel.data("page");
                newSel.remove();
            }
            else if (newSel.length) {
                newSel.show();
                return;
            }
            if (prev) currentPage--;
            if (next) currentPage++;
            var s = "<ul class='newSelectList' data-page='" + currentPage + "'>";
            var start = (currentPage - 1) * elementVisible;
            var end = Math.min(currentPage * elementVisible, data.length);
            var allPages = Math.ceil(data.length / elementVisible);
            parent.append(_.template(selectTemplate, {
                collection: data.slice(start, end),
                currentPage: currentPage,
                allPages: allPages,
                start: start,
                end: end,
                dataLength: data.length,
                elementVisible: elementVisible,
                level: data.level
            }));
        };
        return {
            get: get,
            get2name: get2name,
            getPriority: getPriority,
            getWorkflow: getWorkflow,
            showSelect: showSelect,
            getParrentDepartment: getParrentDepartment,
            getCompanies: getCompanies,
            showSelectPriority: showSelectPriority,
            showProductsSelect: showProductsSelect
        };
    });
