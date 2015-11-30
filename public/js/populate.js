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
                        _id             : item._id,
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

        var getParrentCategory = function (id, url, data, content, isCreate, canBeEmpty) {
            dataService.getData(url, data, function (response) {
                content.responseObj[id] = [];
                if (canBeEmpty) {
                    content.responseObj[id].push({_id: "", name: "Select"});
                }
                content.responseObj[id] = content.responseObj[id].concat(_.map(response.data, function (item) {
                    return {
                        _id     : item._id,
                        name: item.name,
                        level: item.nestingLevel,
                        parent: item.parent,
                        fullName: item.fullName
                    };
                }));
                if (isCreate) {
                    $(id).text(content.responseObj[id][0].name).attr("data-id", content.responseObj[id][0]._id).attr("data-level", content.responseObj[id][0].level).attr("data-fullname", content.responseObj[id][0].fullName);
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

        var showSelect = function (e, prev, next, context, number) {
            e.stopPropagation();

            var targetEl = $(e.target);
            var attr = targetEl.closest('td').attr("data-content");
            var data = context.responseObj["#" + attr];
            var targetParent = $(e.target).parent();
            var elementVisible;
            var newSel;
            var parent;
            var currentPage = 1;
            var s;
            var start;
            var end;
            var allPages;

            if (!data){
                attr = targetEl.attr("id") || targetEl.attr("data-id");
                data = context.responseObj["#" + attr];
            }

            elementVisible = number || 10;

            if (targetParent.prop('tagName') !== 'TR') {
                newSel = targetParent.find(".newSelectList");
            } else {
                newSel = targetParent.find(".emptySelector");
            }

            if (prev || next) {
                newSel = $(e.target).closest(".newSelectList");
                if (!data) {
                    data = context.responseObj["#" + newSel.parent().find(".current-selected").attr("id")];
                }
            }

            parent = newSel.length > 0 ? newSel.parent() : $(e.target).parent();

            if (parent.prop('tagName') === 'TR') {
                parent = $(e.target);
            }

            if (newSel.length && newSel.is(":visible") && !prev && !next) {
                newSel.remove();
                return;
            }

            $(".newSelectList").hide(); //fixed by Liliya for generateWTracks

            if ((prev || next) && newSel.length) {
                currentPage = newSel.data("page");
                newSel.remove();
            } else if (newSel.length) {
                newSel.show();
                return;
            }

            if (prev) {
                currentPage--;
            }
            if (next) {
                currentPage++;
            }

            s = "<ul class='newSelectList' data-page='1'><li id='createJob'>Generate</li>";
            start = (currentPage - 1) * elementVisible;
            end = Math.min(currentPage * elementVisible, data.length);
            allPages = Math.ceil(data.length / elementVisible);

            if (data && data.length) {
                parent.append(_.template(selectTemplate, {
                    collection    : data.slice(start, end),
                    currentPage: currentPage,
                    allPages   : allPages,
                    start      : start,
                    end        : end,
                    dataLength : data.length,
                    elementVisible: elementVisible
                }));
            } else if(attr === 'jobs'){
                parent.append(s);
            }

            return false;
        };

        var employeesByDep = function (options) {
            options = options || {};

            var e = options.e;
            var targetEl;
            var attr;
            var data;
            var elementVisible;
            var targetParent;
            var newSel;

            var parent;
            var currentPage = 1;
            var s;
            var start;
            var end;
            var allPages;

            if (!e) {
                return;
            }

            e.stopPropagation();

            targetEl = $(e.target);
            data = context.responseObj["#employee"];

            targetParent = targetEl.parent();

            elementVisible = number || 10;

            if (targetParent.prop('tagName') !== 'TR') {
                newSel = targetParent.find(".newSelectList");
            } else {
                newSel = targetParent.find(".emptySelector");
            }

            if (prev || next) {
                newSel = $(e.target).closest(".newSelectList");

                if (!data) {
                    data = context.responseObj["#" + newSel.parent().find(".current-selected").attr("id")];
                }
            }

            parent = newSel.length > 0 ? newSel.parent() : $(e.target).parent();

            if (parent.prop('tagName') === 'TR') {
                parent = $(e.target);
            }

            if (newSel.length && newSel.is(":visible") && !prev && !next) {
                newSel.hide();
                return;
            }

            $(".newSelectList").hide();

            if ((prev || next) && newSel.length) {
                currentPage = newSel.data("page");
                newSel.remove();
            } else if (newSel.length) {
                newSel.show();
                return;
            }

            if (prev) {
                currentPage--;
            }
            if (next) {
                currentPage++;
            }

            s = "<ul class='newSelectList' data-page='" + currentPage + "'>";
            start = (currentPage - 1) * elementVisible;
            end = Math.min(currentPage * elementVisible, data.length);
            allPages = Math.ceil(data.length / elementVisible);

            parent.append(_.template(selectTemplate, {
                collection    : data.slice(start, end),
                currentPage: currentPage,
                allPages   : allPages,
                start      : start,
                end        : end,
                dataLength : data.length,
                elementVisible: elementVisible
            }));

            return false;
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
                collection    : data.slice(start, end),
                currentPage: currentPage,
                allPages   : allPages,
                start      : start,
                end        : end,
                dataLength : data.length,
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
                collection    : data.slice(start, end),
                currentPage: currentPage,
                allPages   : allPages,
                start      : start,
                end        : end,
                dataLength : data.length,
                elementVisible: elementVisible,
                level         : data.level
            }));
        };

        var fetchWorkflow = function (data, callback) {
            if (typeof data === 'function') {
                callback = data;
                data = {wId: 'Purchase Order'};
            }

            dataService.getData('workflow/getFirstForConvert', data, callback);
        };

        return {
            get                 : get,
            get2name: get2name,
            getPriority: getPriority,
            getWorkflow: getWorkflow,
            showSelect : showSelect,
            getParrentDepartment: getParrentDepartment,
            getParrentCategory  : getParrentCategory,
            getCompanies        : getCompanies,
            showSelectPriority  : showSelectPriority,
            showProductsSelect  : showProductsSelect,
            fetchWorkflow       : fetchWorkflow
        };
    });
