define([
		"dataService",
		'text!templates/main/selectTemplate.html'
	],
	function (dataService, selectTemplate) {
		var showSelect = function (e, options) {
			e.stopPropagation();

			var targetEl = $(e.target);
			var attr = targetEl.attr("id") || targetEl.closest('td').data("content");
			var data = context.responseObj["#" + attr];
			var elementVisible;
			var targetParent = $(e.target).parent();
			var newSel;

			elementVisible = number || 10;

			if (targetParent.prop('tagName') !== 'TR') {
				newSel = targetParent.find(".newSelectList");
			} else {
				newSel = targetParent.find(".emptySelector");
			}


			var parent;
			var currentPage = 1;
			var s;
			var start;
			var end;
			var allPages;

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
				collection: data.slice(start, end),
				currentPage: currentPage,
				allPages: allPages,
				start: start,
				end: end,
				dataLength: data.length,
				elementVisible: elementVisible
			}));

			return false;
		};

		return {
			showSelect: showSelect
		};
	});
