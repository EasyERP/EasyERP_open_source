define([
        "dataService",
        'text!templates/helpers/select'
    ],
    function (dataService, selectTemplate) {
        var showSelect = function (e, options) {
            options = options || {};
            e.stopPropagation();

            var targetEl = $(e.target);

            var context = options.context;
            var prev = options.prev;
            var next = options.next;
            var number = options.number;

            var attr = targetEl.attr("id") || targetEl.closest('td').data("content");
            var targetParent = targetEl.parent();

            var data = context.responseObj ? context.responseObj["#" + attr] : undefined;

            var elementVisible;
            var newSel;
            var parent;
            var currentPage = 1;
            var start;
            var end;
            var allPages;
            var template;

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
                parent = targetEl;
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

            start = (currentPage - 1) * elementVisible;
            end = Math.min(currentPage * elementVisible, data.length);
            allPages = Math.ceil(data.length / elementVisible);

            parent.append(_.template(selectTemplate, {
                collection    : data.slice(start, end),
                currentPage   : currentPage,
                allPages      : allPages,
                start         : start,
                end           : end,
                dataLength    : data.length,
                elementVisible: elementVisible
            }));

            return false;
        };

        return {
            showSelect: showSelect
        };
    });
